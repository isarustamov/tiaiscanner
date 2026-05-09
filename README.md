# TrustIntelAI Scanner

Premium AI-powered fintech security scanner foundation for phishing URLs, SMS/message scams, fake credit websites, reporting, B2B APIs, admin workflows, and threat intelligence expansion.

## Implemented MVP
- Next.js + TypeScript + Tailwind CSS premium responsive UI.
- Home page, URL scanner, message scanner, fake credit checker, card safety guide, pricing, blog, dashboard, and admin pages.
- Scanner APIs with Zod validation.
- Transparent risk scoring engine and evidence model.
- Mock threat intelligence interfaces for later WHOIS, Safe Browsing, VirusTotal, PhishTank, URLScan, DNS, SSL, and feeds.
- AI advisor prompt/guardrail layer with heuristic-only disclosure.
- Prisma PostgreSQL schema for core SaaS models.

## Development
```bash
npm install
npm run typecheck
npm test
npm run build
```

## Security Notes
This MVP does not claim real-time verified safety. It uses deterministic heuristics and mock threat intelligence until production feeds are connected. Do not submit OTP, PIN, CVV, passwords, full card details, or other sensitive banking secrets.
