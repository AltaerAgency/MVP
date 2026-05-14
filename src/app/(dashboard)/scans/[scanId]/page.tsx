import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { FixQueue } from "./FixQueue";
export const dynamic = "force-dynamic";
const card = { background: "rgba(224,120,48,0.08)", border: "1px solid rgba(220,100,30,0.15)", borderRadius: 16, overflow: "hidden" };
export default async function ScanDetailPage({ params }: { params: Promise<{ scanId: string }> }) {
  const ctx = await getTenantContext(); if (!ctx) redirect("/sign-in");
  const { scanId } = await params;
  const scan = await prisma.scan.findFirst({ where: { id: scanId, organizationId: ctx.organizationId }, include: { site: true, issues: { orderBy: [{ severity: "asc" }, { createdAt: "asc" }], include: { fix: true } } } });
  if (!scan) notFound();
  const sc = scan.score; const scColor = sc == null ? "#c4b0a0" : sc >= 80 ? "#16a34a" : sc >= 60 ? "#e07830" : "#dc2626";
  return (
    <div>
      <Link href="/scans" style={{ fontSize: 12, color: "#b89880", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}>← Back to scans</Link>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#e07830", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 4 }}>Scan result</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#2d1f14", letterSpacing: -.5, marginBottom: 4 }}>{scan.site?.name ?? scan.url ?? `Scan ${scan.id.slice(-8)}`}</h1>
        <p style={{ fontSize: 12, color: "#b89880" }}>{new Date(scan.createdAt).toLocaleString()} · {scan.status}{sc != null ? ` · Score ` : ""}{sc != null && <span style={{ color: scColor, fontWeight: 600 }}>{sc}</span>}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[{ l: "Total", v: scan.totalIssues, c: "#2d1f14" }, { l: "Critical", v: scan.criticalCount, c: "#dc2626" }, { l: "High", v: scan.highCount, c: "#e07830" }, { l: "Auto-Fix Ready", v: scan.autoFixCount, c: "#16a34a" }].map(s => (
          <div key={s.l} style={{ ...card, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, color: "#b89880", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.c, letterSpacing: -.5 }}>{s.v}</div>
          </div>
        ))}
      </div>
      {scan.issues.length === 0 ? (
        <div style={{ ...card, padding: 32, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#16a34a", fontWeight: 500 }}>No accessibility issues detected on this page.</p>
        </div>
      ) : <FixQueue issues={scan.issues as Parameters<typeof FixQueue>[0]["issues"]} />}
    </div>
  );
}
