import { createItem, isContentType, listItems } from "@/lib/local-content";
import { filterItemsForSector, getSectorBySlug } from "@/lib/sectors";
import { requireAdminMutation } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isContentType(type)) return Response.json({ error: "Unknown content type" }, { status: 404 });
  const sector = new URL(request.url).searchParams.get("sector");
  const sectorProfile = sector ? getSectorBySlug(sector) : null;
  if (sector && !sectorProfile) return Response.json({ error: "Unknown sector" }, { status: 404 });
  const items = await listItems(type);
  return Response.json(sectorProfile ? filterItemsForSector(type, items, sectorProfile.id) : items);
}

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const authError = await requireAdminMutation(request);
  if (authError) return authError;
  const { type } = await params;
  if (!isContentType(type)) return Response.json({ error: "Unknown content type" }, { status: 404 });
  if ((type === "experiencesettings" || type === "globalsettings" || type === "footer" || type === "repeaterhero" || type === "customplugins") && (await listItems(type)).length) {
    return Response.json({ error: "Only one settings record is allowed. Edit the existing settings instead." }, { status: 409 });
  }
  return Response.json(await createItem(type, await request.json()), { status: 201 });
}
