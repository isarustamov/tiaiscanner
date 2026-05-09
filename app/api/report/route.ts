import { NextResponse } from "next/server";
import { z } from "zod";
import { maskSensitiveData } from "@/lib/security/masking";

const reports: Array<Record<string, unknown>> = [];
const schema = z.object({ type: z.enum(["url", "message", "email", "credit", "profile", "phone"]), value: z.string().min(3).max(10000), notes: z.string().max(2000).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid report payload." }, { status: 400 });
  const report = { id: crypto.randomUUID(), status: "Under investigation", createdAt: new Date().toISOString(), ...parsed.data, value: maskSensitiveData(parsed.data.value), notes: parsed.data.notes ? maskSensitiveData(parsed.data.notes) : undefined };
  reports.unshift(report);
  return NextResponse.json(report, { status: 201 });
}

export function getReports() { return reports; }
