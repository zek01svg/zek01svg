import { clsx } from "clsx";

type BadgeVariant = "default" | "urgent" | "warn" | "ok" | "dim";

const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-ink)] text-white",
  urgent: "bg-[var(--color-red)] text-white",
  warn: "bg-[var(--color-yellow)] text-[var(--color-ink)]",
  ok: "bg-[var(--color-green)] text-[var(--color-ink)]",
  dim: "bg-[var(--color-dim)] text-[var(--color-ink)]",
};

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span
      className={clsx(
        "inline-block px-1.5 py-0 text-[10px] font-bold tracking-wider uppercase border border-[var(--color-border)]",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
