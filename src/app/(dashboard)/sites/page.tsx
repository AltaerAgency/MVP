"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const card = { background:"rgba(224,120,48,0.08)", border:"1px solid rgba(220,100,30,0.15)", borderRadius:16, padding:20 };
interface Site { id:string; name:string; baseUrl:string; lastScore?:number|null; openIssues:number; lastScanAt?:string|null; }
export default function SitesPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState(""); const [url, setUrl] = useState(""); const [saving, setSaving] = useState(false); const [err, setErr] = useState<string|null>(null);
  useEffect(()=>{ fetch("/api/sites").then(r=>r.json()).then(d=>setSites(d.sites??[])); },[]);
  async function addSite() {
    setErr(null); setSaving(true);
    const res = await fetch("/api/sites",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,baseUrl:url})});
    const data = await res.json();
    if (!res.ok){setErr(data.error??"Failed");}else{setSites(s=>[data.site,...s]);setAdding(false);setName("");setUrl("");}
    setSaving(false);
  }
  const inp = { padding:"10px 14px", border:"1px solid rgba(220,100,30,0.2)", borderRadius:8, fontSize:14, color:"#2d1f14", background:"rgba(255,255,255,0.6)", outline:"none", width:"100%" };
  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <p style={{fontSize:11,fontWeight:600,color:"#e07830",letterSpacing:".05em",textTransform:"uppercase",marginBottom:4}}>Sites</p>
          <h1 style={{fontSize:32,fontWeight:700,color:"#2d1f14",letterSpacing:-.5}}>Websites</h1>
        </div>
        <button onClick={()=>setAdding(a=>!a)} style={{padding:"8px 18px",background:"#e07830",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add site</button>
      </div>
      {adding&&(
        <div style={{...card,marginBottom:16}}>
          <h2 style={{fontSize:15,fontWeight:600,color:"#2d1f14",marginBottom:14}}>Add a website</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={{fontSize:11,fontWeight:600,color:"#b89880",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:5}}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="City Website" style={inp}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:"#b89880",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:5}}>Base URL</label><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" type="url" style={inp}/></div>
          </div>
          {err&&<p style={{fontSize:12,color:"#dc2626",marginBottom:8}}>{err}</p>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={addSite} disabled={saving||!name||!url} style={{padding:"8px 18px",background:saving||!name||!url?"#c4b0a0":"#e07830",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>{saving?"Saving…":"Add site"}</button>
            <button onClick={()=>setAdding(false)} style={{padding:"8px 18px",background:"transparent",border:"1px solid rgba(220,100,30,0.2)",borderRadius:8,fontSize:13,color:"#a08070",cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
      {sites.length===0&&!adding ? (
        <div style={{...card,textAlign:"center",padding:48}}><p style={{color:"#b89880",marginBottom:12}}>No sites yet. Add your first website to start monitoring.</p></div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {sites.map(s=>{
            const sc=s.lastScore; const scColor=sc==null?"#c4b0a0":sc>=80?"#16a34a":sc>=60?"#e07830":"#dc2626";
            return (
              <div key={s.id} style={card}>
                <h3 style={{fontSize:15,fontWeight:600,color:"#2d1f14",marginBottom:2}}>{s.name}</h3>
                <p style={{fontSize:11,color:"#c4b0a0",marginBottom:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.baseUrl}</p>
                <div style={{height:4,background:"rgba(220,100,30,0.1)",borderRadius:2,marginBottom:10,overflow:"hidden"}}><div style={{height:4,width:`${sc??0}%`,background:scColor,borderRadius:2}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:scColor}}>Score {sc??"—"}</span>
                  <span style={{fontSize:11,color:"#b89880"}}>{s.openIssues} issues</span>
                </div>
                <button onClick={()=>router.push(`/scans/new?siteId=${s.id}`)} style={{marginTop:12,width:"100%",padding:"8px",background:"transparent",border:"1px solid rgba(220,100,30,0.2)",borderRadius:8,fontSize:12,color:"#e07830",fontWeight:500,cursor:"pointer"}}>Scan now</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
