import { readFile } from "node:fs/promises";
import path from "node:path";

import { contentTypes, getInitialContent, type ContentStore } from "@/lib/local-content";
import { filterItemsForSector, getSectorBySlug, type SectorId } from "@/lib/sectors";

const templatePath = path.join(process.cwd(), "public", "rashidverse-site", "index.html");
const publicSiteUrl = "https://rashidverse.me";
const defaultShareImage = `${publicSiteUrl}/og/wordpress-profile.png`;
// Google Analytics measurement IDs are public by design. A fallback keeps the
// tracking tag active for the raw HTML routes that power the home and profile
// pages even when a process manager does not forward `.env.local` values.
const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-VN820786WV";

type ShareMetadata = {
  title: string;
  description: string;
  url: string;
  image: string;
};

function escapeAttribute(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] || character);
}

function shareMetadataFor(sector: ReturnType<typeof getSectorBySlug> | null): ShareMetadata {
  if (sector?.id === "wordpress") {
    return {
      title: "Abdul Rashid | WordPress Security Specialist & Developer",
      description: "Abdul Rashid is a WordPress Security Specialist, Designer, Developer, and Plugin Developer providing WordPress security, custom development, performance optimization, and technical solutions.",
      url: `${publicSiteUrl}/wordpress/`,
      image: defaultShareImage,
    };
  }

  if (!sector) {
    return {
      title: "Abdul Rashid | WordPress Developer & Digital Creative",
      description: "I’m a WordPress Designer & Developer with 6+ years of remote experience, working with businesses and agencies across Canada, Ireland, the USA, and global markets. I create responsive websites, eCommerce solutions, custom functionality, and visually polished digital experiences.",
      url: `${publicSiteUrl}/`,
      image: defaultShareImage,
    };
  }

  return {
    title: `Abdul Rashid | ${sector.title}`,
    description: sector.description,
    url: `${publicSiteUrl}/${sector.slug}/`,
    image: defaultShareImage,
  };
}

function renderShareMetadata(metadata: ShareMetadata) {
  const title = escapeAttribute(metadata.title);
  const description = escapeAttribute(metadata.description);
  const url = escapeAttribute(metadata.url);
  const image = escapeAttribute(metadata.image);
  return `<link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="Rashidverse"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:secure_url" content="${image}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}">`;
}

function renderGoogleAnalyticsTag() {
  const measurementId = escapeAttribute(googleAnalyticsId);
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}');</script>`;
}

function serialiseForInlineScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function contentForSector(content: ContentStore, sector: SectorId): ContentStore {
  return contentTypes.reduce((filtered, type) => {
    const items = type === "sectorprofiles"
      ? content[type]
      : filterItemsForSector(type, content[type], sector);
    const portfolioUrl = `/${sector}/portfolio/`;
    filtered[type] = items.map((item) => {
      const copy = { ...item };
      const rewritePortfolioLink = (value: unknown) => {
        const link = String(value || "").trim().toLowerCase();
        return link === "portfolio.html" || link === "/portfolio" || link === "/portfolio/" ? portfolioUrl : value;
      };
      if (type === "hero") copy.link = rewritePortfolioLink(copy.link);
      if (type === "about" || type === "featured") copy.buttonLink = rewritePortfolioLink(copy.buttonLink);
      if (type === "footer") copy.portfolioButtonLink = rewritePortfolioLink(copy.portfolioButtonLink);
      if (type === "header" && Array.isArray(copy.menuItems)) {
        copy.menuItems = copy.menuItems.map((menuItem) => ({ ...menuItem, link: rewritePortfolioLink(menuItem.link) }));
      }
      return copy;
    });
    return filtered;
  }, {} as ContentStore);
}

export async function buildHomeDocument(sectorSlug?: string) {
  const [template, fullContent] = await Promise.all([
    readFile(templatePath, "utf8"),
    getInitialContent(),
  ]);
  const baseSector = sectorSlug ? getSectorBySlug(sectorSlug) : null;
  const savedProfile = baseSector
    ? fullContent.sectorprofiles.find((profile) => profile.id === baseSector.id || profile.slug === baseSector.slug)
    : null;
  const sector = baseSector ? { ...baseSector, ...(savedProfile || {}) } : null;
  const content = sector ? contentForSector(fullContent, sector.id) : fullContent;
  if (sector?.id === "wordpress" && savedProfile) {
    if (Array.isArray(savedProfile.heroSlides) && savedProfile.heroSlides.length) {
      content.hero = savedProfile.heroSlides.map((slide) => ({ ...content.hero[0], ...slide, description: "", categoryTwo: "" }));
    } else if (savedProfile.heroTitle) content.hero = content.hero.slice(0, 1).map(item => ({ ...item, title: savedProfile.heroTitle, description: savedProfile.heroDescription, categoryOne: savedProfile.heroLabel, categoryTwo: "", link: "https://wa.me/8801720498825", profileLink: "#sec2", buttonText: "Secure My Website" }));
    if (savedProfile.footerBio) content.footer = content.footer.map(item => ({ ...item, aboutText: savedProfile.footerBio, contactHeading: "Let's Talk", subscribeEnabled: false }));
    content.globalsettings = content.globalsettings.map(item => ({ ...item, designation: sector.title }));
    const securityGroups = content.skillgroups.filter(item => String(item.id).startsWith("wordpress-security-group-"));
    if (securityGroups.length) content.skillgroups = securityGroups;
  }
  const state = `<script>window.__RASHIDVERSE_INITIAL_CONTENT__=${serialiseForInlineScript(content)};window.__RASHIDVERSE_ACTIVE_SECTOR__=${serialiseForInlineScript(sector?.id || null)};window.__RASHIDVERSE_SECTOR_PROFILE__=${serialiseForInlineScript(sector)};window.setTimeout(function(){document.documentElement.classList.remove('rv-dynamic-pending');},5000);document.documentElement.classList.add('rv-dynamic-pending');</script><style>html.rv-dynamic-pending body{visibility:hidden}</style>`;
  const shareMetadata = shareMetadataFor(baseSector);
  const pageTitle = shareMetadata.title;
  const shareTags = renderShareMetadata(shareMetadata);
  const googleAnalyticsTag = renderGoogleAnalyticsTag();
  const sectorPortfolioUrl = sector ? `/${sector.slug}/portfolio/` : null;
  // These are template navigation links rather than dashboard-managed data.
  // Keep every focused profile inside its own portfolio route.
  const sectorTemplate = sectorPortfolioUrl
    ? template.replace(/href=(["'])(?:portfolio\.html|\/portfolio\/?)(\1)/gi, `href="${sectorPortfolioUrl}"`)
    : template;

  return sectorTemplate
    .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeAttribute(shareMetadata.description)}">`)
    .replace("</head>", `${shareTags}${googleAnalyticsTag}${state}${sector?.id === "wordpress" ? '<link rel="stylesheet" href="/rashidverse-site/css/wordpress-content.css">' : ""}</head>`);
}
