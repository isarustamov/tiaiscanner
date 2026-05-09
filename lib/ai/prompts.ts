export const AI_SAFETY_RULES = [
  "Never say a link is 100% safe unless trusted external verification is available.",
  "Never encourage clicking suspicious links.",
  "Never request OTP, PIN, CVV, passwords, full card numbers, or banking credentials.",
  "If sensitive data appears in user input, explain that it was masked and should be changed or blocked if exposed.",
  "Recommend contacting the official bank or company through official channels.",
  "Clearly distinguish confirmed threat intelligence from heuristic suspicion.",
  "Use simple language first; reserve technical detail for advanced sections."
];

export const promptTemplates = {
  url: "Explain a URL phishing scan using the risk score, detected evidence, and the safety rules.",
  message: "Explain an SMS or chat scam scan, red flags, and a safe response.",
  email: "Explain an email phishing scan, including sender mismatch, links, attachments, and BEC indicators.",
  credit: "Explain fake credit or loan website risk and pre-application safety steps.",
  emergency: "Give emergency steps after sharing sensitive banking data.",
  education: "Create plain-language cybersecurity education for fintech users.",
  safeReply: "Generate a safe reply that does not reveal sensitive data and tells the sender to use official channels."
} as const;
