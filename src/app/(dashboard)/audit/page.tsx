export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Audit</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Activity log</h1>
        <p className="mt-2 text-slate-600">Track important actions for accountability and client reporting.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">No activity yet</h2>
        <p className="mt-2 text-slate-500">Audit events will appear here when database-backed workflows are connected.</p>
      </div>
    </div>
  );
}
