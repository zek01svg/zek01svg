import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { StartupItem } from "@/lib/types";

const PLACEHOLDER: StartupItem[] = [
  { id: "1", headline: "Grab raises $500M Series I at $20B valuation", company: "Grab", summary: "Round led by SoftBank; capital earmarked for AI infrastructure and BNPL expansion.", source: "DealStreetAsia", url: "#", published_at: "2025-04-09", fetched_at: "" },
  { id: "2", headline: "Kumu acquired by Globe Telecom for undisclosed sum", company: "Kumu", summary: "PH live-streaming platform joins Globe's digital entertainment portfolio.", source: "Tech in Asia", url: "#", published_at: "2025-04-08", fetched_at: "" },
  { id: "3", headline: "Funding winter eases: SEA seed deals up 34% Q1 2025", company: "", summary: "Fintech and agritech lead deal count; Singapore dominates at 61% of round volume.", source: "e27", url: "#", published_at: "2025-04-07", fetched_at: "" },
];

export function SEAStartupsCard({ items = PLACEHOLDER }: { items?: StartupItem[] }) {
  return (
    <Card title="SEA Startups">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <Divider />}
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="text-[12px] font-bold leading-snug hover:underline block">{item.headline}</a>
            <div className="text-[11px] text-[var(--color-muted)] mt-0.5 leading-snug">{item.summary}</div>
            <div className="text-[10px] text-[var(--color-dim)] mt-0.5">{item.source}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
