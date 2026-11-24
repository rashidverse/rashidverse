import "server-only";

import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "rashidverse_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

type AdminSession = { role: "admin"; exp: number };

function constantTimeEqual(first: string | Buffer, second: string | Buffer) {
  const firstValue = Buffer.isBuffer(first) ? first : Buffer.from(first);
  const secondValue = Buffer.isBuffer(second) ? second : Buffer.from(second);
  return firstValue.length === secondValue.length && timingSafeEqual(firstValue, secondValue);
}

function sessionSecret() {
  const secret = process.env.RASHIDVERSE_ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function sign(value: string) {
  const secret = sessionSecret();
  return secret ? createHmac("sha256", secret).update(value).digest("base64url") : null;
}

function readSession(token?: string): AdminSession | null {
  if (!token) return null;
  const [encodedPayload, signature, ...extra] = token.split(".");
  if (!encodedPayload || !signature || extra.length) return null;
  const expectedSignature = sign(encodedPayload);
  if (!expectedSignature || !constantTimeEqual(signature, expectedSignature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<AdminSession>;
    if (payload.role !== "admin" || typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;
    return { role: "admin", exp: payload.exp };
  } catch {
    return null;
  }
}

function verifyPassword(password: string) {
  const storedHash = process.env.RASHIDVERSE_ADMIN_PASSWORD_HASH;
  if (!storedHash) return false;
  // Dot-separated hashes avoid Next.js .env `$VARIABLE` expansion. The legacy
  // dollar-separated format remains readable for existing deployments.
  const separator = storedHash.startsWith("scrypt.") ? "." : "$";
  const [algorithm, encodedSalt, encodedHash, ...extra] = storedHash.split(separator);
  if (algorithm !== "scrypt" || !encodedSalt || !encodedHash || extra.length) return false;
  try {
    const expectedHash = Buffer.from(encodedHash, "base64url");
    if (expectedHash.length < 32) return false;
    const actualHash = scryptSync(password, Buffer.from(encodedSalt, "base64url"), expectedHash.length);
    return constantTimeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}

function configuredAdminEmail() {
  return String(process.env.RASHIDVERSE_ADMIN_EMAIL || "").trim().toLowerCase();
}

export function adminAuthIsConfigured() {
  return Boolean(configuredAdminEmail() && process.env.RASHIDVERSE_ADMIN_PASSWORD_HASH && sessionSecret());
}

export async function getAdminSession() {
  return readSession((await cookies()).get(COOKIE_NAME)?.value);
}

export async function requireAdminPage() {
  if (!(await getAdminSession())) redirect("/login");
}

export async function createAdminSession() {
  const exp = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const encodedPayload = Buffer.from(JSON.stringify({ role: "admin", exp } satisfies AdminSession)).toString("base64url");
  const signature = sign(encodedPayload);
  if (!signature) throw new Error("Admin login is not configured");
  (await cookies()).set(COOKIE_NAME, `${encodedPayload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function deleteAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function verifyAdminCredentials(email: unknown, password: unknown) {
  if (!adminAuthIsConfigured() || typeof email !== "string" || typeof password !== "string") return false;
  return constantTimeEqual(email.trim().toLowerCase(), configuredAdminEmail()) && verifyPassword(password);
}

/** Protect every server-side dashboard write, including direct API requests. */
export async function requireAdminMutation(request: Request) {
  if (!(await getAdminSession())) return Response.json({ error: "Admin login is required." }, { status: 401 });
  const origin = request.headers.get("origin");
  let originHost = "";
  try { originHost = origin ? new URL(origin).host : ""; } catch { originHost = ""; }
  // Apache reverse-proxy deployments commonly expose the public host through
  // X-Forwarded-Host while Next receives an internal localhost URL.
  const trustedHosts = [
    new URL(request.url).host,
    request.headers.get("host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
  ].filter(Boolean);
  if (!originHost || !trustedHosts.includes(originHost)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  return null;
}
