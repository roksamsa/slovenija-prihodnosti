import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();

  try {
    const policies = await prisma.policyComparison.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        stances: {
          include: { party: { select: { id: true, slug: true, abbreviation: true, name: true, color: true } } },
        },
      },
    });

    let filtered = policies;
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.question.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
      );
    }

    const parties = await prisma.party.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, abbreviation: true, name: true, color: true },
    });

    return NextResponse.json({
      policies: filtered,
      parties,
      categories: [...new Set(policies.map((p) => p.category))].sort(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch comparison data" }, { status: 500 });
  }
}
