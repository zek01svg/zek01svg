import Parser from "rss-parser";
import { createHash } from "crypto";
import { db, newsItems } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";

const parser = new Parser();

const RSS_FEEDS: Array<[string, "PH" | "SG" | "GLOBAL" | "TECH" | "MARKETS", string]> = [
  ["https://feeds.reuters.com/reuters/topNews",           "GLOBAL",  "Reuters"],
  ["https://feeds.bbci.co.uk/news/world/rss.xml",         "GLOBAL",  "BBC"],
  ["https://rappler.com/feed",                            "PH",      "Rappler"],
  ["https://www.inquirer.net/rss/",                       "PH",      "Inquirer"],
  ["https://www.channelnewsasia.com/rss/8395986",         "SG",      "CNA"],
  ["https://www.straitstimes.com/news/singapore/rss.xml", "SG",      "Straits Times"],
  ["https://techcrunch.com/feed/",                        "TECH",    "TechCrunch"],
  ["https://www.theverge.com/rss/index.xml",              "TECH",    "The Verge"],
  ["https://feeds.arstechnica.com/arstechnica/index",     "TECH",    "Ars Technica"],
];

const FILTER_PROMPT = `You are a personal news filter for a CS student in Singapore/Philippines.
For each item (INDEX|CATEGORY|TITLE), decide KEEP or SKIP.
KEEP: genuinely newsworthy, relevant to tech/finance/world events/SEA.
SKIP: celebrity gossip, sports entertainment, local crime, clickbait.
For KEEP items write a max 25-word summary.
Reply: [{"id":"...","action":"KEEP"|"SKIP","summary":"..."}]
Items:`;

type FeedItem = {
  urlHash: string; url: string; title: string;
  category: "PH" | "SG" | "GLOBAL" | "TECH" | "MARKETS";
  source: string; publishedAt: Date | null;
};

function urlHash(url: string) {
  return createHash("md5").update(url).digest("hex");
}

async function fetchRss(): Promise<FeedItem[]> {
  const items: FeedItem[] = [];
  await Promise.allSettled(
    RSS_FEEDS.map(async ([url, category, source]) => {
      const feed = await parser.parseURL(url);
      for (const entry of feed.items.slice(0, 15)) {
        const link = entry.link;
        if (!link) continue;
        items.push({
          urlHash: urlHash(link),
          url: link,
          title: (entry.title ?? "").trim(),
          category,
          source,
          publishedAt: entry.pubDate ? new Date(entry.pubDate) : null,
        });
      }
    }),
  );
  return items;
}

type FilterResult = { id: string; action: string; summary: string };

export async function runNews() {
  const raw = await fetchRss();
  console.log(`[news] fetched ${raw.length} items from RSS`);

  // pre-dedup against DB
  const existingHashes = new Set(
    (await db.select({ urlHash: newsItems.urlHash }).from(newsItems)).map((r) => r.urlHash),
  );
  const unique = raw.filter((i) => !existingHashes.has(i.urlHash));
  console.log(`[news] ${unique.length} new after dedup`);
  if (!unique.length) return;

  const lines = unique.map((item, i) => `${i}|${item.category}|${item.title}`);
  const raw2 = await filterBulk(lines, FILTER_PROMPT);
  const results = parseJsonArray<FilterResult>(raw2);
  const map = new Map(results.map((r) => [r.id, r]));

  const kept = unique
    .map((item, i) => ({ ...item, result: map.get(String(i)) }))
    .filter((item) => item.result?.action === "KEEP")
    .map((item) => ({
      title: item.title,
      summary: item.result!.summary,
      source: item.source,
      category: item.category,
      url: item.url,
      urlHash: item.urlHash,
      publishedAt: item.publishedAt,
    }));

  console.log(`[news] keeping ${kept.length}`);
  if (kept.length) {
    await db.insert(newsItems).values(kept).onConflictDoNothing({ target: newsItems.urlHash });
  }
}
