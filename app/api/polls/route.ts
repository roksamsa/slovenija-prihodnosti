import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const latest = await prisma.pollData.findFirst({
      orderBy: { pollDate: "desc" },
      select: { pollDate: true, pollSource: true },
    });
    const data = await prisma.pollData.findMany({
      where: latest ? { pollDate: latest.pollDate } : undefined,
      include: { party: { select: { id: true, name: true, abbreviation: true, color: true, slug: true, leaderName: true } } },
      orderBy: { percentage: "desc" },
    });
    return NextResponse.json({
      items: data,
      lastUpdate: latest?.pollDate ?? null,
      source: latest?.pollSource ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 });
  }
}
