"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CloudLightning, Megaphone, Wrench } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Disruption, DisruptionSeverity } from "@/types";
import { formatEta } from "@/lib/utils";

const severityTone = {
  Info: "cyan",
  Watch: "violet",
  Warning: "amber",
  Critical: "rose"
} as const;

const typeIcon = {
  Weather: CloudLightning,
  Strike: Megaphone,
  Congestion: AlertTriangle,
  Mechanical: Wrench,
  Geopolitical: AlertTriangle
} as const;

export default function DisruptionsPage() {
  const [items, setItems] = useState<Disruption[]>([]);
  const [filter, setFilter] = useState<DisruptionSeverity | "All">("All");

  useEffect(() => {
    void fetch("/api/disruptions")
      .then((r) => r.json())
      .then((r) => setItems(r.data));
  }, []);

  const filtered = filter === "All" ? items : items.filter((i) => i.severity === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Disruption ledger</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Active signals</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Mock disruption feed across weather, congestion, strike, mechanical, and geopolitical
            signals. A real deployment would aggregate from port APIs, weather, AIS anomalies, and
            news/intel feeds.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-surface-line bg-surface/70 p-1 text-xs">
          {(["All", "Critical", "Warning", "Watch", "Info"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                filter === f
                  ? "bg-accent-cyan/15 text-accent-cyan ring-1 ring-accent-cyan/30"
                  : "text-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        {filtered.map((item) => {
          const Icon = typeIcon[item.type];
          return (
            <article
              key={item.id}
              className="rounded-2xl border border-surface-line bg-surface/70 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span
                    className={`rounded-xl p-2.5 ring-1 ${
                      item.severity === "Critical"
                        ? "bg-accent-rose/15 text-accent-rose ring-accent-rose/30 pulse-critical"
                        : item.severity === "Warning"
                          ? "bg-accent-amber/15 text-accent-amber ring-accent-amber/30"
                          : item.severity === "Watch"
                            ? "bg-accent-violet/15 text-accent-violet ring-accent-violet/30"
                            : "bg-accent-cyan/15 text-accent-cyan ring-accent-cyan/30"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone={severityTone[item.severity]} dotted={item.severity === "Critical"}>
                        {item.severity}
                      </StatusPill>
                      <StatusPill tone="violet">{item.type}</StatusPill>
                      <StatusPill tone={item.status === "Mitigated" ? "emerald" : item.status === "Open" ? "amber" : "cyan"}>
                        {item.status}
                      </StatusPill>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-ink">{item.location}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.message}</p>
                  </div>
                </div>
                <div className="text-right text-[11px] text-muted">
                  <p>Detected</p>
                  <p className="font-mono text-ink">{formatEta(item.detectedIso)}</p>
                  <p className="mt-2">Affects</p>
                  <p className="font-mono text-ink">{item.affectedVessels} vessels</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
