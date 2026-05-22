import { NextResponse } from "next/server";
import { Voyage } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    from?: string;
    to?: string;
    vessel?: string;
  };

  const planned: Voyage = {
    id: `vy-${Date.now()}`,
    routeCode: `${(body.from || "ANY").slice(0, 2).toUpperCase()}-${(body.to || "ANY").slice(0, 2).toUpperCase()}-NEW`,
    from: body.from || "Singapore",
    to: body.to || "Rotterdam",
    vessel: body.vessel || "Aurora Crest",
    departureIso: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    arrivalIso: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
    distanceNm: 8420,
    status: "Planned",
    fuelTons: 2310,
    onTimeScore: 81,
    riskScore: 27
  };

  return NextResponse.json({ data: planned });
}
