import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const accents = {
  cyan: { ring: "ring-accent-cyan/30", text: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  emerald: { ring: "ring-accent-emerald/30", text: "text-accent-emerald", bg: "bg-accent-emerald/10" },
  amber: { ring: "ring-accent-amber/30", text: "text-accent-amber", bg: "bg-accent-amber/10" },
  rose: { ring: "ring-accent-rose/30", text: "text-accent-rose", bg: "bg-accent-rose/10" },
  violet: { ring: "ring-accent-violet/30", text: "text-accent-violet", bg: "bg-accent-violet/10" }
} as const;

export function MetricTile({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  accent = "cyan"
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  accent?: keyof typeof accents;
}) {
  const a = accents[accent];
  return (
    <article className="relative overflow-hidden rounded-2xl border border-surface-line bg-surface/70 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
          <p className="mt-2 font-mono text-3xl tabular text-ink">{value}</p>
        </div>
        <span className={cn("rounded-xl p-2.5 ring-1", a.bg, a.ring, a.text)}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted">{hint}</span>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              delta >= 0 ? "text-accent-emerald" : "text-accent-rose"
            )}
          >
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
    </article>
  );
}
