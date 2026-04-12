import {
  pgTable, text, integer, numeric, boolean, date, timestamp, uuid,
  unique, index, primaryKey, pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ── Enums ─────────────────────────────────────────────────────────────────────
export const emailPriorityEnum = pgEnum("email_priority", [
  "URGENT_ACTION", "READ_SOON", "INFORMATIONAL", "IRRELEVANT",
]);
export const newsCategoryEnum = pgEnum("news_category", [
  "PH", "SG", "GLOBAL", "TECH", "MARKETS",
]);
export const calendarSourceEnum = pgEnum("calendar_source", [
  "google", "outlook", "apple",
]);
export const hackathonModeEnum = pgEnum("hackathon_mode", [
  "online", "in-person", "hybrid",
]);
export const govCountryEnum = pgEnum("gov_country", ["PH", "SG"]);
export const agentStatusEnum = pgEnum("agent_status_enum", [
  "ok", "error", "running",
]);

// ── Helpers ───────────────────────────────────────────────────────────────────
const id = () => uuid("id").primaryKey().defaultRandom();
const now = () => timestamp("fetched_at", { withTimezone: true }).defaultNow();
const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow();

// ── Agent Status ──────────────────────────────────────────────────────────────
export const agentStatus = pgTable("agent_status", {
  agent:     text("agent").primaryKey(),
  lastRun:   timestamp("last_run", { withTimezone: true }),
  status:    agentStatusEnum("status").notNull().default("ok"),
  errorMsg:  text("error_msg"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ── Email Digest ──────────────────────────────────────────────────────────────
export const emailDigest = pgTable("email_digest", {
  id:         id(),
  account:    text("account").notNull(),
  gmailId:    text("gmail_id").notNull().unique(),
  sender:     text("sender").notNull(),
  subject:    text("subject").notNull(),
  summary:    text("summary").notNull(),
  priority:   emailPriorityEnum("priority").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
  fetchedAt:  now(),
}, (t) => [
  index("email_priority_idx").on(t.priority, t.receivedAt),
  index("email_fetched_idx").on(t.fetchedAt),
]);

// ── News ──────────────────────────────────────────────────────────────────────
export const newsItems = pgTable("news_items", {
  id:          id(),
  title:       text("title").notNull(),
  summary:     text("summary").notNull(),
  source:      text("source").notNull(),
  category:    newsCategoryEnum("category").notNull(),
  url:         text("url").notNull(),
  urlHash:     text("url_hash").notNull().unique(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  fetchedAt:   now(),
}, (t) => [
  index("news_category_idx").on(t.category, t.publishedAt),
]);

// ── Finance Tickers ───────────────────────────────────────────────────────────
export const tickers = pgTable("tickers", {
  symbol:    text("symbol").primaryKey(),
  label:     text("label").notNull(),
  price:     numeric("price").notNull(),
  change:    numeric("change").notNull().default("0"),
  changePct: numeric("change_pct").notNull().default("0"),
  currency:  text("currency").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ── GitHub Trending ───────────────────────────────────────────────────────────
export const githubTrending = pgTable("github_trending", {
  id:          id(),
  fullName:    text("full_name").notNull(),
  name:        text("name").notNull(),
  description: text("description"),
  language:    text("language"),
  stars:       integer("stars").notNull().default(0),
  starsToday:  integer("stars_today").notNull().default(0),
  url:         text("url").notNull(),
  fetchedAt:   now(),
}, (t) => [
  unique("gh_trending_unique").on(t.fullName, sql`date_trunc('day', ${t.fetchedAt})`),
  index("gh_trending_fetched_idx").on(t.fetchedAt),
]);

// ── Hacker News ───────────────────────────────────────────────────────────────
export const hnItems = pgTable("hn_items", {
  hnId:      integer("hn_id").primaryKey(),
  title:     text("title").notNull(),
  url:       text("url"),
  points:    integer("points").notNull().default(0),
  comments:  integer("comments").notNull().default(0),
  fetchedAt: now(),
}, (t) => [
  index("hn_points_idx").on(t.points),
]);

// ── YouTube ───────────────────────────────────────────────────────────────────
export const youtubeItems = pgTable("youtube_items", {
  id:            text("id").primaryKey(),
  title:         text("title").notNull(),
  channel:       text("channel").notNull(),
  thumbnailUrl:  text("thumbnail_url"),
  videoUrl:      text("video_url").notNull(),
  relevanceNote: text("relevance_note"),
  publishedAt:   timestamp("published_at", { withTimezone: true }),
  fetchedAt:     now(),
});

// ── Research Papers ───────────────────────────────────────────────────────────
export const researchPapers = pgTable("research_papers", {
  id:              id(),
  arxivId:         text("arxiv_id").unique(),
  title:           text("title").notNull(),
  authors:         text("authors").array().notNull().default(sql`'{}'`),
  abstractSummary: text("abstract_summary").notNull(),
  arxivUrl:        text("arxiv_url").notNull(),
  relevanceScore:  integer("relevance_score").notNull().default(0),
  categories:      text("categories").array().notNull().default(sql`'{}'`),
  publishedAt:     date("published_at"),
  fetchedAt:       now(),
}, (t) => [
  index("papers_relevance_idx").on(t.relevanceScore, t.fetchedAt),
]);

// ── Dev Releases ──────────────────────────────────────────────────────────────
export const devReleases = pgTable("dev_releases", {
  id:          id(),
  tool:        text("tool").notNull(),
  version:     text("version").notNull(),
  highlight:   text("highlight").notNull(),
  url:         text("url").notNull(),
  isNewTool:   boolean("is_new_tool").notNull().default(false),
  publishedAt: date("published_at"),
  fetchedAt:   now(),
}, (t) => [
  unique("dev_release_unique").on(t.tool, t.version),
  index("dev_release_date_idx").on(t.publishedAt),
]);

// ── Product Releases ──────────────────────────────────────────────────────────
export const productReleases = pgTable("product_releases", {
  id:          id(),
  name:        text("name").notNull(),
  tagline:     text("tagline").notNull(),
  source:      text("source").notNull(),
  url:         text("url").notNull(),
  urlHash:     text("url_hash").notNull().unique(),
  rank:        integer("rank"),
  publishedAt: date("published_at"),
  fetchedAt:   now(),
});

// ── Hackathons ────────────────────────────────────────────────────────────────
export const hackathons = pgTable("hackathons", {
  id:                   id(),
  name:                 text("name").notNull(),
  organizer:            text("organizer").notNull(),
  mode:                 hackathonModeEnum("mode").notNull(),
  location:             text("location"),
  prizeSummary:         text("prize_summary"),
  registrationDeadline: date("registration_deadline"),
  eventStart:           date("event_start"),
  eventEnd:             date("event_end"),
  url:                  text("url").notNull(),
  urlHash:              text("url_hash").notNull().unique(),
  relevanceNote:        text("relevance_note"),
  fetchedAt:            now(),
}, (t) => [
  index("hackathon_deadline_idx").on(t.registrationDeadline),
]);

// ── Internships ───────────────────────────────────────────────────────────────
export const internships = pgTable("internships", {
  id:         id(),
  title:      text("title").notNull(),
  company:    text("company").notNull(),
  location:   text("location").notNull(),
  url:        text("url").notNull(),
  urlHash:    text("url_hash").notNull().unique(),
  source:     text("source").notNull(),
  matchScore: integer("match_score").notNull().default(0),
  postedAt:   date("posted_at"),
  fetchedAt:  now(),
}, (t) => [
  index("internship_score_idx").on(t.matchScore, t.fetchedAt),
]);

// ── Flight Deals ──────────────────────────────────────────────────────────────
export const flightDeals = pgTable("flight_deals", {
  id:            id(),
  origin:        text("origin").notNull(),
  destination:   text("destination").notNull(),
  price:         numeric("price").notNull(),
  currency:      text("currency").notNull(),
  airline:       text("airline").notNull(),
  departureDate: date("departure_date").notNull(),
  returnDate:    date("return_date"),
  bookingUrl:    text("booking_url").notNull(),
  avgPrice:      numeric("avg_price").notNull(),
  discountPct:   numeric("discount_pct").notNull(),
  fetchedAt:     now(),
}, (t) => [
  index("flight_discount_idx").on(t.discountPct, t.fetchedAt),
]);

// ── Price Watchlist ───────────────────────────────────────────────────────────
export const priceWatchlist = pgTable("price_watchlist", {
  id:           id(),
  name:         text("name").notNull(),
  url:          text("url").notNull(),
  platform:     text("platform").notNull(),
  targetPrice:  numeric("target_price"),
  currentPrice: numeric("current_price"),
  highestPrice: numeric("highest_price"),
  currency:     text("currency").notNull().default("PHP"),
  lastChecked:  timestamp("last_checked", { withTimezone: true }).defaultNow(),
  updatedAt:    timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id:        id(),
  itemId:    uuid("item_id").notNull().references(() => priceWatchlist.id, { onDelete: "cascade" }),
  price:     numeric("price").notNull(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("price_history_item_idx").on(t.itemId, t.checkedAt),
]);

// ── Calendar Events ───────────────────────────────────────────────────────────
export const calendarEvents = pgTable("calendar_events", {
  id:          id(),
  externalId:  text("external_id").notNull(),
  source:      calendarSourceEnum("source").notNull(),
  title:       text("title").notNull(),
  startAt:     timestamp("start_at", { withTimezone: true }).notNull(),
  endAt:       timestamp("end_at", { withTimezone: true }).notNull(),
  allDay:      boolean("all_day").notNull().default(false),
  location:    text("location"),
  description: text("description"),
  syncedAt:    timestamp("synced_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  unique("calendar_unique").on(t.externalId, t.source),
  index("calendar_start_idx").on(t.startAt),
]);

// ── Weather ───────────────────────────────────────────────────────────────────
export const weather = pgTable("weather", {
  location:    text("location").primaryKey(),
  tempC:       numeric("temp_c").notNull(),
  feelsLikeC:  numeric("feels_like_c").notNull(),
  condition:   text("condition").notNull(),
  humidity:    integer("humidity").notNull(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ── Daily Brief ───────────────────────────────────────────────────────────────
export const dailyBriefs = pgTable("daily_briefs", {
  id:          id(),
  date:        date("date").unique().notNull(),
  bullets:     text("bullets").array().notNull().default(sql`'{}'`),
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow(),
});

// ── Daily Bread ───────────────────────────────────────────────────────────────
export const dailyBread = pgTable("daily_bread", {
  id:                 id(),
  date:               date("date").unique().notNull(),
  title:              text("title").notNull(),
  scriptureRef:       text("scripture_ref").notNull(),
  verseText:          text("verse_text").notNull(),
  reflectionExcerpt:  text("reflection_excerpt").notNull(),
  devotionalUrl:      text("devotional_url").notNull(),
  bibleUrl:           text("bible_url").notNull(),
  fetchedAt:          now(),
});

// ── Daily Quote ───────────────────────────────────────────────────────────────
export const dailyQuotes = pgTable("daily_quotes", {
  id:     id(),
  date:   date("date").unique().notNull(),
  text:   text("text").notNull(),
  author: text("author").notNull(),
});

// ── SEA Startups ──────────────────────────────────────────────────────────────
export const seaStartups = pgTable("sea_startups", {
  id:          id(),
  headline:    text("headline").notNull(),
  company:     text("company").notNull().default(""),
  summary:     text("summary").notNull(),
  source:      text("source").notNull(),
  url:         text("url").notNull(),
  urlHash:     text("url_hash").notNull().unique(),
  publishedAt: date("published_at"),
  fetchedAt:   now(),
}, (t) => [
  index("sea_startups_date_idx").on(t.publishedAt),
]);

// ── Gov Announcements ─────────────────────────────────────────────────────────
export const govAnnouncements = pgTable("gov_announcements", {
  id:          id(),
  country:     govCountryEnum("country").notNull(),
  agency:      text("agency").notNull(),
  title:       text("title").notNull(),
  summary:     text("summary").notNull(),
  url:         text("url").notNull(),
  urlHash:     text("url_hash").notNull().unique(),
  publishedAt: date("published_at"),
  fetchedAt:   now(),
}, (t) => [
  index("gov_country_idx").on(t.country, t.publishedAt),
]);

// ── Notion Tasks ──────────────────────────────────────────────────────────────
export const notionTasks = pgTable("notion_tasks", {
  id:           text("id").primaryKey(),
  title:        text("title").notNull(),
  dueDate:      date("due_date"),
  status:       text("status").notNull(),
  databaseName: text("database_name").notNull(),
  url:          text("url").notNull(),
  syncedAt:     timestamp("synced_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  index("notion_due_idx").on(t.dueDate),
]);

// ── Type exports (inferred from schema) ───────────────────────────────────────
export type EmailDigest      = typeof emailDigest.$inferSelect;
export type NewsItem         = typeof newsItems.$inferSelect;
export type Ticker           = typeof tickers.$inferSelect;
export type GithubTrending   = typeof githubTrending.$inferSelect;
export type HNItem           = typeof hnItems.$inferSelect;
export type YoutubeItem      = typeof youtubeItems.$inferSelect;
export type ResearchPaper    = typeof researchPapers.$inferSelect;
export type DevRelease       = typeof devReleases.$inferSelect;
export type ProductRelease   = typeof productReleases.$inferSelect;
export type Hackathon        = typeof hackathons.$inferSelect;
export type Internship       = typeof internships.$inferSelect;
export type FlightDeal       = typeof flightDeals.$inferSelect;
export type PriceWatchItem   = typeof priceWatchlist.$inferSelect;
export type CalendarEvent    = typeof calendarEvents.$inferSelect;
export type Weather          = typeof weather.$inferSelect;
export type DailyBrief       = typeof dailyBriefs.$inferSelect;
export type DailyBread       = typeof dailyBread.$inferSelect;
export type DailyQuote       = typeof dailyQuotes.$inferSelect;
export type SeaStartup       = typeof seaStartups.$inferSelect;
export type GovAnnouncement  = typeof govAnnouncements.$inferSelect;
export type NotionTask       = typeof notionTasks.$inferSelect;
export type AgentStatus      = typeof agentStatus.$inferSelect;
