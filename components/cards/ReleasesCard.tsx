import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { DevRelease, ProductRelease } from "@/lib/types";

const PH_DEV: DevRelease[] = [
  { id: "1", tool: "Bun", version: "1.2.0", highlight: "Node.js-compatible shell scripting, faster cold starts", url: "#", is_new_tool: false, published_at: "2025-04-08", fetched_at: "" },
  { id: "2", tool: "Vite", version: "7.0.0", highlight: "Full ESM, drops CJS support, rolldown bundler default", url: "#", is_new_tool: false, published_at: "2025-04-07", fetched_at: "" },
  { id: "3", tool: "Atuin", version: "19.0.0", highlight: "NEW: encrypted shell history sync across machines", url: "#", is_new_tool: true, published_at: "2025-04-06", fetched_at: "" },
];

const PH_PRODUCTS: ProductRelease[] = [
  { id: "1", name: "Cursor Agent 2.0", tagline: "Full agentic coding with persistent memory across sessions", source: "producthunt", url: "#", rank: 1, published_at: "2025-04-09", fetched_at: "" },
  { id: "2", name: "Linear Cycles", tagline: "Time-boxed sprints with AI-generated summaries", source: "producthunt", url: "#", rank: 2, published_at: "2025-04-09", fetched_at: "" },
];

export function ReleasesCard({ dev = PH_DEV, products = PH_PRODUCTS }: {
  dev?: DevRelease[];
  products?: ProductRelease[];
}) {
  return (
    <Card title="Releases">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5">Dev Tools</div>
      <div className="space-y-1.5 mb-3">
        {dev.map((r) => (
          <div key={r.id} className="flex items-baseline gap-2">
            <a href={r.url} target="_blank" rel="noopener noreferrer"
              className="text-[12px] font-bold hover:underline shrink-0">
              {r.tool}@{r.version}
            </a>
            {r.is_new_tool && <Badge variant="warn">NEW</Badge>}
            <span className="text-[11px] text-[var(--color-muted)] leading-snug">{r.highlight}</span>
          </div>
        ))}
      </div>

      <Divider />

      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-1.5 mt-2">Product Hunt</div>
      <div className="space-y-1.5">
        {products.map((p) => (
          <div key={p.id} className="flex gap-2 items-start">
            {p.rank && <span className="text-[10px] text-[var(--color-muted)] shrink-0 mt-0.5">#{p.rank}</span>}
            <div>
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                className="text-[12px] font-bold hover:underline">{p.name}</a>
              <div className="text-[11px] text-[var(--color-muted)] leading-snug">{p.tagline}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
