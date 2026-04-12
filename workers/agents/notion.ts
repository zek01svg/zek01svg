import { db, notionTasks } from "../shared/db";

const NOTION_TOKEN   = process.env.NOTION_TOKEN ?? "";
const NOTION_VERSION = "2022-06-28";
const TASK_DB_IDS    = (process.env.NOTION_TASK_DB_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

async function getDbName(dbId: string): Promise<string> {
  const res  = await fetch(`https://api.notion.com/v1/databases/${dbId}`, { headers: notionHeaders() });
  const data = await res.json() as { title: Array<{ plain_text: string }> };
  return data.title?.map((t) => t.plain_text).join("") || dbId;
}

async function queryDatabase(dbId: string, dbName: string) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + 14);
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Due Date", date: { on_or_before: cutoff.toISOString().slice(0, 10) } },
          { property: "Status",   status: { does_not_equal: "Done" } },
        ],
      },
      sorts: [{ property: "Due Date", direction: "ascending" }],
      page_size: 50,
    }),
  });
  const data = await res.json() as { results: Array<Record<string, unknown>> };
  return (data.results ?? []).map((page: Record<string, unknown>) => {
    const props    = page.properties as Record<string, Record<string, unknown>>;
    const titleProp = props.Name ?? props.Title ?? props.Task ?? {};
    const titleArr  = (titleProp.title as Array<{ plain_text: string }>) ?? [];
    const title     = titleArr.map((t) => t.plain_text).join("");
    const dueProp   = props["Due Date"] ?? props.Due ?? {};
    const dueDate   = ((dueProp.date as Record<string, string>) ?? {}).start ?? null;
    const statusProp = props.Status ?? {};
    const status    = ((statusProp.status as Record<string, string>) ?? {}).name ?? "Unknown";
    return {
      id:           page.id as string,
      title,
      dueDate:      dueDate,
      status,
      databaseName: dbName,
      url:          page.url as string,
    };
  });
}

export async function runNotion() {
  if (!NOTION_TOKEN) { console.log("[notion] no token, skip"); return; }
  const all: typeof notionTasks.$inferInsert[] = [];
  for (const dbId of TASK_DB_IDS) {
    const name  = await getDbName(dbId);
    const tasks = await queryDatabase(dbId, name);
    all.push(...tasks);
    console.log(`[notion] ${name}: ${tasks.length} tasks`);
  }
  if (!all.length) return;
  await db.delete(notionTasks);
  await db.insert(notionTasks).values(all).onConflictDoNothing();
}
