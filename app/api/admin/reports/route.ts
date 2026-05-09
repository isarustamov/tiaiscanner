import { NextResponse } from "next/server";

const mockReports = [
  { id: "rep_001", type: "url", value: "secure-kapital-login.example", status: "Confirmed scam", severity: "Critical", createdAt: "2026-05-09T08:30:00.000Z" },
  { id: "rep_002", type: "message", value: "Your card is blocked. Send OTP...", status: "Under investigation", severity: "High", createdAt: "2026-05-09T09:10:00.000Z" }
];

export async function GET() {
  return NextResponse.json({ reports: mockReports });
}
