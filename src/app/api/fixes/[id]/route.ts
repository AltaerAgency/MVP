import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { newRequestId } from "@/lib/utils";
import { authErrorResponse, requirePermission } from "@/lib/tenant";
import { audit } from "@/lib/audit";
export const runtime = "nodejs";
const Body = z.object({ status: z.enum(["approved","rejected","applied"]), editedValue: z.string().optional() });
export async function PATCH(req: Request, context: {params: Promise<{id:string}>}) {
  const requestId = newRequestId();
  try {
    const {id} = await context.params;
    const body = Body.safeParse(await req.json().catch(()=>({})));
    if (!body.success) return NextResponse.json({error:"Invalid body"},{status:400});
    const {status,editedValue} = body.data;
    const perm = status==="applied"?"fix:apply":status==="rejected"?"fix:reject":"fix:approve";
    const ctx = await requirePermission(perm);
    const fix = await prisma.fix.findFirst({where:{id,organizationId:ctx.organizationId}});
    if (!fix) return NextResponse.json({error:"Fix not found"},{status:404});
    const updated = await prisma.fix.update({where:{id},data:{status,...(editedValue&&{editedValue,status:"edited"}),...(status==="approved"&&{approvedByUserId:ctx.userId,approvedAt:new Date()})}});
    const action = status==="approved"?"fix.approved":status==="rejected"?"fix.rejected":"fix.applied";
    await audit({organizationId:ctx.organizationId,userId:ctx.userId,action,resourceType:"fix",resourceId:id,requestId});
    return NextResponse.json({fix:updated,requestId},{headers:{"X-Request-Id":requestId}});
  } catch(e){return authErrorResponse(e,requestId);}
}
