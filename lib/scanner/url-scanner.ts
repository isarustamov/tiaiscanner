import { getMockUrlThreatIntel, findBrandSimilarity, normalizeDomain } from "@/lib/mock/threat-intel";
import { riskyTlds, scamPhrases, urlShorteners } from "@/lib/mock/threat-data";
import { maskSensitiveData } from "@/lib/security/masking";
import { explainScan } from "@/lib/ai/advisor";
import { RISK_WEIGHTS, riskLevel, scoreEvidence, verdictFor } from "./risk";
import type { Evidence, ScanResult } from "./types";

export async function scanUrl(input: string): Promise<ScanResult> {
  const maskedInput = maskSensitiveData(input.trim());
  const parsed = new URL(maskedInput.startsWith("http") ? maskedInput : `https://${maskedInput}`);
  const domain = normalizeDomain(parsed.hostname);
  const intel = await getMockUrlThreatIntel(parsed.href);
  const evidence: Evidence[] = [];
  const add = (item: Evidence) => evidence.push(item);

  if (intel.isKnownThreat) add({ id: "known-threat", label: "Known suspicious domain", description: "The domain appears in the internal mock threat database.", weight: RISK_WEIGHTS.knownThreat, severity: "critical", source: "mock-threat-intel" });
  if (intel.isNewlyRegistered) add({ id: "new-domain", label: "Newly registered or low-history domain", description: `Mock WHOIS estimates domain age at ${intel.domainAgeDays} days.`, weight: RISK_WEIGHTS.newlyRegisteredDomain, severity: "high", source: "mock-threat-intel" });
  if (!intel.hasValidHttps) add({ id: "https", label: "No valid HTTPS signal", description: "Financial forms should use valid HTTPS; this input does not show a trusted HTTPS signal.", weight: RISK_WEIGHTS.noHttps, severity: "high", source: "heuristic" });
  const brandMatch = findBrandSimilarity(domain);
  if (brandMatch?.type === "lookalike") add({ id: "lookalike", label: `Lookalike ${brandMatch.brand} domain`, description: `Domain resembles official ${brandMatch.official} but is not the same host.`, weight: RISK_WEIGHTS.lookalikeBankDomain, severity: "critical", source: "heuristic" });
  if (urlShorteners.includes(domain)) add({ id: "shortener", label: "URL shortener detected", description: "Short links hide the final destination and are common in scams.", weight: RISK_WEIGHTS.urlShortener, severity: "medium", source: "heuristic" });
  const tld = domain.split(".").pop() ?? "";
  if (riskyTlds.includes(tld)) add({ id: "risky-tld", label: "Risky top-level domain", description: `.${tld} is often abused in scam campaigns and needs extra verification.`, weight: RISK_WEIGHTS.riskyTld, severity: "medium", source: "heuristic" });
  if (parsed.search && /(otp|pin|cvv|card|password|token|session|redirect|next)=/i.test(parsed.search)) add({ id: "query", label: "Suspicious query parameters", description: "The URL contains financial or credential-related parameters.", weight: RISK_WEIGHTS.suspiciousQuery, severity: "high", source: "heuristic" });
  if (intel.redirectCount > 1) add({ id: "redirects", label: "Redirect chain risk", description: `Mock analysis found ${intel.redirectCount} redirects.`, weight: RISK_WEIGHTS.excessiveRedirects, severity: "medium", source: "mock-threat-intel" });
  if (scamPhrases.some((phrase) => parsed.href.toLowerCase().includes(phrase.replaceAll(" ", "-")))) add({ id: "keyword", label: "Suspicious keyword", description: "The URL contains scam-associated wording.", weight: RISK_WEIGHTS.suspiciousKeyword, severity: "medium", source: "heuristic" });

  const score = scoreEvidence(evidence);
  const level = riskLevel(score);
  const partial: Omit<ScanResult, "aiExplanation"> = {
    id: crypto.randomUUID(),
    kind: "url",
    target: parsed.href,
    maskedTarget: maskedInput,
    riskScore: score,
    riskLevel: level,
    verdict: verdictFor(level),
    userExplanation: level === "Low" ? "The URL did not match the strongest scam patterns in the local MVP checks." : "The URL has warning signs often seen in phishing or financial fraud.",
    technicalExplanation: "MVP analysis combines URL parsing, brand similarity, TLD heuristics, HTTPS checks, shortener detection, suspicious parameters, and mock threat intelligence placeholders for future Safe Browsing, VirusTotal, WHOIS, URLScan, DNS, and SSL integrations.",
    recommendedAction: level === "Low" ? "Only continue if you reached this site from an official source. Never share OTP, PIN, CVV, or passwords." : "Do not open the link or enter data. Contact the organization through verified official channels and report the URL.",
    evidence,
    emergencySteps: ["Close the page.", "If credentials were entered, change passwords from the official site.", "If card or OTP data was shared, block the card and call the bank immediately.", "Report the scam to your bank or security team."],
    createdAt: new Date().toISOString(),
    metadata: { domain, intel }
  };
  return { ...partial, aiExplanation: await explainScan(partial) };
}
