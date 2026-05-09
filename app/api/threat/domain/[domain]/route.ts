import { NextResponse } from "next/server";
import { getMockUrlThreatIntel } from "@/lib/mock/threat-intel";

export async function GET(_request: Request, { params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const intel = await getMockUrlThreatIntel(`https://${domain}`);
  return NextResponse.json(intel);
}
