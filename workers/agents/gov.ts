import Parser from "rss-parser";
import { createHash } from "crypto";
import { db, govAnnouncements } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";
import { format } from "date-fns";

const FEEDS: Array<[string, "PH" | "SG", string]> = [
  // Philippines
  ["https://www.officialgazette.gov.ph/feed/",               "PH", "Official Gazette"],
  ["https://www.bsp.gov.ph/SitePages/rss.aspx",              "PH", "BSP"],
  ["https://www.ched.gov.ph/feed/",                          "PH", "CHED"],
  ["https://dict.gov.ph/feed/",                              "PH", "DICT"],
  // Singapore
  ["https://www.mom.gov.sg/rss/newsroom",                    "SG", "MOM"],
  ["https://www.mas.gov.sg/news/rss",                        "SG", "MAS"],
  ["https://www.moe.gov.sg/news/press-releases/rss",         "SG", "MOE"],
  ["https://www.edb.gov.sg/en/news-and-events/news.rss",     "SG", "EDB"],
];

const FILTER_PROMPT = `Filter government announcements for a CS student in Singapore/Philippines.
KEEP: policy changes, financial regulations, scholarship/grant announcements, visa/pass rule updates,
      digital/tech policy, anything affecting students or tech professionals.
SKIP: routine press releases, event announcements, tourism promotions.
For KEEP, write a max 25-word summary.
Format: [{"id":"...","action":"KEEP"|"SKIP","summary":"..."}]
Items (ID|COUNTRY|AGENCY|TITLE):`;

type FilterResult = { id: string; action: string; summary: string };

function urlHash(s: string) { return createHash("md5").update(s).digest("hex"); }

export async function runGov() {
  const parser = new Parser();
  const raw: Array<{ title: string; url: string; country: "PH" | "SG"; agency: string; publishedAt: string }> = [];

  await Promise.allSettled(
    FEEDS.map(async ([feedUrl, country, agency]) => {
      const feed = await parser.parseURL(feedUrl);
      for (const e of feed.items.slice(0, 10)) {
        if (!e.link) continue;
        raw.push({
          title: (e.title ?? "").trim(), url: e.link,
          country, agency,
          publishedAt: format(new Date(e.pubDate ?? Date.now()), "yyyy-MM-dd"),
        });
      }
    }),
  );

  console.log(`[gov] fetched ${raw.length} items`);
  if (!raw.length) return;

  const existingHashes = new Set(
    (await db.select({ urlHash: govAnnouncements.urlHash }).from(govAnnouncements)).map((r) => r.urlHash),
  );
  const unique = raw.filter((i) => !existingHashes.has(urlHash(i.url)));
  if (!unique.length) return;

  const lines  = unique.map((item, i) => `${i}|${item.country}|${item.agency}|${item.title}`);
  const rawTxt = await filterBulk(lines, FILTER_PROMPT);
  const map    = new Map(
    parseJsonArray<FilterResult>(rawTxt)
      .filter((r) => r.action === "KEEP")
      .map((r) => [r.id, r]),
  );

  const kept = unique
    .map((item, i) => ({ ...item, result: map.get(String(i)) }))
    .filter((item) => item.result)
    .map((item) => ({
      country:     item.country,
      agency:      item.agency,
      title:       item.title,
      summary:     item.result!.summary,
      url:         item.url,
      urlHash:     urlHash(item.url),
      publishedAt: item.publishedAt,
    }));

  console.log(`[gov] keeping ${kept.length}`);
  if (kept.length) {
    await db.insert(govAnnouncements).values(kept).onConflictDoNothing({ target: govAnnouncements.urlHash });
  }
}
