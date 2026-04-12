import { clsx } from "clsx";
import type { TickerItem } from "@/lib/types";

const PLACEHOLDER: TickerItem[] = [
  { symbol: "PSEI", label: "PSEi", price: 6821, change: 27.4, change_pct: 0.40, currency: "PHP", updated_at: "" },
  { symbol: "STI", label: "STI", price: 3102, change: 12.1, change_pct: 0.39, currency: "SGD", updated_at: "" },
  { symbol: "SPX", label: "S&P 500", price: 5213, change: -18.2, change_pct: -0.35, currency: "USD", updated_at: "" },
  { symbol: "PHPUSD", label: "PHP/USD", price: 56.21, change: 0.04, change_pct: 0.07, currency: "", updated_at: "" },
  { symbol: "SGDUSD", label: "SGD/USD", price: 1.342, change: -0.001, change_pct: -0.07, currency: "", updated_at: "" },
  { symbol: "PHPSGD", label: "PHP/SGD", price: 41.88, change: 0.12, change_pct: 0.29, currency: "", updated_at: "" },
];

function Tick({ item }: { item: TickerItem }) {
  const up = item.change_pct >= 0;
  return (
    <span className="flex items-baseline gap-2 pr-6 shrink-0">
      <span className="text-[11px] font-bold tracking-wider text-[var(--color-muted)]">{item.label}</span>
      <span className="text-[12px] font-bold">{item.price.toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
      <span className={clsx("text-[11px] font-bold", up ? "text-[var(--color-green)]" : "text-[var(--color-red)]")}>
        {up ? "▲" : "▼"}{Math.abs(item.change_pct).toFixed(2)}%
      </span>
    </span>
  );
}

export function TickerBar({ tickers = PLACEHOLDER }: { tickers?: TickerItem[] }) {
  return (
    <div className="border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 flex gap-0 overflow-x-auto">
      {tickers.map((t) => <Tick key={t.symbol} item={t} />)}
    </div>
  );
}
