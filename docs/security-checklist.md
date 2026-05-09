# Security Checklist

- Validate all request bodies with schemas.
- Mask OTP, PIN, CVV, passwords, six-digit codes, and card-like values.
- Never store full card data or banking credentials.
- Keep AI calls server-side only.
- State when results are heuristic-only.
- Add Redis rate limiting before production.
- Hash API keys and session secrets.
- Use RBAC and MFA for admin routes.
- Add audit logs for admin and API-client actions.
- Add privacy notice, retention controls, and GDPR-friendly deletion/export workflows.
- Integrate trusted threat intelligence before claiming verified safety.
