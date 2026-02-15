import Link from "next/link";
import Image from "next/image";

type Party = {
  id: string;
  name: string;
  abbreviation: string;
  slug: string;
  color: string;
  logoUrl?: string | null;
  leaderName: string | null;
  pollPercentage?: number;
};

export function PartyCard({ party }: { party: Party }) {
  return (
    <Link
      href={`/stranke/${party.slug}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--slovenia-blue)] focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        {party.logoUrl ? (
          <Image
            src={party.logoUrl}
            alt={`${party.name} logotip`}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-1"
            priority={false}
          />
        ) : (
          <span
            className="h-12 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: party.color }}
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{party.name}</h3>
          <p className="text-sm text-slate-500">{party.abbreviation}</p>
          {party.leaderName && (
            <p className="mt-1 text-sm text-slate-600">Vodja: {party.leaderName}</p>
          )}
          {party.pollPercentage != null && (
            <p className="mt-2 text-lg font-semibold" style={{ color: party.color }}>
              {party.pollPercentage}% (glasovanje obiskovalcev)
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
