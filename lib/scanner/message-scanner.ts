import { scamPhrases } from "@/lib/mock/threat-data";
import { maskSensitiveData } from "@/lib/security/masking";
import { explainScan } from "@/lib/ai/advisor";
import { RISK_WEIGHTS, riskLevel, scoreEvidence, verdictFor } from "./risk";
import type { Evidence, ScanResult } from "./types";

const urgency = /urgent|immediately|blocked|suspended|today|now|limited|final warning|тəcili|срочно|hemen/i;
const sensitive = /otp|pin|cvv|cvc|password|card number|bank app|internet banking|fin code|one[- ]time/i;
const rewards = /won|prize|bonus|refund|cashback|free|grant|subsidy/i;
const institutions = /bank|paypal|visa|mastercard|tax|police|government|courier|delivery|loan|credit/i;
const upfront = /fee|upfront|processing payment|insurance payment|commission/i;

export async function scanMessage(input: string): Promise<ScanResult> {
  const masked = maskSensitiveData(input.trim());
  const evidence: Evidence[] = [];
  const add = (item: Evidence) => evidence.push(item);

  if (sensitive.test(masked)) add({ id: "sensitive-request", label: "Requests sensitive banking data", description: "The message asks for or references OTP, PIN, CVV, passwords, card data, or bank login information.", weight: RISK_WEIGHTS.sensitiveDataRequest, severity: "critical", source: "user-input" });
  if (urgency.test(masked)) add({ id: "urgency", label: "Urgency or threat language", description: "Scammers pressure users to act before verifying.", weight: RISK_WEIGHTS.urgentLanguage, severity: "medium", source: "heuristic" });
  if (rewards.test(masked)) add({ id: "reward", label: "Reward or refund hook", description: "Unexpected prizes, bonuses, or refunds are common social-engineering hooks.", weight: RISK_WEIGHTS.suspiciousKeyword, severity: "medium", source: "heuristic" });
  if (institutions.test(masked)) add({ id: "impersonation", label: "Possible institution impersonation", description: "The message appears to reference a bank, payment provider, delivery company, or authority.", weight: RISK_WEIGHTS.brandImpersonation, severity: "high", source: "heuristic" });
  if (upfront.test(masked)) add({ id: "upfront", label: "Upfront payment request", description: "Advance fees before loan approval or payout are a major scam indicator.", weight: RISK_WEIGHTS.upfrontPayment, severity: "high", source: "heuristic" });
  if (/https?:\/\/|bit\.ly|tinyurl|t\.co|cutt\.ly/i.test(masked)) add({ id: "link", label: "Contains link or shortened link", description: "Message-based phishing often pushes users to external links.", weight: RISK_WEIGHTS.urlShortener, severity: "medium", source: "heuristic" });
  if (scamPhrases.some((phrase) => masked.toLowerCase().includes(phrase))) add({ id: "phrase", label: "Known scam phrase", description: "The message contains wording from the internal scam phrase library.", weight: RISK_WEIGHTS.suspiciousKeyword, severity: "medium", source: "mock-threat-intel" });

  const score = scoreEvidence(evidence);
  const level = riskLevel(score);
  const partial: Omit<ScanResult, "aiExplanation"> = {
    id: crypto.randomUUID(), kind: "message", target: input, maskedTarget: masked, riskScore: score, riskLevel: level,
    verdict: verdictFor(level),
    userExplanation: level === "Low" ? "The message does not contain the strongest local scam patterns." : "The message uses social-engineering signals that are common in financial scams.",
    technicalExplanation: "MVP text analysis checks sensitive-data requests, urgency, reward hooks, institution impersonation, links, and mock scam phrase matches. Future integrations can add sender reputation and telecom intelligence.",
    recommendedAction: level === "Low" ? "Do not share sensitive information. If money or banking is involved, verify independently." : "Do not click, reply with data, or call numbers in the message. Contact the official organization directly and report it.",
    evidence,
    emergencySteps: ["Do not click links in the message.", "Delete or archive the message after reporting.", "If you shared OTP/PIN/CVV/passwords, call your bank and block affected cards.", "Warn family members if the scam targets relatives or elderly users."],
    createdAt: new Date().toISOString(), metadata: { textLength: masked.length }
  };
  return { ...partial, aiExplanation: await explainScan(partial) };
}
