import { NextResponse } from "next/server";
import { kpis, vessels } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: vessels, kpis });
}
