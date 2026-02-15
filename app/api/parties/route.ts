import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      orderBy: { name: "asc" },
      include: {
        pollData: {
          orderBy: { pollDate: "desc" },
          take: 1,
        },
      },
    });
    return NextResponse.json(parties);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 });
  }
}
