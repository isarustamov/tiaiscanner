import { NextResponse } from "next/server";
import { z } from "zod";
import { rememberScan } from "@/lib/scanner/history";
import { scanCreditOffer } from "@/lib/scanner/credit-scanner";

const schema = z.object({ input: z.string().trim().min(5).max(10000) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Credit offer text or URL is required." }, { status: 400 });
  const result = rememberScan(await scanCreditOffer(parsed.data.input));
  return NextResponse.json(result);
}
