import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">MVP setup</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome to MVP</h1>
        <p className="mt-3 text-slate-600">
          Your account is ready. The next step is to connect your organization, add websites,
          and begin tracking accessibility scans and remediation work.
        </p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
