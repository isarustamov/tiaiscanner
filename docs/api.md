# API Endpoint List

## MVP
- `POST /api/scan/url` — body `{ "input": "https://..." }`.
- `POST /api/scan/message` — body `{ "input": "message text" }`.
- `POST /api/scan/credit` — body `{ "input": "credit offer or URL" }`.
- `POST /api/scan/email` — body `{ "input": "email content or headers" }`.
- `POST /api/report` — report suspicious URL, message, email, credit page, profile, or phone.
- `GET /api/threat/domain/:domain` — mock domain threat lookup.
- `GET /api/admin/reports` — mock admin report feed.
- `GET /api/admin/stats` — mock admin KPI feed.

## Planned
- `GET /api/admin/threat-indicators`.
- `POST /api/admin/official-domains`.
- `POST /api/admin/scam-phrases`.
- `GET /api/client/usage`.
