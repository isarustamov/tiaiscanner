"use client";

import { useState } from "react";
import type { ScanKind, ScanResult } from "@/lib/scanner/types";
import { Button } from "./Button";
import { ResultCard } from "./ResultCard";

const endpoint: Record<ScanKind, string> = { url: "/api/scan/url", message: "/api/scan/message", email: "/api/scan/email", credit: "/api/scan/credit" };

export function ScannerForm({ kind, placeholder, label }: { kind: ScanKind; placeholder: string; label: string }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true); setError(""); setResult(null);
    const response = await fetch(endpoint[kind], { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ input }) });
    const body = await response.json();
    setLoading(false);
    if (!response.ok) setError(body.error ?? "Scan failed."); else setResult(body);
  }

  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"><label className="text-sm font-bold text-navy">{label}</label><textarea value={input} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)} placeholder={placeholder} className="mt-3 min-h-36 w-full resize-y rounded-2xl border border-slate-200 p-4 outline-none focus:border-cyber" /><div className="mt-4 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Sensitive data is masked. Do not submit OTP, PIN, CVV, passwords, or full card details.</p><Button onClick={submit} disabled={loading || input.trim().length < 3}>{loading ? "Analyzing..." : "Scan now"}</Button></div>{error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}</div>{result && <ResultCard result={result} />}</div>;
}
