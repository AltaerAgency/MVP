export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Team</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Members</h1>
        <p className="mt-2 text-slate-600">Manage team members and roles through Clerk organizations.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Team management</h2>
        <p className="mt-2 text-slate-500">After Clerk organizations are connected, invite and manage members from this area.</p>
      </div>
    </div>
  );
}
