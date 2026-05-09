import type { ScanResult } from "./types";

export const inMemoryScanHistory: ScanResult[] = [];
export function rememberScan(result: ScanResult) {
  inMemoryScanHistory.unshift(result);
  inMemoryScanHistory.splice(25);
  return result;
}
