import Link from "next/link";
import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const sevStyle: Record<string,{bg:string;color:string}> = { critical:{bg:"#fef2f2",color:"#dc2626"}, high:{bg:"rgba(224,120,48,0.12)",color:"#c05020"}, medium:{bg:"rgba(224,120,48,0.08)",color:"#a06030"}, low:{bg:"#f5f5f5",color:"#6b7280"} };
const repairLabel: Record<string,string> = {"auto-fix":"Auto-Fix","ai-suggested":"Needs Approval","code-patch":"Code Patch","human-review":"Dev Review"};
export default async function IssuesPage({ searchParams }: { searchParams: Promise<{ repairType?: string }> }) {
  const ctx = await getTenantContext(); if (!ctx) redirect("/sign-in");
  const { repairType } = await searchParams;
  const [issues, counts] = await Promise.all([
    prisma.issue.findMany({ where:{ organizationId:ctx.organizationId, status:"open", ...(repairType&&{repairType}) }, orderBy:[{severity:"asc"},{createdAt:"desc"}], take:100, include:{fix:true,scan:{select:{id:true,site:{select:{name:true}},url:true}}} }),
    prisma.issue.groupBy({ by:["repairType"], where:{organizationId:ctx.organizationId,status:"open"}, _count:{_all:true} }),
  ]);
  const cm = Object.fromEntries(counts.map(c=>[c.repairType,c._count._all]));
  const total = counts.reduce((s,c)=>s+c._count._all,0);
  const filters = [{id:undefined,label:"All",count:total},{id:"auto-fix",label:"Auto-Fix",count:cm["auto-fix"]??0},{id:"ai-suggested",label:"Needs Approval",count:cm["ai-suggested"]??0},{id:"code-patch",label:"Code Patch",count:cm["code-patch"]??0},{id:"human-review",label:"Dev Review",count:cm["human-review"]??0}];
  return (
    <div>
      <div style={{marginBottom:20}}>
        <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Issues</p>
        <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5}}>Fix queue</h1>
        <p style={{fontSize:14,color:"#7a6055",marginTop:4}}>All open accessibility issues across your scans.</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {filters.map(f=>(
          <Link key={f.label} href={f.id?`/issues?repairType=${f.id}`:"/issues"} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,textDecoration:"none",border:repairType===f.id||((!repairType)&&!f.id)?"1px solid #e07830":"1px solid rgba(220,100,30,0.2)",background:repairType===f.id||((!repairType)&&!f.id)?"#e07830":"transparent",color:repairType===f.id||((!repairType)&&!f.id)?"#fff":"#a08070"}}>
            {f.label} <span style={{opacity:.8}}>{f.count}</span>
          </Link>
        ))}
      </div>
      {issues.length===0 ? (
        <div style={{background:"rgba(224,120,48,0.08)",border:"1px solid rgba(220,100,30,0.15)",borderRadius:16,padding:48,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#b89880",marginBottom:12}}>No open issues. Run a scan to discover accessibility problems.</p>
          <Link href="/scans/new" style={{padding:"10px 20px",background:"#e07830",color:"#fff",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none"}}>New scan</Link>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {issues.map(issue=>{
            const sv = sevStyle[issue.severity]??{bg:"#f5f5f5",color:"#6b7280"};
            return (
              <div key={issue.id} style={{background:"rgba(224,120,48,0.08)",border:"1px solid rgba(220,100,30,0.15)",borderRadius:14,padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                  <div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                      <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:6,background:sv.bg,color:sv.color}}>{issue.severity.toUpperCase()}</span>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,border:"1px solid rgba(220,100,30,0.15)",color:"#a08070"}}>{repairLabel[issue.repairType]??issue.repairType}</span>
                      {issue.wcag.length>0&&<span style={{fontSize:10,color:"#b89880"}}>WCAG {issue.wcag.join(", ")}</span>}
                    </div>
                    <h3 style={{fontSize:14,fontWeight:600,color:"#2d1f14",marginBottom:3}}>{issue.title}</h3>
                    <p style={{fontSize:12,color:"#7a6055"}}>{issue.description}</p>
                    <p style={{fontSize:11,color:"#c4b0a0",marginTop:4}}>From: <Link href={`/scans/${issue.scan.id}`} style={{color:"#e07830",textDecoration:"none"}}>{issue.scan.site?.name??issue.scan.url??`scan ${issue.scan.id.slice(-6)}`}</Link></p>
                  </div>
                  {issue.fix&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:issue.fix.status==="approved"?"#f0fdf4":"rgba(224,120,48,0.1)",color:issue.fix.status==="approved"?"#16a34a":"#e07830",flexShrink:0}}>Fix {issue.fix.status}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
