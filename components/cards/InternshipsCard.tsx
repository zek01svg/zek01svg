import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { InternshipItem } from "@/lib/types";

const PLACEHOLDER: InternshipItem[] = [
  { id: "1", title: "Software Engineer Intern", company: "Grab", location: "Singapore", url: "#", source: "MyCareersFuture", match_score: 96, posted_at: "2025-04-09", fetched_at: "" },
  { id: "2", title: "Data Engineering Intern", company: "Sea Limited", location: "Singapore", url: "#", source: "MyCareersFuture", match_score: 89, posted_at: "2025-04-08", fetched_at: "" },
  { id: "3", title: "Backend Engineering Intern", company: "Ninja Van", location: "Singapore", url: "#", source: "Kalibrr", match_score: 84, posted_at: "2025-04-08", fetched_at: "" },
  { id: "4", title: "ML Research Intern", company: "DSO National Laboratories", location: "Singapore", url: "#", source: "MyCareersFuture", match_score: 81, posted_at: "2025-04-07", fetched_at: "" },
];

function scoreColor(score: number) {
  if (score >= 90) return "ok" as const;
  if (score >= 80) return "warn" as const;
  return "dim" as const;
}

function daysAgo(d: string | null) {
  if (!d) return "";
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return "today";
  return `${diff}d ago`;
}

export function InternshipsCard({ items = PLACEHOLDER }: { items?: InternshipItem[] }) {
  return (
    <Card title="Internships" action={<span>{items.length} new</span>}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <Divider />}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold hover:underline block">{item.title}</a>
                <div className="text-[11px] text-[var(--color-muted)]">{item.company} · {item.location}</div>
                <div className="text-[10px] text-[var(--color-dim)]">{item.source} · {daysAgo(item.posted_at)}</div>
              </div>
              <Badge variant={scoreColor(item.match_score)}>{item.match_score}%</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
