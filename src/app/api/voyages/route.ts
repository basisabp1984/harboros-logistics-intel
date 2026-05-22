import { NextResponse } from "next/server";
import { voyages } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: voyages });
}
