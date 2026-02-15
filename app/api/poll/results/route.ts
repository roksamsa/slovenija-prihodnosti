import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        abbreviation: true,
        slug: true,
        color: true,
        leaderName: true,
        _count: { select: { pollVotes: true } },
      },
    });

    const totalVotes = parties.reduce((sum, p) => sum + p._count.pollVotes, 0);

    const items = parties.map((p) => ({
      id: p.id,
      percentage: totalVotes > 0 ? Math.round((p._count.pollVotes / totalVotes) * 1000) / 10 : 0,
      voteCount: p._count.pollVotes,
      party: {
        id: p.id,
        name: p.name,
        abbreviation: p.abbreviation,
        color: p.color,
        slug: p.slug,
        leaderName: p.leaderName,
      },
    }));

    // Sort by percentage descending for display
    items.sort((a, b) => b.percentage - a.percentage);

    return NextResponse.json({
      items,
      totalVotes,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
