"use client";

import { useEffect, useState } from "react";
import { Anchor } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { WorldMap } from "@/components/ui/WorldMap";
import { Port } from "@/types";
import { formatHours } from "@/lib/utils";

const congestionTone = {
  Calm: "emerald",
  Moderate: "amber",
  Heavy: "amber",
  Critical: "rose"
} as const;

export default function PortsPage() {
  const [ports, setPorts] = useState<Port[]>([]);

  useEffect(() => {
    void fetch("/api/ports")
      .then((r) => r.json())
      .then((r) => setPorts(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Port intelligence</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Port congestion radar</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Watch ports under stress, anchorage queues, and dwell time. Mock signal. A
          production deployment would plug into port APIs (e.g. Marine Traffic, port
          authority schedules) and a weather feed.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-surface-line bg-surface/70 p-3">
          <WorldMap ports={ports} />
        </div>
        <div className="rounded-2xl border border-surface-line bg-surface/70 p-5">
          <h2 className="text-lg font-bold text-ink">Severity legend</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {(["Critical", "Heavy", "Moderate", "Calm"] as const).map((level) => (
              <li key={level} className="flex items-center justify-between rounded-xl border border-surface-line bg-canvas/40 px-3 py-2">
                <div className="flex items-center gap-3">
                  <Anchor size={14} className="text-muted" />
                  <span className="text-ink">{level}</span>
                </div>
                <StatusPill tone={congestionTone[level]}>
                  {ports.filter((p) => p.congestion === level).length} ports
                </StatusPill>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-surface-line bg-surface/70">
        <div className="border-b border-surface-line px-5 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Watchlist</p>
          <h2 className="text-lg font-bold text-ink">Port-by-port snapshot</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-surface-line text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Port</th>
                <th>Mix</th>
                <th>Congestion</th>
                <th>Anchor</th>
                <th>Berthed</th>
                <th>Wait</th>
                <th>w/w</th>
                <th className="pr-5">Notable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-line">
              {ports.map((port) => (
                <tr key={port.id} className="hover:bg-canvas/40">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-ink">{port.name}</p>
                    <p className="font-mono text-[11px] text-muted">{port.country} · {port.unlocode}</p>
                  </td>
                  <td className="text-xs text-muted">{port.cargoMix}</td>
                  <td>
                    <StatusPill tone={congestionTone[port.congestion]} dotted={port.congestion === "Critical"}>
                      {port.congestion}
                    </StatusPill>
                  </td>
                  <td className="font-mono tabular text-ink">{port.vesselsAtAnchor}</td>
                  <td className="font-mono tabular text-ink">{port.vesselsBerthed}</td>
                  <td className="font-mono tabular text-ink">{formatHours(port.avgWaitHours)}</td>
                  <td
                    className={`font-mono tabular ${
                      port.weeklyTrend > 0 ? "text-accent-rose" : "text-accent-emerald"
                    }`}
                  >
                    {port.weeklyTrend > 0 ? "+" : ""}{port.weeklyTrend}%
                  </td>
                  <td className="pr-5 text-[11px] text-muted">{port.events.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
