import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ scansToday: 1284, criticalFindings: 73, reportsPending: 18, apiRequests: 9421, falsePositiveRate: 0.032 });
}
