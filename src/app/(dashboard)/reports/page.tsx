const card = { background:"rgba(224,120,48,0.08)", border:"1px solid rgba(220,100,30,0.15)", borderRadius:16, padding:24, cursor:"pointer" as const };
const reports = [
  { icon:"ti-presentation", title:"Executive summary", desc:"Score overview, top issues, week-over-week trend", color:"#185FA5", bg:"rgba(24,95,165,0.1)" },
  { icon:"ti-shield-check", title:"WCAG conformance", desc:"Full WCAG 2.1 AA and Section 508 readiness breakdown", color:"#16a34a", bg:"rgba(22,163,74,0.1)" },
  { icon:"ti-chart-line", title:"Remediation progress", desc:"Before/after scores, fix velocity, open vs resolved", color:"#e07830", bg:"rgba(224,120,48,0.12)" },
];
export default function ReportsPage() {
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Reports</p>
      <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5,marginBottom:6}}>Accessibility reports</h1>
      <p style={{fontSize:14,color:"#7a6055",marginBottom:20}}>Generate and export compliance documentation for stakeholders.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {reports.map(r=>(
          <div key={r.title} style={card}>
            <div style={{width:40,height:40,borderRadius:10,background:r.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
              <i className={`ti ${r.icon}`} style={{fontSize:20,color:r.color}} aria-hidden="true"/>
            </div>
            <div style={{fontSize:15,fontWeight:600,color:"#2d1f14",marginBottom:4}}>{r.title}</div>
            <div style={{fontSize:12,color:"#a08070",lineHeight:1.5}}>{r.desc}</div>
            <div style={{marginTop:14,fontSize:12,color:"#c4b0a0"}}>Coming in Sprint 6</div>
          </div>
        ))}
      </div>
    </div>
  );
}
