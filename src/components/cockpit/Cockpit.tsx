"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Anchor, Compass, Flame, Ship, Timer } from "lucide-react";
import { MetricTile } from "@/components/ui/MetricTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { Gauge } from "@/components/ui/Gauge";
import { Sparkbars } from "@/components/ui/Sparkbars";
import { WorldMap } from "@/components/ui/WorldMap";
import { CockpitKpis, Disruption, Port, Vessel, Voyage } from "@/types";
import { formatEta, formatHours, formatNumber } from "@/lib/utils";

type Snapshot = {
  vessels: Vessel[];
  ports: Port[];
  voyages: Voyage[];
  disruptions: Disruption[];
  kpis: CockpitKpis;
};

const severityTone = {
  Info: "cyan",
  Watch: "violet",
  Warning: "amber",
  Critical: "rose"
} as const;

const congestionTone = {
  Calm: "emerald",
  Moderate: "amber",
  Heavy: "amber",
  Critical: "rose"
} as const;

export function Cockpit() {
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    async function load() {
      const [vesselsRes, portsRes, voyagesRes, disruptionsRes] = await Promise.all([
        fetch("/api/vessels").then((r) => r.json()),
        fetch("/api/ports").then((r) => r.json()),
        fetch("/api/voyages").then((r) => r.json()),
        fetch("/api/disruptions").then((r) => r.json())
      ]);
      setSnap({
        vessels: vesselsRes.data,
        ports: portsRes.data,
        voyages: voyagesRes.data,
        disruptions: disruptionsRes.data,
        kpis: vesselsRes.kpis
      });
    }
    void load();
  }, []);

  if (!snap) {
    return (
      <div className="rounded-2xl border border-surface-line bg-surface/60 p-10 text-center text-sm text-muted">
        Bringing ops cockpit online — telemetry warming up...
      </div>
    );
  }

  const criticalDisruptions = snap.disruptions.filter((d) => d.severity === "Critical" || d.severity === "Warning");
  const fastestVessel = [...snap.vessels].sort((a, b) => b.speedKn - a.speedKn)[0];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-2xl border border-surface-line bg-gradient-to-br from-surface/90 via-surface/60 to-canvas/80 p-6 lg:grid-cols-[1.4fr_1fr] lg:p-7">
        <div>
          <div className="flex items-center gap-2">
            <StatusPill tone="emerald" dotted>
              All AIS feeds live · mock
            </StatusPill>
            <StatusPill tone="violet">Week 21 · 2026</StatusPill>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Ocean-freight operations cockpit
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Mission-control for fleet managers: live mock vessel telemetry, port congestion,
            voyage risk scoring, and an AI routing analyst. Every screen consumes mock API
            routes — swap them for real AIS, port, weather, and geopolitics feeds when the
            backend lands.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Gauge value={snap.kpis.onTimeScore} label="On-time score" accent="#34d399" />
            <Gauge value={100 - snap.kpis.carbonIntensity} label="Carbon headroom" accent="#22d3ee" />
          </div>
        </div>
        <div className="rounded-2xl border border-surface-line bg-canvas/50 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">This watch&apos;s posture</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            <span className="font-semibold text-accent-rose">{snap.kpis.portsUnderStress}</span> ports under stress,
            <span className="mx-1 font-semibold text-accent-amber">{snap.kpis.activeDisruptions}</span> open disruptions,
            average port wait at <span className="font-semibold text-accent-cyan">{formatHours(snap.kpis.avgPortWaitHours)}</span>.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-surface-line bg-surface-raised/60 p-3">
              <p className="text-muted">Fastest mover</p>
              <p className="mt-1 font-mono tabular text-ink">{fastestVessel.name}</p>
              <p className="font-mono text-accent-cyan">{fastestVessel.speedKn} kn</p>
            </div>
            <div className="rounded-xl border border-surface-line bg-surface-raised/60 p-3">
              <p className="text-muted">Top alert</p>
              <p className="mt-1 font-mono tabular text-ink">{criticalDisruptions[0]?.location || "—"}</p>
              <p className="font-mono text-accent-rose">{criticalDisruptions[0]?.severity}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricTile
          label="Vessels in transit"
          value={`${snap.kpis.vesselsInTransit}`}
          delta={4}
          hint="Underway right now"
          icon={Ship}
          accent="cyan"
        />
        <MetricTile
          label="Ports under stress"
          value={`${snap.kpis.portsUnderStress}`}
          delta={1}
          hint="Heavy + critical"
          icon={Anchor}
          accent="rose"
        />
        <MetricTile
          label="Active disruptions"
          value={`${snap.kpis.activeDisruptions}`}
          delta={2}
          hint="Open + monitoring"
          icon={AlertTriangle}
          accent="amber"
        />
        <MetricTile
          label="On-time score"
          value={`${snap.kpis.onTimeScore}`}
          delta={-3}
          hint="Blended across active routes"
          icon={Timer}
          accent="emerald"
        />
        <MetricTile
          label="Avg port wait"
          value={formatHours(snap.kpis.avgPortWaitHours)}
          delta={6}
          hint="Hours across watched ports"
          icon={Activity}
          accent="violet"
        />
        <MetricTile
          label="Carbon intensity"
          value={`${snap.kpis.carbonIntensity}`}
          delta={-2}
          hint="Mock CII proxy"
          icon={Flame}
          accent="amber"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-surface-line bg-surface/70">
          <div className="flex items-center justify-between border-b border-surface-line px-5 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Live port map</p>
              <h2 className="text-lg font-bold text-ink">Congestion footprint</h2>
            </div>
            <StatusPill tone="cyan" dotted>
              Mock AIS feed
            </StatusPill>
          </div>
          <div className="p-3">
            <WorldMap ports={snap.ports} />
          </div>
        </div>
        <div className="rounded-2xl border border-surface-line bg-surface/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Disruption feed</p>
              <h2 className="text-lg font-bold text-ink">Open + monitoring</h2>
            </div>
            <StatusPill tone="rose" dotted>
              {snap.kpis.activeDisruptions} live
            </StatusPill>
          </div>
          <ul className="mt-4 space-y-3">
            {snap.disruptions.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-surface-line bg-canvas/50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.location}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted">{item.message}</p>
                  </div>
                  <StatusPill
                    tone={severityTone[item.severity]}
                    dotted={item.severity === "Critical"}
                    className={item.severity === "Critical" ? "pulse-critical" : ""}
                  >
                    {item.severity}
                  </StatusPill>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                  <span>{item.type} · {item.affectedVessels} vessels</span>
                  <span className="font-mono">{new Date(item.detectedIso).toUTCString().slice(5, 22)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-surface-line bg-surface/70">
          <div className="flex items-center justify-between border-b border-surface-line px-5 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Fleet pulse</p>
              <h2 className="text-lg font-bold text-ink">Underway and at port</h2>
            </div>
            <StatusPill tone="cyan">Live mock API</StatusPill>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-surface-line text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3">Vessel</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Speed</th>
                  <th>ETA</th>
                  <th className="pr-5">Pulse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-line">
                {snap.vessels.slice(0, 6).map((vessel) => (
                  <tr key={vessel.id} className="hover:bg-canvas/40">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-ink">{vessel.name}</p>
                      <p className="text-xs text-muted">{vessel.type} · {formatNumber(vessel.capacityTeu)} TEU</p>
                    </td>
                    <td className="text-xs text-muted">
                      <span className="font-mono text-ink">{vessel.originPort}</span>
                      <span className="mx-1">→</span>
                      <span className="font-mono text-ink">{vessel.destinationPort}</span>
                    </td>
                    <td>
                      <StatusPill
                        tone={
                          vessel.status === "Underway"
                            ? "cyan"
                            : vessel.status === "Delayed"
                              ? "rose"
                              : vessel.status === "Anchored"
                                ? "amber"
                                : "violet"
                        }
                        dotted={vessel.status === "Underway"}
                      >
                        {vessel.status}
                      </StatusPill>
                    </td>
                    <td className="font-mono tabular text-ink">{vessel.speedKn} kn</td>
                    <td className="font-mono text-xs text-muted">{formatEta(vessel.etaIso)}</td>
                    <td className="pr-5">
                      <Sparkbars data={vessel.speedHistory} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-surface-line bg-surface/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Port stress</p>
              <h2 className="text-lg font-bold text-ink">Top watchlist</h2>
            </div>
            <Compass className="text-muted" size={18} />
          </div>
          <ul className="mt-4 space-y-3">
            {snap.ports
              .filter((p) => p.congestion === "Critical" || p.congestion === "Heavy")
              .map((port) => (
                <li key={port.id} className="rounded-xl border border-surface-line bg-canvas/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{port.name}</p>
                      <p className="text-xs text-muted">{port.country} · {port.unlocode}</p>
                    </div>
                    <StatusPill tone={congestionTone[port.congestion]}>{port.congestion}</StatusPill>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <p className="text-muted">Wait</p>
                      <p className="font-mono tabular text-ink">{formatHours(port.avgWaitHours)}</p>
                    </div>
                    <div>
                      <p className="text-muted">At anchor</p>
                      <p className="font-mono tabular text-ink">{port.vesselsAtAnchor}</p>
                    </div>
                    <div>
                      <p className="text-muted">w/w</p>
                      <p className={port.weeklyTrend > 0 ? "font-mono text-accent-rose" : "font-mono text-accent-emerald"}>
                        {port.weeklyTrend > 0 ? "+" : ""}{port.weeklyTrend}%
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
