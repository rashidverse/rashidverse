import { buildHomeDocument } from "@/lib/home-document";
import { getSectorBySlug } from "@/lib/sectors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  if (!getSectorBySlug(sector)) return new Response("Not found", { status: 404 });

  return new Response(await buildHomeDocument(sector), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
    },
  });
}
