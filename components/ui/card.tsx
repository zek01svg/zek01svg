import { clsx } from "clsx";

interface CardProps {
  title: string;
  accent?: "yellow" | "red" | "green" | "none";
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Card({ title, accent = "none", className, children, action }: CardProps) {
  const accentMap = {
    yellow: "bg-[var(--color-yellow)]",
    red: "bg-[var(--color-red)] text-white",
    green: "bg-[var(--color-green)]",
    none: "bg-[var(--color-ink)] text-white",
  };

  return (
    <div
      className={clsx(
        "border-2 border-[var(--color-border)] bg-[var(--color-surface)]",
        "shadow-[4px_4px_0px_#0A0A0A] flex flex-col",
        className
      )}
    >
      {/* header */}
      <div
        className={clsx(
          "flex items-center justify-between px-3 py-1.5 border-b-2 border-[var(--color-border)]",
          accentMap[accent]
        )}
      >
        <span className="text-[11px] font-bold tracking-widest uppercase">
          {title}
        </span>
        {action && <div className="text-[11px]">{action}</div>}
      </div>
      {/* body */}
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
}
