import { db, hnItems } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";

const HN_API = "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30";

const FILTER_PROMPT = `Filter Hacker News stories for a CS developer/student.
KEEP: genuinely technical, important world events, interesting research, thoughtful discussions.
SKIP: personal blogs without substance, click-bait, low-signal Show HN, job postings, US local news.
Format: [{"id":"...","action":"KEEP"|"SKIP"}]
Stories (ID|TITLE):`;

type HNHit = { objectID: string; title: string; url?: string; points: number; num_comments: number };
type FilterResult = { id: string; action: string };

export async function runHN() {
  const res  = await fetch(HN_API);
  const data = await res.json() as { hits: HNHit[] };
  const hits = data.hits.filter((h) => h.points >= 100);
  console.log(`[hn] fetched ${hits.length} items (score>=100)`);
  if (!hits.length) return;

  const lines = hits.map((h) => `${h.objectID}|${h.title}`);
  const raw   = await filterBulk(lines, FILTER_PROMPT);
  const keepIds = new Set(
    parseJsonArray<FilterResult>(raw)
      .filter((r) => r.action === "KEEP")
      .map((r) => r.id),
  );

  const kept = hits
    .filter((h) => keepIds.has(h.objectID))
    .map((h) => ({
      hnId: parseInt(h.objectID, 10),
      title: h.title,
      url: h.url ?? null,
      points: h.points,
      comments: h.num_comments,
    }));

  console.log(`[hn] keeping ${kept.length}`);
  if (kept.length) {
    await db.insert(hnItems).values(kept).onConflictDoNothing({ target: hnItems.hnId });
  }
}
