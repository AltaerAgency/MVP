import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";
import { withRetry } from "./utils";
import type { AccessibilityIssue, FixSuggestion } from "./types";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY??"missing" });
const MODEL = process.env.ANTHROPIC_MODEL??"claude-haiku-4-5";
const SYSTEM = `You are an expert accessibility remediation assistant. For each issue produce a JSON response with: explanation (2 sentences, plain language for non-technical users), suggestedValue (alt text, link text, etc. when applicable), codePatch (HTML fix when structural). Never claim legal compliance. Output ONLY valid JSON, no markdown.`;
export async function suggestFix(issue: AccessibilityIssue, ctx: {url?:string;pageTitle?:string}, requestId: string): Promise<FixSuggestion> {
  logger.info({requestId,ruleId:issue.ruleId,model:MODEL},"claude suggestion");
  const message = await withRetry(()=>anthropic.messages.create({
    model:MODEL, max_tokens:600, system:SYSTEM,
    messages:[{role:"user",content:`Page: ${ctx.url??"unknown"}\nTitle: ${ctx.pageTitle??"unknown"}\nIssue: ${issue.title} (${issue.ruleId})\nWCAG: ${issue.wcag.join(", ")||"n/a"}\nSeverity: ${issue.severity}\nDescription: ${issue.description}\nHTML: ${issue.htmlSnippet}\nSelector: ${issue.selectors[0]??"(none)"}\n\nRespond ONLY with: {"explanation":"...","suggestedValue":"...","codePatch":"..."}`}],
  }),{maxAttempts:3,label:"anthropic",baseDelayMs:800});
  const tb = message.content.find(b=>b.type==="text");
  if(!tb||tb.type!=="text") throw new Error("No text from Claude");
  let parsed: {explanation?:string;suggestedValue?:string;codePatch?:string};
  try { parsed=JSON.parse(tb.text.replace(/```json\s*|\s*```/g,"").trim()); }
  catch { logger.error({requestId,ruleId:issue.ruleId},"bad JSON from Claude"); throw new Error("Claude returned malformed JSON"); }
  return { ruleId:issue.ruleId, selector:issue.selectors[0]??"", explanation:parsed.explanation??"No explanation.", suggestedValue:parsed.suggestedValue, codePatch:parsed.codePatch };
}
