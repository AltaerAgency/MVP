import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Scans", "/scans"],
  ["Issues", "/issues"],
  ["Sites", "/sites"],
  ["Documents", "/documents"],
  ["Reports", "/reports"],
  ["Audit", "/audit"],
  ["Settings", "/settings"],
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-slate-900">MVP</Link>
        <p className="mt-2 text-sm text-slate-500">Accessibility Dashboard</p>
        <nav className="mt-8 space-y-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
          <div>
            <p className="text-sm font-medium text-slate-500">MVP</p>
            <p className="text-xs text-slate-400">AI-assisted accessibility workflow</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
