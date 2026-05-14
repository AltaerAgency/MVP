import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { newRequestId } from "@/lib/utils";
import { authErrorResponse, requirePermission, requireTenantContext } from "@/lib/tenant";
import { audit } from "@/lib/audit";
export const runtime = "nodejs";
const CreateBody = z.object({ name:z.string().min(1).max(100), baseUrl:z.string().url().max(2000), cmsType:z.string().optional() });
export async function GET() {
  const requestId = newRequestId();
  try {
    const ctx = await requireTenantContext();
    const sites = await prisma.site.findMany({where:{organizationId:ctx.organizationId,deletedAt:null},orderBy:{createdAt:"desc"},select:{id:true,name:true,baseUrl:true,cmsType:true,lastScanAt:true,lastScore:true,openIssues:true,createdAt:true}});
    return NextResponse.json({sites,requestId},{headers:{"X-Request-Id":requestId}});
  } catch(e){return authErrorResponse(e,requestId);}
}
export async function POST(req: Request) {
  const requestId = newRequestId();
  try {
    const ctx = await requirePermission("site:create");
    const body = CreateBody.safeParse(await req.json().catch(()=>({})));
    if (!body.success) return NextResponse.json({error:"Invalid body",requestId},{status:400});
    const site = await prisma.site.create({data:{...body.data,organizationId:ctx.organizationId}});
    await audit({organizationId:ctx.organizationId,userId:ctx.userId,action:"site.created",resourceType:"site",resourceId:site.id,requestId});
    return NextResponse.json({site,requestId},{status:201,headers:{"X-Request-Id":requestId}});
  } catch(e){return authErrorResponse(e,requestId);}
}
