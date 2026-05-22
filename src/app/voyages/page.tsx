"use client";

import { useEffect, useState } from "react";
import { Fuel, Navigation, ShieldAlert, Timer } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Voyage } from "@/types";
import { formatEta, formatNumber } from "@/lib/utils";

const statusTone = {
  Planned: "cyan",
  "In transit": "emerald",
  Completed: "violet",
  Diverted: "rose"
} as const;

export default function VoyagesPage() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);

  useEffect(() => {
    void fetch("/api/voyages")
      .then((r) => r.json())
      .then((r) => setVoyages(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Voyage planner</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Active corridors</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Mock voyage ledger with on-time and risk scoring. Press <kbd className="rounded border border-surface-line bg-surface-raised px-1.5 py-0.5 font-mono text-[11px]">Ctrl K</kbd>
          {" "}then <span className="font-semibold text-accent-cyan">Plan voyage</span> to simulate a new lane.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {voyages.map((voyage) => (
          <article
            key={voyage.id}
            className="overflow-hidden rounded-2xl border border-surface-line bg-surface/70"
          >
            <div className="flex items-center justify-between border-b border-surface-line px-5 py-3">
              <div>
                <p className="font-mono text-[11px] text-muted">{voyage.routeCode}</p>
                <h2 className="text-lg font-bold text-ink">
                  {voyage.from} <span className="text-muted">→</span> {voyage.to}
                </h2>
                <p className="text-xs text-muted">on {voyage.vessel}</p>
              </div>
              <StatusPill
                tone={statusTone[voyage.status]}
                dotted={voyage.status === "In transit" || voyage.status === "Diverted"}
              >
                {voyage.status}
              </StatusPill>
            </div>
            <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
              <div className="rounded-xl border border-surface-line bg-canvas/40 p-3">
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <Timer size={11} /> Window
                </p>
                <p className="mt-1 font-mono text-xs text-ink">{formatEta(voyage.departureIso)}</p>
                <p className="font-mono text-xs text-accent-cyan">{formatEta(voyage.arrivalIso)}</p>
              </div>
              <div className="rounded-xl border border-surface-line bg-canvas/40 p-3">
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <Navigation size={11} /> Distance
                </p>
                <p className="mt-1 font-mono text-lg tabular text-ink">{formatNumber(voyage.distanceNm)}<span className="text-xs text-muted"> NM</span></p>
              </div>
              <div className="rounded-xl border border-surface-line bg-canvas/40 p-3">
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <Fuel size={11} /> Fuel burn
                </p>
                <p className="mt-1 font-mono text-lg tabular text-ink">{formatNumber(voyage.fuelTons)}<span className="text-xs text-muted"> t</span></p>
              </div>
              <div className="rounded-xl border border-surface-line bg-canvas/40 p-3">
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <ShieldAlert size={11} /> Risk
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${voyage.riskScore}%`,
                      background: voyage.riskScore > 60 ? "#fb7185" : voyage.riskScore > 35 ? "#fbbf24" : "#34d399"
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
                  <span>Risk {voyage.riskScore}</span>
                  <span className="text-accent-emerald">On-time {voyage.onTimeScore}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
