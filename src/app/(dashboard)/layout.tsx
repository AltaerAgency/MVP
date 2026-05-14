import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getTenantContext();
  if (!ctx) redirect("/sign-in");
  const org = await prisma.organization.findUnique({ where: { id: ctx.organizationId }, select: { name: true, planId: true, trialEndsAt: true } });
  if (!org) redirect("/onboarding");
  const trialDays = org.trialEndsAt ? Math.max(0, Math.ceil((org.trialEndsAt.getTime() - Date.now()) / 86400000)) : null;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fdf8f3", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 64, flexShrink: 0, background: "#fff", borderRight: "1px solid #f0ebe4", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 4 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff5ee", border: "2px solid #f4a86a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <i className="ti ti-user" style={{ fontSize: 17, color: "#e07830" }} aria-hidden="true" />
        </div>
        {[
          { href: "/dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
          { href: "/scans", icon: "ti-radar", label: "Scans" },
          { href: "/issues", icon: "ti-list-check", label: "Fix queue" },
          { href: "/sites", icon: "ti-world", label: "Sites" },
          { href: "/documents", icon: "ti-file-text", label: "Documents" },
          { href: "/reports", icon: "ti-chart-bar", label: "Reports" },
          { href: "/audit", icon: "ti-shield-check", label: "Audit log" },
          { href: "/settings", icon: "ti-settings", label: "Settings" },
        ].map(n => (
          <Link key={n.href} href={n.href} title={n.label} style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#c4b0a0", textDecoration: "none" }}>
            <i className={`ti ${n.icon}`} style={{ fontSize: 18 }} aria-hidden="true" />
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <UserButton afterSignOutUrl="/" />
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 52, background: "#fff", borderBottom: "1px solid #f0ebe4", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#2d1f14", letterSpacing: "-.2px" }}>{org.name}</div>
            <div style={{ fontSize: 11, color: "#b89880" }}>{org.planId} plan{trialDays !== null ? ` · ${trialDays} days left` : ""}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/scans/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#e07830", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" /> New scan
            </Link>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>{children}</main>
      </div>
    </div>
  );
}
