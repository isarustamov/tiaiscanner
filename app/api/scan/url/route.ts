import { NextResponse } from "next/server";
import { z } from "zod";
import { rememberScan } from "@/lib/scanner/history";
import { scanUrl } from "@/lib/scanner/url-scanner";

const schema = z.object({ input: z.string().trim().min(3).max(4096) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Valid URL input is required." }, { status: 400 });
  try {
    const result = rememberScan(await scanUrl(parsed.data.input));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "The URL could not be parsed safely." }, { status: 400 });
  }
}
