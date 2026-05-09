const sensitivePatterns: Array<[RegExp, string]> = [
  [/\b(?:\d[ -]*?){13,19}\b/g, "[MASKED_CARD]"],
  [/\b\d{3,4}\b(?=\s*(?:cvv|cvc|security code))/gi, "[MASKED_CVV]"],
  [/(otp|one[- ]time password|pin|password)\s*[:=-]?\s*\S+/gi, "$1: [MASKED_SECRET]"],
  [/\b\d{6}\b/g, "[MASKED_6_DIGIT_CODE]"]
];

export function maskSensitiveData(input: string): string {
  return sensitivePatterns.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), input);
}
