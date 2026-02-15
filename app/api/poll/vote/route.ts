import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const VOTER_COOKIE = "sp_voter";

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const partySlug = typeof body?.partySlug === "string" ? body.partySlug.trim() : null;
    if (!partySlug) {
      return NextResponse.json({ error: "partySlug is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(VOTER_COOKIE)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Cookie missing. Please refresh the page and try again." },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);

    const party = await prisma.party.findUnique({
      where: { slug: partySlug },
      select: { id: true },
    });
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    try {
      await prisma.pollVote.create({
        data: {
          partyId: party.id,
          ipAddress: ip,
          voterToken: token,
        },
      });
    } catch (e: unknown) {
      const isUniqueViolation =
        e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002";
      if (isUniqueViolation) {
        return NextResponse.json(
          { error: "already_voted", message: "Iz te naprave ste že glasovali." },
          { status: 409 }
        );
      }
      throw e;
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}
