import { NextResponse } from "next/server";
import { z } from "zod";
import { rememberScan } from "@/lib/scanner/history";
import { scanEmail } from "@/lib/scanner/email-scanner";

const schema = z.object({ input: z.string().trim().min(10).max(25000) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Email content or headers are required." }, { status: 400 });
  const result = rememberScan(await scanEmail(parsed.data.input));
  return NextResponse.json(result);
}
