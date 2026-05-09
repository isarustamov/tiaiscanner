import { maskSensitiveData } from "@/lib/security/masking";
import { explainScan } from "@/lib/ai/advisor";
import { RISK_WEIGHTS, riskLevel, scoreEvidence, verdictFor } from "./risk";
import type { Evidence, ScanResult } from "./types";
import { scanUrl } from "./url-scanner";

export async function scanCreditOffer(input: string): Promise<ScanResult> {
  const masked = maskSensitiveData(input.trim());
  const evidence: Evidence[] = [];
  const add = (item: Evidence) => evidence.push(item);

  if (/instant approval|guaranteed|no credit history|bad credit accepted|100% approved/i.test(masked)) add({ id: "promise", label: "Unrealistic credit promise", description: "Guaranteed or instant loans without checks are common fake-credit hooks.", weight: RISK_WEIGHTS.fakeCreditPromise, severity: "high", source: "heuristic" });
  if (/upfront|processing fee|insurance fee|activation fee|before approval|advance payment/i.test(masked)) add({ id: "fee", label: "Upfront payment before approval", description: "Legitimate lenders normally do not demand informal advance fees to release credit.", weight: RISK_WEIGHTS.upfrontPayment, severity: "critical", source: "heuristic" });
  if (/otp|pin|cvv|card number|password|bank app/i.test(masked)) add({ id: "sensitive", label: "Requests card or login secrets", description: "Credit applications should not require OTP, PIN, CVV, or banking passwords.", weight: RISK_WEIGHTS.sensitiveDataRequest, severity: "critical", source: "user-input" });
  if (/license|regulated|central bank|official partner/i.test(masked) && !/registration number|company number|legal address/i.test(masked)) add({ id: "license", label: "Unverifiable license claim", description: "The offer claims regulation but does not provide enough verification details.", weight: RISK_WEIGHTS.suspiciousKeyword, severity: "medium", source: "heuristic" });

  if (/https?:\/\/|\w+\.\w{2,}/.test(masked)) {
    try {
      const urlResult = await scanUrl(masked.match(/https?:\/\/\S+|\b[\w.-]+\.[a-z]{2,}\S*/i)?.[0] ?? masked);
      evidence.push(...urlResult.evidence.map((item) => ({ ...item, id: `url-${item.id}` })));
    } catch {
      add({ id: "url-parse", label: "Suspicious or malformed credit URL", description: "The website address could not be safely parsed.", weight: RISK_WEIGHTS.suspiciousKeyword, severity: "medium", source: "heuristic" });
    }
  }

  const score = scoreEvidence(evidence);
  const level = riskLevel(score);
  const partial: Omit<ScanResult, "aiExplanation"> = {
    id: crypto.randomUUID(), kind: "credit", target: input, maskedTarget: masked, riskScore: score, riskLevel: level,
    verdict: verdictFor(level),
    userExplanation: level === "Low" ? "The credit offer does not match the strongest fake-loan patterns in this MVP." : "The offer contains patterns commonly found in fake credit or loan scams.",
    technicalExplanation: "Credit analysis checks unrealistic promises, upfront fees, sensitive-data requests, unverifiable licensing claims, and embedded URL risk using the shared URL scanner.",
    recommendedAction: level === "Low" ? "Verify lender registration and use only official application channels before submitting data." : "Do not pay upfront fees or provide card/login secrets. Verify the lender with the regulator and official bank contacts.",
    evidence,
    emergencySteps: ["Do not pay processing or activation fees.", "If you shared card data or OTP, block the card immediately.", "Save screenshots and report the page.", "Apply only through verified lender domains and apps."],
    createdAt: new Date().toISOString(), metadata: { module: "fake-credit-detector" }
  };
  return { ...partial, aiExplanation: await explainScan(partial) };
}
