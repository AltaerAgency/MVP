"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
const card = { background: "rgba(224,120,48,0.08)", border: "1px solid rgba(220,100,30,0.15)", borderRadius: 16, padding: 24 };
export default function NewScanPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  async function handleScan() {
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Scan failed"); }
      else { router.push(`/scans/${data.scanId}`); }
    } catch(e) { setError("Network error: " + String(e)); }
    finally { setLoading(false); }
  }
  return (
    <div style={{ maxWidth: 560 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#e07830", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 8 }}>New scan</p>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#2d1f14", letterSpacing: -.5, marginBottom: 6 }}>Scan a website</h1>
      <p style={{ fontSize: 14, color: "#7a6055", marginBottom: 24 }}>Enter any public URL. We&apos;ll run a full axe-core audit using headless Chromium — results in 10–30 seconds.</p>
      <div style={card}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#b89880", letterSpacing: ".05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Website URL</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" disabled={loading} onKeyDown={e => e.key === "Enter" && url && !loading && handleScan()}
            style={{ flex: 1, padding: "12px 16px", border: "1px solid rgba(220,100,30,0.2)", borderRadius: 10, fontSize: 14, color: "#2d1f14", background: "rgba(255,255,255,0.6)", outline: "none" }} />
          <button onClick={handleScan} disabled={loading || !url}
            style={{ padding: "12px 22px", background: loading || !url ? "#c4b0a0" : "#e07830", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading || !url ? "not-allowed" : "pointer" }}>
            {loading ? "Scanning…" : "Run scan"}
          </button>
        </div>
        {loading && <p style={{ fontSize: 12, color: "#b89880", marginTop: 10 }}>Launching headless Chromium and running axe-core audit…</p>}
        {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 10, padding: "8px 12px", background: "#fef2f2", borderRadius: 8 }}>{error}</p>}
      </div>
    </div>
  );
}
