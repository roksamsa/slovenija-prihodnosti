import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAdminSession, getAdminCookieName, getAdminCookieMaxAge } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      console.error("ADMIN_PASSWORD is not set");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (password !== expected) {
      return NextResponse.json({ error: "Napačno geslo" }, { status: 401 });
    }

    const token = signAdminSession();
    const cookieStore = await cookies();
    cookieStore.set(getAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getAdminCookieMaxAge(),
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
