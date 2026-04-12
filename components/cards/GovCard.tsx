import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { GovAnnouncement } from "@/lib/types";

const PLACEHOLDER: GovAnnouncement[] = [
  { id: "1", country: "PH", agency: "BSP", title: "BSP holds overnight rate at 6.5% amid easing inflation", summary: "Monetary board opts to keep rates unchanged; next meeting June 2025.", url: "#", published_at: "2025-04-09", fetched_at: "" },
  { id: "2", country: "SG", agency: "MOM", title: "Updated Employment Pass eligibility criteria from Sep 2025", summary: "Minimum salary raised to SGD 5,600 for new applications; COMPASS scoring updated.", url: "#", published_at: "2025-04-08", fetched_at: "" },
  { id: "3", country: "PH", agency: "CHED", title: "CHED opens applications for UniFAST scholarships FY2025", summary: "Free tuition and living allowance for eligible state university enrollees.", url: "#", published_at: "2025-04-07", fetched_at: "" },
];

const countryBadge = {
  PH: <Badge variant="warn">PH</Badge>,
  SG: <Badge variant="ok">SG</Badge>,
};

export function GovCard({ items = PLACEHOLDER }: { items?: GovAnnouncement[] }) {
  return (
    <Card title="Gov Announcements">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <Divider />}
            <div className="flex gap-2 items-start">
              <div className="shrink-0 mt-0.5">
                {countryBadge[item.country]}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[var(--color-muted)] font-bold mb-0.5">{item.agency}</div>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold leading-snug hover:underline block">{item.title}</a>
                <div className="text-[11px] text-[var(--color-muted)] mt-0.5 leading-snug">{item.summary}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
