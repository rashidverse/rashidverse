import { notFound } from "next/navigation";

import PortfolioPage from "@/app/portfolio/page";
import { getInitialContent } from "@/lib/local-content";
import { getSectorBySlug } from "@/lib/sectors";

export const dynamic = "force-dynamic";

export default async function SectorPortfolioPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector: slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) notFound();

  const content = await getInitialContent();
  const savedProfile = content.sectorprofiles.find((profile) => profile.id === sector.id || profile.slug === sector.slug);
  const profile = { ...sector, ...(savedProfile || {}) };

  return <PortfolioPage sector={sector.id} profile={profile} />;
}
