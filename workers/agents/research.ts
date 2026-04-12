import { db, researchPapers } from "../shared/db";
import { filterBulk, parseJsonArray } from "../shared/llm";

const CATEGORIES = ["cs.AI", "cs.LG", "cs.CL", "cs.DC", "cs.CR", "cs.SE"];

const RELEVANCE_PROMPT = `Score each research paper for relevance to a CS student interested in:
AI/ML, distributed systems, security, programming languages, software engineering.
Score 0-100. Only include papers >=75.
Write a max 25-word summary of the contribution.
Format: [{"id":"...","score":85,"summary":"..."}]  (omit score <75)
Papers (ID|TITLE|ABSTRACT_EXCERPT):`;

type ArxivEntry = {
  arxivId: string; title: string; authors: string[];
  abstract: string; arxivUrl: string; categories: string[]; publishedAt: string;
};

type ScoreResult = { id: string; score: number; summary: string };

async function fetchArxiv(): Promise<ArxivEntry[]> {
  const catQuery = CATEGORIES.map((c) => `cat:${c}`).join("+OR+");
  const res  = await fetch(
    `https://export.arxiv.org/api/query?search_query=${catQuery}&sortBy=submittedDate&sortOrder=descending&max_results=30`,
  );
  const xml  = await res.text();

  // minimal XML parse with regex (avoids a heavy dependency)
  const entries: ArxivEntry[] = [];
  const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  for (const entry of entryMatches) {
    const id       = entry.match(/<id>.*?abs\/([\w.]+)<\/id>/)?.[1] ?? "";
    const title    = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim().replace(/\s+/g, " ") ?? "";
    const abstract = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim().replace(/\s+/g, " ") ?? "";
    const authors  = [...entry.matchAll(/<name>(.*?)<\/name>/g)].map((m) => m[1]).slice(0, 5);
    const cats     = [...entry.matchAll(/term="(cs\.\w+)"/g)].map((m) => m[1]);
    const published = entry.match(/<published>([\d-]+)/)?.[1] ?? "";
    entries.push({ arxivId: id, title, authors, abstract: abstract.slice(0, 300), arxivUrl: `https://arxiv.org/abs/${id}`, categories: [...new Set(cats)], publishedAt: published });
  }
  return entries;
}

export async function runResearch() {
  const papers = await fetchArxiv();
  console.log(`[research] fetched ${papers.length} papers`);
  if (!papers.length) return;

  const lines = papers.map((p, i) => `${i}|${p.title}|${p.abstract.slice(0, 150)}`);
  const raw   = await filterBulk(lines, RELEVANCE_PROMPT);
  const scored = parseJsonArray<ScoreResult>(raw);
  const map   = new Map(scored.map((r) => [r.id, r]));

  const kept = papers
    .map((p, i) => ({ ...p, result: map.get(String(i)) }))
    .filter((p) => (p.result?.score ?? 0) >= 75)
    .sort((a, b) => (b.result?.score ?? 0) - (a.result?.score ?? 0))
    .slice(0, 5)
    .map((p) => ({
      arxivId:         p.arxivId,
      title:           p.title,
      authors:         p.authors,
      abstractSummary: p.result?.summary ?? p.abstract.slice(0, 120),
      arxivUrl:        p.arxivUrl,
      relevanceScore:  p.result?.score ?? 0,
      categories:      p.categories,
      publishedAt:     p.publishedAt,
    }));

  console.log(`[research] keeping ${kept.length}`);
  if (kept.length) {
    await db.insert(researchPapers).values(kept).onConflictDoNothing({ target: researchPapers.arxivId });
  }
}
