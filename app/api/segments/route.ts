import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const segments = await prisma.nationalSegment.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        needs: { orderBy: { orderIndex: "asc" } },
      },
    });
    return NextResponse.json(segments);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch segments" }, { status: 500 });
  }
}
