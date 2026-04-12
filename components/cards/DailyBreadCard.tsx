import { Card } from "@/components/ui/card";
import type { DailyBread } from "@/lib/types";

const PLACEHOLDER: DailyBread = {
  id: "",
  date: "2025-04-09",
  title: "The God Who Sees",
  scripture_ref: "Genesis 16:13",
  verse_text: "She gave this name to the LORD who spoke to her: 'You are the God who sees me.'",
  reflection_excerpt:
    "Hagar, alone in the wilderness, felt invisible — yet God met her there. No matter how unseen you feel, you are known.",
  devotional_url: "https://odb.org",
  bible_url: "https://www.biblegateway.com/passage/?search=Genesis+16%3A13&version=NIV",
};

export function DailyBreadCard({ bread = PLACEHOLDER }: { bread?: DailyBread }) {
  return (
    <Card title="Daily Bread" accent="none">
      <div className="space-y-2">
        <div>
          <span className="text-[10px] tracking-widest uppercase text-[var(--color-muted)]">
            {bread.scripture_ref}
          </span>
          <div className="text-[11px] italic mt-0.5 leading-snug text-[var(--color-ink)]">
            &ldquo;{bread.verse_text}&rdquo;
          </div>
        </div>
        <div className="border-t-2 border-[var(--color-border)] pt-2">
          <div className="text-[12px] font-bold mb-1">{bread.title}</div>
          <div className="text-[11px] text-[var(--color-muted)] leading-snug">
            {bread.reflection_excerpt}
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <a
            href={bread.bible_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-wider font-bold underline underline-offset-2"
          >
            Full verse →
          </a>
          <a
            href={bread.devotional_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-wider font-bold underline underline-offset-2"
          >
            Devotional →
          </a>
        </div>
      </div>
    </Card>
  );
}
