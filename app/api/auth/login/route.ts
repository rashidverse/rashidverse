import { adminAuthIsConfigured, createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!adminAuthIsConfigured()) return Response.json({ error: "Admin login is not configured on this server." }, { status: 503 });
  try {
    const { email, password } = await request.json();
    if (!(await verifyAdminCredentials(email, password))) return Response.json({ error: "Incorrect email or password." }, { status: 401 });
    await createAdminSession();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
