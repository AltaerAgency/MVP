import Link from "next/link";
export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf8f3", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid #f0ebe4", background: "#fff" }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#2d1f14", letterSpacing: "-.3px" }}>MVP<span style={{ color: "#e07830" }}>.</span></div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/sign-in" style={{ fontSize: 14, color: "#7a6055", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
          <Link href="/sign-up" style={{ padding: "8px 18px", background: "#e07830", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get started</Link>
        </div>
      </header>
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 40px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#e07830", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Accessibility Platform</p>
        <h1 style={{ fontSize: 56, fontWeight: 700, color: "#2d1f14", letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: 20, maxWidth: 700 }}>Identify, repair, and document accessibility issues — at scale.</h1>
        <p style={{ fontSize: 18, color: "#7a6055", maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>AI-assisted scanning and remediation for enterprises and government managing WCAG 2.1 AA and Section 508 readiness.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/sign-up" style={{ padding: "14px 28px", background: "#e07830", color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>Request access</Link>
          <Link href="/sign-in" style={{ padding: "14px 28px", background: "rgba(224,120,48,0.08)", color: "#e07830", border: "1px solid rgba(220,100,30,0.2)", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </div>
        <p style={{ marginTop: 40, fontSize: 12, color: "#c4b0a0", maxWidth: 500 }}>MVP helps identify, prioritize, and repair accessibility issues. Final compliance should be reviewed by qualified accessibility professionals.</p>
      </section>
    </main>
  );
}
