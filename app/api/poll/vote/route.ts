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

    const ip = getClientIp(request);

    // Hard block per IP regardless of token/browser/incognito
    const existingIpVote = await prisma.pollVote.findUnique({
      where: { ipAddress: ip },
      select: { id: true },
    });
    if (existingIpVote) {
      return NextResponse.json(
        { error: "already_voted", message: "Z vašega omrežja/IP je glas že oddan." },
        { status: 409 }
      );
    }

    // Token retained for traceability, but not used for uniqueness anymore
    const cookieStore = await cookies();
    const token = cookieStore.get(VOTER_COOKIE)?.value ?? "token-not-used";

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
