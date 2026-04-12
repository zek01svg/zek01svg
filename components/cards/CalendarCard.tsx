import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { CalendarEvent } from "@/lib/types";

const PLACEHOLDER: CalendarEvent[] = [
  { id: "1", title: "Math Class", start_at: "2025-04-09T10:00:00+08:00", end_at: "2025-04-09T11:30:00+08:00", all_day: false, source: "google", location: "SOE 2-1", description: null },
  { id: "2", title: "Project X Submission Deadline", start_at: "2025-04-09T15:00:00+08:00", end_at: "2025-04-09T15:00:00+08:00", all_day: false, source: "outlook", location: null, description: "Submit via eLearn" },
  { id: "3", title: "Gym", start_at: "2025-04-09T18:00:00+08:00", end_at: "2025-04-09T19:30:00+08:00", all_day: false, source: "apple", location: "OCBC Arena", description: null },
  { id: "4", title: "SMU Hackathon Info Session", start_at: "2025-04-10T14:00:00+08:00", end_at: "2025-04-10T15:30:00+08:00", all_day: false, source: "google", location: "SIS Seminar Room", description: null },
];

const sourceColor: Record<string, string> = {
  google: "text-[var(--color-red)]",
  outlook: "text-blue-600",
  apple: "text-[var(--color-ink)]",
};

const sourceDot: Record<string, string> = {
  google: "bg-[var(--color-red)]",
  outlook: "bg-blue-600",
  apple: "bg-[var(--color-ink)]",
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
}

export function CalendarCard({ events = PLACEHOLDER }: { events?: CalendarEvent[] }) {
  const today = events.filter((e) => isToday(e.start_at));
  const upcoming = events.filter((e) => !isToday(e.start_at));

  return (
    <Card title="Calendar">
      {today.length > 0 && (
        <>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5">Today</div>
          <div className="space-y-1.5 mb-3">
            {today.map((e) => (
              <div key={e.id} className="flex gap-2 items-start">
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${sourceDot[e.source]}`} />
                <div>
                  <div className="text-[12px] font-bold leading-snug">{e.title}</div>
                  <div className="text-[10px] text-[var(--color-muted)]">
                    {fmtTime(e.start_at)}{e.location && ` · ${e.location}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {upcoming.length > 0 && (
        <>
          <Divider />
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5 mt-2">Upcoming</div>
          <div className="space-y-1.5">
            {upcoming.map((e) => (
              <div key={e.id} className="flex gap-2 items-start">
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${sourceDot[e.source]}`} />
                <div>
                  <div className="text-[12px] font-bold leading-snug">{e.title}</div>
                  <div className="text-[10px] text-[var(--color-muted)]">
                    {new Date(e.start_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} {fmtTime(e.start_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
