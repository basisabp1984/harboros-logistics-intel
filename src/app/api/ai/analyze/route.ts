import { NextResponse } from "next/server";
import { disruptions, ports, vessels, voyages } from "@/lib/mock-data";

const fallback =
  "Across the current snapshot, Long Beach is the dominant bottleneck and the Bab-el-Mandeb advisory is the costliest tail risk. Reroute headroom is in the AS-EU lane.";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { question?: string };
  const q = (body.question || "").toLowerCase();

  let answer = fallback;

  if (q.includes("delay") || q.includes("late") || q.includes("on time") || q.includes("on-time")) {
    const worst = [...voyages].sort((a, b) => a.onTimeScore - b.onTimeScore)[0];
    answer = `Lowest on-time score is route ${worst.routeCode} (${worst.from} → ${worst.to}) on ${worst.vessel}: ${worst.onTimeScore}/100 with risk ${worst.riskScore}. Suggest pre-positioning a slot at the discharge port and notifying the consignee.`;
  }

  if (q.includes("congest") || q.includes("port")) {
    const critical = ports.filter((p) => p.congestion === "Critical" || p.congestion === "Heavy");
    const named = critical.map((p) => `${p.name} (${p.avgWaitHours}h wait, ${p.vesselsAtAnchor} at anchor)`).join("; ");
    answer = `Ports under stress right now: ${named}. Long Beach is the most expensive to enter this week — pre-clear customs and stage trucking before berth assignment.`;
  }

  if (q.includes("disruption") || q.includes("risk") || q.includes("alert")) {
    const open = disruptions.filter((d) => d.status === "Open").length;
    const critical = disruptions.filter((d) => d.severity === "Critical").length;
    answer = `There are ${open} open disruptions, ${critical} of them critical. The dominant signal is congestion at Long Beach and a weather window narrowing at Port Hedland. Two routes worth flagging to commercial: ME-EU-18 (Equinox Voyager) and AS-EU-12 (Aurora Crest).`;
  }

  if (q.includes("fuel") || q.includes("carbon") || q.includes("emission")) {
    const worst = [...vessels].sort((a, b) => b.carbonIndex - a.carbonIndex)[0];
    answer = `Highest carbon intensity index is on ${worst.name} (${worst.carbonIndex}/100, ${worst.cargo}). Slow steaming over the next 600 NM saves an estimated 7-9% fuel without breaching the contracted arrival window.`;
  }

  if (q.includes("brief") || q.includes("summary") || q.includes("report")) {
    answer =
      "Weekly ocean-freight brief: Asia → US West Coast is the binding bottleneck (Long Beach, 62h wait). Asia → EU is healthy; expect on-time scores to hold ~85. Australian iron-ore lane is at cyclone risk through Friday. Two policy moves: slow-steam Equinox Voyager to recover fuel margin; pre-clear Aurora Crest customs at Rotterdam.";
  }

  return NextResponse.json({
    data: {
      answer,
      citations: ["Mock AIS positions", "Mock port congestion model", "Mock weather + geopolitics feed"]
    }
  });
}
