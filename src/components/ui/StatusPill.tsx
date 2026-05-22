import { cn } from "@/lib/utils";

const tones = {
  emerald: "bg-accent-emerald/15 text-accent-emerald ring-accent-emerald/30",
  cyan: "bg-accent-cyan/15 text-accent-cyan ring-accent-cyan/30",
  amber: "bg-accent-amber/15 text-accent-amber ring-accent-amber/30",
  rose: "bg-accent-rose/15 text-accent-rose ring-accent-rose/30",
  violet: "bg-accent-violet/15 text-accent-violet ring-accent-violet/30",
  slate: "bg-surface-raised text-muted ring-surface-line"
} as const;

export type Tone = keyof typeof tones;

export function StatusPill({
  children,
  tone = "slate",
  dotted = false,
  className
}: {
  children: React.ReactNode;
  tone?: Tone;
  dotted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        tones[tone],
        className
      )}
    >
      {dotted && <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />}
      {children}
    </span>
  );
}
