import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="container mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/admin" className="font-semibold text-slate-900">
            Admin – Kaj potrebujemo
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/kaj-potrebujemo" className="text-sm text-slate-600 hover:underline">
              Nazaj na stran
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Odjava
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
