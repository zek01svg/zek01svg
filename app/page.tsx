import { TopBar } from "@/components/cards/TopBar";
import { TickerBar } from "@/components/cards/TickerBar";
import { WhileYouSlept } from "@/components/cards/WhileYouSlept";
import { DailyBreadCard } from "@/components/cards/DailyBreadCard";
import { InboxCard } from "@/components/cards/InboxCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { TrendingCard } from "@/components/cards/TrendingCard";
import { ReleasesCard } from "@/components/cards/ReleasesCard";
import { CalendarCard } from "@/components/cards/CalendarCard";
import { NotionCard } from "@/components/cards/NotionCard";
import { HackathonsCard } from "@/components/cards/HackathonsCard";
import { InternshipsCard } from "@/components/cards/InternshipsCard";
import { ResearchCard } from "@/components/cards/ResearchCard";
import { SEAStartupsCard } from "@/components/cards/SEAStartupsCard";
import { GovCard } from "@/components/cards/GovCard";
import { WatchlistCard } from "@/components/cards/WatchlistCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* sticky top chrome */}
      <div className="sticky top-0 z-10">
        <TopBar />
        <TickerBar />
      </div>

      {/* main content */}
      <div className="flex-1 p-3">
        {/* ROW 1: Morning brief + Bible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <WhileYouSlept />
          <DailyBreadCard />
        </div>

        {/* ROW 2: Inbox + News + Trending */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <InboxCard />
          <NewsCard />
          <TrendingCard />
        </div>

        {/* ROW 3: Calendar + Notion + Releases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <CalendarCard />
          <NotionCard />
          <ReleasesCard />
        </div>

        {/* ROW 4: Hackathons + Internships + Watchlist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <HackathonsCard />
          <InternshipsCard />
          <WatchlistCard />
        </div>

        {/* ROW 5: Research + SEA Startups + Gov */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ResearchCard />
          <SEAStartupsCard />
          <GovCard />
        </div>
      </div>

      {/* footer */}
      <footer className="border-t-2 border-[var(--color-border)] px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-[var(--color-muted)] tracking-widest uppercase">HQ · Personal Intelligence Dashboard</span>
        <span className="text-[10px] text-[var(--color-muted)]" id="last-updated">—</span>
      </footer>
    </div>
  );
}
