import Parser from "rss-parser";
import { createHash } from "crypto";
import { chromium } from "playwright";
import { db, hackathons } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";
import { sendHackathonReminder } from "../shared/telegram";
import { differenceInDays, parseISO } from "date-fns";

const DEVPOST_RSS = "https://devpost.com/hackathons.rss";
const FILTER_PROMPT = `Filter hackathons for a CS student in Singapore/Philippines.
KEEP: online-eligible OR in Singapore/Philippines/Asia, tech/software focused, meaningful prize/learning value.
SKIP: hardware-only, non-tech, ended, US/EU in-person only.
For KEEP classify mode: online|in-person|hybrid. Write a one-sentence relevance note.
Format: [{"id":"...","action":"KEEP"|"SKIP","mode":"...","note":"..."}]
Items (ID|TITLE|DESCRIPTION):`;

type FilterResult = { id: string; action: string; mode: string; note: string };

function urlHash(s: string) { return createHash("md5").update(s).digest("hex"); }

async function fetchDevpost() {
  const parser = new Parser();
  const feed   = await parser.parseURL(DEVPOST_RSS);
  return feed.items.slice(0, 30).map((e) => ({
    name: (e.title ?? "").trim(), organizer: "Devpost",
    url: e.link ?? "", description: e.contentSnippet ?? "",
    mode: "online" as const,
  }));
}

async function scrapeMLH() {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page    = await browser.newPage();
  const items: Array<{ name: string; organizer: string; url: string; description: string; mode: "in-person" }> = [];
  try {
    await page.goto("https://mlh.io/seasons/2025/events", { waitUntil: "domcontentloaded", timeout: 20_000 });
    const events = await page.$$eval(".event", (els) =>
      els.slice(0, 20).map((el) => ({
        name:  el.querySelector(".event-name")?.textContent?.trim() ?? "",
        url:   el.querySelector("a")?.getAttribute("href") ?? "",
        date:  el.querySelector(".event-date")?.textContent?.trim() ?? "",
      })),
    );
    for (const ev of events) {
      if (!ev.name) continue;
      items.push({ name: ev.name, organizer: "MLH", url: ev.url, description: ev.date, mode: "in-person" });
    }
  } catch (e) { console.warn("[hackathons] MLH scrape error:", e); }
  await browser.close();
  return items;
}

export async function runHackathons() {
  const [devpost, mlh] = await Promise.all([fetchDevpost(), scrapeMLH()]);
  const all = [...devpost, ...mlh];
  console.log(`[hackathons] fetched ${all.length} raw items`);

  const lines  = all.map((h, i) => `${i}|${h.name}|${h.description.slice(0, 100)}`);
  const rawTxt = await filterBulk(lines, FILTER_PROMPT);
  const map    = new Map(
    parseJsonArray<FilterResult>(rawTxt)
      .filter((r) => r.action === "KEEP")
      .map((r) => [r.id, r]),
  );

  const kept = all
    .map((h, i) => ({ ...h, result: map.get(String(i)) }))
    .filter((h) => h.result)
    .map((h) => ({
      name:        h.name,
      organizer:   h.organizer,
      mode:        (h.result!.mode || "online") as "online" | "in-person" | "hybrid",
      location:    null,
      prizeSummary: null,
      registrationDeadline: null,
      eventStart:  null,
      eventEnd:    null,
      url:         h.url,
      urlHash:     urlHash(h.url),
      relevanceNote: h.result!.note,
    }));

  console.log(`[hackathons] keeping ${kept.length}`);
  if (kept.length) {
    await db.insert(hackathons).values(kept).onConflictDoNothing({ target: hackathons.urlHash });
  }

  // deadline alerts
  const allStored = await db.select().from(hackathons);
  const today = new Date();
  for (const h of allStored) {
    if (!h.registrationDeadline) continue;
    const daysLeft = differenceInDays(parseISO(h.registrationDeadline), today);
    if (daysLeft === 7 || daysLeft === 2) {
      await sendHackathonReminder(h.name, daysLeft, h.url);
    }
  }
}
