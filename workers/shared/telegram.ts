const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";
const API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export async function send(text: string, parseMode: "Markdown" | "HTML" = "Markdown"): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log(`[telegram] SKIP (no config): ${text.slice(0, 80)}`);
    return;
  }
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: parseMode }),
  });
  if (!res.ok) throw new Error(`Telegram error: ${res.status} ${await res.text()}`);
}

export const sendUrgentEmail = (sender: string, subject: string, summary: string) =>
  send(`🔴 *URGENT EMAIL*\n*From:* ${sender}\n*Subject:* ${subject}\n\n${summary}`);

export const sendFlightDeal = (
  origin: string, dest: string, price: number, currency: string,
  airline: string, depart: string, discountPct: number, url: string,
) =>
  send(`✈️ *Flight Deal*\n${origin} → ${dest}\n*${currency} ${price.toLocaleString()}* (${discountPct.toFixed(0)}% below avg)\n${airline} · ${depart}\n[Book →](${url})`);

export const sendPriceDrop = (
  name: string, price: number, currency: string, target: number, platform: string, url: string,
) =>
  send(`💸 *Price Drop*\n${name}\n*${currency} ${price.toLocaleString()}* (target: ${currency} ${target.toLocaleString()})\n${platform}\n[View →](${url})`);

export const sendHackathonReminder = (name: string, daysLeft: number, url: string) =>
  send(`⚡ *Hackathon Deadline* — ${daysLeft}d left\n${name}\n[Register →](${url})`);

export const sendMorningBrief = (date: string, bullets: string[]) =>
  send(`*☀️ Morning Brief — ${date}*\n\n${bullets.map((b) => `• ${b}`).join("\n")}`);

export const sendEmergency = (title: string, body: string) =>
  send(`🚨 *${title}*\n${body}`);
