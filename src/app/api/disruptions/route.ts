import { NextResponse } from "next/server";
import { disruptions } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: disruptions });
}
