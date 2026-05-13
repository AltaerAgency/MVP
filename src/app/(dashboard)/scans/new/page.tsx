export default function NewScanPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">New scan</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Scan a public URL</h1>
        <p className="mt-2 text-slate-600">This screen is ready for the scanner API. For the first deployment, use it to verify the dashboard route.</p>
      </div>
      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700" htmlFor="url">Website URL</label>
        <input id="url" name="url" type="url" placeholder="https://example.com" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        <button type="button" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white opacity-60" disabled>
          Scanner coming next
        </button>
      </form>
    </div>
  );
}
