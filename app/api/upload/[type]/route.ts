import { isContentType, saveUpload } from "@/lib/local-content";
import { requireAdminMutation } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const authError = await requireAdminMutation(request);
  if (authError) return authError;
  const { type } = await params;
  if (!isContentType(type)) return Response.json({ error: "Unknown upload type" }, { status: 404 });
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return Response.json({ error: "A file is required" }, { status: 400 });
    return Response.json(await saveUpload(type, file), { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}
