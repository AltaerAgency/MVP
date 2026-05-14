export type Severity = "critical"|"high"|"medium"|"low";
export type RepairType = "auto-fix"|"ai-suggested"|"code-patch"|"human-review";
export type RepairConfidence = "high"|"medium"|"low";
export interface AccessibilityIssue {
  ruleId: string; title: string; description: string; wcag: string[];
  severity: Severity; repairType: RepairType; confidence: RepairConfidence;
  selectors: string[]; htmlSnippet: string; helpUrl: string;
}
export interface ScanResult {
  url: string; scannedAt: string; pageTitle: string;
  issues: AccessibilityIssue[];
  summary: { total: number; bySeverity: Record<Severity,number>; byRepairType: Record<RepairType,number>; };
}
export interface FixSuggestion { ruleId: string; selector: string; explanation: string; suggestedValue?: string; codePatch?: string; }
