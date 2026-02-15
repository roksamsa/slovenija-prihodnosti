import Image from "next/image";
import type { Party, PartyProgram, PolicyStanceSummary } from "./types";

type PartyTemplateProps = {
  party: Party;
  programSections: PartyProgram[];
  keyStances: PolicyStanceSummary[];
};

export function PartyTemplate({ party, programSections, keyStances }: PartyTemplateProps) {
  return (
    <article className="mx-auto max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        <div
          className="h-2 w-full rounded-t-lg"
          style={{ backgroundColor: party.color }}
        />
        <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {party.logoUrl && (
              <Image
                src={party.logoUrl}
                alt={`${party.name} logotip`}
                width={112}
                height={56}
                className="h-14 w-auto"
                priority={false}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{party.name}</h1>
              <p className="mt-1 text-lg text-slate-600">{party.abbreviation}</p>
            </div>
          </div>
          {party.leaderName && (
            <p className="mt-2 text-slate-600">
              Vodja: <span className="font-medium">{party.leaderName}</span>
            </p>
          )}
        </div>
      </header>

      {/* Osnovni podatki */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Osnovni podatki</h2>
        <dl className="grid gap-2 sm:grid-cols-2">
          {party.foundedYear != null && (
            <>
              <dt className="text-slate-500">Ustanovljena</dt>
              <dd>{party.foundedYear}</dd>
            </>
          )}
          {party.ideology && (
            <>
              <dt className="text-slate-500">Ideologija</dt>
              <dd>{party.ideology}</dd>
            </>
          )}
          {party.coalition && (
            <>
              <dt className="text-slate-500">Koalicija</dt>
              <dd>{party.coalition}</dd>
            </>
          )}
          {party.previousSeats != null && (
            <>
              <dt className="text-slate-500">Poslancev (zadnje volitve)</dt>
              <dd>{party.previousSeats}</dd>
            </>
          )}
          {party.website && (
            <>
              <dt className="text-slate-500">Spletna stran</dt>
              <dd>
                <a
                  href={party.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--slovenia-blue)] hover:underline"
                >
                  {party.website}
                </a>
              </dd>
            </>
          )}
          {party.programUrl && (
            <>
              <dt className="text-slate-500">Uradni program</dt>
              <dd>
                <a
                  href={party.programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--slovenia-blue)] hover:underline"
                >
                  Povezava do programa (PDF / splet)
                </a>
              </dd>
            </>
          )}
        </dl>
      </section>

      {/* Program stranke */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Program stranke</h2>
        {programSections.length > 0 ? (
          <div className="space-y-6">
            {programSections.map((section) => (
              <div key={section.id}>
                <h3 className="mb-2 font-medium text-slate-800">{section.sectionTitle}</h3>
                <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">
            [Program za to stranko še ni vnešen. Dodajte URL programa.]
          </p>
        )}
      </section>

      {/* Ključna stališča */}
      {keyStances.length > 0 && (
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Ključna stališča</h2>
          <ul className="space-y-2">
            {keyStances.map((s) => (
              <li key={s.policyId} className="flex items-start gap-2">
                <span
                  className={
                    s.value === true
                      ? "text-green-600"
                      : s.value === false
                        ? "text-red-600"
                        : "text-slate-400"
                  }
                >
                  {s.value === true ? "✓" : s.value === false ? "✗" : "?"}
                </span>
                <span className="text-slate-700">{s.question}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Volilni rezultati placeholder */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Volilni rezultati</h2>
        <p className="text-slate-500">
          Zgodovinski pregled volilnih rezultatov bo dodan, ko bodo podatki na voljo.
        </p>
      </section>
    </article>
  );
}
