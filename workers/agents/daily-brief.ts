import { db, emailDigest, newsItems, tickers, hackathons, internships, dailyBriefs } from "../shared/db";
import { summarize } from "../shared/llm";
import { sendMorningBrief } from "../shared/telegram";
import { format, subHours } from "date-fns";
import { gte, eq, desc } from "drizzle-orm";

const BRIEF_PROMPT = `Write a morning brief for a CS student in Singapore/Philippines.
Based on the data below, write 6-8 bullet points covering the most important overnight developments.
Be direct. No fluff. Max 20 words per bullet. Format as a plain list, one bullet per line starting with •`;

async function gatherContext(): Promise<string> {
  const since = subHours(new Date(), 8);
  const parts: string[] = [];

  const urgent = await db
    .select({ sender: emailDigest.sender, subject: emailDigest.subject, summary: emailDigest.summary })
    .from(emailDigest)
    .where(gte(emailDigest.fetchedAt, since))
    .limit(5);
  if (urgent.length)
    parts.push("URGENT EMAILS:\n" + urgent.map((e) => `- ${e.subject} from ${e.sender}: ${e.summary}`).join("\n"));

  const news = await db
    .select({ category: newsItems.category, title: newsItems.title, summary: newsItems.summary })
    .from(newsItems)
    .where(gte(newsItems.fetchedAt, since))
    .orderBy(desc(newsItems.fetchedAt))
    .limit(12);
  if (news.length)
    parts.push("OVERNIGHT NEWS:\n" + news.map((n) => `[${n.category}] ${n.title}: ${n.summary}`).join("\n"));

  const rates = await db.select({ label: tickers.label, price: tickers.price, changePct: tickers.changePct }).from(tickers);
  if (rates.length)
    parts.push("MARKETS:\n" + rates.map((t) => `${t.label}: ${t.price} (${Number(t.changePct) >= 0 ? "+" : ""}${t.changePct}%)`).join("\n"));

  return parts.join("\n\n");
}

export async function runDailyBrief() {
  const context = await gatherContext();
  if (!context.trim()) { console.log("[daily-brief] no overnight data, skip"); return; }

  const rawBrief = await summarize(context, BRIEF_PROMPT);
  const bullets = rawBrief
    .split("\n")
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  const today = format(new Date(), "yyyy-MM-dd");
  await db
    .insert(dailyBriefs)
    .values({ date: today, bullets })
    .onConflictDoNothing({ target: dailyBriefs.date });

  await sendMorningBrief(today, bullets);
  console.log(`[daily-brief] saved ${bullets.length} bullets`);
}
