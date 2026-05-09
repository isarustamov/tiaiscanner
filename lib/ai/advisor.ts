import type { ScanResult } from "@/lib/scanner/types";
import { AI_SAFETY_RULES } from "./prompts";

export async function explainScan(result: Omit<ScanResult, "aiExplanation">, language = "English") {
  const topEvidence = result.evidence.slice(0, 4).map((item) => item.label.toLowerCase()).join(", ") || "no major red flags";
  const confidence = result.evidence.some((item) => item.source === "mock-threat-intel" && item.label.includes("Known"))
    ? "mock threat-intelligence and heuristic analysis"
    : "heuristic analysis only; real-time threat intelligence is not connected in this MVP";

  return [
    `AI security advisor (${language}): ${result.verdict}`,
    `The main signals are: ${topEvidence}. This assessment is based on ${confidence}.`,
    "Do not provide OTP, PIN, CVV, passwords, full card details, or bank app login data on suspicious pages or messages.",
    "If this involves your bank, close the message and contact the bank using the official app, card phone number, or verified website."
  ].join(" ");
}

export function aiGuardrailsSummary() {
  return AI_SAFETY_RULES.join(" ");
}
