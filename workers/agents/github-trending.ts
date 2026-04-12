import { chromium } from "playwright";
import { db, githubTrending } from "../shared/db";

const LANGUAGES = ["", "python", "typescript", "rust", "go"];

async function scrapeTrending(language = "") {
  const url = language
    ? `https://github.com/trending/${language}?since=daily`
    : "https://github.com/trending?since=daily";

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page    = await browser.newPage({
    userAgent: "Mozilla/5.0 (compatible; PersonalDashboard/1.0)",
  });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

  const repos = await page.$$eval("article.Box-row", (rows) =>
    rows.slice(0, 10).map((row) => {
      const nameEl    = row.querySelector("h2 a");
      const descEl    = row.querySelector("p");
      const langEl    = row.querySelector("[itemprop='programmingLanguage']");
      const starsEl   = row.querySelector("a[href$='/stargazers']");
      const todayEl   = row.querySelector(".float-sm-right");
      const fullName  = nameEl?.getAttribute("href")?.slice(1) ?? "";
      const starsText = starsEl?.textContent?.replace(/,/g, "").trim() ?? "0";
      const todayText = todayEl?.textContent?.trim() ?? "0";
      const starsToday = parseInt(todayText.match(/\d+/)?.[0] ?? "0", 10);
      return {
        fullName,
        name: fullName.split("/")[1] ?? fullName,
        description: descEl?.textContent?.trim() ?? null,
        language: langEl?.textContent?.trim() ?? null,
        stars: parseInt(starsText, 10) || 0,
        starsToday,
        url: `https://github.com/${fullName}`,
      };
    }),
  );
  await browser.close();
  return repos;
}

export async function runGithubTrending() {
  const seen = new Set<string>();
  const all: typeof githubTrending.$inferInsert[] = [];

  await Promise.allSettled(
    LANGUAGES.map(async (lang) => {
      const repos = await scrapeTrending(lang);
      for (const r of repos) {
        if (!r.fullName || seen.has(r.fullName)) continue;
        seen.add(r.fullName);
        all.push(r);
      }
    }),
  );

  console.log(`[github-trending] found ${all.length} repos`);
  if (all.length) {
    // unique constraint on (full_name, date_trunc('day', fetched_at)) handles dedup
    await db.insert(githubTrending).values(all).onConflictDoNothing();
  }
}
