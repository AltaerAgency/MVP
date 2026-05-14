import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const card = { background:"rgba(224,120,48,0.08)", border:"1px solid rgba(220,100,30,0.15)", borderRadius:16, overflow:"hidden" };
const roleColors: Record<string,{bg:string;color:string}> = { owner:{bg:"rgba(224,120,48,0.15)",color:"#c05020"}, admin:{bg:"rgba(224,120,48,0.1)",color:"#e07830"}, editor:{bg:"#f0fdf4",color:"#16a34a"}, developer:{bg:"#f5f3ff",color:"#7c3aed"}, viewer:{bg:"#f5f5f5",color:"#6b7280"}, auditor:{bg:"#eff6ff",color:"#2563eb"}, accessibility_lead:{bg:"rgba(224,120,48,0.08)",color:"#a06030"} };
export default async function MembersPage() {
  const ctx = await getTenantContext(); if (!ctx) redirect("/sign-in");
  const members = await prisma.membership.findMany({ where:{organizationId:ctx.organizationId}, include:{user:{select:{name:true,email:true,avatarUrl:true}}}, orderBy:{createdAt:"asc"} });
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Settings</p>
      <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5,marginBottom:6}}>Team members</h1>
      <p style={{fontSize:14,color:"#7a6055",marginBottom:20}}>Manage who has access to your organization.</p>
      <div style={card}>
        <div style={{padding:"10px 18px",background:"rgba(220,100,30,0.05)",fontSize:10,fontWeight:600,color:"#b89880",textTransform:"uppercase",letterSpacing:".06em",display:"grid",gridTemplateColumns:"1fr 200px 120px"}}>
          <span>Member</span><span>Email</span><span>Role</span>
        </div>
        {members.map(m=>{
          const rc = roleColors[m.role]??{bg:"#f5f5f5",color:"#6b7280"};
          return (
            <div key={m.id} style={{display:"grid",gridTemplateColumns:"1fr 200px 120px",padding:"14px 18px",borderTop:"1px solid rgba(220,100,30,0.08)",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(224,120,48,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:"#e07830",flexShrink:0}}>{(m.user.name??m.user.email??"?")[0].toUpperCase()}</div>
                <span style={{fontSize:13,fontWeight:500,color:"#2d1f14"}}>{m.user.name??m.user.email}</span>
              </div>
              <span style={{fontSize:12,color:"#b89880"}}>{m.user.email}</span>
              <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:rc.bg,color:rc.color,display:"inline-block"}}>{m.role}</span>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:14,padding:16,background:"rgba(224,120,48,0.06)",border:"1px solid rgba(220,100,30,0.12)",borderRadius:12,fontSize:12,color:"#a08070"}}>
        To invite new members, use the <strong style={{color:"#e07830"}}>Organization Settings</strong> in Clerk (the user icon in the sidebar). Invitations sync automatically.
      </div>
    </div>
  );
}
