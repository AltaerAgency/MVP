import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Workspace settings</h1>
        <p className="mt-2 text-slate-600">Manage team access, billing, and organization preferences.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/settings/members" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50">
          <h2 className="font-semibold text-slate-900">Team members</h2>
          <p className="mt-2 text-sm text-slate-500">Invite users and manage roles.</p>
        </Link>
        <Link href="/settings/billing" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50">
          <h2 className="font-semibold text-slate-900">Billing</h2>
          <p className="mt-2 text-sm text-slate-500">Manage plans and payment settings.</p>
        </Link>
      </div>
    </div>
  );
}
