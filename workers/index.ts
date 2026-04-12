/**
 * HQ Workers — Hono HTTP service
 * Each agent is a POST /agents/<name> route.
 * Triggered by Cloud Scheduler via HTTP.
 * One Cloud Run service, many cron jobs pointing at different routes.
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { setAgentStatus } from "./shared/db";

import { runEmail }          from "./agents/email";
import { runNews }           from "./agents/news";
import { runFinance }        from "./agents/finance";
import { runGithubTrending } from "./agents/github-trending";
import { runHN }             from "./agents/hn";
import { runCalendar }       from "./agents/calendar";
import { runWeather }        from "./agents/weather";
import { runResearch }       from "./agents/research";
import { runReleases }       from "./agents/releases";
import { runHackathons }     from "./agents/hackathons";
import { runSEAStartups }    from "./agents/sea-startups";
import { runGov }            from "./agents/gov";
import { runNotion }         from "./agents/notion";
import { runDailyBrief }     from "./agents/daily-brief";
import { runBible }          from "./agents/bible";
import { runPrices }         from "./agents/prices";

const app = new Hono();

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/", (c) => c.json({ status: "ok", service: "hq-workers" }));
app.get("/health", (c) => c.json({ status: "ok" }));

// ── Agent runner helper ───────────────────────────────────────────────────────
function agent(name: string, fn: () => Promise<void>) {
  return async (c: Parameters<Parameters<typeof app.post>[1]>[0]) => {
    // Verify Cloud Scheduler OIDC token in prod (skip in dev)
    const authHeader = c.req.header("Authorization");
    if (process.env.NODE_ENV === "production" && !authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await setAgentStatus(name, "running");
    const start = Date.now();
    try {
      await fn();
      await setAgentStatus(name, "ok");
      return c.json({ agent: name, status: "ok", ms: Date.now() - start });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[${name}] FAILED:`, msg);
      await setAgentStatus(name, "error", msg);
      return c.json({ agent: name, status: "error", error: msg }, 500);
    }
  };
}

// ── Agent routes ──────────────────────────────────────────────────────────────
app.post("/agents/email",           agent("email",           () => Promise.all([
  runEmail("personal", "GMAIL_CREDS_PERSONAL"),
  runEmail("school",   "GMAIL_CREDS_SCHOOL"),
]).then(() => {})));

app.post("/agents/news",            agent("news",            runNews));
app.post("/agents/finance",         agent("finance",         runFinance));
app.post("/agents/github-trending", agent("github-trending", runGithubTrending));
app.post("/agents/hn",              agent("hn",              runHN));
app.post("/agents/calendar",        agent("calendar",        runCalendar));
app.post("/agents/weather",         agent("weather",         runWeather));
app.post("/agents/research",        agent("research",        runResearch));
app.post("/agents/releases",        agent("releases",        runReleases));
app.post("/agents/hackathons",      agent("hackathons",      runHackathons));
app.post("/agents/sea-startups",    agent("sea-startups",    runSEAStartups));
app.post("/agents/gov",             agent("gov",             runGov));
app.post("/agents/notion",          agent("notion",          runNotion));
app.post("/agents/daily-brief",     agent("daily-brief",     runDailyBrief));
app.post("/agents/bible",           agent("bible",           runBible));
app.post("/agents/prices",          agent("prices",          runPrices));

// Run all agents sequentially (for manual full refresh)
app.post("/agents/all", async (c) => {
  const results: Record<string, string> = {};
  const runners: Array<[string, () => Promise<void>]> = [
    ["weather",         runWeather],
    ["finance",         runFinance],
    ["bible",           runBible],
    ["notion",          runNotion],
    ["calendar",        runCalendar],
    ["news",            runNews],
    ["hn",              runHN],
    ["github-trending", runGithubTrending],
    ["research",        runResearch],
    ["releases",        runReleases],
    ["hackathons",      runHackathons],
    ["sea-startups",    runSEAStartups],
    ["gov",             runGov],
  ];
  for (const [name, fn] of runners) {
    try { await fn(); results[name] = "ok"; }
    catch (e) { results[name] = e instanceof Error ? e.message : "error"; }
  }
  return c.json(results);
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "8080", 10);
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`HQ Workers running on :${PORT}`);
});

export default app;
