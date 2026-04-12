import Parser from "rss-parser";
import { db, dailyBread } from "../shared/db";
import { format } from "date-fns";

const ODB_RSS     = "https://odb.org/feed/";
const BIBLE_API   = "https://api.scripture.api.bible/v1/bibles";
const KJV_BIBLE   = "de4e12af7f28f599-02";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function bibleGatewayUrl(ref: string): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=NIV`;
}

async function fetchODB(): Promise<{ title: string; excerpt: string; url: string } | null> {
  try {
    const parser = new Parser();
    const feed   = await parser.parseURL(ODB_RSS);
    const entry  = feed.items[0];
    if (!entry) return null;
    const content = (entry.content ?? entry.contentSnippet ?? entry.summary ?? "");
    const plain   = stripHtml(content);
    return {
      title:   (entry.title ?? "").trim(),
      excerpt: plain.split(" ").slice(0, 40).join(" ") + "…",
      url:     entry.link ?? "https://odb.org",
    };
  } catch (e) {
    console.warn("[bible] ODB error:", e);
    return null;
  }
}

async function fetchVerseOfDay(): Promise<{ text: string; reference: string } | null> {
  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) return null;
  try {
    // Rotate a small set of morning verses
    const VERSES = ["JHN.3.16", "PSA.23.1", "PHP.4.13", "ROM.8.28", "ISA.40.31"];
    const day    = new Date().getDay();
    const verseId = VERSES[day % VERSES.length];
    const res  = await fetch(
      `${BIBLE_API}/${KJV_BIBLE}/verses/${verseId}?content-type=text&include-verse-numbers=false`,
      { headers: { "api-key": apiKey } },
    );
    const data = await res.json() as { data: { content: string; reference: string } };
    return { text: data.data.content.trim(), reference: data.data.reference };
  } catch (e) {
    console.warn("[bible] API.Bible error:", e);
    return null;
  }
}

export async function runBible() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [odb, verse] = await Promise.all([fetchODB(), fetchVerseOfDay()]);
  if (!odb || !verse) { console.log("[bible] missing data, skip"); return; }

  await db
    .insert(dailyBread)
    .values({
      date:               today,
      title:              odb.title,
      scriptureRef:       verse.reference,
      verseText:          verse.text,
      reflectionExcerpt:  odb.excerpt,
      devotionalUrl:      odb.url,
      bibleUrl:           bibleGatewayUrl(verse.reference),
    })
    .onConflictDoNothing({ target: dailyBread.date });

  console.log(`[bible] saved: ${odb.title} / ${verse.reference}`);
}
