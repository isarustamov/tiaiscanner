import { knownScamDomains, officialBrandDomains, urlShorteners } from "./threat-data";
import type { UrlThreatIntel } from "@/lib/scanner/types";

export function normalizeDomain(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[a.length][b.length];
}

export function findBrandSimilarity(domain: string) {
  const normalized = normalizeDomain(domain);
  for (const brand of officialBrandDomains) {
    for (const official of brand.domains) {
      const officialRoot = official.split(".")[0];
      const candidateRoot = normalized.split(".")[0].replace(/[-_]/g, "");
      const distance = levenshtein(candidateRoot, officialRoot.replace(/[-_]/g, ""));
      if (normalized === official) return { brand: brand.brand, official, type: "official" as const, distance };
      if (candidateRoot.includes(officialRoot) || distance <= 2) {
        return { brand: brand.brand, official, type: "lookalike" as const, distance };
      }
    }
  }
  return null;
}

export async function getMockUrlThreatIntel(rawUrl: string): Promise<UrlThreatIntel> {
  const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  const domain = normalizeDomain(parsed.hostname);
  const brandMatch = findBrandSimilarity(domain);
  const suspiciousNew = /secure|verify|login|support|bonus|credit|loan|bank/i.test(domain) && !brandMatch?.type.includes("official");

  return {
    domain,
    isKnownThreat: knownScamDomains.includes(domain),
    isOfficialBrandDomain: brandMatch?.type === "official",
    matchedBrand: brandMatch?.brand,
    isNewlyRegistered: suspiciousNew,
    domainAgeDays: suspiciousNew ? 8 : 1200,
    hasValidHttps: parsed.protocol === "https:" && !domain.includes("invalid") && !domain.includes("http-only"),
    redirectCount: urlShorteners.includes(domain) ? 2 : 0,
    pageSignals: /login|pay|checkout|card|credit|loan/i.test(parsed.href) ? ["financial-form-language"] : []
  };
}
