import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustIntel AI Scanner",
  description: "AI-powered fintech phishing, scam, and fake-credit scanner."
};

const nav = [["URL Scanner", "/url-scanner"], ["Message Scanner", "/message-scanner"], ["Credit Checker", "/credit-checker"], ["Card Safety", "/card-safety"], ["Pricing", "/pricing"], ["Admin", "/admin"]];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><a href="/" className="text-xl font-black text-navy">TrustIntel<span className="text-cyber">AI</span></a><nav className="hidden gap-5 text-sm font-semibold text-slate-600 lg:flex">{nav.map(([label, href]) => <a key={href} href={href} className="hover:text-cyber">{label}</a>)}</nav><a href="/login" className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white">Login</a></div></header>{children}<footer className="border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4"><div><div className="font-black text-navy">TrustIntelAI</div><p className="mt-2 text-sm text-slate-600">Heuristic-first fintech fraud scanning with AI explanations and clean upgrade paths for enterprise threat intelligence.</p></div>{["Product", "Security", "Business"].map((title) => <div key={title}><h3 className="font-bold">{title}</h3><ul className="mt-2 space-y-1 text-sm text-slate-600"><li>Scanner API</li><li>Threat database</li><li>Privacy by design</li></ul></div>)}</div></footer></body></html>;
}
