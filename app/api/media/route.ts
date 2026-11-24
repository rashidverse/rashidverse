import { deleteMedia, listMedia, saveUpload } from "@/lib/local-content";
import { getAdminSession, requireAdminMutation } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdminSession())) return Response.json({ error: "Admin login is required." }, { status: 401 });
  return Response.json(await listMedia());
}

export async function POST(request: Request) {
  const authError = await requireAdminMutation(request);
  if (authError) return authError;
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return Response.json({ error: "A file is required" }, { status: 400 });
    return Response.json(await saveUpload("media", file), { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdminMutation(request);
  if (authError) return authError;
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return Response.json({ error: "Image URL is required" }, { status: 400 });
  const result = await deleteMedia(url);
  return result.deleted ? Response.json(result) : Response.json(result, { status: 400 });
}
