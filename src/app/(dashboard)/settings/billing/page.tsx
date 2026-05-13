export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Billing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Plans and billing</h1>
        <p className="mt-2 text-slate-600">Stripe billing will be connected after the first live dashboard deployment.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Starter", "Professional", "Government"].map((plan) => (
          <div key={plan} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{plan}</h2>
            <p className="mt-2 text-sm text-slate-500">Plan configuration coming soon.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
