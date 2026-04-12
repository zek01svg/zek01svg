import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { PriceWatchItem } from "@/lib/types";

const PLACEHOLDER: PriceWatchItem[] = [
  { id: "1", name: "Sony WH-1000XM6", url: "#", platform: "Lazada", target_price: 16000, current_price: 18500, highest_price: 19990, currency: "PHP", last_checked: "2025-04-09T06:00:00Z" },
  { id: "2", name: "Logitech MX Master 3S", url: "#", platform: "Amazon SG", target_price: 90, current_price: 94, highest_price: 109, currency: "SGD", last_checked: "2025-04-09T06:00:00Z" },
  { id: "3", name: "iPad Pro M4 11\"", url: "#", platform: "Apple Store SG", target_price: 1200, current_price: 1299, highest_price: 1299, currency: "SGD", last_checked: "2025-04-09T06:00:00Z" },
];

function priceDiff(current: number | null, target: number | null) {
  if (!current || !target) return null;
  const pct = ((current - target) / target) * 100;
  if (pct <= 0) return <Badge variant="ok">AT TARGET</Badge>;
  if (pct <= 10) return <Badge variant="warn">-{Math.round(pct)}% to go</Badge>;
  return null;
}

export function WatchlistCard({ items = PLACEHOLDER }: { items?: PriceWatchItem[] }) {
  return (
    <Card title="Price Watchlist">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <Divider />}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold hover:underline block">{item.name}</a>
                <div className="text-[10px] text-[var(--color-muted)]">{item.platform}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-bold">
                  {item.currency} {item.current_price?.toLocaleString()}
                </div>
                {item.target_price && (
                  <div className="text-[10px] text-[var(--color-muted)]">
                    target: {item.currency} {item.target_price.toLocaleString()}
                  </div>
                )}
                {priceDiff(item.current_price, item.target_price)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
