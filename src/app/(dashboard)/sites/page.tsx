export default function SitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Sites</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Websites</h1>
        <p className="mt-2 text-slate-600">Manage the websites and projects that your organization wants to monitor.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">No websites connected</h2>
        <p className="mt-2 text-slate-500">Site registration forms will be added after the first live deployment is working.</p>
      </div>
    </div>
  );
}
