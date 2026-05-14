import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { suggestFix } from "@/lib/claude";
import { logger } from "@/lib/logger";
import { newRequestId } from "@/lib/utils";
import { authErrorResponse, requirePermission } from "@/lib/tenant";
import { audit } from "@/lib/audit";
import type { AccessibilityIssue } from "@/lib/types";
export const runtime = "nodejs";
export const maxDuration = 30;
const Body = z.object({ issueId: z.string().min(1).max(100) });
export async function POST(req: Request) {
  const requestId = newRequestId();
  try {
    const ctx = await requirePermission("issue:view");
    const body = Body.safeParse(await req.json().catch(()=>({})));
    if (!body.success) return NextResponse.json({error:"Body must be {issueId}",requestId},{status:400});
    const issue = await prisma.issue.findFirst({ where:{id:body.data.issueId,organizationId:ctx.organizationId}, include:{scan:{include:{site:true}}} });
    if (!issue) return NextResponse.json({error:"Issue not found",requestId},{status:404});
    const issueForClaude: AccessibilityIssue = { ruleId:issue.ruleId,title:issue.title,description:issue.description,wcag:issue.wcag,severity:issue.severity as AccessibilityIssue["severity"],repairType:issue.repairType as AccessibilityIssue["repairType"],confidence:issue.confidence as AccessibilityIssue["confidence"],selectors:issue.selectors,htmlSnippet:issue.htmlSnippet,helpUrl:issue.helpUrl };
    const fix = await suggestFix(issueForClaude,{url:issue.scan.site?.baseUrl??issue.scan.url??undefined},requestId);
    await prisma.fix.upsert({ where:{issueId:issue.id}, create:{issueId:issue.id,organizationId:ctx.organizationId,explanation:fix.explanation,suggestedValue:fix.suggestedValue,codePatch:fix.codePatch,generatedByModel:MODEL}, update:{explanation:fix.explanation,suggestedValue:fix.suggestedValue,codePatch:fix.codePatch,status:"pending",generatedByModel:MODEL} });
    await audit({organizationId:ctx.organizationId,userId:ctx.userId,action:"fix.generated",resourceType:"fix",resourceId:issue.id,requestId});
    return NextResponse.json({fix,requestId},{headers:{"X-Request-Id":requestId}});
  } catch(e) { logger.error({requestId,error:String(e)},"suggest-fix failed"); return authErrorResponse(e,requestId); }
}
const MODEL = process.env.ANTHROPIC_MODEL??"claude-haiku-4-5";
