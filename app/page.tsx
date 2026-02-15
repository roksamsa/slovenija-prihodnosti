import Link from "next/link";
import { UserPoll } from "@/components/poll/UserPoll";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Slovenija prihodnosti
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Državljanska platforma za primerjavo strank in programov na državnozborskih volitvah 2026.
          Raziščite stališča, primerjajte stranke in se odločite na podlagi informacij.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/primerjava"
            className="rounded-lg bg-[var(--slovenia-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Primerjava strank
          </Link>
          <Link
            href="/stranke"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Vse stranke
          </Link>
          <Link
            href="/kaj-potrebujemo"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Kaj potrebujemo
          </Link>
        </div>
      </section>

      {/* User poll: starts at 0%, one vote per IP + device (cookie) */}
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-semibold text-slate-900">
          Glasovanje obiskovalcev
        </h2>
        <p className="mb-4 text-slate-600">
          Spodaj so rezultati vaše ankete. En glas na napravo (en brskalnik). Družina z več napravami lahko vsak s svoje naprave glasuje.
        </p>
        <UserPoll />
      </section>
    </div>
  );
}
