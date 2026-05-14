import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newRequestId } from "@/lib/utils";
import { authErrorResponse, requireTenantContext } from "@/lib/tenant";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const requestId = newRequestId();
  try {
    const ctx = await requireTenantContext();
    const {searchParams} = new URL(req.url);
    const repairType = searchParams.get("repairType");
    const status = searchParams.get("status")??"open";
    const scanId = searchParams.get("scanId");
    const take = Math.min(parseInt(searchParams.get("limit")??"100",10),200);
    const issues = await prisma.issue.findMany({
      where:{organizationId:ctx.organizationId,...(status!=="all"&&{status}),...(repairType&&{repairType}),...(scanId&&{scanId})},
      orderBy:[{severity:"asc"},{createdAt:"desc"}],take,
      include:{fix:true,scan:{select:{id:true,siteId:true,url:true,site:{select:{name:true}}}}},
    });
    return NextResponse.json({issues,requestId},{headers:{"X-Request-Id":requestId}});
  } catch(e){return authErrorResponse(e,requestId);}
}
