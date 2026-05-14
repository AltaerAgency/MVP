import Link from "next/link";
import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const card = { background: "rgba(224,120,48,0.08)", border: "1px solid rgba(220,100,30,0.15)", borderRadius: 16, overflow: "hidden" };
export default async function ScansPage() {
  const ctx = await getTenantContext(); if (!ctx) redirect("/sign-in");
  const scans = await prisma.scan.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: "desc" }, take: 50, include: { site: { select: { name: true } } } });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#e07830", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 4 }}>Scans</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#2d1f14", letterSpacing: -.5 }}>Website scans</h1>
        </div>
        <Link href="/scans/new" style={{ padding: "8px 18px", background: "#e07830", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>+ New scan</Link>
      </div>
      {scans.length === 0 ? (
        <div style={{ ...card, padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#b89880", marginBottom: 12 }}>No scans yet. Scan your first URL to find accessibility issues.</p>
          <Link href="/scans/new" style={{ padding: "10px 20px", background: "#e07830", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Scan a URL</Link>
        </div>
      ) : (
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 70px 80px 110px", padding: "10px 18px", background: "rgba(220,100,30,0.05)", fontSize: 10, fontWeight: 600, color: "#b89880", textTransform: "uppercase", letterSpacing: ".06em", gap: 0 }}>
            <span>Page</span><span>Score</span><span>Issues</span><span>Status</span><span>Date</span>
          </div>
          {scans.map(s => {
            const sc = s.score; const scColor = sc == null ? "#c4b0a0" : sc >= 80 ? "#16a34a" : sc >= 60 ? "#e07830" : "#dc2626";
            const scBg = sc == null ? "#f5f5f5" : sc >= 80 ? "#f0fdf4" : sc >= 60 ? "rgba(224,120,48,0.1)" : "#fef2f2";
            return (
              <Link key={s.id} href={`/scans/${s.id}`} style={{ display: "grid", gridTemplateColumns: "2fr 80px 70px 80px 110px", padding: "13px 18px", borderTop: "1px solid rgba(220,100,30,0.08)", alignItems: "center", textDecoration: "none" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#2d1f14", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.site?.name ?? s.url ?? `Scan ${s.id.slice(-8)}`}</span>
                <span>{sc != null && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: scBg, color: scColor }}>{sc}</span>}</span>
                <span style={{ fontSize: 13, color: "#7a6055" }}>{s.totalIssues}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: s.status==="complete"?"#16a34a":s.status==="failed"?"#dc2626":"#e07830" }}>{s.status}</span>
                <span style={{ fontSize: 11, color: "#b89880" }}>{new Date(s.createdAt).toLocaleDateString()}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
