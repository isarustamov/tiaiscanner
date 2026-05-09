import type { Evidence, RiskLevel } from "./types";

export const RISK_WEIGHTS = {
  newlyRegisteredDomain: 20,
  noHttps: 15,
  lookalikeBankDomain: 30,
  sensitiveDataRequest: 35,
  urlShortener: 10,
  urgentLanguage: 10,
  upfrontPayment: 25,
  fakeCreditPromise: 25,
  suspiciousKeyword: 10,
  suspiciousAttachment: 25,
  senderMismatch: 20,
  brandImpersonation: 30,
  knownThreat: 45,
  riskyTld: 10,
  excessiveRedirects: 10,
  suspiciousQuery: 10
} as const;

export function scoreEvidence(evidence: Evidence[]) {
  return Math.min(100, evidence.reduce((total, item) => total + item.weight, 0));
}

export function riskLevel(score: number): RiskLevel {
  if (score <= 25) return "Low";
  if (score <= 50) return "Medium";
  if (score <= 75) return "High";
  return "Critical";
}

export function verdictFor(level: RiskLevel) {
  switch (level) {
    case "Low": return "No major scam indicators were found, but remain cautious.";
    case "Medium": return "Several warning signs were detected. Verify through official channels before acting.";
    case "High": return "This looks risky. Do not click links or share financial information.";
    case "Critical": return "This strongly resembles a financial scam or phishing attempt.";
  }
}
