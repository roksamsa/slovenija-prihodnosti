import { prisma } from "@/lib/db";
import { PartyCard } from "@/components/parties/PartyCard";

export const dynamic = "force-dynamic";

async function getPartiesWithPoll() {
  const parties = await prisma.party.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      abbreviation: true,
      slug: true,
      color: true,
      logoUrl: true,
      leaderName: true,
      _count: { select: { pollVotes: true } },
    },
  });
  const totalVotes = parties.reduce((sum, p) => sum + p._count.pollVotes, 0);
  const withPercentage = parties.map((p) => ({
    id: p.id,
    name: p.name,
    abbreviation: p.abbreviation,
    slug: p.slug,
    color: p.color,
    logoUrl: p.logoUrl,
    leaderName: p.leaderName,
    pollPercentage:
      totalVotes > 0
        ? Math.round((p._count.pollVotes / totalVotes) * 1000) / 10
        : undefined,
  }));
  return withPercentage;
}

export default async function StrankePage() {
  const parties = await getPartiesWithPoll();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Stranke</h1>
      <p className="mb-8 text-slate-600">
        Seznam vseh strank, ki nastopajo na državnozborskih volitvah 2026, urejen po abecedi.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parties.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
    </div>
  );
}
