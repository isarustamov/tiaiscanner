export type ScanKind = "url" | "message" | "email" | "credit";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type Evidence = {
  id: string;
  label: string;
  description: string;
  weight: number;
  severity: "info" | "low" | "medium" | "high" | "critical";
  source: "heuristic" | "mock-threat-intel" | "user-input" | "ai";
};

export type ScanResult = {
  id: string;
  kind: ScanKind;
  target: string;
  maskedTarget: string;
  riskScore: number;
  riskLevel: RiskLevel;
  verdict: string;
  userExplanation: string;
  technicalExplanation: string;
  recommendedAction: string;
  evidence: Evidence[];
  emergencySteps: string[];
  aiExplanation: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type UrlThreatIntel = {
  domain: string;
  isKnownThreat: boolean;
  isOfficialBrandDomain: boolean;
  matchedBrand?: string;
  isNewlyRegistered: boolean;
  domainAgeDays?: number;
  hasValidHttps: boolean;
  redirectCount: number;
  pageSignals: string[];
};
