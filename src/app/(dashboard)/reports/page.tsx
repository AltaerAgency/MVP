export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Reports</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Accessibility reports</h1>
        <p className="mt-2 text-slate-600">Prepare client-ready summaries for website and document accessibility work.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Report types</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {["Executive summary", "Issue export", "Remediation progress"].map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
