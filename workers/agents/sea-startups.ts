import Parser from "rss-parser";
import { createHash } from "crypto";
import { db, seaStartups } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";
import { format } from "date-fns";

const RSS_FEEDS: Array<[string, string]> = [
  ["https://www.dealstreetasia.com/feed/",     "DealStreetAsia"],
  ["https://e27.co/feed/",                     "e27"],
  ["https://www.techinasia.com/feed",          "Tech in Asia"],
  ["https://kr-asia.com/feed",                 "KrASIA"],
];

const FILTER_PROMPT = `Filter SEA startup news for a CS student.
KEEP: funding rounds, acquisitions, shutdowns, notable product launches by SEA tech companies.
SKIP: opinion pieces, event announcements, non-tech topics.
Write a max 25-word summary for KEEP items.
Format: [{"id":"...","action":"KEEP"|"SKIP","company":"company name or empty","summary":"..."}]
Items (ID|TITLE):`;

type FilterResult = { id: string; action: string; company: string; summary: string };

function urlHash(s: string) { return createHash("md5").update(s).digest("hex"); }

export async function runSEAStartups() {
  const parser = new Parser();
  const raw: Array<{ title: string; url: string; source: string; publishedAt: string }> = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async ([url, source]) => {
      const feed = await parser.parseURL(url);
      for (const e of feed.items.slice(0, 10)) {
        if (!e.link) continue;
        raw.push({ title: (e.title ?? "").trim(), url: e.link, source, publishedAt: format(new Date(e.pubDate ?? Date.now()), "yyyy-MM-dd") });
      }
    }),
  );

  console.log(`[sea-startups] fetched ${raw.length} items`);
  if (!raw.length) return;

  // dedup
  const existingHashes = new Set(
    (await db.select({ urlHash: seaStartups.urlHash }).from(seaStartups)).map((r) => r.urlHash),
  );
  const unique = raw.filter((i) => !existingHashes.has(urlHash(i.url)));
  if (!unique.length) return;

  const lines  = unique.map((item, i) => `${i}|${item.title}`);
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
      headline:    item.title,
      company:     item.result!.company ?? "",
      summary:     item.result!.summary,
      source:      item.source,
      url:         item.url,
      urlHash:     urlHash(item.url),
      publishedAt: item.publishedAt,
    }));

  console.log(`[sea-startups] keeping ${kept.length}`);
  if (kept.length) {
    await db.insert(seaStartups).values(kept).onConflictDoNothing({ target: seaStartups.urlHash });
  }
}
