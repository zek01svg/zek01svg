import { google } from "googleapis";
import { db, emailDigest } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";
import { sendUrgentEmail } from "../shared/telegram";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const FILTER_PROMPT = `You are filtering emails for a university student in Singapore/Philippines.
For each email (ID | SENDER | SUBJECT), classify as:
  URGENT_ACTION — needs reply/action within 24h
  READ_SOON     — worth reading soon
  INFORMATIONAL — low-priority newsletters/updates
  IRRELEVANT    — promotions, spam, automated
Also write a max 20-word summary.
Reply as JSON array: [{"id":"...","priority":"...","summary":"..."}]
Emails:`;

function gmailService(credsJson: string) {
  const creds = JSON.parse(credsJson);
  const auth = new google.auth.OAuth2();
  auth.setCredentials(creds);
  return google.gmail({ version: "v1", auth });
}

async function fetchUnread(service: ReturnType<typeof google.gmail>, sinceMinutes = 35) {
  const since = Math.floor((Date.now() - sinceMinutes * 60_000) / 1000);
  const list = await service.users.messages.list({
    userId: "me",
    q: `is:unread after:${since}`,
    maxResults: 50,
  });
  const messages = list.data.messages ?? [];
  return Promise.all(
    messages.map(async (msg) => {
      const detail = await service.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });
      const h = Object.fromEntries(
        (detail.data.payload?.headers ?? []).map((hdr) => [hdr.name, hdr.value]),
      );
      return {
        gmailId: msg.id!,
        sender: h["From"] ?? "",
        subject: h["Subject"] ?? "",
        receivedAt: new Date(Number(detail.data.internalDate)),
      };
    }),
  );
}

type FilterResult = { id: string; priority: string; summary: string };

async function classify(emails: Awaited<ReturnType<typeof fetchUnread>>) {
  if (!emails.length) return [];
  const lines = emails.map((e) => `${e.gmailId}|${e.sender}|${e.subject}`);
  const raw = await filterBulk(lines, FILTER_PROMPT);
  const results = parseJsonArray<FilterResult>(raw);
  const map = new Map(results.map((r) => [r.id, r]));
  return emails
    .map((e) => ({ ...e, ...map.get(e.gmailId) }))
    .filter((e) => e.priority && e.priority !== "IRRELEVANT");
}

export async function runEmail(account: "personal" | "school", credsEnv: string) {
  const credsJson = process.env[credsEnv];
  if (!credsJson) { console.log(`[email:${account}] no creds, skip`); return; }

  const service = gmailService(credsJson);
  const raw = await fetchUnread(service);
  console.log(`[email:${account}] fetched ${raw.length} unread`);
  const classified = await classify(raw);

  if (classified.length) {
    await db
      .insert(emailDigest)
      .values(
        classified.map((e) => ({
          account,
          gmailId: e.gmailId,
          sender: e.sender,
          subject: e.subject,
          summary: (e as FilterResult & typeof e).summary ?? "",
          priority: (e.priority as "URGENT_ACTION" | "READ_SOON" | "INFORMATIONAL"),
          receivedAt: e.receivedAt,
        })),
      )
      .onConflictDoNothing({ target: emailDigest.gmailId });
  }

  for (const e of classified) {
    if (e.priority === "URGENT_ACTION")
      await sendUrgentEmail(e.sender, e.subject, (e as FilterResult & typeof e).summary ?? "");
  }
  console.log(`[email:${account}] saved ${classified.length} (${classified.filter((e) => e.priority === "URGENT_ACTION").length} urgent)`);
}
