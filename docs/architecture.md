# System Architecture

## Web Application
- Next.js App Router, TypeScript, Tailwind CSS, and composable UI components.
- API routes provide scanner endpoints for `/api/scan/url`, `/api/scan/message`, `/api/scan/email`, `/api/scan/credit`, reporting, admin stats, admin reports, and domain lookup.

## Domain Services
- `lib/scanner/*`: deterministic scanning and scoring modules.
- `lib/mock/threat-intel.ts`: replaceable interface for WHOIS, Safe Browsing, VirusTotal, PhishTank, URLScan, DNS, SSL, and feeds.
- `lib/ai/*`: prompt templates, guardrails, and server-side explanation service.
- `lib/security/masking.ts`: data minimization for OTP/PIN/CVV/password/card-like values.

## Persistence Roadmap
- PostgreSQL with Prisma schema included.
- Redis for rate limiting, scan caching, and BullMQ background jobs.
- Audit logs for admin actions and B2B API usage.

## Security Architecture
- Server-side validation with Zod.
- No client-side AI API keys.
- Mask sensitive values before returning or storing.
- Future middleware: authentication, RBAC, API key hashing, request signing, abuse detection, admin MFA, audit logging, and per-plan limits.
