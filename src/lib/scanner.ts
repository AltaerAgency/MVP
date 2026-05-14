import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { logger } from "./logger";
import { withRetry } from "./utils";
import { classifyRule, extractWcag, mapImpact, patternHash } from "./classify";
import type { AccessibilityIssue, RepairType, ScanResult, Severity } from "./types";

export async function scanUrl(url: string, requestId: string): Promise<ScanResult> {
  logger.info({ requestId, url }, "scan starting");
  if (!isPublicUrl(url)) throw new Error("URL must be a public address");
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ userAgent: "Mozilla/5.0 AccessFixAI/0.1 (+accessibility-scanner)" });
    const page = await context.newPage();
    await withRetry(()=>page.goto(url,{waitUntil:"networkidle",timeout:30000}),{maxAttempts:2,label:"page.goto",baseDelayMs:1000});
    const pageTitle = (await page.title())||"(untitled)";
    const axeResults = await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"]).analyze();
    const issues: AccessibilityIssue[] = [];
    for (const v of axeResults.violations) {
      const {repairType,confidence} = classifyRule(v.id);
      const severity = mapImpact(v.impact);
      const wcag = extractWcag(v.tags);
      for (const node of v.nodes) {
        issues.push({ ruleId:v.id, title:v.help, description:v.description, wcag, severity, repairType, confidence, selectors:node.target.map(String), htmlSnippet:node.html.slice(0,500), helpUrl:v.helpUrl });
      }
    }
    const summary = buildSummary(issues);
    logger.info({requestId,url,total:summary.total},"scan complete");
    return {url,scannedAt:new Date().toISOString(),pageTitle,issues,summary};
  } finally { await browser.close(); }
}
function buildSummary(issues: AccessibilityIssue[]): ScanResult["summary"] {
  const bySeverity: Record<Severity,number>={critical:0,high:0,medium:0,low:0};
  const byRepairType: Record<RepairType,number>={"auto-fix":0,"ai-suggested":0,"code-patch":0,"human-review":0};
  for (const i of issues){bySeverity[i.severity]++;byRepairType[i.repairType]++;}
  return {total:issues.length,bySeverity,byRepairType};
}
function isPublicUrl(url: string): boolean {
  try {
    const {protocol,hostname:h}=new URL(url);
    if(protocol!=="http:"&&protocol!=="https:")return false;
    if(["localhost","0.0.0.0","169.254.169.254"].includes(h))return false;
    if(h.endsWith(".local")||h.endsWith(".internal"))return false;
    if(/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^127\./.test(h))return false;
    return true;
  } catch{return false;}
}
export {patternHash};
