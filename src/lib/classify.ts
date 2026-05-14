import type { Severity, RepairType, RepairConfidence } from "./types";
export function mapImpact(impact: string|null|undefined): Severity {
  const m: Record<string,Severity> = { critical:"critical", serious:"high", moderate:"medium", minor:"low" };
  return (impact && m[impact]) ? m[impact] : "medium";
}
const ruleMap: Record<string,{repairType:RepairType;confidence:RepairConfidence}> = {
  "html-has-lang":{repairType:"auto-fix",confidence:"high"},"html-lang-valid":{repairType:"auto-fix",confidence:"high"},
  "document-title":{repairType:"auto-fix",confidence:"high"},"meta-viewport":{repairType:"auto-fix",confidence:"high"},
  "image-alt":{repairType:"ai-suggested",confidence:"medium"},"link-name":{repairType:"ai-suggested",confidence:"medium"},
  "button-name":{repairType:"ai-suggested",confidence:"medium"},"heading-order":{repairType:"ai-suggested",confidence:"medium"},
  "label":{repairType:"code-patch",confidence:"medium"},"aria-required-attr":{repairType:"code-patch",confidence:"high"},
  "aria-valid-attr":{repairType:"code-patch",confidence:"high"},"color-contrast":{repairType:"human-review",confidence:"low"},
  "bypass":{repairType:"human-review",confidence:"low"},
};
export function classifyRule(ruleId: string) { return ruleMap[ruleId]??{repairType:"human-review" as RepairType,confidence:"low" as RepairConfidence}; }
export function extractWcag(tags: string[]): string[] { return tags.flatMap(t=>{const m=t.match(/^wcag(\d)(\d)(\d+)$/);return m?[`${m[1]}.${m[2]}.${m[3]}`]:[];}); }
export function patternHash(ruleId: string, html: string): string { return `${ruleId}::${html.replace(/=["'][^"']*["']/g,"=").replace(/>[^<]*</g,"><").replace(/\s+/g," ").trim().slice(0,200)}`; }
export function computeScore(s:{critical:number;high:number;medium:number;low:number}): number { return Math.max(0,Math.round(100-s.critical*10-s.high*5-s.medium*2-s.low*.5)); }
