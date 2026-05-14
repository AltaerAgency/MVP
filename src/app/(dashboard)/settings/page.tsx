import Link from "next/link";
const card = { background:"rgba(224,120,48,0.08)", border:"1px solid rgba(220,100,30,0.15)", borderRadius:16, padding:20 };
export default function SettingsPage() {
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Settings</p>
      <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5,marginBottom:20}}>Workspace settings</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Link href="/settings/members" style={{...card,textDecoration:"none",display:"block"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:9,background:"rgba(224,120,48,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-users" style={{fontSize:18,color:"#e07830"}} aria-hidden="true"/></div>
            <div><div style={{fontSize:14,fontWeight:600,color:"#2d1f14"}}>Team members</div><div style={{fontSize:12,color:"#a08070",marginTop:2}}>Invite and manage team roles</div></div>
          </div>
        </Link>
        <Link href="/settings/billing" style={{...card,textDecoration:"none",display:"block"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:9,background:"rgba(224,120,48,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-credit-card" style={{fontSize:18,color:"#e07830"}} aria-hidden="true"/></div>
            <div><div style={{fontSize:14,fontWeight:600,color:"#2d1f14"}}>Billing</div><div style={{fontSize:12,color:"#a08070",marginTop:2}}>Manage plans and payment</div></div>
          </div>
        </Link>
      </div>
    </div>
  );
}
