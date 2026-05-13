import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">MVP</div>
        <nav className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Sign in
          </Link>
          <Link href="/sign-up" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Request access
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-blue-700">
          Accessibility dashboard for teams
        </p>
        <h1 className="text-balance text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Identify, prioritize, and repair accessibility issues at scale.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-600">
          MVP is an AI-assisted dashboard for scanning websites, organizing accessibility issues,
          creating remediation tasks, and building reports for WCAG and Section 508 readiness.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/sign-up" className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
            Request a demo
          </Link>
          <Link href="/sign-in" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
            Sign in
          </Link>
        </div>
        <p className="mt-12 text-sm text-slate-500">
          MVP helps teams identify and manage accessibility issues. Final compliance should be reviewed by qualified accessibility professionals.
        </p>
      </section>
    </main>
  );
}
