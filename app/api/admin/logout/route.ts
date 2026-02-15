import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminCookieName());
  const url = new URL(request.url);
  const origin = url.origin;
  return NextResponse.redirect(`${origin}/admin/login`);
}
