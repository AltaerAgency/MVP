const cards = [
  { label: "Scans this month", value: "0", note: "Connect a site and run your first scan" },
  { label: "Open issues", value: "0", note: "Issues will appear after scans" },
  { label: "Ready fixes", value: "0", note: "AI suggestions need an API key" },
  { label: "Reports", value: "0", note: "Create client-ready summaries" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome to MVP</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          This is the online accessibility dashboard for scanning websites, managing issues,
          reviewing AI-assisted fix suggestions, and preparing reports.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">First setup checklist</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["Connect PostgreSQL", "Add Clerk auth keys", "Create Clerk webhook", "Run first website scan", "Add Stripe billing later", "Add PDF upload later"].map((item) => (
            <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
