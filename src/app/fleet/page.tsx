"use client";

import { useEffect, useState } from "react";
import { Fuel, Gauge as GaugeIcon, Navigation, Ship } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Sparkbars } from "@/components/ui/Sparkbars";
import { Vessel } from "@/types";
import { formatEta, formatNumber, formatHours } from "@/lib/utils";

const statusTone = {
  Underway: "cyan",
  Anchored: "amber",
  Loading: "violet",
  Discharging: "violet",
  Delayed: "rose"
} as const;

export default function FleetPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [filter, setFilter] = useState<"All" | "Underway" | "Anchored" | "Delayed">("All");

  useEffect(() => {
    void fetch("/api/vessels")
      .then((r) => r.json())
      .then((r) => setVessels(r.data));
  }, []);

  const filtered =
    filter === "All" ? vessels : vessels.filter((v) => v.status === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Fleet ledger</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Vessels under management</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Mock AIS feed across container, bulk, tanker, reefer, and Ro-Ro vessels. Tap a card
            to see route progress, fuel posture, and recent speed pulse.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-surface-line bg-surface/70 p-1 text-xs">
          {(["All", "Underway", "Anchored", "Delayed"] as const).map((f) => (
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vessel) => (
          <article
            key={vessel.id}
            className="rounded-2xl border border-surface-line bg-surface/70 p-5 transition hover:border-accent-cyan/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-muted">
                  <Ship size={14} className="text-accent-cyan" />
                  <span className="font-mono text-[11px]">{vessel.imo} · {vessel.flag}</span>
                </div>
                <h2 className="mt-1 text-lg font-bold text-ink">{vessel.name}</h2>
                <p className="text-xs text-muted">{vessel.type} · {formatNumber(vessel.capacityTeu)} TEU</p>
              </div>
              <StatusPill
                tone={statusTone[vessel.status]}
                dotted={vessel.status === "Underway" || vessel.status === "Delayed"}
                className={vessel.status === "Delayed" ? "pulse-critical" : ""}
              >
                {vessel.status}
              </StatusPill>
            </div>

            <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
              <span className="text-ink">{vessel.originPort}</span>
              <Navigation size={12} className="text-accent-cyan" />
              <span className="text-ink">{vessel.destinationPort}</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-raised">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-emerald"
                style={{ width: `${vessel.routeProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted">
              Progress {vessel.routeProgress}% · ETA {formatEta(vessel.etaIso)}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-lg border border-surface-line bg-canvas/40 p-2">
                <p className="flex items-center gap-1 text-muted">
                  <GaugeIcon size={11} /> Speed
                </p>
                <p className="mt-1 font-mono tabular text-ink">{vessel.speedKn} kn</p>
              </div>
              <div className="rounded-lg border border-surface-line bg-canvas/40 p-2">
                <p className="flex items-center gap-1 text-muted">
                  <Fuel size={11} /> Fuel
                </p>
                <p className="mt-1 font-mono tabular text-ink">{vessel.fuelPct}%</p>
              </div>
              <div className="rounded-lg border border-surface-line bg-canvas/40 p-2">
                <p className="text-muted">Delay</p>
                <p
                  className={`mt-1 font-mono tabular ${
                    vessel.delayHours > 12 ? "text-accent-rose" : vessel.delayHours > 0 ? "text-accent-amber" : "text-accent-emerald"
                  }`}
                >
                  {vessel.delayHours > 0 ? `+${formatHours(vessel.delayHours)}` : "on plan"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] text-muted">Speed pulse · 7d</p>
                <Sparkbars data={vessel.speedHistory} />
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted">Carbon idx</p>
                <p
                  className={`font-mono tabular ${
                    vessel.carbonIndex > 75 ? "text-accent-rose" : vessel.carbonIndex > 60 ? "text-accent-amber" : "text-accent-emerald"
                  }`}
                >
                  {vessel.carbonIndex}
                </p>
              </div>
            </div>

            <p className="mt-4 line-clamp-2 text-[11px] text-muted">{vessel.cargo}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
