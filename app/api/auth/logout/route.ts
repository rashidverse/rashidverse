import { deleteAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  await deleteAdminSession();
  return Response.json({ ok: true });
}
