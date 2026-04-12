import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { NewsItem, NewsCategory } from "@/lib/types";

const PLACEHOLDER: NewsItem[] = [
  { id: "1", title: "Senate approves Magna Carta for Internet Freedom", summary: "Landmark bill guaranteeing digital rights passed third reading.", source: "Rappler", category: "PH", url: "#", published_at: "2025-04-09T07:00:00Z", fetched_at: "" },
  { id: "2", title: "MAS tightens crypto exchange rules effective May 2025", summary: "Retail leverage capped at 2x; enhanced KYC required.", source: "CNA", category: "SG", url: "#", published_at: "2025-04-09T06:00:00Z", fetched_at: "" },
  { id: "3", title: "GPT-5 Turbo pricing drops 60% amid competition from Gemini", summary: "OpenAI cuts API costs as market pressure intensifies.", source: "TechCrunch", category: "TECH", url: "#", published_at: "2025-04-09T05:30:00Z", fetched_at: "" },
  { id: "4", title: "PSEi dips 0.8% as BSP holds rates amid inflation concerns", summary: "Index closes at 6,821; energy and bank stocks lead losses.", source: "Inquirer", category: "MARKETS", url: "#", published_at: "2025-04-09T04:00:00Z", fetched_at: "" },
  { id: "5", title: "NATO summit: Ukraine aid package approved", summary: "Alliance commits $40B additional military aid for 2025.", source: "Reuters", category: "GLOBAL", url: "#", published_at: "2025-04-09T03:00:00Z", fetched_at: "" },
];

const catBadge: Record<NewsCategory, React.ReactNode> = {
  PH: <Badge variant="warn">PH</Badge>,
  SG: <Badge variant="ok">SG</Badge>,
  GLOBAL: <Badge variant="dim">GLOBAL</Badge>,
  TECH: <Badge variant="default">TECH</Badge>,
  MARKETS: <Badge variant="dim">MARKETS</Badge>,
};

export function NewsCard({ items = PLACEHOLDER }: { items?: NewsItem[] }) {
  return (
    <Card title="News">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <Divider />}
            <div className="flex gap-2 items-start">
              <div className="shrink-0 mt-0.5">{catBadge[item.category]}</div>
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold leading-snug hover:underline block">
                  {item.title}
                </a>
                <div className="text-[11px] text-[var(--color-muted)] mt-0.5 leading-snug">{item.summary}</div>
                <div className="text-[10px] text-[var(--color-dim)] mt-0.5">{item.source}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
