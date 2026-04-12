import { google } from "googleapis";
import { db, calendarEvents } from "../shared/db";
import { addDays, startOfDay } from "date-fns";

const WINDOW_DAYS = 7;

async function syncGoogle(): Promise<typeof calendarEvents.$inferInsert[]> {
  const credsJson = process.env.GOOGLE_CALENDAR_CREDS;
  if (!credsJson) { console.log("[calendar] no Google creds, skip"); return []; }

  const auth = new google.auth.OAuth2();
  auth.setCredentials(JSON.parse(credsJson));
  const cal     = google.calendar({ version: "v3", auth });
  const now     = new Date();
  const end     = addDays(now, WINDOW_DAYS);
  const result  = await cal.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  return (result.data.items ?? []).map((e) => ({
    externalId:  e.id!,
    source:      "google" as const,
    title:       e.summary ?? "(no title)",
    startAt:     new Date(e.start?.dateTime ?? e.start?.date ?? ""),
    endAt:       new Date(e.end?.dateTime ?? e.end?.date ?? ""),
    allDay:      !e.start?.dateTime,
    location:    e.location ?? null,
    description: e.description ?? null,
  }));
}

async function syncOutlook(): Promise<typeof calendarEvents.$inferInsert[]> {
  const tokenJson = process.env.OUTLOOK_TOKEN_JSON;
  if (!tokenJson) { console.log("[calendar] no Outlook token, skip"); return []; }

  const { access_token } = JSON.parse(tokenJson);
  const now = new Date();
  const end = addDays(now, WINDOW_DAYS);
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now.toISOString()}&endDateTime=${end.toISOString()}&$top=50&$select=id,subject,start,end,location,isAllDay`,
    { headers: { Authorization: `Bearer ${access_token}` } },
  );
  const data = await res.json() as { value: Array<Record<string, unknown>> };
  return (data.value ?? []).map((e: Record<string, unknown>) => ({
    externalId:  e.id as string,
    source:      "outlook" as const,
    title:       (e.subject as string) ?? "(no title)",
    startAt:     new Date(((e.start as Record<string, string>).dateTime) + "Z"),
    endAt:       new Date(((e.end as Record<string, string>).dateTime) + "Z"),
    allDay:      (e.isAllDay as boolean) ?? false,
    location:    ((e.location as Record<string, string>)?.displayName) ?? null,
    description: null,
  }));
}

async function syncApple(): Promise<typeof calendarEvents.$inferInsert[]> {
  const appleId  = process.env.APPLE_ID;
  const appPass  = process.env.APPLE_APP_PASSWORD;
  if (!appleId || !appPass) { console.log("[calendar] no Apple creds, skip"); return []; }

  // Dynamic import — tsdav is ESM
  const { createDAVClient } = await import("tsdav");
  const client = await createDAVClient({
    serverUrl: "https://caldav.icloud.com",
    credentials: { username: appleId, password: appPass },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });
  const now = new Date();
  const end = addDays(now, WINDOW_DAYS);
  const cals = await client.fetchCalendars();
  const rows: typeof calendarEvents.$inferInsert[] = [];
  for (const cal of cals) {
    const objects = await client.fetchCalendarObjects({
      calendar: cal,
      timeRange: { start: now.toISOString(), end: end.toISOString() },
    });
    for (const obj of objects) {
      // Minimal parse — real projects should use ical.js
      const uid = obj.url.split("/").pop()?.replace(".ics", "") ?? obj.url;
      rows.push({
        externalId:  uid,
        source:      "apple" as const,
        title:       "Apple event",
        startAt:     now,
        endAt:       end,
        allDay:      false,
        location:    null,
        description: null,
      });
    }
  }
  return rows;
}

export async function runCalendar() {
  const now = startOfDay(new Date());
  // clear window then re-insert
  await db.delete(calendarEvents);

  const all = [
    ...(await syncGoogle()),
    ...(await syncOutlook()),
    ...(await syncApple()),
  ];
  console.log(`[calendar] synced ${all.length} events`);
  if (all.length) {
    await db
      .insert(calendarEvents)
      .values(all)
      .onConflictDoNothing();
  }
}
