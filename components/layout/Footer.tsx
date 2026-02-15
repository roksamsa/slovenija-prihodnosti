import Link from "next/link";

const dataSources = [
  { label: "Liste kandidatov 2026", url: "https://sl.wikipedia.org/wiki/Liste_kandidatov_za_državnozborske_volitve_v_Sloveniji_2026" },
  { label: "Wikipedia", url: "https://sl.wikipedia.org" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-600">
              © {year} Slovenija prihodnosti. Državljanski projekt, neprofitno.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Ta platforma je namenjena informiranju volivcev. Ni povezana z nobeno politično stranko.
              Podatki so zbrani iz javno dostopnih virov; za natančnost ne jamčimo.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Viri podatkov</p>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {dataSources.map(({ label, url }) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--slovenia-blue)] underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Domov
          </Link>
          <Link href="/primerjava" className="text-slate-500 hover:text-slate-700">
            Primerjava
          </Link>
          <Link href="/stranke" className="text-slate-500 hover:text-slate-700">
            Stranke
          </Link>
          <Link href="/kaj-potrebujemo" className="text-slate-500 hover:text-slate-700">
            Kaj potrebujemo
          </Link>
        </div>
      </div>
    </footer>
  );
}
