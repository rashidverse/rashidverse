import { buildHomeDocument } from "@/lib/home-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const document = await buildHomeDocument();

  return new Response(document, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
    },
  });
}
