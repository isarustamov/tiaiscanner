import type { RiskLevel } from "@/lib/scanner/types";

const classes: Record<RiskLevel, string> = {
  Low: "bg-green-50 text-risk-low ring-green-200",
  Medium: "bg-yellow-50 text-risk-medium ring-yellow-200",
  High: "bg-orange-50 text-risk-high ring-orange-200",
  Critical: "bg-red-50 text-risk-critical ring-red-200"
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ring-1 ${classes[level]}`}>{level} Risk</span>;
}
