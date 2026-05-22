export function Gauge({ value, label, accent = "#22d3ee" }: { value: number; label: string; accent?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2a44" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div>
        <p className="font-mono text-2xl tabular text-ink">{clamped}<span className="text-sm text-muted"> /100</span></p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
