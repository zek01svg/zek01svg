import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { HackathonItem } from "@/lib/types";

const PLACEHOLDER: HackathonItem[] = [
  { id: "1", name: "HackMIT 2025", organizer: "MLH / MIT", mode: "in-person", location: "Boston, MA", prize_summary: "$15,000 in prizes", registration_deadline: "2025-04-16", event_start: "2025-05-10", event_end: "2025-05-11", url: "#", relevance_note: "Top-tier; applications open now", fetched_at: "" },
  { id: "2", name: "PH Dev Cup 2025", organizer: "DICT Philippines", mode: "hybrid", location: "Manila + Online", prize_summary: "₱500k total prizes", registration_deadline: "2025-04-20", event_start: "2025-05-15", event_end: "2025-05-16", url: "#", relevance_note: "PH gov-backed, strong for local resume", fetched_at: "" },
  { id: "3", name: "Hack for Good SG", organizer: "IMDA", mode: "in-person", location: "Singapore", prize_summary: "SGD 20,000", registration_deadline: "2025-04-25", event_start: "2025-05-20", event_end: "2025-05-21", url: "#", relevance_note: "IMDA-sponsored, great networking", fetched_at: "" },
];

function daysLeft(deadline: string | null) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return <Badge variant="dim">closed</Badge>;
  if (diff <= 3) return <Badge variant="urgent">{diff}d left</Badge>;
  if (diff <= 7) return <Badge variant="warn">{diff}d left</Badge>;
  return <Badge variant="dim">{diff}d left</Badge>;
}

const modeMap: Record<string, string> = {
  online: "ONLINE",
  "in-person": "IN-PERSON",
  hybrid: "HYBRID",
};

export function HackathonsCard({ items = PLACEHOLDER }: { items?: HackathonItem[] }) {
  return (
    <Card title="Hackathons">
      <div className="space-y-3">
        {items.map((h, i) => (
          <div key={h.id}>
            {i > 0 && <Divider />}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <Badge variant="dim">{modeMap[h.mode]}</Badge>
                  {h.location && <span className="text-[10px] text-[var(--color-muted)]">{h.location}</span>}
                </div>
                <a href={h.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold hover:underline block">{h.name}</a>
                <div className="text-[10px] text-[var(--color-muted)]">{h.organizer}</div>
                {h.prize_summary && <div className="text-[11px] mt-0.5">{h.prize_summary}</div>}
                {h.relevance_note && <div className="text-[11px] text-[var(--color-muted)] italic">{h.relevance_note}</div>}
              </div>
              <div className="shrink-0 text-right space-y-1">
                {daysLeft(h.registration_deadline)}
                <div className="text-[10px] text-[var(--color-dim)]">reg closes</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
