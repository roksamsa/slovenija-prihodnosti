import { prisma } from "@/lib/db";
import { SegmentSection } from "@/components/segments/SegmentSection";
import { SuggestionFormModal } from "@/components/suggestions/SuggestionFormModal";

export const dynamic = "force-dynamic";

async function getSegments() {
  return prisma.nationalSegment.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      needs: { orderBy: { orderIndex: "asc" } },
    },
  });
}

async function getApprovedSuggestions() {
  return prisma.needSuggestion.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      segment: { select: { id: true, name: true, slug: true } },
    },
  });
}

export default async function KajPotrebujemoPage() {
  const [segments, suggestions] = await Promise.all([
    getSegments(),
    getApprovedSuggestions(),
  ]);

  const suggestionsBySegmentId = suggestions.reduce<Record<string, typeof suggestions>>(
    (acc, s) => {
      const id = s.segmentId;
      if (!acc[id]) acc[id] = [];
      acc[id].push(s);
      return acc;
    },
    {}
  );

  const segmentOptions = segments.map((s) => ({ id: s.id, name: s.name, slug: s.slug }));

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Kaj potrebujemo</h1>
        <p className="mb-8 text-slate-600">
          Slovenija za napredek potrebuje spremembe v številnih segmentih. Spodaj so kategorije s predlogi in potrebami.
          Lahko tudi dodate lasten predlog.
        </p>

        <section className="mb-10">
          <SuggestionFormModal segments={segmentOptions} />
        </section>
      </div>

      {segments.map((segment, index) => (
        <SegmentSection
          key={segment.id}
          segment={segment}
          index={index}
          suggestions={suggestionsBySegmentId[segment.id] ?? []}
        />
      ))}
    </>
  );
}
