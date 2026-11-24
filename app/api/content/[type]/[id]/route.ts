import { deleteItem, isContentType, updateItem } from "@/lib/local-content";
import { requireAdminMutation } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const authError = await requireAdminMutation(request);
  if (authError) return authError;
  const { type, id } = await params;
  if (!isContentType(type)) return Response.json({ error: "Unknown content type" }, { status: 404 });
  const updated = await updateItem(type, id, await request.json());
  return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const authError = await requireAdminMutation(request);
  if (authError) return authError;
  const { type, id } = await params;
  if (!isContentType(type)) return Response.json({ error: "Unknown content type" }, { status: 404 });
  const removed = await deleteItem(type, id);
  return removed ? Response.json(removed) : Response.json({ error: "Not found" }, { status: 404 });
}
