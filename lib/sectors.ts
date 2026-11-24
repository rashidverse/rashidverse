export const PORTFOLIO_SECTORS = [
  {
    id: "wordpress",
    slug: "wordpress",
    label: "WordPress",
    name: "WordPress Portfolio",
    title: "WordPress Designer & Developer",
    description: "Selected WordPress design and development work.",
  },
  {
    id: "motion",
    slug: "motion",
    label: "Motion & Video",
    name: "Motion Graphics & Video Editing",
    title: "Motion Graphics & Video Editor",
    description: "Selected motion graphics and video editing work.",
  },
  {
    id: "multimedia",
    slug: "multimedia",
    label: "Multimedia",
    name: "Multimedia Design",
    title: "Multimedia Designer",
    description: "Selected multimedia design work.",
  },
] as const;

export type SectorId = (typeof PORTFOLIO_SECTORS)[number]["id"];

export const SINGLETON_SECTOR_CONTENT = new Set([
  "experiencesettings",
  "about",
  "facts",
  "video",
  "process",
  "skills",
  "featured",
  "testimonialsettings",
  "cta",
]);

export function isSectorId(value: unknown): value is SectorId {
  return PORTFOLIO_SECTORS.some((sector) => sector.id === value);
}

export function normalizeSectorIds(value: unknown): SectorId[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return [...new Set(values.filter(isSectorId))];
}

export function sectorFromText(value: unknown): SectorId | null {
  const label = String(value ?? "").toLocaleLowerCase();
  if (label.includes("wordpress") || label.includes("elementor") || label.includes("wpbakery") || label.includes("divi")) return "wordpress";
  if (label.includes("motion") || label.includes("video") || label.includes("premiere") || label.includes("after effects")) return "motion";
  if (label.includes("multimedia")) return "multimedia";
  return null;
}

export function itemSectorIds(type: string, item: Record<string, unknown>): SectorId[] {
  const selected = normalizeSectorIds(item.sectors);
  if (selected.length) return selected;

  // Existing portfolio and skill data predates the sector field. Infer its
  // first placement from the current category/title so nothing disappears.
  if (type === "portfolio") return [sectorFromText(item.mainCategory || item.category)].filter(Boolean) as SectorId[];
  if (type === "skillgroups") return [sectorFromText(item.title)].filter(Boolean) as SectorId[];
  if (type === "hero") return [sectorFromText(`${item.title || ""} ${item.categoryOne || ""} ${item.categoryTwo || ""}`)].filter(Boolean) as SectorId[];
  return [];
}

export function filterItemsForSector(type: string, items: Array<Record<string, unknown>>, sector: SectorId) {
  const explicitlyScoped = items.filter((item) => itemSectorIds(type, item).includes(sector));
  const unscoped = items.filter((item) => itemSectorIds(type, item).length === 0);

  // A section such as About has one active version. A sector-specific record
  // overrides its general version; without one, the general version is used.
  if (SINGLETON_SECTOR_CONTENT.has(type)) return explicitlyScoped.length ? explicitlyScoped : unscoped;

  // Collections can safely combine items shared by every profile with items
  // assigned specifically to the selected profile.
  return [...unscoped, ...explicitlyScoped];
}

export function getSectorBySlug(slug: string) {
  return PORTFOLIO_SECTORS.find((sector) => sector.slug === slug) ?? null;
}
