export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Documents</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">PDF remediation</h1>
        <p className="mt-2 text-slate-600">Upload PDFs, review accessibility findings, and track remediation work.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">PDF workflow coming next</h2>
        <p className="mt-2 text-slate-500">This section is reserved for upload, tagging, remediation, and report generation.</p>
      </div>
    </div>
  );
}
