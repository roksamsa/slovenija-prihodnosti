import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PartyTemplate } from "@/components/parties/PartyTemplate";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function PartyDetailPage({ params }: Props) {
  const { slug } = await params;
  const party = await prisma.party.findUnique({
    where: { slug },
  });
  if (!party) notFound();

  const [programSections, stances] = await Promise.all([
    prisma.partyProgram.findMany({
      where: { partyId: party.id },
      orderBy: { orderIndex: "asc" },
    }),
    prisma.partyPolicyStance.findMany({
      where: { partyId: party.id },
      include: {
        policy: { select: { id: true, question: true } },
      },
    }),
  ]);

  // Key positions: take first 20 with known value (true/false)
  const keyStances = stances
    .filter((s) => s.value !== null)
    .slice(0, 20)
    .map((s) => ({
      policyId: s.policy.id,
      question: s.policy.question,
      value: s.value,
    }));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <PartyTemplate
        party={{
          id: party.id,
          name: party.name,
          abbreviation: party.abbreviation,
          slug: party.slug,
          color: party.color,
          logoUrl: party.logoUrl,
          website: party.website,
          programUrl: party.programUrl,
          description: party.description,
          foundedYear: party.foundedYear,
          leaderName: party.leaderName,
          ideology: party.ideology,
          coalition: party.coalition,
          previousSeats: party.previousSeats,
        }}
        programSections={programSections.map((s) => ({
          id: s.id,
          sectionTitle: s.sectionTitle,
          content: s.content,
          orderIndex: s.orderIndex,
        }))}
        keyStances={keyStances}
      />
    </div>
  );
}
