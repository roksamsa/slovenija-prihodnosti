import { prisma } from "@/lib/db";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";

export const dynamic = "force-dynamic";

async function getData() {
  const [policies, parties] = await Promise.all([
    prisma.policyComparison.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        stances: {
          include: {
            party: {
              select: { id: true, slug: true, abbreviation: true, name: true, color: true },
            },
          },
        },
      },
    }),
    prisma.party.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, abbreviation: true, name: true, color: true, programUrl: true },
    }),
  ]);
  const categories = [...new Set(policies.map((p) => p.category))].sort();
  return { policies, parties, categories };
}

export default async function PrimerjavaPage() {
  const { policies, parties, categories } = await getData();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Primerjava strank
      </h1>
      <p className="mb-8 text-slate-600">
        Primerjajte stališča strank do izbranih izjav. Prvi stolpec (izjava) je pritrjen ob vodoravnem pomiku.
      </p>
      <ComparisonTable policies={policies} parties={parties} categories={categories} />
    </div>
  );
}
