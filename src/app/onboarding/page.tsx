import { CreateOrganization } from "@clerk/nextjs";
export default function OnboardingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f3", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 24 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#2d1f14", letterSpacing: "-.5px", marginBottom: 6 }}>Create your organization</h1>
        <p style={{ fontSize: 14, color: "#7a6055" }}>Your organization is the home for all your sites, scans, and team members.</p>
      </div>
      <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
    </div>
  );
}
