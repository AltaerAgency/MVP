import Link from "next/link";

export default function ScansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Scans</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Website scans</h1>
          <p className="mt-2 text-slate-600">Run and review accessibility scans for public website pages.</p>
        </div>
        <Link href="/scans/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">New scan</Link>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">No scans yet</h2>
        <p className="mt-2 text-slate-500">After deployment, connect the scanner workflow and run your first public URL scan.</p>
      </div>
    </div>
  );
}
