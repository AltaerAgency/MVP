const statuses = ["Open", "Needs review", "Ready to fix", "Resolved"];

export default function IssuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Issues</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Fix queue</h1>
        <p className="mt-2 text-slate-600">Prioritize accessibility issues and track remediation status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {statuses.map((status) => (
          <div key={status} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{status}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">No issues yet</h2>
        <p className="mt-2 text-slate-500">Issues will appear here after scans are connected and completed.</p>
      </div>
    </div>
  );
}
