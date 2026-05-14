import { NextResponse } from "next/server";
import { z } from "zod";
import { scanUrl, patternHash } from "@/lib/scanner";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { newRequestId } from "@/lib/utils";
import { authErrorResponse, requirePermission } from "@/lib/tenant";
import { audit } from "@/lib/audit";
import { computeScore } from "@/lib/classify";
export const runtime = "nodejs";
export const maxDuration = 60;
const Body = z.object({ url: z.string().url().max(2000), siteId: z.string().optional() });
export async function POST(req: Request) {
  const requestId = newRequestId();
  try {
    const ctx = await requirePermission("scan:create");
    const body = Body.safeParse(await req.json().catch(()=>({})));
    if (!body.success) return NextResponse.json({error:"Body must be {url}",requestId},{status:400});
    const {url,siteId} = body.data;
    const scan = await prisma.scan.create({ data:{organizationId:ctx.organizationId,siteId,url,scanType:"page",status:"running",startedAt:new Date(),triggeredByUserId:ctx.userId,triggerSource:"manual"} });
    await audit({organizationId:ctx.organizationId,userId:ctx.userId,action:"scan.started",resourceType:"scan",resourceId:scan.id,metadata:{url},requestId});
    try {
      const result = await scanUrl(url, requestId);
      const score = computeScore(result.summary.bySeverity);
      await prisma.$transaction([
        prisma.scan.update({where:{id:scan.id},data:{status:"complete",finishedAt:new Date(),pagesScanned:1,totalIssues:result.summary.total,criticalCount:result.summary.bySeverity.critical,highCount:result.summary.bySeverity.high,mediumCount:result.summary.bySeverity.medium,lowCount:result.summary.bySeverity.low,autoFixCount:result.summary.byRepairType["auto-fix"],aiSuggestedCount:result.summary.byRepairType["ai-suggested"],codePatchCount:result.summary.byRepairType["code-patch"],humanReviewCount:result.summary.byRepairType["human-review"],score}}),
        ...result.issues.map(i=>prisma.issue.create({data:{scanId:scan.id,organizationId:ctx.organizationId,ruleId:i.ruleId,title:i.title,description:i.description,wcag:i.wcag,severity:i.severity,repairType:i.repairType,confidence:i.confidence,selectors:i.selectors,htmlSnippet:i.htmlSnippet,helpUrl:i.helpUrl,patternHash:patternHash(i.ruleId,i.htmlSnippet)}})),
      ]);
      if(siteId){await prisma.site.update({where:{id:siteId},data:{lastScanAt:new Date(),lastScore:score,openIssues:result.summary.total}});}
      await audit({organizationId:ctx.organizationId,userId:ctx.userId,action:"scan.completed",resourceType:"scan",resourceId:scan.id,metadata:{totalIssues:result.summary.total,score},requestId});
      return NextResponse.json({scanId:scan.id,result,requestId},{headers:{"X-Request-Id":requestId}});
    } catch(e) {
      await prisma.scan.update({where:{id:scan.id},data:{status:"failed",finishedAt:new Date(),errorMessage:String(e).slice(0,1000)}});
      await audit({organizationId:ctx.organizationId,userId:ctx.userId,action:"scan.failed",resourceType:"scan",resourceId:scan.id,requestId});
      logger.error({requestId,error:String(e)},"scan failed");
      return NextResponse.json({error:"Scan failed. Check the URL is public and try again.",requestId},{status:500,headers:{"X-Request-Id":requestId}});
    }
  } catch(e){return authErrorResponse(e,requestId);}
}
