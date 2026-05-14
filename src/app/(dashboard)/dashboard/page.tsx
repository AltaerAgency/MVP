import Link from "next/link";
import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const card = { background: "rgba(224,120,48,0.08)", border: "1px solid rgba(220,100,30,0.15)", borderRadius: 16, padding: 18 };
const label = { fontSize: 11, fontWeight: 600, color: "#b89880", letterSpacing: ".05em", textTransform: "uppercase" as const, marginBottom: 10 };

export default async function DashboardPage() {
  const ctx = await getTenantContext();
  if (!ctx) redirect("/sign-in");

  const [scanCount, openIssues, recentScans, byRepair, org] = await Promise.all([
    prisma.scan.count({ where: { organizationId: ctx.organizationId, status: "complete" } }),
    prisma.issue.count({ where: { organizationId: ctx.organizationId, status: "open" } }),
    prisma.scan.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: "desc" }, take: 5, include: { site: { select: { name: true } } } }),
    prisma.issue.groupBy({ by: ["repairType"], where: { organizationId: ctx.organizationId, status: "open" }, _count: { _all: true } }),
    prisma.organization.findUnique({ where: { id: ctx.organizationId }, select: { name: true, planId: true } }),
  ]);

  const rc = Object.fromEntries(byRepair.map(g => [g.repairType, g._count._all]));
  const avgScore = recentScans.length > 0 ? Math.round(recentScans.filter(s => s.score).reduce((a, s) => a + (s.score ?? 0), 0) / recentScans.filter(s => s.score).length) || 0 : 0;

  const scoreColor = avgScore >= 80 ? "#22c55e" : avgScore >= 60 ? "#e07830" : "#ef4444";
  const dotColors: Record<string, string> = { complete: "#22c55e", running: "#e07830", failed: "#ef4444", queued: "#c4b0a0" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, ...card, padding: 0, overflow: "hidden" }}>
        {[
          { val: avgScore || "—", label: "Avg. score", color: scoreColor, delta: "↑ improving" },
          { val: openIssues, label: "Open issues", color: openIssues > 0 ? "#ef4444" : "#22c55e", delta: `${rc["auto-fix"] ?? 0} auto-fixable` },
          { val: rc["ai-suggested"] ?? 0, label: "Need approval", color: "#e07830", delta: "AI suggestions ready" },
          { val: scanCount, label: "Scans total", color: "#2d1f14", delta: "all time" },
          { val: recentScans.length, label: "Recent scans", color: "#2d1f14", delta: "last 5 shown" },
        ].map((k, i) => (
          <div key={i} style={{ padding: "18px 20px", borderRight: i < 4 ? "1px solid rgba(220,100,30,0.12)" : "none" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: k.color, letterSpacing: -1, lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: "#b89880", marginTop: 4, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: "#c4b0a0", marginTop: 3 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 220px", gap: 12 }}>
        {/* Recent scans */}
        <div style={card}>
          <div style={{ ...label, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Recent scans
            <Link href="/scans" style={{ fontSize: 11, color: "#e07830", fontWeight: 500, textDecoration: "none" }}>View all →</Link>
          </div>
          {recentScans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: 13, color: "#b89880" }}>No scans yet.</p>
              <Link href="/scans/new" style={{ fontSize: 12, color: "#e07830", textDecoration: "none" }}>Run your first scan →</Link>
            </div>
          ) : recentScans.map(s => (
            <Link key={s.id} href={`/scans/${s.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(220,100,30,0.08)", textDecoration: "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColors[s.status] ?? "#c4b0a0", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#2d1f14", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.site?.name ?? s.url ?? `Scan ${s.id.slice(-6)}`}</div>
                <div style={{ fontSize: 10, color: "#b89880" }}>{new Date(s.createdAt).toLocaleDateString()} · {s.status}</div>
              </div>
              {s.score != null && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: s.score >= 80 ? "#f0fdf4" : s.score >= 60 ? "rgba(224,120,48,0.1)" : "#fef2f2", color: s.score >= 80 ? "#16a34a" : s.score >= 60 ? "#e07830" : "#dc2626" }}>{s.score}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Top issues */}
        <div style={card}>
          <div style={{ ...label, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Fix queue
            <Link href="/issues" style={{ fontSize: 11, color: "#e07830", fontWeight: 500, textDecoration: "none" }}>View all →</Link>
          </div>
          {[
            { type: "auto-fix", label: "Auto-Fix Ready", color: "#16a34a", bg: "#f0fdf4" },
            { type: "ai-suggested", label: "Needs Approval", color: "#e07830", bg: "rgba(224,120,48,0.1)" },
            { type: "code-patch", label: "Code Patch", color: "#7c3aed", bg: "#f5f3ff" },
            { type: "human-review", label: "Dev Review", color: "#6b7280", bg: "#f5f5f5" },
          ].map(t => (
            <Link key={t.type} href={`/issues?repairType=${t.type}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(220,100,30,0.08)", textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: "#5a4035", fontWeight: 500 }}>{t.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: t.bg, color: t.color }}>{rc[t.type] ?? 0}</span>
            </Link>
          ))}
        </div>

        {/* WCAG ring */}
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ ...label, width: "100%", textAlign: "left" }}>WCAG readiness</div>
          <svg width="90" height="90" viewBox="0 0 90 90" aria-label={`${avgScore}% score`} style={{ margin: "6px 0" }}>
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(220,100,30,0.12)" strokeWidth="10" />
            <circle cx="45" cy="45" r="36" fill="none" stroke="#e07830" strokeWidth="10" strokeLinecap="round" strokeDasharray="226.19" strokeDashoffset={226.19 - (226.19 * (avgScore || 0) / 100)} transform="rotate(-90 45 45)" />
          </svg>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#2d1f14", letterSpacing: -0.5 }}>{avgScore || "—"}%</div>
          <div style={{ fontSize: 11, color: "#a08070", marginTop: 4, lineHeight: 1.5 }}>{rc["auto-fix"] ?? 0} auto-fixable<br />{rc["ai-suggested"] ?? 0} need review</div>
          <Link href="/issues" style={{ marginTop: 14, width: "100%", padding: "10px 0", background: "#e07830", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>Review fixes →</Link>
        </div>
      </div>
    </div>
  );
}
