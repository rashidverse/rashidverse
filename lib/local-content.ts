import "server-only";

import { access, mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DEFAULT_MAIN_SKILL_CATEGORY, cleanTaxonomyLabel, isMainSkillCategory, normalizeTaxonomyLabel } from "./project-taxonomy";
import { PORTFOLIO_SECTORS, normalizeSectorIds, sectorFromText } from "./sectors";

export const contentTypes = ["portfolio", "experience", "experiencesettings", "hero", "about", "facts", "video", "process", "skills", "skillgroups", "featured", "testimonials", "testimonialsettings", "clientlogos", "cta", "footer", "header", "sectorprofiles", "globalsettings", "repeaterhero", "customplugins", "pluginitems"] as const;
export type ContentType = (typeof contentTypes)[number];

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "content.json");
export type ContentStore = Record<ContentType, Array<Record<string, unknown>>>;
type Store = ContentStore;
const emptyStore = (): Store => ({ portfolio: [], experience: [], experiencesettings: [], hero: [], about: [], facts: [], video: [], process: [], skills: [], skillgroups: [], featured: [], testimonials: [], testimonialsettings: [], clientlogos: [], cta: [], footer: [], header: [], sectorprofiles: [], globalsettings: [], repeaterhero: [], customplugins: [], pluginitems: [] });

const profileHeroOverlayDefaults = {
  mode: "solid",
  color: "#000000",
  opacity: 40,
  startColor: "#000000",
  startOpacity: 72,
  endColor: "#000000",
  endOpacity: 20,
  direction: "left",
};

function validOverlayColor(value: unknown, fallback: string) {
  const color = String(value ?? "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function overlayOpacity(value: unknown, fallback: number) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.max(0, Math.min(100, amount)) : fallback;
}

function normalizeProfileHeroOverlay(value: unknown) {
  const overlay = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    mode: overlay.mode === "gradient" ? "gradient" : "solid",
    color: validOverlayColor(overlay.color, profileHeroOverlayDefaults.color),
    opacity: overlayOpacity(overlay.opacity, profileHeroOverlayDefaults.opacity),
    startColor: validOverlayColor(overlay.startColor, profileHeroOverlayDefaults.startColor),
    startOpacity: overlayOpacity(overlay.startOpacity, profileHeroOverlayDefaults.startOpacity),
    endColor: validOverlayColor(overlay.endColor, profileHeroOverlayDefaults.endColor),
    endOpacity: overlayOpacity(overlay.endOpacity, profileHeroOverlayDefaults.endOpacity),
    direction: ["left", "right", "center"].includes(String(overlay.direction)) ? String(overlay.direction) : profileHeroOverlayDefaults.direction,
  };
}

export function isContentType(value: string): value is ContentType {
  return contentTypes.includes(value as ContentType);
}

async function readStore(): Promise<Store> {
  try {
    const content = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(content) as Partial<Store>;
    return { portfolio: parsed.portfolio ?? [], experience: parsed.experience ?? [], experiencesettings: parsed.experiencesettings ?? [], hero: parsed.hero ?? [], about: parsed.about ?? [], facts: parsed.facts ?? [], video: parsed.video ?? [], process: parsed.process ?? [], skills: parsed.skills ?? [], skillgroups: parsed.skillgroups ?? [], featured: parsed.featured ?? [], testimonials: parsed.testimonials ?? [], testimonialsettings: parsed.testimonialsettings ?? [], clientlogos: parsed.clientlogos ?? [], cta: parsed.cta ?? [], footer: parsed.footer ?? [], header: parsed.header ?? [], sectorprofiles: parsed.sectorprofiles ?? [], globalsettings: parsed.globalsettings ?? [], repeaterhero: parsed.repeaterhero ?? [], customplugins: parsed.customplugins ?? [], pluginitems: parsed.pluginitems ?? [] };
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await writeStore(emptyStore());
    return emptyStore();
  }
}

async function writeStore(store: Store) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

export async function listItems(type: ContentType) {
  const store = await ensureSectorProfiles(await readStore());
  return store[type].sort((first, second) => Number(first.order ?? 0) - Number(second.order ?? 0));
}

/**
 * Read every dashboard-managed collection in one pass. The home document uses
 * this server-side snapshot so it never needs to wait for separate API calls
 * before showing the saved website content.
 */
export async function getInitialContent(): Promise<ContentStore> {
  const store = await ensureSectorProfiles(await readStore());
  return contentTypes.reduce((snapshot, type) => {
    snapshot[type] = [...store[type]].sort((first, second) => Number(first.order ?? 0) - Number(second.order ?? 0));
    return snapshot;
  }, emptyStore());
}

async function ensureSectorProfiles(store: Store) {
  let changed = false;
  for (const profile of PORTFOLIO_SECTORS) {
    if (store.sectorprofiles.some((item) => item.id === profile.id || item.slug === profile.slug)) continue;
    store.sectorprofiles.push({ ...profile, order: store.sectorprofiles.length, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    changed = true;
  }
  // Each focused portfolio profile has its own Hero overlay. This keeps a
  // profile homepage (for example /wordpress) independent from the main Hero.
  for (const profile of store.sectorprofiles) {
    const normalizedOverlay = normalizeProfileHeroOverlay(profile.heroOverlay);
    if (JSON.stringify(profile.heroOverlay) === JSON.stringify(normalizedOverlay)) continue;
    profile.heroOverlay = normalizedOverlay;
    changed = true;
  }
  // One-time, non-destructive migration for experiences created before their
  // individual View Work and image-link controls existed.
  for (const experience of store.experience) {
    const defaults: Record<string, unknown> = {
      buttonText: "View Work +",
      buttonLink: "",
      buttonTarget: "new",
      imageLink: "",
      imageLinkTarget: "same",
    };
    for (const [key, value] of Object.entries(defaults)) {
      if (Object.prototype.hasOwnProperty.call(experience, key)) continue;
      experience[key] = value;
      changed = true;
    }
  }
  if (store.experiencesettings.length === 0) {
    store.experiencesettings.push({
      id: "work-experience-title",
      sectionLabel: "My Resume",
      eyebrow: "Some Words About Me",
      heading: "My Awesome [highlight]Story[/highlight]",
      description: "We started as a small, subdue, called hath give fourth. Them one over saying. So the god, greater. You. Us air Moved divide midst us fifth sea.",
      buttonText: "Download Resume",
      buttonLink: "#",
      buttonTarget: "same",
      sectors: [],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  // The Repeater Builder landing page starts with one Hero record. Future
  // sections for that page can use their own dedicated collections as well.
  if (store.repeaterhero.length === 0) {
    store.repeaterhero.push({
      id: "repeater-builder-hero",
      badgePrefix: "ACF & SCF Supported",
      badgeHighlight: "Repeater",
      badgeSuffix: "for Elementor",
      titlePrefix: "Build Dynamic Repeater",
      titleHighlight: "Layouts",
      titleSuffix: "in Elementor",
      description: "Visually build, style and manage ACF & SCF Repeater fields with real-time preview. No code, No restriction. Total design freedom.",
      primaryButtonText: "Get Repeater Builder",
      primaryButtonLink: "#pricing",
      primaryButtonTarget: "same",
      secondaryButtonText: "See How It Works",
      secondaryButtonLink: "#how",
      secondaryButtonTarget: "same",
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  // The WordPress folder drawer has one shared title block. Keeping it in its
  // own singleton collection makes the public drawer editable from Admin
  // without mixing it with the actual plugin cards that will be added later.
  if (store.customplugins.length === 0) {
    store.customplugins.push({
      id: "wordpress-custom-plugins-settings",
      heading: "My WordPress Plugins & Extensions",
      description: "A curated collection of custom WordPress plugins, practical add-ons, and extensions I build to improve real project workflows.",
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  if (store.globalsettings.length === 0) {
    store.globalsettings.push({
      id: "global-profile-settings",
      fullName: "Abdul Rashid",
      designation: "WordPress Designer & Developer",
      email: "rashedverse@gmail.com",
      phone: "+880 1720 498825",
      whatsapp: "8801720498825",
      upwork: "https://www.upwork.com/freelancers/~01ceb5756abe039b7a",
      linkedin: "https://www.linkedin.com/in/iamabdulrashid/",
      github: "https://github.com/rashidverse",
      socialLinks: [
        { platform: "upwork", label: "Upwork Profile", url: "https://www.upwork.com/freelancers/~01ceb5756abe039b7a", visible: true, order: 0 },
        { platform: "linkedin", label: "LinkedIn Profile", url: "https://www.linkedin.com/in/iamabdulrashid/", visible: true, order: 1 },
        { platform: "github", label: "GitHub", url: "https://github.com/rashidverse", visible: true, order: 2 },
      ],
      profileImage: "/rashidverse-site/images/contact-drawer-profile.png",
      footer: "Rashidverse. All rights reserved.",
      resumes: [
        { profile: "wordpress", label: "WordPress Resume", url: "/rashidverse-site/Abdul_Rashid_WordPress.pdf", target: "new" },
        { profile: "motion", label: "Motion & Video Resume", url: "", target: "new" },
        { profile: "multimedia", label: "Multimedia Resume", url: "", target: "new" },
      ],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  // Move legacy individual social fields into one shared list. The list is
  // consumed by the sidebar, footer and contact drawer, so an edit applies
  // throughout the entire website.
  for (const settings of store.globalsettings) {
    if (Array.isArray(settings.socialLinks)) continue;
    settings.socialLinks = [
      { platform: "upwork", label: "Upwork Profile", url: String(settings.upwork ?? ""), visible: true, order: 0 },
      { platform: "linkedin", label: "LinkedIn Profile", url: String(settings.linkedin ?? ""), visible: true, order: 1 },
      { platform: "github", label: "GitHub", url: String(settings.github ?? ""), visible: true, order: 2 },
    ].filter((social) => social.url);
    changed = true;
  }
  if (store.footer.length === 0) {
    store.footer.push({
      id: "site-footer-settings",
      siteName: "Rashidverse",
      aboutHeading: "About Me",
      aboutText: "I create thoughtful digital work across WordPress design, motion graphics, video editing, and multimedia design.",
      portfolioButtonText: "My Portfolio",
      portfolioButtonLink: "/portfolio/",
      portfolioButtonTarget: "same",
      contactHeading: "Subscribe / Contacts",
      contactText: "Want to work together or receive an update? Send me a message and I will get back to you.",
      subscribeEnabled: true,
      subscribePlaceholder: "Email address",
      subscribeButtonText: "Send",
      phone: "+880 1720 498825",
      email: "rashedverse@gmail.com",
      address: "Bangladesh",
      socials: [
        { platform: "facebook", label: "Facebook", url: "" },
        { platform: "instagram", label: "Instagram", url: "" },
        { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/iamabdulrashid/" },
        { platform: "youtube", label: "YouTube", url: "" },
      ],
      copyright: "Rashidverse. All rights reserved.",
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  if (changed) await writeStore(store);
  return store;
}

export async function createItem(type: ContentType, values: Record<string, unknown>) {
  const store = await readStore();
  if ((type === "experiencesettings" || type === "globalsettings" || type === "footer" || type === "repeaterhero" || type === "customplugins") && store[type].length) throw new Error(`Only one ${type} item is allowed.`);
  const item = { ...normalizeValues(type, values, store[type]), id: randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store[type].push(item);
  await writeStore(store);
  return item;
}

export async function updateItem(type: ContentType, id: string, values: Record<string, unknown>) {
  const store = await readStore();
  const index = store[type].findIndex((item) => item.id === id);
  if (index === -1) return null;
  store[type][index] = { ...store[type][index], ...normalizeValues(type, values, store[type].filter((item) => item.id !== id)), id, updatedAt: new Date().toISOString() };
  await writeStore(store);
  return store[type][index];
}

function normalizeValues(type: ContentType, values: Record<string, unknown>, siblings: Array<Record<string, unknown>>) {
  if (type === "sectorprofiles") return { ...values, heroOverlay: normalizeProfileHeroOverlay(values.heroOverlay) };
  if (type === "repeaterhero" || type === "customplugins") return { ...values, order: 0 };
  if (type !== "portfolio") return { ...values, sectors: normalizeSectorIds(values.sectors) };

  const hasExplicitSectorChoice = Object.prototype.hasOwnProperty.call(values, "sectors");
  const selectedSectors = normalizeSectorIds(values.sectors);
  const legacyCategory = cleanTaxonomyLabel(values.category);
  const mainCategory = isMainSkillCategory(values.mainCategory)
    ? values.mainCategory
    : DEFAULT_MAIN_SKILL_CATEGORY;
  const proposedSubcategory = cleanTaxonomyLabel(values.subcategory || (legacyCategory && !isMainSkillCategory(legacyCategory) ? legacyCategory : ""));
  const matchingExisting = siblings.find((item) =>
    (isMainSkillCategory(item.mainCategory) ? item.mainCategory : DEFAULT_MAIN_SKILL_CATEGORY) === mainCategory
    && normalizeTaxonomyLabel(item.subcategory) === normalizeTaxonomyLabel(proposedSubcategory),
  );
  const subcategory = proposedSubcategory && matchingExisting
    ? cleanTaxonomyLabel(matchingExisting.subcategory)
    : proposedSubcategory;

  return {
    ...values,
    mainCategory,
    subcategory,
    // Keep this legacy field in sync for older portfolio code and data exports.
    category: mainCategory,
    featured: values.featured === true,
    featuredOrder: Math.max(0, Number(values.featuredOrder) || 0),
    published: values.published !== false,
    // An empty array is an intentional "All profiles" choice. Only legacy
    // records with no sector field at all are inferred from their category.
    sectors: hasExplicitSectorChoice ? selectedSectors : [sectorFromText(mainCategory)].filter(Boolean),
  };
}

export async function deleteItem(type: ContentType, id: string) {
  const store = await readStore();
  const item = store[type].find((entry) => entry.id === id);
  if (!item) return null;
  store[type] = store[type].filter((entry) => entry.id !== id);
  await writeStore(store);
  const filesToRemove = [item.thumbPath, item.hoverPath, item.imagePath]
    .filter((value): value is string => typeof value === "string")
    .filter((file) => ![...store.portfolio, ...store.experience, ...store.hero, ...store.about, ...store.facts, ...store.video, ...store.process, ...store.skills, ...store.skillgroups, ...store.featured, ...store.testimonials, ...store.testimonialsettings, ...store.clientlogos, ...store.cta, ...store.header].some((entry) => [entry.thumbPath, entry.hoverPath, entry.imagePath, entry.avatarPath].includes(file)));
  await Promise.all(filesToRemove.map(removeLocalFile));
  return item;
}

export async function saveUpload(type: ContentType | "media", file: File) {
  const isResumeFile = type === "globalsettings" && (file.type === "application/pdf" || /\.pdf$/i.test(file.name));
  const isMediaAttachment = type === "media" && /\.(zip|pdf|docx?|xlsx?|pptx?|rar)$/i.test(file.name);
  if (!file.type.startsWith("image/") && !isResumeFile && !isMediaAttachment) throw new Error("Only image files, PDF resumes, and supported downloadable files (ZIP, PDF, DOCX, XLSX, PPTX, RAR) are allowed.");
  if (file.size > 25 * 1024 * 1024) throw new Error("File must be smaller than 25 MB.");
  const extension = path.extname(file.name).replace(/[^.a-z0-9]/gi, "") || ".jpg";
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", type);
  await mkdir(uploadDirectory, { recursive: true });
  const filename = type === "media" ? await unusedMediaFilename(file.name, extension, uploadDirectory) : `${Date.now()}-${randomUUID()}${extension}`;
  const relativePath = `/uploads/${type}/${filename}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));
  return { url: relativePath, path: relativePath };
}

async function unusedMediaFilename(originalName: string, extension: string, directory: string) {
  const rawName = path.basename(originalName, path.extname(originalName)).replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim() || "image";
  let candidate = `${rawName}${extension.toLowerCase()}`;
  let suffix = 2;
  while (true) {
    try { await access(path.join(directory, candidate)); candidate = `${rawName} (${suffix})${extension.toLowerCase()}`; suffix += 1; } catch { return candidate; }
  }
}

export async function listMedia() {
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  try {
    const files = await readdir(uploadsRoot, { recursive: true });
    return files
      .filter((file) => /\.(avif|gif|jpe?g|png|svg|webp|zip|pdf|docx?|xlsx?|pptx?|rar)$/i.test(file))
      .map((file) => {
        const url = `/uploads/${file.replace(/\\/g, "/")}`;
        return { name: path.basename(file), url, kind: /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file) ? "image" : "file" };
      })
      .sort((first, second) => second.name.localeCompare(first.name));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function deleteMedia(url: string) {
  if (!url.startsWith("/uploads/")) return { deleted: false, reason: "Invalid media path" };
  const store = await readStore();
  const isInUse = [...store.portfolio, ...store.experience, ...store.hero, ...store.about, ...store.facts, ...store.video, ...store.process, ...store.skills, ...store.skillgroups, ...store.featured, ...store.testimonials, ...store.testimonialsettings, ...store.pluginitems].some((item) =>
    [item.thumb, item.hoverImg, item.image, item.avatar, item.customIcon, item.downloadFile].includes(url) || (Array.isArray(item.features) && item.features.some((feature) => typeof feature === "object" && feature !== null && (feature as Record<string, unknown>).customIcon === url)),
  );
  if (isInUse) return { deleted: false, reason: "This image is still used by website content" };
  await removeLocalFile(url);
  return { deleted: true };
}

async function removeLocalFile(relativePath: string) {
  if (!relativePath.startsWith("/uploads/")) return;
  try { await unlink(path.join(process.cwd(), "public", relativePath)); } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
