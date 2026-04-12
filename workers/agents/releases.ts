import Parser from "rss-parser";
import { createHash } from "crypto";
import { db, devReleases, productReleases } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";
import { subDays, format } from "date-fns";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const WATCHED_REPOS = [
  "oven-sh/bun", "vitejs/vite", "nodejs/node", "denoland/deno",
  "astral-sh/uv", "astral-sh/ruff", "rust-lang/rust",
  "vercel/next.js", "supabase/supabase", "anthropics/claude-code",
  "microsoft/vscode", "docker/cli", "golang/go",
  "BurntSushi/ripgrep", "neovim/neovim", "hono/hono", "drizzle-team/drizzle-orm",
];

const FILTER_PROMPT = `Decide SHOW or SKIP for each GitHub release.
SHOW: major/minor version bump, new tool first release, security advisory.
SKIP: patch without security impact, CI releases, release candidates, nightly builds.
Format: [{"id":"...","action":"SHOW"|"SKIP","highlight":"max 15 words what's new"}]
Releases (ID|REPO|VERSION|BODY):`;

type FilterResult = { id: string; action: string; highlight: string };

function urlHash(s: string) { return createHash("md5").update(s).digest("hex"); }

async function fetchGithubReleases() {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const since = subDays(new Date(), 7).toISOString();
  const raw: Array<{ tool: string; version: string; url: string; body: string; publishedAt: string; repo: string }> = [];

  await Promise.allSettled(
    WATCHED_REPOS.map(async (repo) => {
      const res  = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=3`, { headers });
      if (!res.ok) return;
      const rels = await res.json() as Array<Record<string, unknown>>;
      for (const rel of rels) {
        if (rel.prerelease || rel.draft) continue;
        if ((rel.published_at as string) < since) continue;
        raw.push({
          tool:        (repo.split("/")[1] ?? repo),
          version:     rel.tag_name as string,
          url:         rel.html_url as string,
          body:        ((rel.body as string) ?? "").slice(0, 300),
          publishedAt: (rel.published_at as string).slice(0, 10),
          repo,
        });
      }
    }),
  );
  return raw;
}

export async function runReleases() {
  const rawRels = await fetchGithubReleases();
  console.log(`[releases] fetched ${rawRels.length} GitHub releases`);

  if (rawRels.length) {
    const lines  = rawRels.map((r, i) => `${i}|${r.repo}|${r.version}|${r.body.slice(0, 100)}`);
    const rawTxt = await filterBulk(lines, FILTER_PROMPT);
    const keepMap = new Map(
      parseJsonArray<FilterResult>(rawTxt)
        .filter((r) => r.action === "SHOW")
        .map((r) => [r.id, r.highlight]),
    );
    const kept = rawRels
      .map((r, i) => ({ ...r, highlight: keepMap.get(String(i)) }))
      .filter((r) => r.highlight)
      .map((r) => ({
        tool: r.tool, version: r.version,
        highlight: r.highlight!, url: r.url,
        isNewTool: false, publishedAt: r.publishedAt,
      }));
    if (kept.length) {
      await db.insert(devReleases).values(kept).onConflictDoNothing();
    }
  }

  // ProductHunt
  const parser = new Parser();
  const feed   = await parser.parseURL("https://www.producthunt.com/feed");
  const products = feed.items.slice(0, 10).map((e, i) => ({
    name:        (e.title ?? "").trim(),
    tagline:     (e.contentSnippet ?? "").slice(0, 120),
    source:      "producthunt",
    url:         e.link ?? "",
    urlHash:     urlHash(e.link ?? String(i)),
    rank:        i + 1,
    publishedAt: format(new Date(), "yyyy-MM-dd"),
  }));
  if (products.length) {
    await db.insert(productReleases).values(products).onConflictDoNothing({ target: productReleases.urlHash });
  }
  console.log(`[releases] saved ${products.length} ProductHunt items`);
}
