import test from "node:test";
import assert from "node:assert/strict";

function riskLevel(score) {
  if (score <= 25) return "Low";
  if (score <= 50) return "Medium";
  if (score <= 75) return "High";
  return "Critical";
}
function scoreEvidence(evidence) { return Math.min(100, evidence.reduce((total, item) => total + item.weight, 0)); }

test("risk levels follow transparent thresholds", () => {
  assert.equal(riskLevel(0), "Low");
  assert.equal(riskLevel(25), "Low");
  assert.equal(riskLevel(26), "Medium");
  assert.equal(riskLevel(51), "High");
  assert.equal(riskLevel(76), "Critical");
});

test("evidence scores are capped at 100", () => {
  assert.equal(scoreEvidence([{ weight: 70 }, { weight: 70 }]), 100);
});
