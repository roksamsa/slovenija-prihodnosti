import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const VOTER_COOKIE = "sp_voter";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get(VOTER_COOKIE)?.value;
    const ip = getClientIp(request);

    if (!token) {
      token = crypto.randomUUID();
      cookieStore.set(VOTER_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }

    const vote = await prisma.pollVote.findFirst({
      where: { ipAddress: ip },
      include: {
        party: { select: { slug: true, name: true, color: true } },
      },
    });

    return NextResponse.json({
      hasVoted: !!vote,
      votedPartySlug: vote?.party.slug ?? null,
      votedPartyName: vote?.party.name ?? null,
      votedPartyColor: vote?.party.color ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get vote status" }, { status: 500 });
  }
}
