import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
export const dynamic = "force-dynamic";
const actionLabels: Record<string,string> = {"org.created":"Organization created","member.joined":"Member joined","member.removed":"Member removed","site.created":"Site added","scan.started":"Scan started","scan.completed":"Scan completed","scan.failed":"Scan failed","fix.generated":"Fix suggested","fix.approved":"Fix approved","fix.rejected":"Fix rejected","fix.applied":"Fix applied","report.exported":"Report exported"};
const dotColors: Record<string,string> = {"scan.completed":"#16a34a","fix.approved":"#16a34a","fix.generated":"#e07830","scan.started":"#e07830","scan.failed":"#dc2626","fix.rejected":"#dc2626"};
export default async function AuditPage() {
  const ctx = await getTenantContext(); if (!ctx) redirect("/sign-in");
  if (!can(ctx.role,"audit:view")) return <div style={{padding:24,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:12,color:"#dc2626"}}>You don&apos;t have permission to view the audit log.</div>;
  const events = await prisma.auditEvent.findMany({ where:{organizationId:ctx.organizationId}, orderBy:{createdAt:"desc"}, take:100, include:{user:{select:{name:true,email:true}}} });
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Audit</p>
      <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5,marginBottom:6}}>Activity log</h1>
      <p style={{fontSize:14,color:"#7a6055",marginBottom:20}}>Every action logged for compliance and accountability.</p>
      <div style={{background:"rgba(224,120,48,0.08)",border:"1px solid rgba(220,100,30,0.15)",borderRadius:16,overflow:"hidden"}}>
        {events.length===0 ? <div style={{padding:40,textAlign:"center",color:"#b89880"}}>No events yet. Events appear as your team uses the product.</div> :
          events.map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 18px",borderBottom:"1px solid rgba(220,100,30,0.08)"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:dotColors[e.action]??"#c4b0a0",marginTop:5,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:"#2d1f14"}}>{actionLabels[e.action]??e.action}</div>
                <div style={{fontSize:11,color:"#b89880",marginTop:2}}>{e.user?.name??e.user?.email??"System"} · {new Date(e.createdAt).toLocaleString()}</div>
              </div>
              {e.resourceType&&<span style={{fontSize:10,color:"#c4b0a0",fontFamily:"monospace"}}>{e.resourceType} {(e.resourceId??"").slice(-8)}</span>}
            </div>
          ))
        }
      </div>
    </div>
  );
}
