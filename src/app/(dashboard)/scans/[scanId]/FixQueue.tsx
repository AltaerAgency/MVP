"use client";
import { useState } from "react";
type Fix = { id: string; explanation: string; suggestedValue?: string|null; codePatch?: string|null; status: string; };
type Issue = { id: string; ruleId: string; title: string; description: string; wcag: string[]; severity: string; repairType: string; selectors: string[]; htmlSnippet: string; helpUrl: string; fix: Fix|null; };
const sevStyle: Record<string,{bg:string;color:string}> = { critical:{bg:"#fef2f2",color:"#dc2626"}, high:{bg:"rgba(224,120,48,0.12)",color:"#c05020"}, medium:{bg:"rgba(224,120,48,0.08)",color:"#a06030"}, low:{bg:"#f5f5f5",color:"#6b7280"} };
const repairLabel: Record<string,string> = { "auto-fix":"Auto-Fix Ready", "ai-suggested":"Needs Approval", "code-patch":"Code Patch", "human-review":"Dev Review" };
const TABS = [{id:"all",label:"All"},{id:"auto-fix",label:"Auto-Fix"},{id:"ai-suggested",label:"Needs Approval"},{id:"code-patch",label:"Code Patch"},{id:"human-review",label:"Dev Review"}];
export function FixQueue({ issues }: { issues: Issue[] }) {
  const [tab, setTab] = useState("all");
  const [states, setStates] = useState<Record<string,{fix?:Fix;loading?:boolean;error?:string}>>({});
  const filtered = tab==="all" ? issues : issues.filter(i=>i.repairType===tab);
  const counts = Object.fromEntries(TABS.map(t=>[t.id, t.id==="all"?issues.length:issues.filter(i=>i.repairType===t.id).length]));
  async function suggestFix(issueId: string) {
    setStates(s=>({...s,[issueId]:{loading:true}}));
    try {
      const res = await fetch("/api/suggest-fix",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({issueId})});
      const data = await res.json();
      if (!res.ok) setStates(s=>({...s,[issueId]:{error:data.error??"Failed"}}));
      else setStates(s=>({...s,[issueId]:{fix:{id:"",status:"pending",...data.fix}}}));
    } catch(e){setStates(s=>({...s,[issueId]:{error:String(e)}}))}
  }
  async function updateFix(fixId: string, issueId: string, status: string) {
    const res = await fetch(`/api/fixes/${fixId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    if (res.ok){const data=await res.json();setStates(s=>({...s,[issueId]:{fix:data.fix}}));}
  }
  const card = { background:"rgba(224,120,48,0.08)", border:"1px solid rgba(220,100,30,0.15)", borderRadius:16, marginBottom:10, overflow:"hidden" };
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" as const}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",border:tab===t.id?"1px solid #e07830":"1px solid rgba(220,100,30,0.2)",background:tab===t.id?"#e07830":"transparent",color:tab===t.id?"#fff":"#a08070"}}>
            {t.label} <span style={{fontSize:10,marginLeft:3,opacity:.8}}>{counts[t.id]}</span>
          </button>
        ))}
      </div>
      {filtered.map((issue,idx)=>{
        const st = states[issue.id]; const fix = st?.fix ?? issue.fix; const loading = st?.loading;
        const sv = sevStyle[issue.severity]??{bg:"#f5f5f5",color:"#6b7280"};
        const canSuggest = ["ai-suggested","code-patch"].includes(issue.repairType);
        return (
          <div key={issue.id} style={card}>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",flexWrap:"wrap" as const,gap:6,marginBottom:8}}>
                    <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:6,background:sv.bg,color:sv.color}}>{issue.severity.toUpperCase()}</span>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,border:"1px solid rgba(220,100,30,0.15)",color:"#a08070"}}>{repairLabel[issue.repairType]??issue.repairType}</span>
                    {issue.wcag.length>0&&<a href={issue.helpUrl} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#e07830",textDecoration:"none"}}>WCAG {issue.wcag.join(", ")}</a>}
                  </div>
                  <h3 style={{fontSize:14,fontWeight:600,color:"#2d1f14",marginBottom:3}}>{issue.title}</h3>
                  <p style={{fontSize:12,color:"#7a6055",lineHeight:1.5}}>{issue.description}</p>
                </div>
                {canSuggest&&!fix&&<button onClick={()=>suggestFix(issue.id)} disabled={!!loading} style={{flexShrink:0,padding:"6px 14px",borderRadius:8,background:loading?"#c4b0a0":"#e07830",color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:loading?"not-allowed":"pointer"}}>{loading?"Thinking…":"Suggest fix"}</button>}
              </div>
              <details style={{marginTop:10}}>
                <summary style={{fontSize:11,color:"#c4b0a0",cursor:"pointer"}}>Show element</summary>
                <pre style={{marginTop:8,padding:"10px 12px",background:"rgba(255,255,255,0.5)",borderRadius:8,fontSize:11,color:"#5a4035",overflowX:"auto" as const}}>{issue.selectors[0]}{"\n\n"}{issue.htmlSnippet}</pre>
              </details>
              {st?.error&&<p style={{marginTop:8,fontSize:12,color:"#dc2626",padding:"6px 10px",background:"#fef2f2",borderRadius:6}}>{st.error}</p>}
            </div>
            {fix&&(
              <div style={{margin:"0 18px 16px",padding:"14px 16px",background:fix.status==="approved"||fix.status==="applied"?"rgba(34,197,94,0.06)":"rgba(224,120,48,0.06)",border:`1px solid ${fix.status==="approved"||fix.status==="applied"?"rgba(34,197,94,0.2)":"rgba(220,100,30,0.2)"}`,borderRadius:12}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,color:"#2d1f14",lineHeight:1.5,marginBottom:8}}>{fix.explanation}</p>
                    {fix.suggestedValue&&<div style={{marginBottom:8}}><p style={{fontSize:10,fontWeight:600,color:"#b89880",textTransform:"uppercase" as const,letterSpacing:".05em",marginBottom:4}}>Suggested value</p><p style={{fontSize:13,padding:"8px 12px",background:"rgba(255,255,255,0.7)",borderRadius:8,border:"1px solid rgba(220,100,30,0.15)"}}>{fix.suggestedValue}</p></div>}
                    {fix.codePatch&&<div><p style={{fontSize:10,fontWeight:600,color:"#b89880",textTransform:"uppercase" as const,letterSpacing:".05em",marginBottom:4}}>Code patch</p><pre style={{fontSize:11,padding:"10px 12px",background:"#1a1a2e",color:"#e2e8f0",borderRadius:8,overflowX:"auto" as const}}>{fix.codePatch}</pre></div>}
                  </div>
                  {fix.id&&fix.status==="pending"&&(
                    <div style={{display:"flex",flexDirection:"column" as const,gap:6,flexShrink:0}}>
                      <button onClick={()=>updateFix(fix.id,issue.id,"approved")} style={{padding:"6px 14px",borderRadius:8,background:"#16a34a",color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer"}}>Approve</button>
                      <button onClick={()=>updateFix(fix.id,issue.id,"rejected")} style={{padding:"6px 14px",borderRadius:8,background:"transparent",color:"#7a6055",border:"1px solid rgba(220,100,30,0.2)",fontSize:12,cursor:"pointer"}}>Reject</button>
                    </div>
                  )}
                  {(fix.status==="approved"||fix.status==="applied")&&<span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:"#f0fdf4",color:"#16a34a"}}>✓ Approved</span>}
                  {fix.status==="rejected"&&<span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:"#f5f5f5",color:"#9ca3af"}}>Rejected</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
