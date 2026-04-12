import { Card } from "@/components/ui/card";
import type { DailyBrief } from "@/lib/types";

const PLACEHOLDER: DailyBrief = {
  id: "",
  date: "2025-04-09",
  bullets: [
    "PSEi dropped 0.8% after BSP held rates; sentiment cautious ahead of US CPI data",
    "PHivolcs recorded a M4.2 quake in Surigao — no tsunami warning",
    "OpenAI announced GPT-5 Turbo pricing cut by 60%, effective immediately",
    "Singapore MOM released updated EP application guidelines for 2025",
    "MLH Hackathon deadline extended by 3 days — now closes Apr 16",
    "3 new internship postings matched your profile on MyCareersFuture",
  ],
  generated_at: "",
};

export function WhileYouSlept({ brief = PLACEHOLDER }: { brief?: DailyBrief }) {
  return (
    <Card title="While You Slept" accent="yellow">
      <ul className="space-y-2">
        {brief.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-[12px] leading-snug">
            <span className="text-[var(--color-muted)] shrink-0 select-none">{String(i + 1).padStart(2, "0")}.</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
