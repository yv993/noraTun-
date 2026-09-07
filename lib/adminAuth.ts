import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

// ADMIN AUTHENTICATION — one password, one cookie, no dependencies.
//
// The threat model is honest about what this is: a brochure site whose admin
// edits marketing copy and a status flag. There is no per-user identity to
// protect and nothing here is a secret worth a session store. What it must do
// is refuse everyone without the password, resist a guessing attack, and not
// leak the password to the browser.
//
// NOT a bearer of the password: the cookie carries an HMAC of a fixed string
// keyed by the password, so possessing the cookie does not reveal it, and
// changing ADMIN_PASSWORD invalidates every existing session at once.
//
// UNSET means CLOSED. With no ADMIN_PASSWORD the admin refuses everything
// rather than defaulting to open — the failure mode of a missing env var must
// be "nobody gets in", never "everybody does".

const COOKIE = "noratun_admin";
const CLAIM = "noratun-admin-v1";

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD?.trim();

const tokenFor = (password: string) =>
  createHmac("sha256", password).update(CLAIM).digest("hex");

/** Constant-time compare that cannot throw on a length mismatch — a bare
 *  timingSafeEqual does, and the throw itself is a timing signal. */
const sameSecret = (a: string, b: string) => {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
};

export function checkPassword(candidate: string): boolean {
  const real = process.env.ADMIN_PASSWORD?.trim();
  if (!real) return false;
  return sameSecret(candidate, real);
}

export async function isSignedIn(): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD?.trim();
  if (!real) return false;
  const jar = await cookies();
  const got = jar.get(COOKIE)?.value;
  if (!got) return false;
  return sameSecret(got, tokenFor(real));
}

export async function signIn(password: string): Promise<boolean> {
  if (!checkPassword(password)) return false;
  const jar = await cookies();
  jar.set(COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    // Vercel terminates TLS, so secure is right in production and would break
    // sign-in over plain http on localhost
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
