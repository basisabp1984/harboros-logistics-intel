import { NextResponse } from "next/server";
import { ports } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: ports });
}
