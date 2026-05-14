"use client";
const card = { background:"rgba(224,120,48,0.08)", border:"1px solid rgba(220,100,30,0.15)", borderRadius:16, padding:24 };
export default function DocumentsPage() {
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Documents</p>
      <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5,marginBottom:6}}>PDF remediation</h1>
      <p style={{fontSize:14,color:"#7a6055",marginBottom:20}}>Upload PDFs and check them for WCAG 2.1 AA accessibility issues.</p>
      <div style={{...card,textAlign:"center",padding:"56px 24px",cursor:"pointer"}} onMouseOver={e=>(e.currentTarget.style.borderColor="rgba(220,100,30,0.4)")} onMouseOut={e=>(e.currentTarget.style.borderColor="rgba(220,100,30,0.15)")}>
        <div style={{width:56,height:56,background:"rgba(224,120,48,0.12)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <i className="ti ti-upload" style={{fontSize:26,color:"#e07830"}} aria-hidden="true"/>
        </div>
        <div style={{fontSize:17,fontWeight:600,color:"#2d1f14",marginBottom:6}}>Drop a PDF here, or click to upload</div>
        <div style={{fontSize:13,color:"#b89880"}}>Scans for WCAG 2.1 AA issues · Max 50 MB · PDF only</div>
        <div style={{marginTop:16,fontSize:12,color:"#c4b0a0"}}>PDF upload integration coming in the next sprint</div>
      </div>
    </div>
  );
}
