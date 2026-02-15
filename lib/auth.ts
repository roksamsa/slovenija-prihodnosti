import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "sp_admin";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SESSION_SECRET must be set and at least 16 chars");
  return s;
}

export function signAdminSession(): string {
  const payload = `${Date.now() + SESSION_MAX_AGE * 1000}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSession(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false;
    const exp = parseInt(payload, 10);
    return Number.isFinite(exp) && exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && verifyAdminSession(token);
}

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export function getAdminCookieMaxAge() {
  return SESSION_MAX_AGE;
}