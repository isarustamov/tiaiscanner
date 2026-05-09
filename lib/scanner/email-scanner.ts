import { maskSensitiveData } from "@/lib/security/masking";
import { explainScan } from "@/lib/ai/advisor";
import { RISK_WEIGHTS, riskLevel, scoreEvidence, verdictFor } from "./risk";
import type { Evidence, ScanResult } from "./types";
import { scanUrl } from "./url-scanner";

export async function scanEmail(input: string): Promise<ScanResult> {
  const masked = maskSensitiveData(input.trim());
  const evidence: Evidence[] = [];
  const add = (item: Evidence) => evidence.push(item);
  const from = masked.match(/^from:\s*(.+)$/im)?.[1] ?? "";
  const replyTo = masked.match(/^reply-to:\s*(.+)$/im)?.[1] ?? "";
  if (from && replyTo && from.split("@").pop() !== replyTo.split("@").pop()) add({ id: "reply-to", label: "Reply-to mismatch", description: "The reply-to domain differs from the sender domain.", weight: RISK_WEIGHTS.senderMismatch, severity: "high", source: "heuristic" });
  if (/invoice|wire transfer|payment details|bank account changed|urgent payment/i.test(masked)) add({ id: "bec", label: "BEC or payment redirection language", description: "The email references invoices, wire transfers, changed bank details, or urgent payment actions.", weight: RISK_WEIGHTS.brandImpersonation, severity: "high", source: "heuristic" });
  if (/attachment|\.zip|\.exe|\.scr|\.js|macro/i.test(masked)) add({ id: "attachment", label: "Suspicious attachment indicator", description: "The content references potentially risky attachments or executable file types.", weight: RISK_WEIGHTS.suspiciousAttachment, severity: "high", source: "heuristic" });
  if (/otp|pin|cvv|password|verify your account|login/i.test(masked)) add({ id: "credentials", label: "Credential harvesting language", description: "The email asks for secrets or account verification through risky wording.", weight: RISK_WEIGHTS.sensitiveDataRequest, severity: "critical", source: "heuristic" });
  const url = masked.match(/https?:\/\/\S+|\b[\w.-]+\.[a-z]{2,}\S*/i)?.[0];
  if (url) {
    try {
      const urlResult = await scanUrl(url);
      evidence.push(...urlResult.evidence.map((item) => ({ ...item, id: `url-${item.id}` })));
    } catch {}
  }
  const score = scoreEvidence(evidence);
  const level = riskLevel(score);
  const partial: Omit<ScanResult, "aiExplanation"> = { id: crypto.randomUUID(), kind: "email", target: input, maskedTarget: masked, riskScore: score, riskLevel: level, verdict: verdictFor(level), userExplanation: level === "Low" ? "The email does not contain the strongest MVP phishing indicators." : "The email contains indicators commonly associated with phishing or payment fraud.", technicalExplanation: "Email MVP checks reply-to mismatch, BEC/payment redirection language, attachment indicators, credential harvesting language, and embedded URL risk. SPF/DKIM/DMARC are placeholders until raw header parsing is connected.", recommendedAction: level === "Low" ? "Verify independently before opening attachments or following payment instructions." : "Do not open attachments, click links, or change payment details until verified by a trusted channel.", evidence, emergencySteps: ["Do not open suspicious attachments.", "Verify payment changes by phone using a known number.", "If credentials were entered, change passwords and revoke sessions.", "Report to your security team or email provider."], createdAt: new Date().toISOString(), metadata: { from, replyTo, spf: "placeholder", dkim: "placeholder", dmarc: "placeholder" } };
  return { ...partial, aiExplanation: await explainScan(partial) };
}
