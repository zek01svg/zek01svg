import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { GithubRepo, HNItem, YouTubeItem } from "@/lib/types";

const PH_REPOS: GithubRepo[] = [
  { id: "1", name: "shadcn-ui", full_name: "shadcn/ui", description: "Beautifully designed components built with Radix UI and Tailwind CSS.", language: "TypeScript", stars: 52000, stars_today: 412, url: "#", fetched_at: "" },
  { id: "2", name: "uv", full_name: "astral-sh/uv", description: "An extremely fast Python package and project manager, written in Rust.", language: "Rust", stars: 28000, stars_today: 287, url: "#", fetched_at: "" },
  { id: "3", name: "docling", full_name: "DS4SD/docling", description: "Get your documents ready for gen AI.", language: "Python", stars: 18400, stars_today: 203, url: "#", fetched_at: "" },
];

const PH_HN: HNItem[] = [
  { id: 1, title: "Show HN: I built a local-first spreadsheet app that works offline", url: "#", points: 847, comments: 213, fetched_at: "" },
  { id: 2, title: "The end of localhost (Cloudflare blog)", url: "#", points: 612, comments: 189, fetched_at: "" },
  { id: 3, title: "Ask HN: What tools do you use for personal knowledge management?", url: null, points: 504, comments: 302, fetched_at: "" },
];

const PH_YT: YouTubeItem[] = [
  { id: "1", title: "How MCP Servers Actually Work", channel: "Fireship", thumbnail_url: "", video_url: "#", relevance_note: "Explains the protocol you are using in this project", published_at: "2025-04-08", fetched_at: "" },
  { id: "2", title: "Rust in 2025: The State of the Language", channel: "No Boilerplate", thumbnail_url: "", video_url: "#", relevance_note: "Language you track", published_at: "2025-04-07", fetched_at: "" },
];

function fmtStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function TrendingCard({ repos = PH_REPOS, hn = PH_HN, yt = PH_YT }: {
  repos?: GithubRepo[];
  hn?: HNItem[];
  yt?: YouTubeItem[];
}) {
  return (
    <Card title="Trending">
      {/* GitHub */}
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5">GitHub</div>
      <div className="space-y-1.5 mb-3">
        {repos.map((r) => (
          <div key={r.id} className="flex items-start gap-2">
            <span className="text-[10px] text-[var(--color-muted)] shrink-0 mt-0.5">★{fmtStars(r.stars)}</span>
            <div className="min-w-0">
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                className="text-[12px] font-bold hover:underline">{r.full_name}</a>
              <div className="text-[11px] text-[var(--color-muted)] leading-snug truncate">{r.description}</div>
              {r.language && <span className="text-[10px] text-[var(--color-dim)]">{r.language} · +{r.stars_today} today</span>}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* HN */}
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5 mt-2">Hacker News</div>
      <div className="space-y-1.5 mb-3">
        {hn.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <span className="text-[10px] text-[var(--color-muted)] shrink-0 mt-0.5">{item.points}p</span>
            <a href={item.url ?? "#"} target="_blank" rel="noopener noreferrer"
              className="text-[12px] font-bold leading-snug hover:underline">{item.title}</a>
          </div>
        ))}
      </div>

      <Divider />

      {/* YouTube */}
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5 mt-2">YouTube</div>
      <div className="space-y-1.5">
        {yt.map((v) => (
          <div key={v.id}>
            <a href={v.video_url} target="_blank" rel="noopener noreferrer"
              className="text-[12px] font-bold leading-snug hover:underline block">{v.title}</a>
            <div className="text-[10px] text-[var(--color-muted)]">{v.channel}</div>
            <div className="text-[11px] text-[var(--color-dim)] italic">{v.relevance_note}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
