import { AlertTriangle, CheckCircle2, Download, ShieldAlert, Share2 } from "lucide-react";
import type { ScanResult } from "@/lib/scanner/types";
import { RiskBadge } from "./RiskBadge";

export function ResultCard({ result }: { result: ScanResult }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <RiskBadge level={result.riskLevel} />
          <h2 className="mt-3 text-2xl font-bold text-navy">{result.verdict}</h2>
          <p className="mt-2 text-slate-600">{result.userExplanation}</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-5 text-center text-white">
          <div className="text-sm text-slate-300">Risk score</div>
          <div className="text-5xl font-black">{result.riskScore}</div>
          <div className="text-xs text-slate-400">0 safe-ish · 100 critical</div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-sky-50 p-5">
        <div className="flex items-center gap-2 font-bold text-navy"><ShieldAlert size={18} /> AI security advisor</div>
        <p className="mt-2 text-slate-700">{result.aiExplanation}</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-bold text-navy">Red flags detected</h3>
          <div className="mt-3 space-y-3">
            {result.evidence.length ? result.evidence.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 text-orange-500" size={18} /><div><div className="font-semibold">{item.label} <span className="text-xs text-slate-500">+{item.weight}</span></div><p className="text-sm text-slate-600">{item.description}</p></div></div>
              </div>
            )) : <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800"><CheckCircle2 className="inline" size={18} /> No major red flags found by MVP heuristics.</div>}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-navy">Recommended action</h3>
          <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-slate-700">{result.recommendedAction}</p>
          <h3 className="mt-5 font-bold text-navy">Emergency steps</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {result.emergencySteps.map((step) => <li key={step} className="rounded-xl bg-red-50 px-3 py-2">{step}</li>)}
          </ul>
          <details className="mt-5 rounded-2xl border border-slate-200 p-4">
            <summary className="cursor-pointer font-bold">Technical details</summary>
            <p className="mt-2 text-sm text-slate-600">{result.technicalExplanation}</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(result.metadata, null, 2)}</pre>
          </details>
          <div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl border px-4 py-2 font-semibold"><Download size={16} className="inline" /> PDF report</button><button className="rounded-xl border px-4 py-2 font-semibold"><Share2 size={16} className="inline" /> Share result</button><button className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white">Report this scam</button></div>
        </div>
      </div>
    </section>
  );
}
