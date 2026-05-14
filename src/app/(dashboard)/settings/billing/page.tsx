import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const plans = [
  { id:"pro", name:"Pro", price:"$499", period:"/mo", desc:"For agencies and mid-size organizations", features:["2,500 pages/mo","250 PDFs/mo","10 sites","10 seats","API access","Audit log"] },
  { id:"government", name:"Government", price:"$1,499", period:"/mo", desc:"For cities, counties, schools, federal agencies", features:["10,000 pages/mo","1,000 PDFs/mo","25 sites","25 seats","SSO","VPAT generation","Dedicated support"], highlight:true },
  { id:"agency", name:"Agency", price:"$1,999", period:"/mo", desc:"For agencies serving regulated clients", features:["15,000 pages/mo","1,500 PDFs/mo","50 sites","25 seats","White-label reports","SSO","Priority support"] },
];
export default async function BillingPage() {
  const ctx = await getTenantContext(); if (!ctx) redirect("/sign-in");
  const org = await prisma.organization.findUnique({ where:{id:ctx.organizationId}, select:{planId:true,planStatus:true,trialEndsAt:true} });
  const trialDays = org?.trialEndsAt ? Math.max(0,Math.ceil((org.trialEndsAt.getTime()-Date.now())/86400000)) : null;
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Settings</p>
      <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5,marginBottom:6}}>Billing & plans</h1>
      {org?.planId==="trial"&&<div style={{marginBottom:20,padding:"12px 16px",background:"rgba(224,120,48,0.08)",border:"1px solid rgba(220,100,30,0.2)",borderRadius:12,fontSize:13,color:"#7a6055"}}>You&apos;re on the <strong style={{color:"#e07830"}}>Trial plan</strong> — {trialDays} days remaining. Choose a plan below to continue after your trial.</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {plans.map(p=>(
          <div key={p.id} style={{background:p.highlight?"#e07830":"rgba(224,120,48,0.08)",border:`1px solid ${p.highlight?"#e07830":"rgba(220,100,30,0.15)"}`,borderRadius:16,padding:24,position:"relative"}}>
            {p.highlight&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",fontSize:10,fontWeight:700,padding:"3px 12px",background:"#2d1f14",color:"#fff",borderRadius:20,letterSpacing:".05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Most popular</div>}
            <div style={{fontSize:22,fontWeight:700,color:p.highlight?"#fff":"#2d1f14",marginBottom:2}}>{p.name}</div>
            <div style={{fontSize:12,color:p.highlight?"rgba(255,255,255,0.75)":"#a08070",marginBottom:14}}>{p.desc}</div>
            <div style={{fontSize:32,fontWeight:700,color:p.highlight?"#fff":"#2d1f14",letterSpacing:-1,marginBottom:16}}>{p.price}<span style={{fontSize:13,fontWeight:400,opacity:.7}}>{p.period}</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
              {p.features.map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:p.highlight?"rgba(255,255,255,0.9)":"#5a4035"}}>
                  <span style={{color:p.highlight?"rgba(255,255,255,0.8)":"#e07830",fontSize:14}}>✓</span>{f}
                </div>
              ))}
            </div>
            <button style={{width:"100%",padding:"10px",background:p.highlight?"#fff":"#e07830",color:p.highlight?"#e07830":"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer"}}>
              {org?.planId===p.id?"Current plan":"Upgrade to "+p.name}
            </button>
          </div>
        ))}
      </div>
      <div style={{padding:16,background:"rgba(224,120,48,0.06)",border:"1px solid rgba(220,100,30,0.12)",borderRadius:12,fontSize:12,color:"#a08070",textAlign:"center"}}>
        Need a custom Enterprise contract? <a href="mailto:sales@mvp.app" style={{color:"#e07830",textDecoration:"none",fontWeight:500}}>Contact sales →</a>
      </div>
    </div>
  );
}
