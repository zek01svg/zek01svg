import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { PaperItem } from "@/lib/types";

const PLACEHOLDER: PaperItem[] = [
  {
    id: "1",
    title: "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision",
    authors: ["Jay Shah", "Ganesh Bikshandi", "Ying Zhang"],
    abstract_summary: "Achieves 1.5–2x speedup over FA2 on H100 GPUs via async pipelining and FP8 support.",
    arxiv_url: "#",
    relevance_score: 94,
    categories: ["cs.LG", "cs.AR"],
    published_at: "2025-04-08",
    fetched_at: "",
  },
  {
    id: "2",
    title: "Scaling Laws for Reward Model Overoptimization in RLHF",
    authors: ["Leo Gao", "John Schulman", "Jacob Hilton"],
    abstract_summary: "Quantifies how reward hacking scales with model and proxy reward size; key for safe RLHF.",
    arxiv_url: "#",
    relevance_score: 88,
    categories: ["cs.LG", "cs.AI"],
    published_at: "2025-04-07",
    fetched_at: "",
  },
];

export function ResearchCard({ papers = PLACEHOLDER }: { papers?: PaperItem[] }) {
  return (
    <Card title="Research Papers">
      <div className="space-y-3">
        {papers.map((p, i) => (
          <div key={p.id}>
            {i > 0 && <Divider />}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <a href={p.arxiv_url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold leading-snug hover:underline block">{p.title}</a>
                <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
                  {p.authors.slice(0, 2).join(", ")}{p.authors.length > 2 ? " et al." : ""} · {p.categories.join(", ")}
                </div>
                <div className="text-[11px] text-[var(--color-muted)] leading-snug mt-1">{p.abstract_summary}</div>
              </div>
              <Badge variant={p.relevance_score >= 90 ? "ok" : "warn"}>{p.relevance_score}%</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
