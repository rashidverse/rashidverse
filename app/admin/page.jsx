"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaBriefcase, FaChevronDown, FaEye, FaExternalLinkAlt, FaFolderOpen, FaImages, FaPlus, FaRegImage, FaTrash, FaUserCircle } from "react-icons/fa";
import AdminLogoutButton from "./AdminLogoutButton";
import styles from "./admin.module.css";
import mediaStyles from "./media.module.css";
import subcategoryStyles from "./subcategory.module.css";
import pageManagerStyles from "./page-manager.module.css";
import { DEFAULT_MAIN_SKILL_CATEGORY, MAIN_SKILL_CATEGORIES, normalizeTaxonomyLabel } from "@/lib/project-taxonomy";
import { PORTFOLIO_SECTORS } from "@/lib/sectors";

const PROJECTS = "portfolio";
const EXPERIENCES = "experience";
const EXPERIENCE_SETTINGS = "experiencesettings";
const HEROES = "hero";
const ABOUT = "about";
const FACTS = "facts";
const VIDEO = "video";
const PROCESS = "process";
const SKILLS = "skills";
const SKILL_GROUPS = "skillgroups";
const FEATURED = "featured";
const TESTIMONIALS = "testimonials";
const TESTIMONIAL_SETTINGS = "testimonialsettings";
const CLIENT_LOGOS = "clientlogos";
const CTA = "cta";
const FOOTER = "footer";
const HEADER = "header";
const SECTOR_PROFILES = "sectorprofiles";
const GLOBAL_SETTINGS = "globalsettings";
const REPEATER_HERO = "repeaterhero";
const CUSTOM_PLUGINS = "customplugins";
const PLUGIN_ITEMS = "pluginitems";
const emptyProject = { title: "", description: "", details: "", link: "", mainCategory: DEFAULT_MAIN_SKILL_CATEGORY, subcategory: "", featured: false, featuredOrder: 0, published: true, order: 0, thumb: "", hoverImg: "", thumbPath: "", hoverPath: "", sectors: [] };
const emptyExperience = { company: "", role: "", period: "", summary: "", highlights: "", order: 0, layout: "standard", image: "", imagePath: "", imageLink: "", imageLinkTarget: "same", buttonText: "View Work +", buttonLink: "", buttonTarget: "new", sectors: [] };
const emptyExperienceSettings = { sectionLabel: "My Resume", eyebrow: "Some Words About Me", heading: "My Awesome [highlight]Story[/highlight]", description: "", buttonText: "Download Resume", buttonSource: "resume", resumeProfile: "active", buttonLink: "#", buttonTarget: "same", sectors: [] };
const defaultSocialLinks = [{ platform: "upwork", label: "Upwork Profile", url: "", visible: true, order: 0 }, { platform: "linkedin", label: "LinkedIn Profile", url: "", visible: true, order: 1 }, { platform: "github", label: "GitHub", url: "", visible: true, order: 2 }];
const emptyGlobalSettings = { fullName: "Abdul Rashid", designation: "WordPress Designer & Developer", email: "rashedverse@gmail.com", phone: "+880 1720 498825", whatsapp: "8801720498825", upwork: "", linkedin: "", github: "", footer: "Rashidverse. All rights reserved.", socialLinks: defaultSocialLinks, resumes: [{ profile: "wordpress", label: "WordPress Resume", url: "", target: "new" }, { profile: "motion", label: "Motion & Video Resume", url: "", target: "new" }, { profile: "multimedia", label: "Multimedia Resume", url: "", target: "new" }] };
const emptyHero = { title: "", categoryOne: "", categoryTwo: "", profileLink: "", link: "", order: 0, image: "", imagePath: "", overlayColor: "#000000", overlayOpacity: 40, sectors: [] };
const emptyAbout = { sectionLabel: "Words About", imageLabel: "Rashidverse.", eyebrow: "", heading: "", description: "", buttonText: "My Portfolio", buttonLink: "", image: "", imagePath: "", sectors: [], features: [{ title: "Web Design", description: "", icon: "fa-desktop", customIcon: "" }, { title: "Ui/Ux Design", description: "", icon: "fa-mobile-alt", customIcon: "" }, { title: "Branding", description: "", icon: "fa-pagelines", customIcon: "" }, { title: "Ecommerce", description: "", icon: "fa-shopping-bag", customIcon: "" }] };
const emptyFacts = { heading: "", description: "", subtitle: "Numbers", image: "", imagePath: "", overlayColor: "#000000", overlayOpacity: 40, sectors: [], items: [{ number: "145", label: "Finished projects" }, { number: "357", label: "Happy customers" }, { number: "825", label: "Working hours" }, { number: "1124", label: "Coffee Cups" }] };
const emptyVideo = { title: "", description: "", videoUrl: "", buttonText: "My Youtube Channel", buttonLink: "", image: "", imagePath: "", sectors: [] };
const emptyProcess = { sectionLabel: "How I Work", eyebrow: "How i Work", heading: "My Working [highlight]Process[/highlight]", description: "", sectors: [], steps: [{ icon: "fa-slideshare", customIcon: "", iconifyIcon: "", title: "Discuss the project", subtitle: "", description: "", morePoints: [], linkText: "More Details", link: "#", linkTarget: "same" }, { icon: "fa-laptop", customIcon: "", iconifyIcon: "", title: "Design & development", subtitle: "", description: "", morePoints: [], linkText: "More Details", link: "#", linkTarget: "same" }, { icon: "fa-flag-checkered", customIcon: "", iconifyIcon: "", title: "Final approval", subtitle: "", description: "", morePoints: [], linkText: "More Details", link: "#", linkTarget: "same" }], ctaText: "Need more info ? Visit my services page :", ctaButtonText: "My Services", ctaButtonLink: "services.html", ctaButtonTarget: "same" };
const emptySkills = { heading: "My Own [highlight]Developer's[/highlight] and\nDesign Skills", description: "", subtitle: "Power", image: "", imagePath: "", overlayColor: "#000000", overlayOpacity: 55, sectors: [] };
const emptySkillGroup = { title: "", description: "", display: "circle", order: 0, items: [{ name: "", percent: 80 }], sectors: [] };
const emptyFeatured = { heading: "My Featured Projects", description: "", buttonText: "My Portfolio", buttonLink: "portfolio.html", background: "", overlayColor: "#101010", overlayOpacity: 0, items: [{ title: "", category: "", link: "", target: "new", image: "" }], sectors: [] };
const emptyTestimonial = { name: "", role: "Happy Client", quote: "", sourceLabel: "", sourceLink: "", rating: 5, order: 0, avatar: "", avatarPath: "", sectors: [] };
const emptyTestimonialSettings = { eyebrow: "Reviews", heading: "My Clients and [highlight]Testimonials[/highlight]", description: "", sectors: [] };
const emptyClientLogo = { name: "", link: "", linkTarget: "new", order: 0, image: "", imagePath: "", sectors: [] };
const emptyCta = { heading: "Ready To order Your Project ?", buttonText: "Get In Touch", buttonLink: "contacts.html", buttonTarget: "same", sectors: [] };
const emptyFooter = { siteName: "Rashidverse", aboutHeading: "About Me", aboutText: "", portfolioButtonText: "My Portfolio", portfolioButtonLink: "/portfolio/", portfolioButtonTarget: "same", contactHeading: "Subscribe / Contacts", contactText: "", subscribeEnabled: true, subscribePlaceholder: "Email address", subscribeButtonText: "Send", phone: "", email: "", address: "", socials: [{ platform: "facebook", label: "Facebook", url: "" }, { platform: "instagram", label: "Instagram", url: "" }, { platform: "linkedin", label: "LinkedIn", url: "" }, { platform: "youtube", label: "YouTube", url: "" }], copyright: "Rashidverse. All rights reserved." };
const emptyHeader = { siteName: "Rashidverse", logo: "", logoLink: "/", menuLabel: "Menu", menuItems: [{ label: "Home", link: "/", target: "same", order: 0 }] };
const emptyRepeaterHero = { badgePrefix: "ACF & SCF Supported", badgeHighlight: "Repeater", badgeSuffix: "for Elementor", titlePrefix: "Build Dynamic Repeater", titleHighlight: "Layouts", titleSuffix: "in Elementor", description: "Visually build, style and manage ACF & SCF Repeater fields with real-time preview. No code, No restriction. Total design freedom.", primaryButtonText: "Get Repeater Builder", primaryButtonLink: "#pricing", primaryButtonTarget: "same", secondaryButtonText: "See How It Works", secondaryButtonLink: "#how", secondaryButtonTarget: "same" };
const emptyCustomPlugins = { heading: "My WordPress Plugins & Extensions", description: "A curated collection of custom WordPress plugins, practical add-ons, and extensions I build to improve real project workflows." };
const emptyPluginItem = { title: "", description: "", link: "", target: "new", icon: "puzzle", customIcon: "", downloadFile: "", downloadUrl: "", order: 0 };
const pluginIconOptions = [["puzzle", "Puzzle"], ["blocks", "Blocks"], ["form", "Form"], ["database", "Database"], ["cart", "eCommerce"], ["speed", "Performance"], ["shield", "Security"], ["image", "Media"], ["code", "Code"], ["settings", "Settings"]];
const aboutIconLibrary = [["fa-desktop", "Desktop"], ["fa-laptop", "Laptop"], ["fa-mobile-alt", "Mobile"], ["fa-code", "Code"], ["fa-paint-brush", "Paint brush"], ["fa-camera", "Camera"], ["fa-video", "Video"], ["fa-bullhorn", "Marketing"], ["fa-chart-line", "Growth"], ["fa-pagelines", "Brand"], ["fa-shopping-bag", "Shopping"], ["fa-heart", "Heart"], ["fa-lightbulb", "Idea"], ["fa-rocket", "Rocket"], ["fa-pencil-ruler", "Design"], ["fa-layer-group", "Layers"], ["fa-globe", "Web"], ["fa-cog", "Settings"]];
const socialPlatformOptions = [["upwork", "Upwork"], ["linkedin", "LinkedIn"], ["github", "GitHub"], ["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"], ["twitter", "X / Twitter"], ["behance", "Behance"], ["dribbble", "Dribbble"], ["tiktok", "TikTok"], ["custom", "Custom link"]];
const defaultProfileHeroOverlay = { mode: "solid", color: "#000000", opacity: 40, startColor: "#000000", startOpacity: 72, endColor: "#000000", endOpacity: 20, direction: "left" };
const normalizeProfileHeroOverlay = (value = {}) => {
  const overlay = value && typeof value === "object" ? value : {};
  const color = (candidate, fallback) => /^#[0-9a-f]{6}$/i.test(String(candidate || "")) ? candidate : fallback;
  const opacity = (candidate, fallback) => Number.isFinite(Number(candidate)) ? Math.max(0, Math.min(100, Number(candidate))) : fallback;
  return {
    mode: overlay.mode === "gradient" ? "gradient" : "solid",
    color: color(overlay.color, defaultProfileHeroOverlay.color),
    opacity: opacity(overlay.opacity, defaultProfileHeroOverlay.opacity),
    startColor: color(overlay.startColor, defaultProfileHeroOverlay.startColor),
    startOpacity: opacity(overlay.startOpacity, defaultProfileHeroOverlay.startOpacity),
    endColor: color(overlay.endColor, defaultProfileHeroOverlay.endColor),
    endOpacity: opacity(overlay.endOpacity, defaultProfileHeroOverlay.endOpacity),
    direction: ["left", "right", "center"].includes(overlay.direction) ? overlay.direction : defaultProfileHeroOverlay.direction,
  };
};

function Field({ label, children, wide = false }) {
  return <label className={`${styles.field}${wide ? ` ${styles.wide}` : ""}`}><span>{label}</span>{children}</label>;
}

function SidebarToggleIcon({ collapsed = false }) {
  return <svg aria-hidden="true" viewBox="0 0 16.7 17.5" fill="none" className={`${styles.sidebarToggleIcon}${collapsed ? ` ${styles.sidebarToggleIconCollapsed}` : ""}`}>
    <rect x=".9" y=".8" width="14.9" height="16" rx="1.1" ry="1.1" stroke="currentColor" strokeMiterlimit="10" />
    <line x1="4.9" y1="1.3" x2="4.9" y2="16.3" stroke="currentColor" strokeMiterlimit="10" />
    <path d="M12.4 5.4 8.8 8.5c-.3.2-.3.6 0 .9l3.5 2.8" stroke="currentColor" strokeMiterlimit="10" />
  </svg>;
}

function SocialLinksManager({ links, onChange }) {
  const socialLinks = Array.isArray(links) ? links : [];
  const update = (index, values) => onChange(socialLinks.map((entry, position) => position === index ? { ...entry, ...values } : entry));
  return <div className={`${styles.field} ${styles.wide}`}>
    <span>Social Media Links</span>
    <small style={{ display: "block", margin: "4px 0 14px", color: "#637182" }}>These links automatically update the left sidebar, footer and contact drawer everywhere on the site.</small>
    {socialLinks.map((social, index) => <div className={styles.socialLinksRow} key={`${social.platform}-${index}`}>
      <label className={styles.field}><span>Platform</span><select value={social.platform || "custom"} onChange={(event) => update(index, { platform: event.target.value })}>{socialPlatformOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className={styles.field}><span>Label</span><input value={social.label || ""} onChange={(event) => update(index, { label: event.target.value })} placeholder="Profile label" /></label>
      <label className={styles.field}><span>Profile URL</span><input type="url" value={social.url || ""} onChange={(event) => update(index, { url: event.target.value })} placeholder="https://..." /></label>
      <label className={styles.field}><span>Visible</span><span style={{ display: "flex", alignItems: "center", gap: 6, height: 42, margin: 0, fontSize: 13, fontWeight: 500 }}><input type="checkbox" checked={social.visible !== false} onChange={(event) => update(index, { visible: event.target.checked })} />Show</span></label>
      <label className={styles.field}><span>Order</span><input type="number" value={social.order ?? index} onChange={(event) => update(index, { order: Number(event.target.value) || 0 })} /></label>
      <button type="button" className={styles.close} onClick={() => onChange(socialLinks.filter((_, position) => position !== index))}><FaTrash /> Delete</button>
    </div>)}
    <button type="button" className={styles.close} onClick={() => onChange([...socialLinks, { platform: "custom", label: "", url: "", visible: true, order: socialLinks.length }])}><FaPlus /> Add social link</button>
  </div>;
}

function SectorScopePicker({ value = [], onChange }) {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
    <button type="button" onClick={() => onChange([])} style={{ border: "1px solid #d9dee5", borderRadius: 5, padding: "8px 11px", fontWeight: 700, background: selected.length === 0 ? "#ffca18" : "#fff" }}>All profiles</button>
    {PORTFOLIO_SECTORS.map((sector) => <label key={sector.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #d9dee5", borderRadius: 5, padding: "7px 10px", background: selected.includes(sector.id) ? "#eef7ff" : "#fff", cursor: "pointer" }}><input type="checkbox" checked={selected.includes(sector.id)} onChange={() => toggle(sector.id)} />{sector.label}</label>)}
    <small style={{ width: "100%", color: "#6b7280" }}>All profiles means this content is shared. Select one or more profiles for focused content.</small>
  </div>;
}

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState("portfolio");
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [sitewideOpen, setSitewideOpen] = useState(false);
  const [pageManagerSelection, setPageManagerSelection] = useState("all");
  const [pageManagerMode, setPageManagerMode] = useState(false);
  const [pageManagerPanelOpen, setPageManagerPanelOpen] = useState(true);
  const [profilePageContext, setProfilePageContext] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [experienceSettings, setExperienceSettings] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [aboutItems, setAboutItems] = useState([]);
  const [factsItems, setFactsItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);
  const [processItems, setProcessItems] = useState([]);
  const [skillsItems, setSkillsItems] = useState([]);
  const [skillGroups, setSkillGroups] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialSettings, setTestimonialSettings] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [ctaItems, setCtaItems] = useState([]);
  const [footerItems, setFooterItems] = useState([]);
  const [headerItems, setHeaderItems] = useState([]);
  const [allSectorProfiles, setSectorProfiles] = useState([]);
  const [sectorProfileForm, setSectorProfileForm] = useState(null);
  const [globalSettings, setGlobalSettings] = useState([]);
  const [repeaterHeroItems, setRepeaterHeroItems] = useState([]);
  const [repeaterHeroForm, setRepeaterHeroForm] = useState(emptyRepeaterHero);
  const [openRepeaterHero, setOpenRepeaterHero] = useState(null);
  const [customPluginsItems, setCustomPluginsItems] = useState([]);
  const [customPluginsForm, setCustomPluginsForm] = useState(emptyCustomPlugins);
  const [openCustomPlugins, setOpenCustomPlugins] = useState(null);
  const [pluginItems, setPluginItems] = useState([]);
  const [pluginItemForm, setPluginItemForm] = useState(emptyPluginItem);
  const [editingPluginItem, setEditingPluginItem] = useState(null);
  const [openPluginItem, setOpenPluginItem] = useState(null);
  const [pluginIconPickerOpen, setPluginIconPickerOpen] = useState(false);
  const [pluginDownloadPickerOpen, setPluginDownloadPickerOpen] = useState(false);
  const [globalSettingsForm, setGlobalSettingsForm] = useState(emptyGlobalSettings);
  const [editingGlobalSettings, setEditingGlobalSettings] = useState(null);
  const [resumeUploadState, setResumeUploadState] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaPickerSearch, setMediaPickerSearch] = useState("");
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [addingProjectSubcategory, setAddingProjectSubcategory] = useState(false);
  const [projectSubcategoryMenuOpen, setProjectSubcategoryMenuOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [experienceSettingsForm, setExperienceSettingsForm] = useState(emptyExperienceSettings);
  const [heroForm, setHeroForm] = useState(emptyHero);
  const [aboutForm, setAboutForm] = useState(emptyAbout);
  const [factsForm, setFactsForm] = useState(emptyFacts);
  const [videoForm, setVideoForm] = useState(emptyVideo);
  const [processForm, setProcessForm] = useState(emptyProcess);
  const [skillsForm, setSkillsForm] = useState(emptySkills);
  const [skillGroupForm, setSkillGroupForm] = useState(emptySkillGroup);
  const [featuredForm, setFeaturedForm] = useState(emptyFeatured);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [testimonialSettingsForm, setTestimonialSettingsForm] = useState(emptyTestimonialSettings);
  const [clientLogoForm, setClientLogoForm] = useState(emptyClientLogo);
  const [ctaForm, setCtaForm] = useState(emptyCta);
  const [footerForm, setFooterForm] = useState(emptyFooter);
  const [headerForm, setHeaderForm] = useState(emptyHeader);
  const [processStepTab, setProcessStepTab] = useState(0);
  const [projectFile, setProjectFile] = useState(null);
  const [hoverFile, setHoverFile] = useState(null);
  const [projectThumbPickerOpen, setProjectThumbPickerOpen] = useState(false);
  const [projectHoverPickerOpen, setProjectHoverPickerOpen] = useState(false);
  const [experienceFile, setExperienceFile] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [heroMediaPickerOpen, setHeroMediaPickerOpen] = useState(false);
  const [aboutMediaPickerOpen, setAboutMediaPickerOpen] = useState(false);
  const [aboutIconPickerIndex, setAboutIconPickerIndex] = useState(null);
  const [aboutLibraryPickerIndex, setAboutLibraryPickerIndex] = useState(null);
  const [processIconPickerIndex, setProcessIconPickerIndex] = useState(null);
  const [processLibraryPickerIndex, setProcessLibraryPickerIndex] = useState(null);
  const [iconifySearch, setIconifySearch] = useState("");
  const [iconifyResults, setIconifyResults] = useState([]);
  const [iconifyLoading, setIconifyLoading] = useState(false);
  const [iconifyError, setIconifyError] = useState("");
  const [factsMediaPickerOpen, setFactsMediaPickerOpen] = useState(false);
  const [videoMediaPickerOpen, setVideoMediaPickerOpen] = useState(false);
  const [skillsMediaPickerOpen, setSkillsMediaPickerOpen] = useState(false);
  const [testimonialAvatarPickerOpen, setTestimonialAvatarPickerOpen] = useState(false);
  const [clientLogoPickerOpen, setClientLogoPickerOpen] = useState(false);
  const [headerLogoPickerOpen, setHeaderLogoPickerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingExperienceSettings, setEditingExperienceSettings] = useState(null);
  const [editingHero, setEditingHero] = useState(null);
  const [editingAbout, setEditingAbout] = useState(null);
  const [editingFacts, setEditingFacts] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingProcess, setEditingProcess] = useState(null);
  const [editingSkills, setEditingSkills] = useState(null);
  const [editingSkillGroup, setEditingSkillGroup] = useState(null);
  const [editingFeatured, setEditingFeatured] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingTestimonialSettings, setEditingTestimonialSettings] = useState(null);
  const [editingClientLogo, setEditingClientLogo] = useState(null);
  const [editingCta, setEditingCta] = useState(null);
  const [editingFooter, setEditingFooter] = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  const [openExperience, setOpenExperience] = useState(null);
  const [openExperienceSettings, setOpenExperienceSettings] = useState(null);
  const [openHero, setOpenHero] = useState(null);
  const [openAbout, setOpenAbout] = useState(null);
  const [openFacts, setOpenFacts] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  const [openProcess, setOpenProcess] = useState(null);
  const [openSkills, setOpenSkills] = useState(null);
  const [openSkillGroup, setOpenSkillGroup] = useState(null);
  const [openFeatured, setOpenFeatured] = useState(null);
  const [openTestimonial, setOpenTestimonial] = useState(null);
  const [openTestimonialSettings, setOpenTestimonialSettings] = useState(null);
  const [openClientLogo, setOpenClientLogo] = useState(null);
  const [openCta, setOpenCta] = useState(null);
  const [openFooter, setOpenFooter] = useState(null);
  const [openHeader, setOpenHeader] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch(`/api/content/${PROJECTS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load projects"))).then(setProjects).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${EXPERIENCES}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load experience"))).then(setExperiences).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${EXPERIENCE_SETTINGS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load Work Experience title settings"))).then(setExperienceSettings).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${HEROES}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load hero slides"))).then(setHeroes).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${ABOUT}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load About section"))).then(setAboutItems).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${FACTS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load facts section"))).then(setFactsItems).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${VIDEO}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load video section"))).then(setVideoItems).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => {
    fetch(`/api/content/${PROCESS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load working process"))).then(setProcessItems).catch((error) => setNotice(error.message));
  }, []);
  useEffect(() => { fetch(`/api/content/${SKILLS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load Skills section"))).then(setSkillsItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${SKILL_GROUPS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load skill groups"))).then(setSkillGroups).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${FEATURED}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load Featured Projects settings"))).then(setFeaturedItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${TESTIMONIALS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load testimonials"))).then(setTestimonials).catch((error) => setNotice(error.message)); fetch(`/api/content/${TESTIMONIAL_SETTINGS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load testimonial settings"))).then(setTestimonialSettings).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${CLIENT_LOGOS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load client logos"))).then(setClientLogos).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${CTA}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load call to action"))).then(setCtaItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${FOOTER}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load footer settings"))).then(setFooterItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${HEADER}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load header settings"))).then(setHeaderItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${SECTOR_PROFILES}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load portfolio profiles"))).then(setSectorProfiles).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${GLOBAL_SETTINGS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load Global Settings"))).then(setGlobalSettings).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${REPEATER_HERO}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load Repeater Builder Hero"))).then(setRepeaterHeroItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${CUSTOM_PLUGINS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load Custom Plugins settings"))).then(setCustomPluginsItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => { fetch(`/api/content/${PLUGIN_ITEMS}/`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load plugin cards"))).then(setPluginItems).catch((error) => setNotice(error.message)); }, []);
  useEffect(() => {
    const query = iconifySearch.trim();
    if ((aboutLibraryPickerIndex === null && processLibraryPickerIndex === null) || query.length < 2) return;
    const timer = window.setTimeout(() => {
      setIconifyLoading(true); setIconifyError("");
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=72`)
        .then((response) => response.ok ? response.json() : Promise.reject(new Error("Icon search unavailable")))
        .then((data) => setIconifyResults(Array.isArray(data.icons) ? data.icons : []))
        .catch(() => { setIconifyResults([]); setIconifyError("Icon library could not be reached. Check your internet connection."); })
        .finally(() => setIconifyLoading(false));
    }, 260);
    return () => window.clearTimeout(timer);
  }, [aboutLibraryPickerIndex, processLibraryPickerIndex, iconifySearch]);
  const refreshMedia = () => fetch("/api/media/").then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load media"))).then(setMediaFiles).catch((error) => setNotice(error.message));
  useEffect(() => { refreshMedia(); }, []);

  const upload = async (file, folder) => {
    const formData = new FormData();
    formData.set("file", file);
    const type = folder.startsWith("experience") ? EXPERIENCES : folder.startsWith("hero") ? HEROES : PROJECTS;
    const response = await fetch(`/api/upload/${type}/`, { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload failed");
    return result;
  };
  const resetProject = () => { setProjectForm(emptyProject); setAddingProjectSubcategory(false); setProjectSubcategoryMenuOpen(false); setProjectFile(null); setHoverFile(null); setProjectThumbPickerOpen(false); setProjectHoverPickerOpen(false); setEditingProject(null); setOpenProject(null); };
  const resetExperience = () => { setExperienceForm(emptyExperience); setExperienceFile(null); setEditingExperience(null); setOpenExperience(null); };
  const resetExperienceSettings = () => { setExperienceSettingsForm(emptyExperienceSettings); setEditingExperienceSettings(null); setOpenExperienceSettings(null); };
  const resetHero = () => { setHeroForm(emptyHero); setEditingHero(null); setOpenHero(null); setHeroMediaPickerOpen(false); };
  const resetAbout = () => { setAboutForm(emptyAbout); setEditingAbout(null); setOpenAbout(null); setAboutMediaPickerOpen(false); setAboutIconPickerIndex(null); setAboutLibraryPickerIndex(null); setIconifySearch(""); };
  const resetFacts = () => { setFactsForm(emptyFacts); setEditingFacts(null); setOpenFacts(null); setFactsMediaPickerOpen(false); };
  const resetVideo = () => { setVideoForm(emptyVideo); setEditingVideo(null); setOpenVideo(null); setVideoMediaPickerOpen(false); };
  const resetProcess = () => { setProcessForm(emptyProcess); setProcessStepTab(0); setEditingProcess(null); setOpenProcess(null); setProcessIconPickerIndex(null); setProcessLibraryPickerIndex(null); setIconifySearch(""); };
  const resetSkills = () => { setSkillsForm(emptySkills); setEditingSkills(null); setOpenSkills(null); setSkillsMediaPickerOpen(false); };
  const resetSkillGroup = () => { setSkillGroupForm(emptySkillGroup); setEditingSkillGroup(null); setOpenSkillGroup(null); };
  const resetFeatured = () => { setFeaturedForm(emptyFeatured); setEditingFeatured(null); setOpenFeatured(null); };

  const beginProject = (project = null) => {
    if (!project) { resetProject(); setOpenProject("new"); return; }
    const mainCategory = MAIN_SKILL_CATEGORIES.includes(project.mainCategory) ? project.mainCategory : DEFAULT_MAIN_SKILL_CATEGORY;
    setProjectForm({ title: project.title || "", description: project.description || "", details: project.details || "", link: project.link || "", mainCategory, subcategory: project.subcategory || (MAIN_SKILL_CATEGORIES.includes(project.category) ? "" : project.category || ""), featured: project.featured === true, featuredOrder: project.featuredOrder ?? 0, published: project.published !== false, order: project.order ?? 0, thumb: project.thumb || "", hoverImg: project.hoverImg || "", thumbPath: project.thumbPath || "", hoverPath: project.hoverPath || "", sectors: Array.isArray(project.sectors) ? project.sectors : [] });
    setAddingProjectSubcategory(false);
    setProjectSubcategoryMenuOpen(false);
    setEditingProject(project.id); setProjectFile(null); setHoverFile(null); setOpenProject(project.id);
  };
  const beginExperience = (experience = null) => {
    if (!experience) { resetExperience(); setOpenExperience("new"); return; }
    setExperienceForm({ company: experience.company || "", role: experience.role || "", period: experience.period || "", summary: experience.summary || "", highlights: Array.isArray(experience.highlights) ? experience.highlights.join("\n") : "", order: experience.order ?? 0, layout: ["reverse", "image-right", "no-image"].includes(experience.layout) ? experience.layout : "standard", image: experience.image || "", imagePath: experience.imagePath || "", imageLink: experience.imageLink || "", imageLinkTarget: experience.imageLinkTarget === "new" ? "new" : "same", buttonText: experience.buttonText || "View Work +", buttonLink: experience.buttonLink || "", buttonTarget: experience.buttonTarget === "same" ? "same" : "new", sectors: Array.isArray(experience.sectors) ? experience.sectors : [] });
    setEditingExperience(experience.id); setExperienceFile(null); setOpenExperience(experience.id);
  };
  const beginExperienceSettings = (item = null) => {
    if (!item) { resetExperienceSettings(); setOpenExperienceSettings("new"); return; }
    setExperienceSettingsForm({ sectionLabel: item.sectionLabel || "My Resume", eyebrow: item.eyebrow || "Some Words About Me", heading: item.heading || "", description: item.description || "", buttonText: item.buttonText || "Download Resume", buttonSource: item.buttonSource === "custom" ? "custom" : "resume", resumeProfile: ["active", "wordpress", "motion", "multimedia"].includes(item.resumeProfile) ? item.resumeProfile : "active", buttonLink: item.buttonLink || "#", buttonTarget: item.buttonTarget === "new" ? "new" : "same", sectors: Array.isArray(item.sectors) ? item.sectors : [] });
    setEditingExperienceSettings(item.id); setOpenExperienceSettings(item.id);
  };
  const beginHero = (hero = null) => {
    if (!hero) { resetHero(); setOpenHero("new"); return; }
    setHeroForm({ title: hero.title || "", categoryOne: hero.categoryOne || "", categoryTwo: hero.categoryTwo || "", profileLink: hero.profileLink || "", link: hero.link || "", order: hero.order ?? 0, image: hero.image || "", imagePath: hero.imagePath || "", overlayColor: /^#[0-9a-f]{6}$/i.test(hero.overlayColor || "") ? hero.overlayColor : "#000000", overlayOpacity: Math.max(0, Math.min(100, Number(hero.overlayOpacity ?? 40))), sectors: Array.isArray(hero.sectors) ? hero.sectors : [] });
    setEditingHero(hero.id); setOpenHero(hero.id);
  };
  const beginAbout = (about = null) => {
    if (!about) { resetAbout(); setOpenAbout("new"); return; }
    const fallbackFeatures = emptyAbout.features;
    setAboutForm({ sectionLabel: about.sectionLabel || "Words About", imageLabel: about.imageLabel || "Rashidverse.", eyebrow: about.eyebrow || "", heading: about.heading || "", description: about.description || "", buttonText: about.buttonText || "My Portfolio", buttonLink: about.buttonLink || "", image: about.image || "", imagePath: about.imagePath || "", features: fallbackFeatures.map((feature, index) => ({ ...feature, ...(Array.isArray(about.features) ? about.features[index] : {}) })) });
    setEditingAbout(about.id); setOpenAbout(about.id);
  };
  const beginFacts = (facts = null) => {
    if (!facts) { resetFacts(); setOpenFacts("new"); return; }
    setFactsForm({ heading: facts.heading || "", description: facts.description || "", subtitle: facts.subtitle || "Numbers", image: facts.image || "", imagePath: facts.imagePath || "", overlayColor: /^#[0-9a-f]{6}$/i.test(facts.overlayColor || "") ? facts.overlayColor : "#000000", overlayOpacity: Math.max(0, Math.min(100, Number(facts.overlayOpacity ?? 40))), items: emptyFacts.items.map((item, index) => ({ ...item, ...(Array.isArray(facts.items) ? facts.items[index] : {}) })) });
    setEditingFacts(facts.id); setOpenFacts(facts.id);
  };
  const beginVideo = (video = null) => {
    if (!video) { resetVideo(); setOpenVideo("new"); return; }
    setVideoForm({ title: video.title || "", description: video.description || "", videoUrl: video.videoUrl || "", buttonText: video.buttonText || "My Youtube Channel", buttonLink: video.buttonLink || "", image: video.image || "", imagePath: video.imagePath || "" });
    setEditingVideo(video.id); setOpenVideo(video.id);
  };
  const beginProcess = (process = null) => {
    if (!process) { resetProcess(); setOpenProcess("new"); return; }
    const sourceSteps = Array.isArray(process.steps) && process.steps.length ? process.steps : emptyProcess.steps;
    setProcessForm({ sectionLabel: process.sectionLabel || "How I Work", eyebrow: process.eyebrow || "How i Work", heading: process.heading || "", description: process.description || "", steps: sourceSteps.map((step, index) => ({ ...(emptyProcess.steps[index] || emptyProcess.steps[0]), ...step, morePoints: Array.isArray(step.morePoints) ? step.morePoints.join("\n") : String(step.morePoints || "") })), ctaText: process.ctaText || "", ctaButtonText: process.ctaButtonText || "", ctaButtonLink: process.ctaButtonLink || "", ctaButtonTarget: process.ctaButtonTarget === "new" ? "new" : "same" });
    setProcessStepTab(0); setEditingProcess(process.id); setOpenProcess(process.id);
  };
  const beginSkills = (skills = null) => { if (!skills) { resetSkills(); setOpenSkills("new"); return; } setSkillsForm({ heading: skills.heading || "", description: skills.description || "", subtitle: skills.subtitle || "Power", image: skills.image || "", imagePath: skills.imagePath || "", overlayColor: /^#[0-9a-f]{6}$/i.test(skills.overlayColor || "") ? skills.overlayColor : "#000000", overlayOpacity: Math.max(0, Math.min(100, Number(skills.overlayOpacity ?? 55))) }); setEditingSkills(skills.id); setOpenSkills(skills.id); };
  const beginSkillGroup = (group = null) => { if (!group) { resetSkillGroup(); setOpenSkillGroup("new"); return; } setSkillGroupForm({ title: group.title || "", description: group.description || "", display: group.display === "bar" ? "bar" : "circle", order: group.order ?? 0, items: Array.isArray(group.items) && group.items.length ? group.items.map((item) => ({ name: item.name || "", percent: item.percent ?? 0 })) : emptySkillGroup.items, sectors: Array.isArray(group.sectors) ? group.sectors : [] }); setEditingSkillGroup(group.id); setOpenSkillGroup(group.id); };
  const beginFeatured = (item = null) => { if (!item) { resetFeatured(); setOpenFeatured("new"); return; } setFeaturedForm({ heading: item.heading || "", description: item.description || "", buttonText: item.buttonText || "My Portfolio", buttonLink: item.buttonLink || "", background: item.background || "", overlayColor: /^#[0-9a-f]{6}$/i.test(item.overlayColor || "") ? item.overlayColor : "#101010", overlayOpacity: Math.max(0, Math.min(90, Number(item.overlayOpacity || 0))), items: Array.isArray(item.items) && item.items.length ? item.items.map((slide) => ({ title: slide.title || "", category: slide.category || "", link: slide.link || "", target: slide.target === "same" ? "same" : "new", image: slide.image || "" })) : emptyFeatured.items }); setEditingFeatured(item.id); setOpenFeatured(item.id); };
  const resetTestimonial = () => { setTestimonialForm(emptyTestimonial); setEditingTestimonial(null); setOpenTestimonial(null); setTestimonialAvatarPickerOpen(false); };
  const beginTestimonial = (item = null) => { if (!item) { resetTestimonial(); setOpenTestimonial("new"); return; } setTestimonialForm({ name: item.name || "", role: item.role || "Happy Client", quote: item.quote || "", sourceLabel: item.sourceLabel || "", sourceLink: item.sourceLink || "", rating: Math.max(1, Math.min(5, Number(item.rating) || 5)), order: item.order ?? 0, avatar: item.avatar || "", avatarPath: item.avatarPath || "", sectors: Array.isArray(item.sectors) ? item.sectors : [] }); setEditingTestimonial(item.id); setOpenTestimonial(item.id); };
  const beginTestimonialSettings = (item = null) => { if (!item) { setTestimonialSettingsForm(emptyTestimonialSettings); setEditingTestimonialSettings(null); setOpenTestimonialSettings("new"); return; } setTestimonialSettingsForm({ eyebrow: item.eyebrow || "Reviews", heading: item.heading || "", description: item.description || "" }); setEditingTestimonialSettings(item.id); setOpenTestimonialSettings(item.id); };
  const resetClientLogo = () => { setClientLogoForm(emptyClientLogo); setEditingClientLogo(null); setOpenClientLogo(null); setClientLogoPickerOpen(false); };
  const beginClientLogo = (item = null) => { if (!item) { resetClientLogo(); setOpenClientLogo("new"); return; } setClientLogoForm({ name: item.name || "", link: item.link || "", linkTarget: item.linkTarget === "same" ? "same" : "new", order: item.order ?? 0, image: item.image || "", imagePath: item.imagePath || "" }); setEditingClientLogo(item.id); setOpenClientLogo(item.id); };
  const resetCta = () => { setCtaForm(emptyCta); setEditingCta(null); setOpenCta(null); };
  const beginCta = (item = null) => { if (!item) { resetCta(); setOpenCta("new"); return; } setCtaForm({ heading: item.heading || "", buttonText: item.buttonText || "Get In Touch", buttonLink: item.buttonLink || "", buttonTarget: item.buttonTarget === "new" ? "new" : "same" }); setEditingCta(item.id); setOpenCta(item.id); };
  const resetFooter = () => { setFooterForm(emptyFooter); setEditingFooter(null); setOpenFooter(null); };
  const beginFooter = (item = null) => {
    if (!item) { resetFooter(); setOpenFooter("new"); return; }
    const savedSocials = Array.isArray(item.socials) ? item.socials : [];
    const socials = emptyFooter.socials.map((social) => ({ ...social, ...(savedSocials.find((saved) => saved.platform === social.platform) || {}) }));
    setFooterForm({ ...emptyFooter, ...item, subscribeEnabled: item.subscribeEnabled !== false, portfolioButtonTarget: item.portfolioButtonTarget === "new" ? "new" : "same", socials });
    setEditingFooter(item.id); setOpenFooter(item.id);
  };
  const resetHeader = () => { setHeaderForm(emptyHeader); setEditingHeader(null); setOpenHeader(null); setHeaderLogoPickerOpen(false); };
  const beginHeader = (item = null) => { if (!item) { resetHeader(); setOpenHeader("new"); return; } setHeaderForm({ siteName: item.siteName || "Rashidverse", logo: item.logo || "", logoLink: item.logoLink || "/", menuLabel: item.menuLabel || "Menu", menuItems: Array.isArray(item.menuItems) && item.menuItems.length ? item.menuItems.map((entry, index) => ({ label: entry.label || "", link: entry.link || "", target: entry.target === "new" ? "new" : "same", order: entry.order ?? index })) : emptyHeader.menuItems }); setEditingHeader(item.id); setOpenHeader(item.id); };

  const saveProject = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); let thumb = { url: projectForm.thumb, path: projectForm.thumbPath }; let hover = { url: projectForm.hoverImg, path: projectForm.hoverPath };
      if (projectFile) thumb = await upload(projectFile, "portfolio/thumbs");
      if (hoverFile) hover = await upload(hoverFile, "portfolio/mockups");
      if (!thumb.url) throw new Error("Choose a thumbnail image from Media Library first");
      const typedSubcategory = projectForm.subcategory.trim();
      const existingSubcategory = projects.find((project) => project.id !== editingProject && project.mainCategory === projectForm.mainCategory && normalizeTaxonomyLabel(project.subcategory) === normalizeTaxonomyLabel(typedSubcategory))?.subcategory;
      const data = { title: projectForm.title.trim(), description: projectForm.description.trim(), details: projectForm.details.trim(), link: projectForm.link.trim(), mainCategory: projectForm.mainCategory, subcategory: existingSubcategory || typedSubcategory, featured: projectForm.featured === true, featuredOrder: Number(projectForm.featuredOrder) || 0, published: projectForm.published !== false, order: Number(projectForm.order) || 0, thumb: thumb.url, thumbPath: thumb.path, hoverImg: hover.url, hoverPath: hover.path, sectors: projectForm.sectors || [] };
      const response = await fetch(editingProject ? `/api/content/${PROJECTS}/${editingProject}/` : `/api/content/${PROJECTS}/`, { method: editingProject ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Project could not be saved");
      setProjects(await fetch(`/api/content/${PROJECTS}/`).then((item) => item.json()));
      setNotice(editingProject ? "Project updated successfully." : "Project added successfully."); resetProject();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveExperience = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); let image = { url: experienceForm.image, path: experienceForm.imagePath };
      if (experienceFile) image = await upload(experienceFile, "experience/images");
      const data = { company: experienceForm.company.trim(), role: experienceForm.role.trim(), period: experienceForm.period.trim(), summary: experienceForm.summary.trim(), highlights: experienceForm.highlights.split("\n").map((item) => item.trim()).filter(Boolean), order: Number(experienceForm.order) || 0, layout: experienceForm.layout, image: image.url, imagePath: image.path, imageLink: experienceForm.imageLink.trim(), imageLinkTarget: experienceForm.imageLinkTarget === "new" ? "new" : "same", buttonText: experienceForm.buttonText.trim(), buttonLink: experienceForm.buttonLink.trim(), buttonTarget: experienceForm.buttonTarget === "same" ? "same" : "new", sectors: experienceForm.sectors || [] };
      const response = await fetch(editingExperience ? `/api/content/${EXPERIENCES}/${editingExperience}/` : `/api/content/${EXPERIENCES}/`, { method: editingExperience ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Work experience could not be saved");
      setExperiences(await fetch(`/api/content/${EXPERIENCES}/`).then((item) => item.json()));
      setNotice(editingExperience ? "Work experience updated successfully." : "Work experience added successfully."); resetExperience();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveExperienceSettings = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = { sectionLabel: experienceSettingsForm.sectionLabel.trim(), eyebrow: experienceSettingsForm.eyebrow.trim(), heading: experienceSettingsForm.heading.trim(), description: experienceSettingsForm.description.trim(), buttonText: experienceSettingsForm.buttonText.trim(), buttonSource: experienceSettingsForm.buttonSource === "custom" ? "custom" : "resume", resumeProfile: ["active", "wordpress", "motion", "multimedia"].includes(experienceSettingsForm.resumeProfile) ? experienceSettingsForm.resumeProfile : "active", buttonLink: experienceSettingsForm.buttonLink.trim(), buttonTarget: experienceSettingsForm.buttonTarget === "new" ? "new" : "same", sectors: experienceSettingsForm.sectors || [] };
      const response = await fetch(editingExperienceSettings ? `/api/content/${EXPERIENCE_SETTINGS}/${editingExperienceSettings}/` : `/api/content/${EXPERIENCE_SETTINGS}/`, { method: editingExperienceSettings ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Work Experience title settings could not be saved");
      setExperienceSettings(await fetch(`/api/content/${EXPERIENCE_SETTINGS}/`).then((item) => item.json()));
      setNotice("Work Experience section title saved."); resetExperienceSettings();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveHero = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (!heroForm.image) throw new Error("Choose a background image from Media Library first");
      const data = { title: heroForm.title.trim(), categoryOne: heroForm.categoryOne.trim(), categoryTwo: heroForm.categoryTwo.trim(), profileLink: heroForm.profileLink.trim(), link: heroForm.link.trim(), order: Number(heroForm.order) || 0, image: heroForm.image, imagePath: heroForm.imagePath, overlayColor: heroForm.overlayColor, overlayOpacity: Math.max(0, Math.min(100, Number(heroForm.overlayOpacity) || 0)), sectors: heroForm.sectors || [] };
      const response = await fetch(editingHero ? `/api/content/${HEROES}/${editingHero}/` : `/api/content/${HEROES}/`, { method: editingHero ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Hero slide could not be saved");
      setHeroes(await fetch(`/api/content/${HEROES}/`).then((item) => item.json()));
      setNotice(editingHero ? "Hero slide updated successfully." : "Hero slide added successfully."); resetHero();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveAbout = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (!aboutForm.image) throw new Error("Choose an About image from Media Library first");
      const data = { ...aboutForm, sectionLabel: aboutForm.sectionLabel.trim(), imageLabel: aboutForm.imageLabel.trim(), eyebrow: aboutForm.eyebrow.trim(), heading: aboutForm.heading.trim(), description: aboutForm.description.trim(), buttonText: aboutForm.buttonText.trim(), buttonLink: aboutForm.buttonLink.trim(), features: aboutForm.features.map((feature) => ({ title: feature.title.trim(), description: feature.description.trim(), icon: feature.icon, customIcon: feature.customIcon || "", iconifyIcon: feature.iconifyIcon || "" })) };
      const response = await fetch(editingAbout ? `/api/content/${ABOUT}/${editingAbout}/` : `/api/content/${ABOUT}/`, { method: editingAbout ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("About section could not be saved");
      setAboutItems(await fetch(`/api/content/${ABOUT}/`).then((item) => item.json()));
      setNotice(editingAbout ? "About section updated successfully." : "About section added successfully."); resetAbout();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveFacts = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (!factsForm.image) throw new Error("Choose a background image from Media Library first");
      const data = { ...factsForm, heading: factsForm.heading.trim(), description: factsForm.description.trim(), subtitle: factsForm.subtitle.trim(), overlayOpacity: Math.max(0, Math.min(100, Number(factsForm.overlayOpacity) || 0)), items: factsForm.items.map((item) => ({ number: String(item.number).trim(), label: item.label.trim() })) };
      const response = await fetch(editingFacts ? `/api/content/${FACTS}/${editingFacts}/` : `/api/content/${FACTS}/`, { method: editingFacts ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Facts section could not be saved");
      setFactsItems(await fetch(`/api/content/${FACTS}/`).then((item) => item.json()));
      setNotice(editingFacts ? "Facts section updated successfully." : "Facts section added successfully."); resetFacts();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveVideo = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (!videoForm.image) throw new Error("Choose a video preview image from Media Library first");
      const data = { ...videoForm, title: videoForm.title.trim(), description: videoForm.description.trim(), videoUrl: videoForm.videoUrl.trim(), buttonText: videoForm.buttonText.trim(), buttonLink: videoForm.buttonLink.trim() };
      const response = await fetch(editingVideo ? `/api/content/${VIDEO}/${editingVideo}/` : `/api/content/${VIDEO}/`, { method: editingVideo ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Video section could not be saved");
      setVideoItems(await fetch(`/api/content/${VIDEO}/`).then((item) => item.json()));
      setNotice(editingVideo ? "Video section updated successfully." : "Video section added successfully."); resetVideo();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveProcess = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = { ...processForm, sectionLabel: processForm.sectionLabel.trim(), eyebrow: processForm.eyebrow.trim(), heading: processForm.heading.trim(), description: processForm.description.trim(), ctaText: processForm.ctaText.trim(), ctaButtonText: processForm.ctaButtonText.trim(), ctaButtonLink: processForm.ctaButtonLink.trim(), ctaButtonTarget: processForm.ctaButtonTarget === "new" ? "new" : "same", steps: processForm.steps.map((step) => ({ icon: step.icon, customIcon: step.customIcon || "", iconifyIcon: step.iconifyIcon || "", title: step.title.trim(), subtitle: step.subtitle.trim(), description: step.description.trim(), morePoints: String(step.morePoints || "").split("\n").map((point) => point.trim()).filter(Boolean), linkText: step.linkText.trim(), link: step.link.trim(), linkTarget: step.linkTarget === "new" ? "new" : "same" })) };
      const response = await fetch(editingProcess ? `/api/content/${PROCESS}/${editingProcess}/` : `/api/content/${PROCESS}/`, { method: editingProcess ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Working process could not be saved");
      setProcessItems(await fetch(`/api/content/${PROCESS}/`).then((item) => item.json()));
      setNotice(editingProcess ? "Working process updated successfully." : "Working process added successfully."); resetProcess();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const saveSkills = async (event) => { event.preventDefault(); try { setSaving(true); if (!skillsForm.image) throw new Error("Choose a Skills background image from Media Library first"); const data = { ...skillsForm, heading: skillsForm.heading.trim(), description: skillsForm.description.trim(), subtitle: skillsForm.subtitle.trim(), overlayOpacity: Math.max(0, Math.min(100, Number(skillsForm.overlayOpacity) || 0)) }; const response = await fetch(editingSkills ? `/api/content/${SKILLS}/${editingSkills}/` : `/api/content/${SKILLS}/`, { method: editingSkills ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Skills section could not be saved"); setSkillsItems(await fetch(`/api/content/${SKILLS}/`).then((item) => item.json())); setNotice(editingSkills ? "Skills section updated successfully." : "Skills section added successfully."); resetSkills(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveSkillGroup = async (event) => { event.preventDefault(); try { setSaving(true); const data = { title: skillGroupForm.title.trim(), description: skillGroupForm.description.trim(), display: skillGroupForm.display, order: Number(skillGroupForm.order) || 0, items: skillGroupForm.items.map((item) => ({ name: item.name.trim(), percent: Math.max(0, Math.min(100, Number(item.percent) || 0)) })).filter((item) => item.name), sectors: skillGroupForm.sectors || [] }; if (!data.items.length) throw new Error("Add at least one sub-skill"); const response = await fetch(editingSkillGroup ? `/api/content/${SKILL_GROUPS}/${editingSkillGroup}/` : `/api/content/${SKILL_GROUPS}/`, { method: editingSkillGroup ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Skill group could not be saved"); setSkillGroups(await fetch(`/api/content/${SKILL_GROUPS}/`).then((item) => item.json())); setNotice(editingSkillGroup ? "Main skill updated successfully." : "Main skill added successfully."); resetSkillGroup(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveFeatured = async (event) => { event.preventDefault(); try { setSaving(true); const data = { ...featuredForm, heading: featuredForm.heading.trim(), description: featuredForm.description.trim(), buttonText: featuredForm.buttonText.trim(), buttonLink: featuredForm.buttonLink.trim(), background: featuredForm.background.trim(), overlayOpacity: Math.max(0, Math.min(90, Number(featuredForm.overlayOpacity) || 0)), items: featuredForm.items.map((item) => ({ ...item, title: item.title.trim(), category: item.category.trim(), link: item.link.trim(), image: item.image.trim(), target: item.target === "same" ? "same" : "new" })).filter((item) => item.title && item.image) }; if (!data.items.length) throw new Error("Add at least one project with an image URL"); const response = await fetch(editingFeatured ? `/api/content/${FEATURED}/${editingFeatured}/` : `/api/content/${FEATURED}/`, { method: editingFeatured ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Featured Projects could not be saved"); setFeaturedItems(await fetch(`/api/content/${FEATURED}/`).then((item) => item.json())); setNotice(editingFeatured ? "Featured Projects updated." : "Featured Projects added."); resetFeatured(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveFeaturedSettings = async (event) => { event.preventDefault(); try { setSaving(true); const data = { heading: featuredForm.heading.trim(), description: featuredForm.description.trim(), buttonText: featuredForm.buttonText.trim(), buttonLink: featuredForm.buttonLink.trim() }; const response = await fetch(editingFeatured ? `/api/content/${FEATURED}/${editingFeatured}/` : `/api/content/${FEATURED}/`, { method: editingFeatured ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Featured Projects settings could not be saved"); setFeaturedItems(await fetch(`/api/content/${FEATURED}/`).then((item) => item.json())); setNotice("Featured Projects section updated."); resetFeatured(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveTestimonial = async (event) => { event.preventDefault(); try { setSaving(true); if (!testimonialForm.avatar) throw new Error("Choose a client avatar from Media Library first"); const data = { ...testimonialForm, name: testimonialForm.name.trim(), role: testimonialForm.role.trim(), quote: testimonialForm.quote.trim(), sourceLabel: testimonialForm.sourceLabel.trim(), sourceLink: testimonialForm.sourceLink.trim(), rating: Math.max(1, Math.min(5, Number(testimonialForm.rating) || 5)), order: Number(testimonialForm.order) || 0 }; const response = await fetch(editingTestimonial ? `/api/content/${TESTIMONIALS}/${editingTestimonial}/` : `/api/content/${TESTIMONIALS}/`, { method: editingTestimonial ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Testimonial could not be saved"); setTestimonials(await fetch(`/api/content/${TESTIMONIALS}/`).then((item) => item.json())); setNotice("Testimonial saved."); resetTestimonial(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveTestimonialSettings = async (event) => { event.preventDefault(); try { setSaving(true); const data = { eyebrow: testimonialSettingsForm.eyebrow.trim(), heading: testimonialSettingsForm.heading.trim(), description: testimonialSettingsForm.description.trim() }; const response = await fetch(editingTestimonialSettings ? `/api/content/${TESTIMONIAL_SETTINGS}/${editingTestimonialSettings}/` : `/api/content/${TESTIMONIAL_SETTINGS}/`, { method: editingTestimonialSettings ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Testimonial section settings could not be saved"); setTestimonialSettings(await fetch(`/api/content/${TESTIMONIAL_SETTINGS}/`).then((item) => item.json())); setNotice("Testimonial section settings saved."); setOpenTestimonialSettings(null); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveClientLogo = async (event) => { event.preventDefault(); try { setSaving(true); if (!clientLogoForm.image) throw new Error("Choose a logo from Media Library first"); const data = { name: clientLogoForm.name.trim(), link: clientLogoForm.link.trim(), linkTarget: clientLogoForm.linkTarget === "same" ? "same" : "new", order: Number(clientLogoForm.order) || 0, image: clientLogoForm.image, imagePath: clientLogoForm.imagePath || clientLogoForm.image }; const response = await fetch(editingClientLogo ? `/api/content/${CLIENT_LOGOS}/${editingClientLogo}/` : `/api/content/${CLIENT_LOGOS}/`, { method: editingClientLogo ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Client logo could not be saved"); setClientLogos(await fetch(`/api/content/${CLIENT_LOGOS}/`).then((item) => item.json())); setNotice("Client logo saved."); resetClientLogo(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveCta = async (event) => { event.preventDefault(); try { setSaving(true); const data = { heading: ctaForm.heading.trim(), buttonText: ctaForm.buttonText.trim(), buttonLink: ctaForm.buttonLink.trim(), buttonTarget: ctaForm.buttonTarget === "new" ? "new" : "same" }; const response = await fetch(editingCta ? `/api/content/${CTA}/${editingCta}/` : `/api/content/${CTA}/`, { method: editingCta ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Call to action could not be saved"); setCtaItems(await fetch(`/api/content/${CTA}/`).then((item) => item.json())); setNotice("Call to action saved."); resetCta(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveFooter = async (event) => { event.preventDefault(); try { setSaving(true); const data = { ...footerForm, siteName: footerForm.siteName.trim(), aboutHeading: footerForm.aboutHeading.trim(), aboutText: footerForm.aboutText.trim(), portfolioButtonText: footerForm.portfolioButtonText.trim(), portfolioButtonLink: footerForm.portfolioButtonLink.trim(), portfolioButtonTarget: footerForm.portfolioButtonTarget === "new" ? "new" : "same", contactHeading: footerForm.contactHeading.trim(), contactText: footerForm.contactText.trim(), subscribeEnabled: footerForm.subscribeEnabled !== false, subscribePlaceholder: footerForm.subscribePlaceholder.trim(), subscribeButtonText: footerForm.subscribeButtonText.trim(), phone: footerForm.phone.trim(), email: footerForm.email.trim(), address: footerForm.address.trim(), socials: footerForm.socials.map((social) => ({ platform: social.platform, label: social.label.trim(), url: social.url.trim() })), copyright: footerForm.copyright.trim() }; const response = await fetch(editingFooter ? `/api/content/${FOOTER}/${editingFooter}/` : `/api/content/${FOOTER}/`, { method: editingFooter ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Footer could not be saved"); setFooterItems(await fetch(`/api/content/${FOOTER}/`).then((item) => item.json())); setNotice("Footer saved."); resetFooter(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const saveHeader = async (event) => { event.preventDefault(); try { setSaving(true); const data = { siteName: headerForm.siteName.trim(), logo: headerForm.logo.trim(), logoLink: headerForm.logoLink.trim(), menuLabel: headerForm.menuLabel.trim(), menuItems: headerForm.menuItems.map((item, index) => ({ label: item.label.trim(), link: item.link.trim(), target: item.target === "new" ? "new" : "same", order: Number(item.order) || index })).filter((item) => item.label && item.link) }; if (!data.menuItems.length) throw new Error("Add at least one navigation item"); const response = await fetch(editingHeader ? `/api/content/${HEADER}/${editingHeader}/` : `/api/content/${HEADER}/`, { method: editingHeader ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Header settings could not be saved"); setHeaderItems(await fetch(`/api/content/${HEADER}/`).then((item) => item.json())); setNotice("Header settings saved."); resetHeader(); } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); } };
  const beginRepeaterHero = (item = repeaterHeroItems[0]) => {
    setRepeaterHeroForm({ ...emptyRepeaterHero, ...(item || {}) });
    setOpenRepeaterHero(item?.id || "new");
  };
  const saveRepeaterHero = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        ...repeaterHeroForm,
        badgePrefix: repeaterHeroForm.badgePrefix.trim(), badgeHighlight: repeaterHeroForm.badgeHighlight.trim(), badgeSuffix: repeaterHeroForm.badgeSuffix.trim(),
        titlePrefix: repeaterHeroForm.titlePrefix.trim(), titleHighlight: repeaterHeroForm.titleHighlight.trim(), titleSuffix: repeaterHeroForm.titleSuffix.trim(), description: repeaterHeroForm.description.trim(),
        primaryButtonText: repeaterHeroForm.primaryButtonText.trim(), primaryButtonLink: repeaterHeroForm.primaryButtonLink.trim(), primaryButtonTarget: repeaterHeroForm.primaryButtonTarget === "new" ? "new" : "same",
        secondaryButtonText: repeaterHeroForm.secondaryButtonText.trim(), secondaryButtonLink: repeaterHeroForm.secondaryButtonLink.trim(), secondaryButtonTarget: repeaterHeroForm.secondaryButtonTarget === "new" ? "new" : "same",
      };
      const editing = Boolean(repeaterHeroForm.id);
      const response = await fetch(editing ? `/api/content/${REPEATER_HERO}/${repeaterHeroForm.id}/` : `/api/content/${REPEATER_HERO}/`, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || "Repeater Builder Hero could not be saved");
      setRepeaterHeroItems([updated]);
      setOpenRepeaterHero(null);
      setNotice("Repeater Builder Hero saved. Refresh the page to see the update.");
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const beginCustomPlugins = (item = customPluginsItems[0]) => {
    setCustomPluginsForm({ ...emptyCustomPlugins, ...(item || {}) });
    setOpenCustomPlugins(item?.id || "new");
  };
  const resetPluginItem = () => { setPluginItemForm(emptyPluginItem); setEditingPluginItem(null); setOpenPluginItem(null); setPluginIconPickerOpen(false); setPluginDownloadPickerOpen(false); };
  const beginPluginItem = (item = null) => {
    if (!item) { resetPluginItem(); setOpenPluginItem("new"); return; }
    setPluginItemForm({ title: item.title || "", description: item.description || "", link: item.link || "", target: item.target === "same" ? "same" : "new", icon: pluginIconOptions.some(([value]) => value === item.icon) ? item.icon : "puzzle", customIcon: item.customIcon || "", downloadFile: item.downloadFile || "", downloadUrl: item.downloadUrl || "", order: item.order ?? 0 });
    setEditingPluginItem(item.id);
    setOpenPluginItem(item.id);
  };
  const saveCustomPlugins = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        heading: customPluginsForm.heading.trim(),
        description: customPluginsForm.description.trim(),
      };
      const editing = Boolean(customPluginsForm.id);
      const response = await fetch(editing ? `/api/content/${CUSTOM_PLUGINS}/${customPluginsForm.id}/` : `/api/content/${CUSTOM_PLUGINS}/`, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || "Custom Plugins settings could not be saved");
      setCustomPluginsItems([updated]);
      setOpenCustomPlugins(null);
      setNotice("Custom Plugins title and description saved.");
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const savePluginItem = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = { title: pluginItemForm.title.trim(), description: pluginItemForm.description.trim(), link: pluginItemForm.link.trim(), target: pluginItemForm.target === "same" ? "same" : "new", icon: pluginIconOptions.some(([value]) => value === pluginItemForm.icon) ? pluginItemForm.icon : "puzzle", customIcon: pluginItemForm.customIcon.trim(), downloadFile: pluginItemForm.downloadFile.trim(), downloadUrl: pluginItemForm.downloadUrl.trim(), order: Math.max(0, Number(pluginItemForm.order) || 0), sectors: ["wordpress"] };
      if (!data.title) throw new Error("Plugin title is required");
      const response = await fetch(editingPluginItem ? `/api/content/${PLUGIN_ITEMS}/${editingPluginItem}/` : `/api/content/${PLUGIN_ITEMS}/`, { method: editingPluginItem ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || "Plugin card could not be saved");
      setPluginItems(await fetch(`/api/content/${PLUGIN_ITEMS}/`).then((item) => item.json()));
      setNotice(editingPluginItem ? "Plugin card updated successfully." : "Plugin card added successfully.");
      resetPluginItem();
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const replaceItemInState = (type, item) => {
    const replace = (setItems) => setItems((items) => items.map((entry) => entry.id === item.id ? item : entry));
    if (type === PROJECTS) replace(setProjects); else if (type === EXPERIENCES) replace(setExperiences); else if (type === EXPERIENCE_SETTINGS) replace(setExperienceSettings); else if (type === HEROES) replace(setHeroes); else if (type === ABOUT) replace(setAboutItems); else if (type === FACTS) replace(setFactsItems); else if (type === VIDEO) replace(setVideoItems); else if (type === PROCESS) replace(setProcessItems); else if (type === SKILLS) replace(setSkillsItems); else if (type === SKILL_GROUPS) replace(setSkillGroups); else if (type === FEATURED) replace(setFeaturedItems); else if (type === TESTIMONIALS) replace(setTestimonials); else if (type === TESTIMONIAL_SETTINGS) replace(setTestimonialSettings); else if (type === CLIENT_LOGOS) replace(setClientLogos); else if (type === CTA) replace(setCtaItems); else if (type === FOOTER) replace(setFooterItems); else if (type === SECTOR_PROFILES) replace(setSectorProfiles); else if (type === GLOBAL_SETTINGS) replace(setGlobalSettings); else if (type === REPEATER_HERO) replace(setRepeaterHeroItems);
  };
  const saveSectorScope = async (type, item, sectors) => {
    try {
      const response = await fetch(`/api/content/${type}/${item.id}/`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, sectors }) });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || "Sector visibility could not be saved");
      replaceItemInState(type, updated);
      setNotice("Sector visibility saved.");
    } catch (error) { setNotice(`Save failed: ${error.message}`); }
  };
  const beginSectorProfile = (profile) => setSectorProfileForm({ id: profile.id, slug: profile.slug, label: profile.label || "", name: profile.name || "", title: profile.title || "", description: profile.description || "", heroOverlay: normalizeProfileHeroOverlay(profile.heroOverlay) });
  const saveSectorProfile = async (event) => {
    event.preventDefault();
    if (!sectorProfileForm) return;
    try {
      setSaving(true);
      const response = await fetch(`/api/content/${SECTOR_PROFILES}/${sectorProfileForm.id}/`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...sectorProfileForm, label: sectorProfileForm.label.trim(), name: sectorProfileForm.name.trim(), title: sectorProfileForm.title.trim(), description: sectorProfileForm.description.trim(), heroOverlay: normalizeProfileHeroOverlay(sectorProfileForm.heroOverlay) }) });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || "Profile could not be saved");
      replaceItemInState(SECTOR_PROFILES, updated);
      setSectorProfileForm(null);
      setNotice("Portfolio profile updated.");
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const updateSectorProfileOverlay = (values) => setSectorProfileForm((current) => current ? { ...current, heroOverlay: { ...normalizeProfileHeroOverlay(current.heroOverlay), ...values } } : current);
  const renderProfileHeroOverlayFields = () => {
    if (!sectorProfileForm) return null;
    const overlay = normalizeProfileHeroOverlay(sectorProfileForm.heroOverlay);
    const profileName = sectorProfileForm.name || sectorProfileForm.label || "Profile";
    const solidPreview = `${overlay.color}${Math.round(overlay.opacity * 2.55).toString(16).padStart(2, "0")}`;
    const gradientDirection = overlay.direction === "right" ? "to left" : overlay.direction === "center" ? "circle at center" : "to right";
    const gradientPreview = overlay.direction === "center"
      ? `radial-gradient(${gradientDirection}, ${overlay.startColor}${Math.round(overlay.startOpacity * 2.55).toString(16).padStart(2, "0")}, ${overlay.endColor}${Math.round(overlay.endOpacity * 2.55).toString(16).padStart(2, "0")})`
      : `linear-gradient(${gradientDirection}, ${overlay.startColor}${Math.round(overlay.startOpacity * 2.55).toString(16).padStart(2, "0")}, ${overlay.endColor}${Math.round(overlay.endOpacity * 2.55).toString(16).padStart(2, "0")})`;
    return <section className={styles.profileHeroOverlay}>
      <div className={styles.profileHeroOverlayHead}>
        <div><h4>{profileName} Hero overlay</h4><p>Only affects <b>/{sectorProfileForm.slug}/</b>. Main homepage Hero settings remain separate.</p></div>
        <div className={styles.overlayPreview} style={{ background: overlay.mode === "gradient" ? gradientPreview : solidPreview }} aria-label="Overlay preview" />
      </div>
      <div className={styles.formGrid}>
        <Field label="Overlay style"><select value={overlay.mode} onChange={(event) => updateSectorProfileOverlay({ mode: event.target.value })}><option value="solid">Solid color</option><option value="gradient">Gradient</option></select></Field>
        <Field label={overlay.mode === "gradient" ? "Gradient direction" : "Overlay opacity"}>{overlay.mode === "gradient" ? <select value={overlay.direction} onChange={(event) => updateSectorProfileOverlay({ direction: event.target.value })}><option value="left">Left → right</option><option value="right">Right → left</option><option value="center">Center → edges</option></select> : <div className={styles.overlayRange}><input type="range" min="0" max="100" value={overlay.opacity} onChange={(event) => updateSectorProfileOverlay({ opacity: Number(event.target.value) })} /><output>{overlay.opacity}%</output></div>}</Field>
        {overlay.mode === "solid" ? <Field label="Overlay color" wide><input type="color" value={overlay.color} onChange={(event) => updateSectorProfileOverlay({ color: event.target.value })} /></Field> : <>
          <Field label="Start color"><input type="color" value={overlay.startColor} onChange={(event) => updateSectorProfileOverlay({ startColor: event.target.value })} /></Field>
          <Field label="Start opacity"><div className={styles.overlayRange}><input type="range" min="0" max="100" value={overlay.startOpacity} onChange={(event) => updateSectorProfileOverlay({ startOpacity: Number(event.target.value) })} /><output>{overlay.startOpacity}%</output></div></Field>
          <Field label="End color"><input type="color" value={overlay.endColor} onChange={(event) => updateSectorProfileOverlay({ endColor: event.target.value })} /></Field>
          <Field label="End opacity"><div className={styles.overlayRange}><input type="range" min="0" max="100" value={overlay.endOpacity} onChange={(event) => updateSectorProfileOverlay({ endOpacity: Number(event.target.value) })} /><output>{overlay.endOpacity}%</output></div></Field>
        </>}
      </div>
    </section>;
  };
  const beginGlobalSettings = (item = globalSettings[0]) => {
    const existingResumes = Array.isArray(item?.resumes) ? item.resumes : [];
    const resumes = emptyGlobalSettings.resumes.map((resume) => ({ ...resume, ...(existingResumes.find((itemResume) => itemResume.profile === resume.profile) || {}) }));
    const legacySocialLinks = [{ platform: "upwork", label: "Upwork Profile", url: item?.upwork || "", visible: true, order: 0 }, { platform: "linkedin", label: "LinkedIn Profile", url: item?.linkedin || "", visible: true, order: 1 }, { platform: "github", label: "GitHub", url: item?.github || "", visible: true, order: 2 }];
    const socialLinks = Array.isArray(item?.socialLinks) && item.socialLinks.length ? item.socialLinks.map((social, index) => ({ platform: social.platform || "custom", label: social.label || "", url: social.url || "", visible: social.visible !== false, order: Number(social.order ?? index) || 0 })) : legacySocialLinks;
    setGlobalSettingsForm({ ...emptyGlobalSettings, ...(item || {}), socialLinks, resumes });
    setEditingGlobalSettings(item?.id || null);
  };
  const uploadResume = async (profile, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setResumeUploadState(profile);
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch(`/api/upload/${GLOBAL_SETTINGS}/`, { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Resume upload failed");
      setGlobalSettingsForm((form) => ({ ...form, resumes: form.resumes.map((resume) => resume.profile === profile ? { ...resume, url: result.url } : resume) }));
      setNotice(`${file.name} uploaded. Click Save Global Settings to publish it.`);
    } catch (error) { setNotice(`Upload failed: ${error.message}`); } finally { setResumeUploadState(""); event.target.value = ""; }
  };
  const saveGlobalSettings = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const socialLinks = globalSettingsForm.socialLinks.map((social, index) => ({ platform: String(social.platform || "custom").trim().toLowerCase(), label: String(social.label || "").trim(), url: String(social.url || "").trim(), visible: social.visible !== false, order: Number(social.order ?? index) || 0 })).filter((social) => social.url);
      const data = { ...globalSettingsForm, fullName: globalSettingsForm.fullName.trim(), designation: globalSettingsForm.designation.trim(), email: globalSettingsForm.email.trim(), phone: globalSettingsForm.phone.trim(), whatsapp: globalSettingsForm.whatsapp.trim(), footer: globalSettingsForm.footer.trim(), socialLinks, resumes: globalSettingsForm.resumes.map((resume) => ({ profile: resume.profile, label: resume.label.trim(), url: resume.url.trim(), target: resume.target === "same" ? "same" : "new" })) };
      const response = await fetch(editingGlobalSettings ? `/api/content/${GLOBAL_SETTINGS}/${editingGlobalSettings}/` : `/api/content/${GLOBAL_SETTINGS}/`, { method: editingGlobalSettings ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || "Global Settings could not be saved");
      setGlobalSettings([updated]); setEditingGlobalSettings(updated.id); setNotice("Global profile, contact links and resumes saved.");
    } catch (error) { setNotice(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };
  const destroy = async (item, type) => {
    const label = item.title || item.heading || item.company || "this item";
    if (!window.confirm(`Delete "${label}"?`)) return;
    try {
      const response = await fetch(`/api/content/${type}/${item.id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Item could not be deleted");
    if (type === PROJECTS) setProjects((items) => items.filter((entry) => entry.id !== item.id)); else if (type === HEROES) setHeroes((items) => items.filter((entry) => entry.id !== item.id)); else if (type === ABOUT) setAboutItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === FACTS) setFactsItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === VIDEO) setVideoItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === PROCESS) setProcessItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === SKILLS) setSkillsItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === SKILL_GROUPS) setSkillGroups((items) => items.filter((entry) => entry.id !== item.id)); else if (type === FEATURED) setFeaturedItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === TESTIMONIALS) setTestimonials((items) => items.filter((entry) => entry.id !== item.id)); else if (type === CLIENT_LOGOS) setClientLogos((items) => items.filter((entry) => entry.id !== item.id)); else if (type === CTA) setCtaItems((items) => items.filter((entry) => entry.id !== item.id)); else if (type === PLUGIN_ITEMS) setPluginItems((items) => items.filter((entry) => entry.id !== item.id)); else setExperiences((items) => items.filter((entry) => entry.id !== item.id));
      setNotice("Item deleted successfully.");
    } catch (error) { setNotice(`Delete failed: ${error.message}`); }
  };
  const uploadMedia = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      await refreshMedia();
      setNotice("Media file added to Media Library.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const removeMedia = async (url) => {
    if (!window.confirm("Delete this media file from Media Library?")) return;
    const response = await fetch(`/api/media/?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setNotice(result.reason || result.error || "Image could not be deleted"); return; }
    await refreshMedia();
    setNotice("Media file deleted.");
  };
  const uploadFromExperiencePicker = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setExperienceFile(null);
      setExperienceForm({ ...experienceForm, image: result.url, imagePath: result.url });
      await refreshMedia();
      setMediaPickerOpen(false);
      setNotice("Image uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromProjectPicker = async (event, kind) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      if (kind === "thumb") { setProjectFile(null); setProjectForm({ ...projectForm, thumb: result.url, thumbPath: result.url }); setProjectThumbPickerOpen(false); }
      else { setHoverFile(null); setProjectForm({ ...projectForm, hoverImg: result.url, hoverPath: result.url }); setProjectHoverPickerOpen(false); }
      await refreshMedia(); setNotice("Image uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromHeroPicker = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setHeroForm({ ...heroForm, image: result.url, imagePath: result.url });
      await refreshMedia();
      setHeroMediaPickerOpen(false);
      setNotice("Image uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromAboutPicker = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setAboutForm({ ...aboutForm, image: result.url, imagePath: result.url });
      await refreshMedia(); setAboutMediaPickerOpen(false); setNotice("Image uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromAboutIconPicker = async (event) => {
    const file = event.target.files?.[0];
    const index = aboutIconPickerIndex;
    if (!file || index === null) return;
    if (file.type !== "image/svg+xml") { setNotice("Please upload an SVG icon file."); event.target.value = ""; return; }
    try {
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setAboutForm({ ...aboutForm, features: aboutForm.features.map((feature, position) => position === index ? { ...feature, customIcon: result.url, iconifyIcon: "" } : feature) });
      await refreshMedia(); setAboutIconPickerIndex(null); setNotice("Custom SVG icon uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromProcessIconPicker = async (event) => {
    const file = event.target.files?.[0];
    const index = processIconPickerIndex;
    if (!file || index === null) return;
    if (file.type !== "image/svg+xml") { setNotice("Please upload an SVG icon file."); event.target.value = ""; return; }
    try {
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setProcessForm({ ...processForm, steps: processForm.steps.map((step, position) => position === index ? { ...step, customIcon: result.url, iconifyIcon: "" } : step) });
      await refreshMedia(); setProcessIconPickerIndex(null); setNotice("Custom SVG icon uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromFactsPicker = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setFactsForm({ ...factsForm, image: result.url, imagePath: result.url }); await refreshMedia(); setFactsMediaPickerOpen(false); setNotice("Image uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromSkillsPicker = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    try { const formData = new FormData(); formData.set("file", file); const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed"); setSkillsForm({ ...skillsForm, image: result.url, imagePath: result.url }); await refreshMedia(); setSkillsMediaPickerOpen(false); setNotice("Image uploaded and selected."); } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromVideoPicker = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData(); formData.set("file", file);
      const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setVideoForm({ ...videoForm, image: result.url, imagePath: result.url }); await refreshMedia(); setVideoMediaPickerOpen(false); setNotice("Image uploaded and selected.");
    } catch (error) { setNotice(`Upload failed: ${error.message}`); }
    event.target.value = "";
  };
  const uploadFromTestimonialPicker = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const formData = new FormData(); formData.set("file", file); const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed"); setTestimonialForm({ ...testimonialForm, avatar: result.url, avatarPath: result.url }); await refreshMedia(); setTestimonialAvatarPickerOpen(false); setNotice("Avatar uploaded and selected."); } catch (error) { setNotice(`Upload failed: ${error.message}`); } event.target.value = ""; };
  const uploadFromClientLogoPicker = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const formData = new FormData(); formData.set("file", file); const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed"); setClientLogoForm({ ...clientLogoForm, image: result.url, imagePath: result.url }); await refreshMedia(); setClientLogoPickerOpen(false); setNotice("Client logo uploaded and selected."); } catch (error) { setNotice(`Upload failed: ${error.message}`); } event.target.value = ""; };
  const uploadFromHeaderLogoPicker = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const formData = new FormData(); formData.set("file", file); const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed"); setHeaderForm({ ...headerForm, logo: result.url }); await refreshMedia(); setHeaderLogoPickerOpen(false); setNotice("Header logo uploaded and selected."); } catch (error) { setNotice(`Upload failed: ${error.message}`); } event.target.value = ""; };
  const uploadFromPluginIconPicker = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const formData = new FormData(); formData.set("file", file); const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed"); setPluginItemForm({ ...pluginItemForm, customIcon: result.url }); await refreshMedia(); setPluginIconPickerOpen(false); setNotice("Plugin icon uploaded and selected."); } catch (error) { setNotice(`Upload failed: ${error.message}`); } event.target.value = ""; };
  const uploadFromPluginDownloadPicker = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const formData = new FormData(); formData.set("file", file); const response = await fetch("/api/media/", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed"); setPluginItemForm({ ...pluginItemForm, downloadFile: result.url }); await refreshMedia(); setPluginDownloadPickerOpen(false); setNotice("Downloadable file uploaded and selected."); } catch (error) { setNotice(`Upload failed: ${error.message}`); } event.target.value = ""; };
  const removePickerMedia = async (url, picker) => {
    if (!window.confirm("Delete this media file from Media Library?")) return;
    const response = await fetch(`/api/media/?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setNotice(result.reason || result.error || "Image could not be deleted"); return; }
    if (picker === "experience" && experienceForm.image === url) setExperienceForm({ ...experienceForm, image: "", imagePath: "" });
    if (picker === "hero" && heroForm.image === url) setHeroForm({ ...heroForm, image: "", imagePath: "" });
    if (picker === "about" && aboutForm.image === url) setAboutForm({ ...aboutForm, image: "", imagePath: "" });
    if (picker === "about-icon") setAboutForm({ ...aboutForm, features: aboutForm.features.map((feature) => feature.customIcon === url ? { ...feature, customIcon: "" } : feature) });
    if (picker === "process-icon") setProcessForm({ ...processForm, steps: processForm.steps.map((step) => step.customIcon === url ? { ...step, customIcon: "" } : step) });
    if (picker === "plugin-icon" && pluginItemForm.customIcon === url) setPluginItemForm({ ...pluginItemForm, customIcon: "" });
    if (picker === "plugin-download" && pluginItemForm.downloadFile === url) setPluginItemForm({ ...pluginItemForm, downloadFile: "" });
    if (picker === "facts" && factsForm.image === url) setFactsForm({ ...factsForm, image: "", imagePath: "" });
    if (picker === "skills" && skillsForm.image === url) setSkillsForm({ ...skillsForm, image: "", imagePath: "" });
    if (picker === "video" && videoForm.image === url) setVideoForm({ ...videoForm, image: "", imagePath: "" });
    if (picker === "project-thumb" && projectForm.thumb === url) setProjectForm({ ...projectForm, thumb: "", thumbPath: "" });
    if (picker === "project-hover" && projectForm.hoverImg === url) setProjectForm({ ...projectForm, hoverImg: "", hoverPath: "" });
    await refreshMedia();
    setNotice("Media file deleted.");
  };
  const renderMediaPicker = ({ open, close, selectedUrl, onSelect, onUpload, label, picker, svgOnly = false, fileOnly = false }) => {
    if (!open) return null;
    const visibleMedia = mediaFiles.filter((media) => media.name.toLowerCase().includes(mediaPickerSearch.trim().toLowerCase()) && (!svgOnly || /\.svg$/i.test(media.name)) && (fileOnly ? media.kind === "file" : media.kind !== "file"));
    if (fileOnly) return <div className={mediaStyles.backdrop} role="dialog" aria-modal="true" aria-label={`Choose ${label} from Media Library`}><div className={mediaStyles.modal}><div className={mediaStyles.modalHead}><div><p>Media Library</p><h3>Choose {label}</h3></div><button type="button" onClick={close}>Close</button></div><div className={mediaStyles.pickerTools}><label className={mediaStyles.uploadButton}><FaPlus /> Upload a new file<input type="file" accept=".zip,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rar" onChange={onUpload} hidden /></label><input type="search" value={mediaPickerSearch} onChange={(event) => setMediaPickerSearch(event.target.value)} placeholder="Search file name..." aria-label="Search file name" /></div><div className={mediaStyles.pickerGrid}>{visibleMedia.length === 0 ? <p className={mediaStyles.emptyState}>No downloadable file matches your search.</p> : visibleMedia.map((media) => <article className={mediaStyles.pickWrap} key={media.url}><button type="button" className={`${mediaStyles.pickCard}${selectedUrl === media.url ? ` ${mediaStyles.selected}` : ""}`} onClick={() => { onSelect(media); setMediaPickerSearch(""); close(); }}><span className={mediaStyles.filePreview}>FILE</span><span>{media.name}</span></button><button type="button" className={mediaStyles.pickDelete} onClick={() => removePickerMedia(media.url, picker)}><FaTrash /> Delete</button></article>)}</div></div></div>;
    return <div className={mediaStyles.backdrop} role="dialog" aria-modal="true" aria-label={`Choose ${label} from Media Library`}><div className={mediaStyles.modal}><div className={mediaStyles.modalHead}><div><p>Media Library</p><h3>Choose {label}</h3></div><button type="button" onClick={close}>Ã—</button></div><div className={mediaStyles.pickerTools}><label className={mediaStyles.uploadButton}><FaPlus /> Upload a new image<input type="file" accept={svgOnly ? "image/svg+xml" : "image/*"} onChange={onUpload} hidden /></label><input type="search" value={mediaPickerSearch} onChange={(event) => setMediaPickerSearch(event.target.value)} placeholder="Search image nameâ€¦" aria-label="Search image name" /></div><div className={mediaStyles.pickerGrid}>{visibleMedia.length === 0 ? <p className={mediaStyles.emptyState}>{svgOnly ? "No SVG icon matches your search." : `No image matches â€œ${mediaPickerSearch}â€.`}</p> : visibleMedia.map((media) => <article className={mediaStyles.pickWrap} key={media.url}><button type="button" className={`${mediaStyles.pickCard}${selectedUrl === media.url ? ` ${mediaStyles.selected}` : ""}`} onClick={() => { onSelect(media); setMediaPickerSearch(""); close(); }}><img src={media.url} alt={media.name} /><span>{media.name}</span></button><button type="button" className={mediaStyles.pickDelete} onClick={() => removePickerMedia(media.url, picker)}><FaTrash /> Delete</button></article>)}</div></div></div>;
  };
  const renderAboutIconLibrary = () => {
    if (aboutLibraryPickerIndex === null) return null;
    const current = aboutForm.features[aboutLibraryPickerIndex] || {};
    const iconifyUrl = (icon) => `https://api.iconify.design/${icon.replace(":", "/")}.svg`;
    const close = () => { setAboutLibraryPickerIndex(null); setIconifySearch(""); };
    return <div className={mediaStyles.backdrop} role="dialog" aria-modal="true" aria-label="Choose service icon"><div className={mediaStyles.iconLibraryModal}><div className={mediaStyles.modalHead}><div><p>Connected Icon Libraries</p><h3>Search and choose an icon</h3></div><button type="button" onClick={close}>Ã—</button></div><input className={mediaStyles.iconSearch} type="search" value={iconifySearch} onChange={(event) => setIconifySearch(event.target.value)} placeholder="Search Font Awesome, Material, Lucide, Tablerâ€¦" autoFocus />{iconifySearch.trim().length < 2 ? <><p className={mediaStyles.libraryHint}>Search 2 or more letters to browse connected libraries. Popular local icons are shown below.</p><div className={mediaStyles.iconLibraryGrid}>{aboutIconLibrary.map(([icon, label]) => <button type="button" key={icon} className={current.icon === icon && !current.customIcon && !current.iconifyIcon ? mediaStyles.iconLibrarySelected : ""} onClick={() => { setAboutForm({ ...aboutForm, features: aboutForm.features.map((feature, index) => index === aboutLibraryPickerIndex ? { ...feature, icon, customIcon: "", iconifyIcon: "" } : feature) }); close(); }}><i className={`fal ${icon}`} /><span>{label}</span></button>)}</div></> : iconifyLoading ? <p className={mediaStyles.libraryHint}>Searching icon librariesâ€¦</p> : iconifyError ? <p className={mediaStyles.libraryError}>{iconifyError}</p> : <div className={mediaStyles.iconLibraryGrid}>{iconifyResults.map((icon) => <button type="button" key={icon} className={current.iconifyIcon === icon ? mediaStyles.iconLibrarySelected : ""} onClick={() => { setAboutForm({ ...aboutForm, features: aboutForm.features.map((feature, index) => index === aboutLibraryPickerIndex ? { ...feature, customIcon: "", iconifyIcon: icon } : feature) }); close(); }}><img src={iconifyUrl(icon)} alt="" /><span>{icon}</span></button>)}</div>}</div></div>;
  };
  const renderProcessIconLibrary = () => {
    if (processLibraryPickerIndex === null) return null;
    const current = processForm.steps[processLibraryPickerIndex] || {};
    const iconifyUrl = (icon) => `https://api.iconify.design/${icon.replace(":", "/")}.svg`;
    const close = () => { setProcessLibraryPickerIndex(null); setIconifySearch(""); };
    return <div className={mediaStyles.backdrop} role="dialog" aria-modal="true" aria-label="Choose process icon"><div className={mediaStyles.iconLibraryModal}><div className={mediaStyles.modalHead}><div><p>Connected Icon Libraries</p><h3>Search and choose an icon</h3></div><button type="button" onClick={close}>Ãƒâ€”</button></div><input className={mediaStyles.iconSearch} type="search" value={iconifySearch} onChange={(event) => setIconifySearch(event.target.value)} placeholder="Search Font Awesome, Material, Lucide, TablerÃ¢â‚¬Â¦" autoFocus />{iconifySearch.trim().length < 2 ? <><p className={mediaStyles.libraryHint}>Search 2 or more letters to browse connected libraries. Popular local icons are shown below.</p><div className={mediaStyles.iconLibraryGrid}>{aboutIconLibrary.map(([icon, label]) => <button type="button" key={icon} className={current.icon === icon && !current.customIcon && !current.iconifyIcon ? mediaStyles.iconLibrarySelected : ""} onClick={() => { setProcessForm({ ...processForm, steps: processForm.steps.map((step, index) => index === processLibraryPickerIndex ? { ...step, icon, customIcon: "", iconifyIcon: "" } : step) }); close(); }}><i className={`fal ${icon}`} /><span>{label}</span></button>)}</div></> : iconifyLoading ? <p className={mediaStyles.libraryHint}>Searching icon librariesÃ¢â‚¬Â¦</p> : iconifyError ? <p className={mediaStyles.libraryError}>{iconifyError}</p> : <div className={mediaStyles.iconLibraryGrid}>{iconifyResults.map((icon) => <button type="button" key={icon} className={current.iconifyIcon === icon ? mediaStyles.iconLibrarySelected : ""} onClick={() => { setProcessForm({ ...processForm, steps: processForm.steps.map((step, index) => index === processLibraryPickerIndex ? { ...step, customIcon: "", iconifyIcon: icon } : step) }); close(); }}><img src={iconifyUrl(icon)} alt="" /><span>{icon}</span></button>)}</div>}</div></div>;
  };

  const renderProjectForm = () => {
    const subcategories = Array.from(new Map(projects.filter((project) => project.mainCategory === projectForm.mainCategory && project.subcategory).map((project) => [normalizeTaxonomyLabel(project.subcategory), project.subcategory])).values());
    const selectableSubcategories = projectForm.subcategory && !subcategories.some((item) => normalizeTaxonomyLabel(item) === normalizeTaxonomyLabel(projectForm.subcategory)) ? [...subcategories, projectForm.subcategory] : subcategories;
    return <form className={styles.editor} onSubmit={saveProject}>
    <div className={styles.editorHead}><h3>{editingProject ? "Edit project" : "Add project"}</h3><button type="button" className={styles.close} onClick={resetProject}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Project title"><input required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} /></Field>
      <Field label="Main skill category"><select value={projectForm.mainCategory} onChange={(e) => { setAddingProjectSubcategory(false); setProjectForm({ ...projectForm, mainCategory: e.target.value, subcategory: "" }); }}>{MAIN_SKILL_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
      <Field label="Subcategory"><div className={subcategoryStyles.control}><button type="button" className={subcategoryStyles.trigger} onClick={() => setProjectSubcategoryMenuOpen((open) => !open)}>{projectForm.subcategory || "Select a subcategory"}<span>âŒ„</span></button>{projectSubcategoryMenuOpen && <div className={subcategoryStyles.menu}><div className={subcategoryStyles.menuHead}><strong>Select a subcategory</strong><button type="button" onClick={() => { setAddingProjectSubcategory(true); setProjectSubcategoryMenuOpen(false); setProjectForm({ ...projectForm, subcategory: "" }); }}>+ Add New Subcategory</button></div><div className={subcategoryStyles.options}>{selectableSubcategories.length === 0 ? <span>No subcategories yet.</span> : selectableSubcategories.map((item) => <button type="button" key={item} className={item === projectForm.subcategory ? subcategoryStyles.selected : ""} onClick={() => { setAddingProjectSubcategory(false); setProjectSubcategoryMenuOpen(false); setProjectForm({ ...projectForm, subcategory: item }); }}>{item}</button>)}</div></div>}</div>{addingProjectSubcategory && <div style={{ display: "flex", gap: 8, marginTop: 8 }}><input autoFocus value={projectForm.subcategory} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} onChange={(e) => setProjectForm({ ...projectForm, subcategory: e.target.value })} placeholder="New subcategory name" /><button type="button" className={styles.close} onClick={() => { if (!projectForm.subcategory.trim()) { setNotice("Enter a subcategory name first."); return; } setAddingProjectSubcategory(false); }}>Add</button><button type="button" className={styles.close} onClick={() => { setAddingProjectSubcategory(false); setProjectForm({ ...projectForm, subcategory: "" }); }}>Cancel</button></div>}</Field>
      <Field label="Website link"><input required type="url" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} placeholder="https://example.com" /></Field>
      <Field label="Thumbnail image"><div className={mediaStyles.pickerTrigger}>{projectForm.thumb ? <img src={projectForm.thumb} alt="Selected project thumbnail" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setProjectThumbPickerOpen(true); }}>Choose from Media Library</button>{projectForm.thumb && <button type="button" className={mediaStyles.removeSelection} onClick={() => setProjectForm({ ...projectForm, thumb: "", thumbPath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: projectThumbPickerOpen, close: () => setProjectThumbPickerOpen(false), selectedUrl: projectForm.thumb, onSelect: (media) => { setProjectFile(null); setProjectForm({ ...projectForm, thumb: media.url, thumbPath: media.url }); }, onUpload: (event) => uploadFromProjectPicker(event, "thumb"), label: "project thumbnail", picker: "project-thumb" })}
      <Field label="Full / hover image"><div className={mediaStyles.pickerTrigger}>{projectForm.hoverImg ? <img src={projectForm.hoverImg} alt="Selected project hover image" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setProjectHoverPickerOpen(true); }}>Choose from Media Library</button>{projectForm.hoverImg && <button type="button" className={mediaStyles.removeSelection} onClick={() => setProjectForm({ ...projectForm, hoverImg: "", hoverPath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: projectHoverPickerOpen, close: () => setProjectHoverPickerOpen(false), selectedUrl: projectForm.hoverImg, onSelect: (media) => { setHoverFile(null); setProjectForm({ ...projectForm, hoverImg: media.url, hoverPath: media.url }); }, onUpload: (event) => uploadFromProjectPicker(event, "hover"), label: "project hover image", picker: "project-hover" })}
      <Field label="Short description"><textarea rows="5" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="A short summary for this project" /></Field>
      <Field label="Full project details"><textarea rows="5" value={projectForm.details} onChange={(e) => setProjectForm({ ...projectForm, details: e.target.value })} placeholder="Optional longer project details" /></Field>
      <div className={`${styles.field} ${styles.wide}`}><span>Project settings</span><div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(140px, 1fr))", gap: 12 }}><label>Display order<input type="number" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: e.target.value })} /></label><label>Featured order<input type="number" min="0" disabled={!projectForm.featured} value={projectForm.featuredOrder} onChange={(e) => setProjectForm({ ...projectForm, featuredOrder: e.target.value })} /></label><label>Featured project<span style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, fontWeight: 600 }}><input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} /> Featured</span></label><label>Published<select value={projectForm.published ? "yes" : "no"} onChange={(e) => setProjectForm({ ...projectForm, published: e.target.value === "yes" })}><option value="yes">Yes</option><option value="no">Draft</option></select></label></div></div>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Savingâ€¦" : editingProject ? "Update project" : "Save project"}</button></div>
  </form>;
  };
  const renderExperienceForm = () => <form className={styles.editor} onSubmit={saveExperience}>
    <div className={styles.editorHead}><h3>{editingExperience ? "Edit work experience" : "Add work experience"}</h3><button type="button" className={styles.close} onClick={resetExperience}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Company name"><input required value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} /></Field>
      <Field label="Job title / role"><input required value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} /></Field>
      <div className={`${styles.field} ${styles.wide}`}><span>Job display settings</span><div className={styles.experienceControlRow}><label>Period<input required value={experienceForm.period} onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })} placeholder="2022 - Present" /></label><label>Choose layout<select value={experienceForm.layout} onChange={(e) => setExperienceForm({ ...experienceForm, layout: e.target.value })}><option value="standard">1. Job &rarr; Image &rarr; Details</option><option value="reverse">2. Details &rarr; Image &rarr; Job</option><option value="image-right">3. Job &rarr; Details &rarr; Image</option><option value="no-image">4. Job &rarr; Details (wide, no image)</option></select></label><label>Display order<input type="number" value={experienceForm.order} onChange={(e) => setExperienceForm({ ...experienceForm, order: e.target.value })} /></label></div></div>
      <div className={`${styles.field} ${styles.wide}`}><span>Experience image & link</span><div className={styles.experienceImageRow}><label>Experience image<div className={mediaStyles.pickerTrigger}>{experienceForm.image ? <img src={experienceForm.image} alt="Selected experience" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setMediaPickerOpen(true); }}>Choose from Media Library</button>{experienceForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setExperienceForm({ ...experienceForm, image: "", imagePath: "" })}>Remove</button>}</div></label><label>Image click link<input value={experienceForm.imageLink} onChange={(e) => setExperienceForm({ ...experienceForm, imageLink: e.target.value })} placeholder="https://... (optional)" /></label><label>Open image link in<select value={experienceForm.imageLinkTarget} onChange={(e) => setExperienceForm({ ...experienceForm, imageLinkTarget: e.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></label></div></div>
      {renderMediaPicker({ open: mediaPickerOpen, close: () => setMediaPickerOpen(false), selectedUrl: experienceForm.image, onSelect: (media) => { setExperienceFile(null); setExperienceForm({ ...experienceForm, image: media.url, imagePath: media.url }); }, onUpload: uploadFromExperiencePicker, label: "experience image", picker: "experience" })}
      <Field label="Description"><textarea required rows="5" value={experienceForm.summary} onChange={(e) => setExperienceForm({ ...experienceForm, summary: e.target.value })} /></Field>
      <Field label="Highlights (one per line)"><textarea rows="5" value={experienceForm.highlights} onChange={(e) => setExperienceForm({ ...experienceForm, highlights: e.target.value })} /></Field>
      <div className={`${styles.field} ${styles.wide}`}><span>View Work button</span><div className={styles.experienceViewWorkRow}><label>Button text<input value={experienceForm.buttonText} onChange={(e) => setExperienceForm({ ...experienceForm, buttonText: e.target.value })} placeholder="View Work +" /></label><label>Button link<input value={experienceForm.buttonLink} onChange={(e) => setExperienceForm({ ...experienceForm, buttonLink: e.target.value })} placeholder="https://... (optional)" /></label><label>Open in<select value={experienceForm.buttonTarget} onChange={(e) => setExperienceForm({ ...experienceForm, buttonTarget: e.target.value })}><option value="new">New tab</option><option value="same">Same tab</option></select></label></div></div>
      <div style={{ display: "none" }}>
      <Field label="Company name"><input required value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} /></Field>
      <Field label="Job title / role"><input required value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} /></Field>
      <Field label="Period"><input required value={experienceForm.period} onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })} placeholder="2022 â€” Present" /></Field>
      <Field label="Display order"><input type="number" value={experienceForm.order} onChange={(e) => setExperienceForm({ ...experienceForm, order: e.target.value })} /></Field>
      <Field label="Layout"><select value={experienceForm.layout} onChange={(e) => setExperienceForm({ ...experienceForm, layout: e.target.value })}><option value="standard">Job â†’ Image â†’ Details</option><option value="reverse">Details â†’ Image â†’ Job</option></select></Field>
      <Field label="Experience image" wide><div className={mediaStyles.pickerTrigger}>{experienceForm.image ? <img src={experienceForm.image} alt="Selected experience" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setMediaPickerOpen(true); }}>Choose from Media Library</button>{experienceForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setExperienceForm({ ...experienceForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: mediaPickerOpen, close: () => setMediaPickerOpen(false), selectedUrl: experienceForm.image, onSelect: (media) => { setExperienceFile(null); setExperienceForm({ ...experienceForm, image: media.url, imagePath: media.url }); }, onUpload: uploadFromExperiencePicker, label: "experience image", picker: "experience" })}
      <Field label="Choose layout" wide><select value={experienceForm.layout} onChange={(e) => setExperienceForm({ ...experienceForm, layout: e.target.value })}><option value="standard">1. Job â†’ Image â†’ Details</option><option value="reverse">2. Details â†’ Image â†’ Job</option><option value="image-right">3. Job â†’ Details â†’ Image</option><option value="no-image">4. Job â†’ Details (wide, no image)</option></select></Field>
      <Field label="Description" wide><textarea required rows="4" value={experienceForm.summary} onChange={(e) => setExperienceForm({ ...experienceForm, summary: e.target.value })} /></Field>
      <Field label="Highlights (one per line)" wide><textarea rows="4" value={experienceForm.highlights} onChange={(e) => setExperienceForm({ ...experienceForm, highlights: e.target.value })} /></Field>
      <Field label="View Work button text"><input value={experienceForm.buttonText} onChange={(e) => setExperienceForm({ ...experienceForm, buttonText: e.target.value })} placeholder="View Work +" /></Field>
      <Field label="View Work button link"><input value={experienceForm.buttonLink} onChange={(e) => setExperienceForm({ ...experienceForm, buttonLink: e.target.value })} placeholder="https://... (optional)" /></Field>
      <Field label="Open View Work in"><select value={experienceForm.buttonTarget} onChange={(e) => setExperienceForm({ ...experienceForm, buttonTarget: e.target.value })}><option value="new">New tab</option><option value="same">Same tab</option></select></Field>
      <Field label="Image click link"><input value={experienceForm.imageLink} onChange={(e) => setExperienceForm({ ...experienceForm, imageLink: e.target.value })} placeholder="https://... (optional)" /></Field>
      <Field label="Open image link in"><select value={experienceForm.imageLinkTarget} onChange={(e) => setExperienceForm({ ...experienceForm, imageLinkTarget: e.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></Field>
      </div>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Savingâ€¦" : editingExperience ? "Update experience" : "Save experience"}</button></div>
  </form>;
  const renderExperienceSettingsForm = () => <form className={styles.editor} onSubmit={saveExperienceSettings}>
    <div className={styles.editorHead}><h3>Work Experience section title</h3><button type="button" className={styles.close} onClick={resetExperienceSettings}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Side section label"><input value={experienceSettingsForm.sectionLabel} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, sectionLabel: e.target.value })} placeholder="My Resume" /></Field>
      <Field label="Small heading"><input value={experienceSettingsForm.eyebrow} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, eyebrow: e.target.value })} placeholder="Some Words About Me" /></Field>
      <Field label="Main heading (use [highlight]text[/highlight] for yellow words)" wide><textarea required rows="3" value={experienceSettingsForm.heading} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, heading: e.target.value })} /></Field>
      <Field label="Description" wide><textarea rows="4" value={experienceSettingsForm.description} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, description: e.target.value })} /></Field>
      <Field label="Button text"><input value={experienceSettingsForm.buttonText} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, buttonText: e.target.value })} /></Field>
      <Field label="Button link source"><select value={experienceSettingsForm.buttonSource} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, buttonSource: e.target.value })}><option value="resume">Use Resume Center</option><option value="custom">Use custom link</option></select></Field>
      {experienceSettingsForm.buttonSource === "resume" ? <Field label="Resume to use"><select value={experienceSettingsForm.resumeProfile} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, resumeProfile: e.target.value })}><option value="active">Active portfolio profile (recommended)</option><option value="wordpress">WordPress Resume</option><option value="motion">Motion & Video Resume</option><option value="multimedia">Multimedia Resume</option></select></Field> : <><Field label="Button link"><input value={experienceSettingsForm.buttonLink} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, buttonLink: e.target.value })} placeholder="/resume.pdf or https://..." /></Field><Field label="Open button in"><select value={experienceSettingsForm.buttonTarget} onChange={(e) => setExperienceSettingsForm({ ...experienceSettingsForm, buttonTarget: e.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></Field></>}
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : "Save Work Experience title"}</button></div>
  </form>;
  const renderHeroForm = () => <form className={styles.editor} onSubmit={saveHero}>
    <div className={styles.editorHead}><h3>{editingHero ? "Edit hero slide" : "Add hero slide"}</h3><button type="button" className={styles.close} onClick={resetHero}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Heading"><input required value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} placeholder="Your hero headline" /></Field>
      <Field label="Display order"><input type="number" min="0" value={heroForm.order} onChange={(e) => setHeroForm({ ...heroForm, order: e.target.value })} /></Field>
      <Field label="Category 1"><input value={heroForm.categoryOne} onChange={(e) => setHeroForm({ ...heroForm, categoryOne: e.target.value })} placeholder="Web Design" /></Field>
      <Field label="Category 2 (optional)"><input value={heroForm.categoryTwo} onChange={(e) => setHeroForm({ ...heroForm, categoryTwo: e.target.value })} placeholder="Elementor" /></Field>
      <Field label="Profile link (image, category & heading)"><input value={heroForm.profileLink} onChange={(e) => setHeroForm({ ...heroForm, profileLink: e.target.value })} placeholder="/wordpress/" /></Field>
      <Field label="Button / project link"><input value={heroForm.link} onChange={(e) => setHeroForm({ ...heroForm, link: e.target.value })} placeholder="https://example.com or /portfolio/" /></Field>
      <Field label="Overlay color"><input type="color" value={heroForm.overlayColor} onChange={(e) => setHeroForm({ ...heroForm, overlayColor: e.target.value })} /></Field>
      <Field label={`Overlay opacity: ${heroForm.overlayOpacity}%`}><input type="range" min="0" max="90" step="5" value={heroForm.overlayOpacity} onChange={(e) => setHeroForm({ ...heroForm, overlayOpacity: e.target.value })} /></Field>
      <Field label="Background image" wide><div className={mediaStyles.pickerTrigger}>{heroForm.image ? <img src={heroForm.image} alt="Selected hero background" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setHeroMediaPickerOpen(true); }}>Choose from Media Library</button>{heroForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setHeroForm({ ...heroForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: heroMediaPickerOpen, close: () => setHeroMediaPickerOpen(false), selectedUrl: heroForm.image, onSelect: (media) => setHeroForm({ ...heroForm, image: media.url, imagePath: media.url }), onUpload: uploadFromHeroPicker, label: "hero background", picker: "hero" })}
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Savingâ€¦" : editingHero ? "Update hero slide" : "Save hero slide"}</button></div>
  </form>;
  const renderAboutForm = () => <form className={styles.editor} onSubmit={saveAbout}>
    <div className={styles.editorHead}><h3>{editingAbout ? "Edit About Me" : "Add About Me content"}</h3><button type="button" className={styles.close} onClick={resetAbout}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Side label"><input value={aboutForm.sectionLabel} onChange={(e) => setAboutForm({ ...aboutForm, sectionLabel: e.target.value })} /></Field>
      <Field label="Image label"><input value={aboutForm.imageLabel} onChange={(e) => setAboutForm({ ...aboutForm, imageLabel: e.target.value })} /></Field>
      <Field label="Small heading" wide><input value={aboutForm.eyebrow} onChange={(e) => setAboutForm({ ...aboutForm, eyebrow: e.target.value })} /></Field>
      <Field label="Main heading (new line allowed; use [highlight]text[/highlight] for yellow words)" wide><textarea required rows="3" value={aboutForm.heading} onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })} /></Field>
      <Field label="Description" wide><textarea required rows="5" value={aboutForm.description} onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })} /></Field>
      <Field label="Button text"><input value={aboutForm.buttonText} onChange={(e) => setAboutForm({ ...aboutForm, buttonText: e.target.value })} /></Field>
      <Field label="Button link"><input value={aboutForm.buttonLink} onChange={(e) => setAboutForm({ ...aboutForm, buttonLink: e.target.value })} placeholder="/portfolio/" /></Field>
      <Field label="About image" wide><div className={mediaStyles.pickerTrigger}>{aboutForm.image ? <img src={aboutForm.image} alt="Selected About" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setAboutMediaPickerOpen(true); }}>Choose from Media Library</button>{aboutForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setAboutForm({ ...aboutForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: aboutMediaPickerOpen, close: () => setAboutMediaPickerOpen(false), selectedUrl: aboutForm.image, onSelect: (media) => setAboutForm({ ...aboutForm, image: media.url, imagePath: media.url }), onUpload: uploadFromAboutPicker, label: "About image", picker: "about" })}
      <Field label="Services" wide><div>{aboutForm.features.map((feature, index) => <div key={index} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 10, marginBottom: 12 }}><div><button type="button" className={mediaStyles.iconPickerButton} onClick={() => setAboutLibraryPickerIndex(index)}>{feature.customIcon ? <img className={mediaStyles.buttonIconPreview} src={feature.customIcon} alt="" /> : feature.iconifyIcon ? <img className={mediaStyles.buttonIconPreview} src={`https://api.iconify.design/${feature.iconifyIcon.replace(":", "/")}.svg`} alt="" /> : <i className={`fal ${feature.icon}`} />} Choose library icon</button><button type="button" className={mediaStyles.iconPickerButton} onClick={() => { setMediaPickerSearch(""); setAboutIconPickerIndex(index); }}>{feature.customIcon ? "Change custom SVG" : "Use custom SVG"}</button>{feature.customIcon && <img className={mediaStyles.iconPreview} src={feature.customIcon} alt="Custom service icon" />}</div><div><input required value={feature.title} onChange={(e) => setAboutForm({ ...aboutForm, features: aboutForm.features.map((item, position) => position === index ? { ...item, title: e.target.value } : item) })} placeholder={`Service ${index + 1} title`} /><textarea rows="2" value={feature.description} onChange={(e) => setAboutForm({ ...aboutForm, features: aboutForm.features.map((item, position) => position === index ? { ...item, description: e.target.value } : item) })} placeholder="Service description" /></div></div>)}</div></Field>
      {renderMediaPicker({ open: aboutIconPickerIndex !== null, close: () => setAboutIconPickerIndex(null), selectedUrl: aboutIconPickerIndex === null ? "" : aboutForm.features[aboutIconPickerIndex]?.customIcon, onSelect: (media) => setAboutForm({ ...aboutForm, features: aboutForm.features.map((feature, position) => position === aboutIconPickerIndex ? { ...feature, customIcon: media.url, iconifyIcon: "" } : feature) }), onUpload: uploadFromAboutIconPicker, label: "custom SVG icon", picker: "about-icon", svgOnly: true })}
      {renderAboutIconLibrary()}
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Savingâ€¦" : editingAbout ? "Update About section" : "Save About section"}</button></div>
  </form>;
  const renderFactsForm = () => <form className={styles.editor} onSubmit={saveFacts}>
    <div className={styles.editorHead}><h3>{editingFacts ? "Edit Interesting Facts" : "Add Interesting Facts"}</h3><button type="button" className={styles.close} onClick={resetFacts}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Heading (use [highlight]text[/highlight] for yellow words)" wide><textarea required rows="3" value={factsForm.heading} onChange={(e) => setFactsForm({ ...factsForm, heading: e.target.value })} /></Field>
      <Field label="Description" wide><textarea required rows="4" value={factsForm.description} onChange={(e) => setFactsForm({ ...factsForm, description: e.target.value })} /></Field>
      <Field label="Vertical subtitle"><input value={factsForm.subtitle} onChange={(e) => setFactsForm({ ...factsForm, subtitle: e.target.value })} /></Field>
      <Field label="Overlay color"><input type="color" value={factsForm.overlayColor} onChange={(e) => setFactsForm({ ...factsForm, overlayColor: e.target.value })} /></Field>
      <Field label={`Overlay opacity: ${factsForm.overlayOpacity}%`}><input type="range" min="0" max="90" step="5" value={factsForm.overlayOpacity} onChange={(e) => setFactsForm({ ...factsForm, overlayOpacity: e.target.value })} /></Field>
      <Field label="Background image" wide><div className={mediaStyles.pickerTrigger}>{factsForm.image ? <img src={factsForm.image} alt="Selected facts background" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setFactsMediaPickerOpen(true); }}>Choose from Media Library</button>{factsForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setFactsForm({ ...factsForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: factsMediaPickerOpen, close: () => setFactsMediaPickerOpen(false), selectedUrl: factsForm.image, onSelect: (media) => setFactsForm({ ...factsForm, image: media.url, imagePath: media.url }), onUpload: uploadFromFactsPicker, label: "facts background", picker: "facts" })}
      <Field label="Counters" wide><div>{factsForm.items.map((item, index) => <div key={index} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10, marginBottom: 10 }}><input required value={item.number} onChange={(e) => setFactsForm({ ...factsForm, items: factsForm.items.map((entry, position) => position === index ? { ...entry, number: e.target.value } : entry) })} placeholder="Number" /><input required value={item.label} onChange={(e) => setFactsForm({ ...factsForm, items: factsForm.items.map((entry, position) => position === index ? { ...entry, label: e.target.value } : entry) })} placeholder="Counter label" /></div>)}</div></Field>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Savingâ€¦" : editingFacts ? "Update Facts section" : "Save Facts section"}</button></div>
  </form>;
  const renderVideoForm = () => <form className={styles.editor} onSubmit={saveVideo}>
    <div className={styles.editorHead}><h3>{editingVideo ? "Edit Video Presentation" : "Add Video Presentation"}</h3><button type="button" className={styles.close} onClick={resetVideo}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Title" wide><input required value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} /></Field>
      <Field label="Description" wide><textarea required rows="5" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} /></Field>
      <Field label="Video URL" wide><input required value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=... or Vimeo URL" /></Field>
      <Field label="Button text"><input value={videoForm.buttonText} onChange={(e) => setVideoForm({ ...videoForm, buttonText: e.target.value })} /></Field>
      <Field label="Button link"><input value={videoForm.buttonLink} onChange={(e) => setVideoForm({ ...videoForm, buttonLink: e.target.value })} placeholder="https://youtube.com/@yourchannel" /></Field>
      <Field label="Video preview image" wide><div className={mediaStyles.pickerTrigger}>{videoForm.image ? <img src={videoForm.image} alt="Selected video preview" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setVideoMediaPickerOpen(true); }}>Choose from Media Library</button>{videoForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setVideoForm({ ...videoForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>
      {renderMediaPicker({ open: videoMediaPickerOpen, close: () => setVideoMediaPickerOpen(false), selectedUrl: videoForm.image, onSelect: (media) => setVideoForm({ ...videoForm, image: media.url, imagePath: media.url }), onUpload: uploadFromVideoPicker, label: "video preview image", picker: "video" })}
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Savingâ€¦" : editingVideo ? "Update Video section" : "Save Video section"}</button></div>
  </form>;
  const updateProcessStep = (index, values) => setProcessForm({ ...processForm, steps: processForm.steps.map((step, position) => position === index ? { ...step, ...values } : step) });
  const addProcessStep = () => { const nextIndex = processForm.steps.length; setProcessForm({ ...processForm, steps: [...processForm.steps, { ...emptyProcess.steps[0], title: `New Step ${nextIndex + 1}`, subtitle: "", description: "", morePoints: "", customIcon: "", iconifyIcon: "" }] }); setProcessStepTab(nextIndex); };
  const removeProcessStep = (index) => { if (processForm.steps.length <= 1) return; const nextSteps = processForm.steps.filter((_, position) => position !== index); setProcessForm({ ...processForm, steps: nextSteps }); setProcessStepTab(Math.max(0, Math.min(index - 1, nextSteps.length - 1))); };
  const activeProcessStep = processForm.steps[processStepTab] || processForm.steps[0];
  const renderProcessForm = () => <form className={styles.editor} onSubmit={saveProcess}>
    <div className={styles.editorHead}><h3>{editingProcess ? "Edit Working Process" : "Add Working Process"}</h3><button type="button" className={styles.close} onClick={resetProcess}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Side label"><input value={processForm.sectionLabel} onChange={(e) => setProcessForm({ ...processForm, sectionLabel: e.target.value })} /></Field>
      <Field label="Small heading"><input value={processForm.eyebrow} onChange={(e) => setProcessForm({ ...processForm, eyebrow: e.target.value })} /></Field>
      <Field label="Main heading (use [highlight]text[/highlight] for yellow words)" wide><textarea required rows="2" value={processForm.heading} onChange={(e) => setProcessForm({ ...processForm, heading: e.target.value })} /></Field>
      <Field label="Description" wide><textarea required rows="4" value={processForm.description} onChange={(e) => setProcessForm({ ...processForm, description: e.target.value })} /></Field>
      <Field label="Process steps" wide><div><div className={styles.processTabs}>{processForm.steps.map((step, index) => <button type="button" key={index} className={`${styles.processTab}${index === processStepTab ? ` ${styles.processTabActive}` : ""}`} onClick={() => setProcessStepTab(index)}>Step {index + 1}</button>)}<button type="button" className={`${styles.processTab} ${styles.processAddTab}`} onClick={addProcessStep}>+ Add step</button></div>{activeProcessStep && <div className={styles.processStepPanel}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><strong>Editing Step {processStepTab + 1}</strong>{processForm.steps.length > 1 && <button type="button" className={styles.delete} onClick={() => removeProcessStep(processStepTab)}>Remove this step</button>}</div><div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 10 }}><div><button type="button" className={mediaStyles.iconPickerButton} onClick={() => setProcessLibraryPickerIndex(processStepTab)}>{activeProcessStep.customIcon ? <img className={mediaStyles.buttonIconPreview} src={activeProcessStep.customIcon} alt="" /> : activeProcessStep.iconifyIcon ? <img className={mediaStyles.buttonIconPreview} src={`https://api.iconify.design/${activeProcessStep.iconifyIcon.replace(":", "/")}.svg`} alt="" /> : <i className={`fal ${activeProcessStep.icon}`} />} Choose library icon</button><button type="button" className={mediaStyles.iconPickerButton} onClick={() => { setMediaPickerSearch(""); setProcessIconPickerIndex(processStepTab); }}>{activeProcessStep.customIcon ? "Change custom SVG" : "Use custom SVG"}</button></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><input required value={activeProcessStep.title} onChange={(e) => updateProcessStep(processStepTab, { title: e.target.value })} placeholder="Step title" /><input value={activeProcessStep.subtitle} onChange={(e) => updateProcessStep(processStepTab, { subtitle: e.target.value })} placeholder="Small subtitle" /><input value={activeProcessStep.linkText} onChange={(e) => updateProcessStep(processStepTab, { linkText: e.target.value })} placeholder="Button text" /><select value={activeProcessStep.linkTarget === "new" ? "new" : "same"} onChange={(e) => updateProcessStep(processStepTab, { linkTarget: e.target.value })}><option value="same">Open in same tab</option><option value="new">Open in new tab</option></select></div></div><textarea required rows="3" value={activeProcessStep.description} onChange={(e) => updateProcessStep(processStepTab, { description: e.target.value })} placeholder="Step description" style={{ marginTop: 10 }} /><textarea rows="3" value={activeProcessStep.morePoints || ""} onChange={(e) => updateProcessStep(processStepTab, { morePoints: e.target.value })} placeholder="Expanded bullet points (one per line)" style={{ marginTop: 10 }} /><input value={activeProcessStep.link} onChange={(e) => updateProcessStep(processStepTab, { link: e.target.value })} placeholder="Button link (optional)" style={{ marginTop: 10 }} /></div>}</div></Field>
      {renderMediaPicker({ open: processIconPickerIndex !== null, close: () => setProcessIconPickerIndex(null), selectedUrl: processIconPickerIndex === null ? "" : processForm.steps[processIconPickerIndex]?.customIcon, onSelect: (media) => setProcessForm({ ...processForm, steps: processForm.steps.map((step, position) => position === processIconPickerIndex ? { ...step, customIcon: media.url, iconifyIcon: "" } : step) }), onUpload: uploadFromProcessIconPicker, label: "custom SVG icon", picker: "process-icon", svgOnly: true })}
      {renderProcessIconLibrary()}
      <Field label="CTA text"><input value={processForm.ctaText} onChange={(e) => setProcessForm({ ...processForm, ctaText: e.target.value })} /></Field>
      <Field label="CTA button text"><input value={processForm.ctaButtonText} onChange={(e) => setProcessForm({ ...processForm, ctaButtonText: e.target.value })} /></Field>
      <Field label="CTA button link" wide><input value={processForm.ctaButtonLink} onChange={(e) => setProcessForm({ ...processForm, ctaButtonLink: e.target.value })} placeholder="services.html or https://example.com" /></Field>
      <Field label="CTA button behavior"><select value={processForm.ctaButtonTarget === "new" ? "new" : "same"} onChange={(e) => setProcessForm({ ...processForm, ctaButtonTarget: e.target.value })}><option value="same">Open in same tab</option><option value="new">Open in new tab</option></select></Field>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingProcess ? "Update Working Process" : "Save Working Process"}</button></div>
  </form>;
  const renderSkillsForm = () => <form className={styles.editor} onSubmit={saveSkills}><div className={styles.editorHead}><h3>{editingSkills ? "Edit Skills section" : "Add Skills section"}</h3><button type="button" className={styles.close} onClick={resetSkills}>Close</button></div><div className={styles.formGrid}><Field label="Heading (use [highlight]text[/highlight] for yellow words)" wide><textarea required rows="3" value={skillsForm.heading} onChange={(e) => setSkillsForm({ ...skillsForm, heading: e.target.value })} /></Field><Field label="Description" wide><textarea required rows="5" value={skillsForm.description} onChange={(e) => setSkillsForm({ ...skillsForm, description: e.target.value })} /></Field><Field label="Vertical subtitle"><input value={skillsForm.subtitle} onChange={(e) => setSkillsForm({ ...skillsForm, subtitle: e.target.value })} /></Field><Field label="Overlay color"><input type="color" value={skillsForm.overlayColor} onChange={(e) => setSkillsForm({ ...skillsForm, overlayColor: e.target.value })} /></Field><Field label={`Overlay opacity: ${skillsForm.overlayOpacity}%`}><input type="range" min="0" max="90" step="5" value={skillsForm.overlayOpacity} onChange={(e) => setSkillsForm({ ...skillsForm, overlayOpacity: e.target.value })} /></Field><Field label="Background image" wide><div className={mediaStyles.pickerTrigger}>{skillsForm.image ? <img src={skillsForm.image} alt="Selected Skills background" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setSkillsMediaPickerOpen(true); }}>Choose from Media Library</button>{skillsForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setSkillsForm({ ...skillsForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>{renderMediaPicker({ open: skillsMediaPickerOpen, close: () => setSkillsMediaPickerOpen(false), selectedUrl: skillsForm.image, onSelect: (media) => setSkillsForm({ ...skillsForm, image: media.url, imagePath: media.url }), onUpload: uploadFromSkillsPicker, label: "Skills background", picker: "skills" })}</div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingSkills ? "Update Skills section" : "Save Skills section"}</button></div></form>;
  const renderSkillGroupForm = () => <form className={styles.editor} onSubmit={saveSkillGroup}><div className={styles.editorHead}><h3>{editingSkillGroup ? "Edit main skill" : "Add main skill"}</h3><button type="button" className={styles.close} onClick={resetSkillGroup}>Close</button></div><div className={styles.formGrid}><Field label="Main skill title"><input required value={skillGroupForm.title} onChange={(e) => setSkillGroupForm({ ...skillGroupForm, title: e.target.value })} placeholder="WordPress Designer and Developer" /></Field><Field label="Display style"><select value={skillGroupForm.display} onChange={(e) => setSkillGroupForm({ ...skillGroupForm, display: e.target.value })}><option value="circle">Percentage circles</option><option value="bar">Percentage bars</option></select></Field><Field label="Short description" wide><textarea rows="3" value={skillGroupForm.description} onChange={(e) => setSkillGroupForm({ ...skillGroupForm, description: e.target.value })} /></Field><Field label="Display order"><input type="number" value={skillGroupForm.order} onChange={(e) => setSkillGroupForm({ ...skillGroupForm, order: e.target.value })} /></Field><Field label="Sub-skills" wide><div>{skillGroupForm.items.map((item, index) => <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px", gap: 10, marginBottom: 10 }}><input required value={item.name} onChange={(e) => setSkillGroupForm({ ...skillGroupForm, items: skillGroupForm.items.map((entry, position) => position === index ? { ...entry, name: e.target.value } : entry) })} placeholder="HTML, CSS, Elementor..." /><input required type="number" min="0" max="100" value={item.percent} onChange={(e) => setSkillGroupForm({ ...skillGroupForm, items: skillGroupForm.items.map((entry, position) => position === index ? { ...entry, percent: e.target.value } : entry) })} placeholder="Percent" /><button type="button" className={styles.delete} disabled={skillGroupForm.items.length === 1} onClick={() => setSkillGroupForm({ ...skillGroupForm, items: skillGroupForm.items.filter((_, position) => position !== index) })}>Delete</button></div>)}<button type="button" className={styles.close} onClick={() => setSkillGroupForm({ ...skillGroupForm, items: [...skillGroupForm.items, { name: "", percent: 80 }] })}>+ Add sub-skill</button></div></Field></div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingSkillGroup ? "Update main skill" : "Save main skill"}</button></div></form>;
  const renderFeaturedForm = () => <form className={styles.editor} onSubmit={saveFeatured}><div className={styles.editorHead}><h3>{editingFeatured ? "Edit Featured Projects" : "Add Featured Projects"}</h3><button type="button" className={styles.close} onClick={resetFeatured}>Close</button></div><div className={styles.formGrid}><Field label="Heading" wide><input required value={featuredForm.heading} onChange={(e) => setFeaturedForm({ ...featuredForm, heading: e.target.value })} /></Field><Field label="Description" wide><textarea rows="4" value={featuredForm.description} onChange={(e) => setFeaturedForm({ ...featuredForm, description: e.target.value })} /></Field><Field label="Button text"><input value={featuredForm.buttonText} onChange={(e) => setFeaturedForm({ ...featuredForm, buttonText: e.target.value })} /></Field><Field label="Button link"><input value={featuredForm.buttonLink} onChange={(e) => setFeaturedForm({ ...featuredForm, buttonLink: e.target.value })} /></Field><Field label="Carousel projects" wide><div>{featuredForm.items.map((item, index) => <div key={index} style={{ borderTop: index ? "1px solid #e5e7eb" : "none", marginTop: index ? 16 : 0, paddingTop: index ? 16 : 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><input required value={item.title} onChange={(e) => setFeaturedForm({ ...featuredForm, items: featuredForm.items.map((entry, position) => position === index ? { ...entry, title: e.target.value } : entry) })} placeholder="Project title" /><input value={item.category} onChange={(e) => setFeaturedForm({ ...featuredForm, items: featuredForm.items.map((entry, position) => position === index ? { ...entry, category: e.target.value } : entry) })} placeholder="Category" /><input required value={item.image} onChange={(e) => setFeaturedForm({ ...featuredForm, items: featuredForm.items.map((entry, position) => position === index ? { ...entry, image: e.target.value } : entry) })} placeholder="Image URL (Media Library path)" /><input value={item.link} onChange={(e) => setFeaturedForm({ ...featuredForm, items: featuredForm.items.map((entry, position) => position === index ? { ...entry, link: e.target.value } : entry) })} placeholder="Project link" /><select value={item.target} onChange={(e) => setFeaturedForm({ ...featuredForm, items: featuredForm.items.map((entry, position) => position === index ? { ...entry, target: e.target.value } : entry) })}><option value="same">Open in same tab</option><option value="new">Open in new tab</option></select><button type="button" className={styles.delete} disabled={featuredForm.items.length === 1} onClick={() => setFeaturedForm({ ...featuredForm, items: featuredForm.items.filter((_, position) => position !== index) })}>Delete project</button></div>)}<button type="button" className={styles.close} onClick={() => setFeaturedForm({ ...featuredForm, items: [...featuredForm.items, { title: "", category: "", link: "", target: "same", image: "" }] })}>+ Add carousel project</button></div></Field></div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingFeatured ? "Update Featured Projects" : "Save Featured Projects"}</button></div></form>;
  const renderFeaturedSettingsForm = () => <form className={styles.editor} onSubmit={saveFeaturedSettings}><div className={styles.editorHead}><h3>Featured Projects section</h3><button type="button" className={styles.close} onClick={resetFeatured}>Close</button></div><div className={styles.formGrid}><Field label="Title" wide><input required value={featuredForm.heading} onChange={(e) => setFeaturedForm({ ...featuredForm, heading: e.target.value })} /></Field><Field label="Description" wide><textarea rows="4" value={featuredForm.description} onChange={(e) => setFeaturedForm({ ...featuredForm, description: e.target.value })} /></Field><Field label="Button text"><input value={featuredForm.buttonText} onChange={(e) => setFeaturedForm({ ...featuredForm, buttonText: e.target.value })} /></Field><Field label="Button link"><input value={featuredForm.buttonLink} onChange={(e) => setFeaturedForm({ ...featuredForm, buttonLink: e.target.value })} /></Field></div><p className={styles.intro}>Projects are controlled only from Portfolio Admin using the Featured Project switch.</p><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : "Save section settings"}</button></div></form>;
  const renderTestimonialForm = () => <form className={styles.editor} onSubmit={saveTestimonial}><div className={styles.editorHead}><h3>{editingTestimonial ? "Edit testimonial" : "Add testimonial"}</h3><button type="button" className={styles.close} onClick={resetTestimonial}>Close</button></div><div className={styles.formGrid}><Field label="Client name"><input required value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} /></Field><Field label="Role / label"><input value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} /></Field><Field label="Rating"><select value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: e.target.value })}>{[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></Field><Field label="Display order"><input type="number" value={testimonialForm.order} onChange={(e) => setTestimonialForm({ ...testimonialForm, order: e.target.value })} /></Field><Field label="Client quote" wide><textarea required rows="5" value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} /></Field><Field label="Source label"><input value={testimonialForm.sourceLabel} onChange={(e) => setTestimonialForm({ ...testimonialForm, sourceLabel: e.target.value })} placeholder="Via Facebook" /></Field><Field label="Source link"><input value={testimonialForm.sourceLink} onChange={(e) => setTestimonialForm({ ...testimonialForm, sourceLink: e.target.value })} placeholder="https://..." /></Field><Field label="Client avatar" wide><div className={mediaStyles.pickerTrigger}>{testimonialForm.avatar ? <img src={testimonialForm.avatar} alt="Selected client" /> : <span>No image selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setTestimonialAvatarPickerOpen(true); }}>Choose from Media Library</button>{testimonialForm.avatar && <button type="button" className={mediaStyles.removeSelection} onClick={() => setTestimonialForm({ ...testimonialForm, avatar: "", avatarPath: "" })}>Remove</button>}</div></Field>{renderMediaPicker({ open: testimonialAvatarPickerOpen, close: () => setTestimonialAvatarPickerOpen(false), selectedUrl: testimonialForm.avatar, onSelect: (media) => setTestimonialForm({ ...testimonialForm, avatar: media.url, avatarPath: media.url }), onUpload: uploadFromTestimonialPicker, label: "client avatar", picker: "testimonial" })}</div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingTestimonial ? "Update testimonial" : "Save testimonial"}</button></div></form>;
  const renderTestimonialSettingsForm = () => <form className={styles.editor} onSubmit={saveTestimonialSettings}><div className={styles.editorHead}><h3>Testimonials title section</h3><button type="button" className={styles.close} onClick={() => setOpenTestimonialSettings(null)}>Close</button></div><div className={styles.formGrid}><Field label="Small title"><input value={testimonialSettingsForm.eyebrow} onChange={(e) => setTestimonialSettingsForm({ ...testimonialSettingsForm, eyebrow: e.target.value })} /></Field><Field label="Main heading" wide><textarea required rows="3" value={testimonialSettingsForm.heading} onChange={(e) => setTestimonialSettingsForm({ ...testimonialSettingsForm, heading: e.target.value })} /></Field><Field label="Description" wide><textarea rows="4" value={testimonialSettingsForm.description} onChange={(e) => setTestimonialSettingsForm({ ...testimonialSettingsForm, description: e.target.value })} /></Field></div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>Save title section</button></div></form>;
  const renderClientLogoForm = () => <form className={styles.editor} onSubmit={saveClientLogo}><div className={styles.editorHead}><h3>{editingClientLogo ? "Edit client logo" : "Add client logo"}</h3><button type="button" className={styles.close} onClick={resetClientLogo}>Close</button></div><div className={styles.formGrid}><Field label="Client / company name"><input required value={clientLogoForm.name} onChange={(e) => setClientLogoForm({ ...clientLogoForm, name: e.target.value })} /></Field><Field label="Display order"><input type="number" value={clientLogoForm.order} onChange={(e) => setClientLogoForm({ ...clientLogoForm, order: e.target.value })} /></Field><Field label="Website link" wide><input value={clientLogoForm.link} onChange={(e) => setClientLogoForm({ ...clientLogoForm, link: e.target.value })} placeholder="https://..." /></Field><Field label="Open link"><select value={clientLogoForm.linkTarget} onChange={(e) => setClientLogoForm({ ...clientLogoForm, linkTarget: e.target.value })}><option value="new">New tab</option><option value="same">Same tab</option></select></Field><Field label="Company logo" wide><div className={mediaStyles.pickerTrigger}>{clientLogoForm.image ? <img src={clientLogoForm.image} alt="Selected client logo" /> : <span>No logo selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setClientLogoPickerOpen(true); }}>Choose from Media Library</button>{clientLogoForm.image && <button type="button" className={mediaStyles.removeSelection} onClick={() => setClientLogoForm({ ...clientLogoForm, image: "", imagePath: "" })}>Remove</button>}</div></Field>{renderMediaPicker({ open: clientLogoPickerOpen, close: () => setClientLogoPickerOpen(false), selectedUrl: clientLogoForm.image, onSelect: (media) => setClientLogoForm({ ...clientLogoForm, image: media.url, imagePath: media.url }), onUpload: uploadFromClientLogoPicker, label: "company logo", picker: "client-logo" })}</div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingClientLogo ? "Update logo" : "Save logo"}</button></div></form>;
  const renderCtaForm = () => <form className={styles.editor} onSubmit={saveCta}><div className={styles.editorHead}><h3>{editingCta ? "Edit call to action" : "Add call to action"}</h3><button type="button" className={styles.close} onClick={resetCta}>Close</button></div><div className={styles.formGrid}><Field label="Heading" wide><input required value={ctaForm.heading} onChange={(e) => setCtaForm({ ...ctaForm, heading: e.target.value })} /></Field><Field label="Button text"><input required value={ctaForm.buttonText} onChange={(e) => setCtaForm({ ...ctaForm, buttonText: e.target.value })} /></Field><Field label="Button link"><input required value={ctaForm.buttonLink} onChange={(e) => setCtaForm({ ...ctaForm, buttonLink: e.target.value })} placeholder="contacts.html or https://..." /></Field><Field label="Open link"><select value={ctaForm.buttonTarget} onChange={(e) => setCtaForm({ ...ctaForm, buttonTarget: e.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></Field></div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingCta ? "Update call to action" : "Save call to action"}</button></div></form>;
  const renderFooterForm = () => <form className={styles.editor} onSubmit={saveFooter}>
    <div className={styles.editorHead}><h3>Footer content</h3><button type="button" className={styles.close} onClick={resetFooter}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Footer site name"><input required value={footerForm.siteName} onChange={(e) => setFooterForm({ ...footerForm, siteName: e.target.value })} /></Field>
      <Field label="About heading"><input value={footerForm.aboutHeading} onChange={(e) => setFooterForm({ ...footerForm, aboutHeading: e.target.value })} /></Field>
      <Field label="About text" wide><textarea rows="4" value={footerForm.aboutText} onChange={(e) => setFooterForm({ ...footerForm, aboutText: e.target.value })} /></Field>
      <Field label="Portfolio button text"><input value={footerForm.portfolioButtonText} onChange={(e) => setFooterForm({ ...footerForm, portfolioButtonText: e.target.value })} /></Field>
      <Field label="Portfolio button link"><input value={footerForm.portfolioButtonLink} onChange={(e) => setFooterForm({ ...footerForm, portfolioButtonLink: e.target.value })} placeholder="/portfolio/" /></Field>
      <Field label="Open portfolio button"><select value={footerForm.portfolioButtonTarget} onChange={(e) => setFooterForm({ ...footerForm, portfolioButtonTarget: e.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></Field>
      <Field label="Contacts heading"><input value={footerForm.contactHeading} onChange={(e) => setFooterForm({ ...footerForm, contactHeading: e.target.value })} /></Field>
      <Field label="Contact intro" wide><textarea rows="3" value={footerForm.contactText} onChange={(e) => setFooterForm({ ...footerForm, contactText: e.target.value })} /></Field>
      <div className={`${styles.field} ${styles.wide}`}><span>Subscribe form</span><label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}><input type="checkbox" checked={footerForm.subscribeEnabled} onChange={(e) => setFooterForm({ ...footerForm, subscribeEnabled: e.target.checked })} /> Show subscribe form</label>{footerForm.subscribeEnabled && <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 14 }}><label>Input placeholder<input value={footerForm.subscribePlaceholder} onChange={(e) => setFooterForm({ ...footerForm, subscribePlaceholder: e.target.value })} /></label><label>Button text<input value={footerForm.subscribeButtonText} onChange={(e) => setFooterForm({ ...footerForm, subscribeButtonText: e.target.value })} /></label></div>}</div>
      <Field label="Phone"><input value={footerForm.phone} onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })} /></Field>
      <Field label="Email"><input type="email" value={footerForm.email} onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })} /></Field>
      <Field label="Address" wide><input value={footerForm.address} onChange={(e) => setFooterForm({ ...footerForm, address: e.target.value })} /></Field>
      <div className={`${styles.field} ${styles.wide}`}><span>Social links</span><small style={{ display: "block", color: "#637182", lineHeight: 1.6 }}>Social links are managed globally. Go to <b>Sitewide Settings → Global Profile & Resumes → Social Media Links</b> to update the left sidebar, footer and contact drawer together.</small></div>
      <Field label="Copyright text" wide><input value={footerForm.copyright} onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })} /></Field>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : "Save footer"}</button></div>
  </form>;
  const renderHeaderForm = () => <form className={styles.editor} onSubmit={saveHeader}><div className={styles.editorHead}><h3>{editingHeader ? "Edit Header & Navigation" : "Add Header & Navigation"}</h3><button type="button" className={styles.close} onClick={resetHeader}>Close</button></div><div className={styles.formGrid}><Field label="Website name"><input required value={headerForm.siteName} onChange={(e) => setHeaderForm({ ...headerForm, siteName: e.target.value })} /></Field><Field label="Menu label"><input required value={headerForm.menuLabel} onChange={(e) => setHeaderForm({ ...headerForm, menuLabel: e.target.value })} placeholder="Menu" /></Field><Field label="Header logo" wide><div className={mediaStyles.pickerTrigger}>{headerForm.logo ? <img src={headerForm.logo} alt="Selected header logo" /> : <span>No logo selected</span>}<button type="button" onClick={() => { setMediaPickerSearch(""); setHeaderLogoPickerOpen(true); }}>Choose from Media Library</button>{headerForm.logo && <button type="button" className={mediaStyles.removeSelection} onClick={() => setHeaderForm({ ...headerForm, logo: "" })}>Remove</button>}</div></Field>{renderMediaPicker({ open: headerLogoPickerOpen, close: () => setHeaderLogoPickerOpen(false), selectedUrl: headerForm.logo, onSelect: (media) => setHeaderForm({ ...headerForm, logo: media.url }), onUpload: uploadFromHeaderLogoPicker, label: "header logo", picker: "header-logo" })}<Field label="Logo click link" wide><input required value={headerForm.logoLink} onChange={(e) => setHeaderForm({ ...headerForm, logoLink: e.target.value })} placeholder="/" /></Field><Field label="Navigation menu" wide><div>{headerForm.menuItems.map((item, index) => <div key={index} style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px 60px 60px",gap:8,marginBottom:8}}><input required placeholder="Menu text" value={item.label} onChange={(e) => setHeaderForm({...headerForm,menuItems:headerForm.menuItems.map((entry,i)=>i===index?{...entry,label:e.target.value}:entry)})}/><input required placeholder="Link" value={item.link} onChange={(e) => setHeaderForm({...headerForm,menuItems:headerForm.menuItems.map((entry,i)=>i===index?{...entry,link:e.target.value}:entry)})}/><select value={item.target} onChange={(e) => setHeaderForm({...headerForm,menuItems:headerForm.menuItems.map((entry,i)=>i===index?{...entry,target:e.target.value}:entry)})}><option value="same">Same tab</option><option value="new">New tab</option></select><input type="number" value={item.order} onChange={(e) => setHeaderForm({...headerForm,menuItems:headerForm.menuItems.map((entry,i)=>i===index?{...entry,order:e.target.value}:entry)})}/><button type="button" className={styles.delete} onClick={() => setHeaderForm({...headerForm,menuItems:headerForm.menuItems.filter((_,i)=>i!==index)})}>Delete</button></div>)}<button type="button" className={styles.close} onClick={() => setHeaderForm({...headerForm,menuItems:[...headerForm.menuItems,{label:"",link:"",target:"same",order:headerForm.menuItems.length}]})}><FaPlus /> Add menu item</button></div></Field></div><div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingHeader ? "Update header" : "Save header"}</button></div></form>;
  const renderRepeaterHeroForm = () => <form className={styles.editor} onSubmit={saveRepeaterHero}>
    <div className={styles.editorHead}><h3>Repeater Builder Hero</h3><button type="button" className={styles.close} onClick={() => setOpenRepeaterHero(null)}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Badge — first text"><input required value={repeaterHeroForm.badgePrefix} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, badgePrefix: event.target.value })} /></Field>
      <Field label="Badge — highlighted text"><input required value={repeaterHeroForm.badgeHighlight} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, badgeHighlight: event.target.value })} /></Field>
      <Field label="Badge — ending text" wide><input required value={repeaterHeroForm.badgeSuffix} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, badgeSuffix: event.target.value })} /></Field>
      <Field label="Heading — first text"><input required value={repeaterHeroForm.titlePrefix} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, titlePrefix: event.target.value })} /></Field>
      <Field label="Heading — highlighted text"><input required value={repeaterHeroForm.titleHighlight} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, titleHighlight: event.target.value })} /></Field>
      <Field label="Heading — ending text" wide><input required value={repeaterHeroForm.titleSuffix} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, titleSuffix: event.target.value })} /></Field>
      <Field label="Hero description" wide><textarea rows="4" required value={repeaterHeroForm.description} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, description: event.target.value })} /></Field>
      <Field label="Primary button text"><input required value={repeaterHeroForm.primaryButtonText} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, primaryButtonText: event.target.value })} /></Field>
      <Field label="Primary button link"><input required value={repeaterHeroForm.primaryButtonLink} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, primaryButtonLink: event.target.value })} placeholder="#pricing or https://..." /></Field>
      <Field label="Primary button opens in"><select value={repeaterHeroForm.primaryButtonTarget} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, primaryButtonTarget: event.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></Field>
      <Field label="Secondary button text"><input required value={repeaterHeroForm.secondaryButtonText} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, secondaryButtonText: event.target.value })} /></Field>
      <Field label="Secondary button link"><input required value={repeaterHeroForm.secondaryButtonLink} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, secondaryButtonLink: event.target.value })} placeholder="#how or https://..." /></Field>
      <Field label="Secondary button opens in"><select value={repeaterHeroForm.secondaryButtonTarget} onChange={(event) => setRepeaterHeroForm({ ...repeaterHeroForm, secondaryButtonTarget: event.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></Field>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : "Save Hero section"}</button></div>
  </form>;
  const renderCustomPluginsForm = () => <form className={styles.editor} onSubmit={saveCustomPlugins}>
    <div className={styles.editorHead}><h3>Custom Plugins</h3><button type="button" className={styles.close} onClick={() => setOpenCustomPlugins(null)}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Main title" wide><input required value={customPluginsForm.heading} onChange={(event) => setCustomPluginsForm({ ...customPluginsForm, heading: event.target.value })} placeholder="My WordPress Plugins & Extensions" /></Field>
      <Field label="Short description" wide><textarea required rows="4" value={customPluginsForm.description} onChange={(event) => setCustomPluginsForm({ ...customPluginsForm, description: event.target.value })} /></Field>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : "Save Custom Plugins"}</button></div>
  </form>;
  const renderPluginItemForm = () => <form className={styles.editor} onSubmit={savePluginItem}>
    <div className={styles.editorHead}><h3>{editingPluginItem ? "Edit plugin card" : "Add plugin card"}</h3><button type="button" className={styles.close} onClick={resetPluginItem}>Close</button></div>
    <div className={styles.pluginCardPrimaryRow}>
      <Field label="Plugin title"><input required value={pluginItemForm.title} onChange={(event) => setPluginItemForm({ ...pluginItemForm, title: event.target.value })} placeholder="My WordPress Plugin" /></Field>
      <Field label="Short description"><input value={pluginItemForm.description} onChange={(event) => setPluginItemForm({ ...pluginItemForm, description: event.target.value })} placeholder="A short line explaining what this plugin does" /></Field>
      <Field label="Display order"><input type="number" min="0" value={pluginItemForm.order} onChange={(event) => setPluginItemForm({ ...pluginItemForm, order: event.target.value })} /></Field>
    </div>
    <div className={styles.pluginCardLinkRow}>
      <Field label="Card icon">
        <div className={mediaStyles.pickerTrigger}>
          {pluginItemForm.customIcon ? <img src={pluginItemForm.customIcon} alt="Selected plugin icon" /> : <span>Built-in: {pluginIconOptions.find(([value]) => value === pluginItemForm.icon)?.[1] || "Puzzle"}</span>}
          <button type="button" onClick={() => { setMediaPickerSearch(""); setPluginIconPickerOpen(true); }}>Media Library</button>
          {pluginItemForm.customIcon && <button type="button" className={mediaStyles.removeSelection} onClick={() => setPluginItemForm({ ...pluginItemForm, customIcon: "" })}>Remove</button>}
        </div>
        <select value={pluginItemForm.icon} onChange={(event) => setPluginItemForm({ ...pluginItemForm, icon: event.target.value })}>{pluginIconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </Field>
      <Field label="Downloadable file (optional)">
        <div className={mediaStyles.pickerTrigger}>
          <span>{pluginItemForm.downloadFile ? pluginItemForm.downloadFile.split("/").pop() : "No file selected"}</span>
          <button type="button" onClick={() => { setMediaPickerSearch(""); setPluginDownloadPickerOpen(true); }}>Media Library</button>
          {pluginItemForm.downloadFile && <button type="button" className={mediaStyles.removeSelection} onClick={() => setPluginItemForm({ ...pluginItemForm, downloadFile: "" })}>Remove</button>}
        </div>
        <input value={pluginItemForm.downloadUrl} onChange={(event) => setPluginItemForm({ ...pluginItemForm, downloadUrl: event.target.value })} placeholder="Or paste a direct external file URL" />
      </Field>
      <Field label="Plugin link"><input value={pluginItemForm.link} onChange={(event) => setPluginItemForm({ ...pluginItemForm, link: event.target.value })} placeholder="GitHub, plugin page, or live demo URL" /></Field>
      <label className={`${styles.field} ${styles.pluginTargetToggle}`}><span>Open plugin link</span><span className={styles.checkLabel}><input type="checkbox" checked={pluginItemForm.target !== "same"} onChange={(event) => setPluginItemForm({ ...pluginItemForm, target: event.target.checked ? "new" : "same" })} /> Open in new tab</span></label>
    </div>
    {renderMediaPicker({ open: pluginIconPickerOpen, close: () => setPluginIconPickerOpen(false), selectedUrl: pluginItemForm.customIcon, onSelect: (media) => setPluginItemForm({ ...pluginItemForm, customIcon: media.url }), onUpload: uploadFromPluginIconPicker, label: "plugin card icon", picker: "plugin-icon" })}
    {renderMediaPicker({ open: pluginDownloadPickerOpen, close: () => setPluginDownloadPickerOpen(false), selectedUrl: pluginItemForm.downloadFile, onSelect: (media) => setPluginItemForm({ ...pluginItemForm, downloadFile: media.url }), onUpload: uploadFromPluginDownloadPicker, label: "downloadable file", picker: "plugin-download", fileOnly: true })}
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : editingPluginItem ? "Update plugin card" : "Save plugin card"}</button></div>
  </form>;
  const renderGlobalSettingsForm = () => <form className={styles.editor} onSubmit={saveGlobalSettings}>
    <div className={styles.editorHead}><h3>Global profile, contact & resumes</h3><button type="button" className={styles.close} onClick={() => setEditingGlobalSettings(null)}>Close</button></div>
    <div className={styles.formGrid}>
      <Field label="Full name"><input required value={globalSettingsForm.fullName} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, fullName: e.target.value })} /></Field>
      <Field label="Professional title"><input required value={globalSettingsForm.designation} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, designation: e.target.value })} /></Field>
      <Field label="Email address"><input type="email" value={globalSettingsForm.email} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, email: e.target.value })} /></Field>
      <Field label="Phone number"><input value={globalSettingsForm.phone} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, phone: e.target.value })} /></Field>
      <Field label="WhatsApp number"><input value={globalSettingsForm.whatsapp} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, whatsapp: e.target.value })} placeholder="8801..." /></Field>
      <Field label="Drawer profile image URL"><input value={globalSettingsForm.profileImage || ""} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, profileImage: e.target.value })} placeholder="/uploads/media/your-photo.webp" /></Field>
      <SocialLinksManager links={globalSettingsForm.socialLinks} onChange={(socialLinks) => setGlobalSettingsForm({ ...globalSettingsForm, socialLinks })} />
      <Field label="Footer text" wide><input value={globalSettingsForm.footer} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, footer: e.target.value })} /></Field>
      <div className={`${styles.field} ${styles.wide}`}><span>Resume Center</span><small style={{ display: "block", margin: "4px 0 14px", color: "#637182" }}>Upload each profile’s PDF once. Any button set to use Resume Center updates automatically.</small>{globalSettingsForm.resumes.map((resume) => <div key={resume.profile} style={{ display: "grid", gridTemplateColumns: "minmax(150px, 0.8fr) minmax(230px, 1.5fr) 140px auto", gap: 10, alignItems: "end", marginBottom: 12, padding: 12, border: "1px solid #d9e0e0", borderRadius: 7 }}><label><small>{PORTFOLIO_SECTORS.find((sector) => sector.id === resume.profile)?.label || resume.profile}</small><input value={resume.label} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, resumes: globalSettingsForm.resumes.map((entry) => entry.profile === resume.profile ? { ...entry, label: e.target.value } : entry) })} /></label><label><small>Resume URL</small><input value={resume.url} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, resumes: globalSettingsForm.resumes.map((entry) => entry.profile === resume.profile ? { ...entry, url: e.target.value } : entry) })} placeholder="Upload a PDF or paste a link" /></label><label><small>Open in</small><select value={resume.target} onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, resumes: globalSettingsForm.resumes.map((entry) => entry.profile === resume.profile ? { ...entry, target: e.target.value } : entry) })}><option value="new">New tab</option><option value="same">Same tab</option></select></label><label className={styles.close} style={{ cursor: "pointer", whiteSpace: "nowrap" }}><FaPlus /> {resumeUploadState === resume.profile ? "Uploading…" : "Upload PDF"}<input type="file" accept="application/pdf,.pdf" onChange={(event) => uploadResume(resume.profile, event)} hidden disabled={resumeUploadState === resume.profile} /></label></div>)}</div>
    </div>
    <div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving…" : "Save Global Settings"}</button></div>
  </form>;
  // Keep editable content in the same top-to-bottom order as it appears on the homepage.
  const homeContentMenu = [{ id: "hero", label: "Hero Section", icon: FaRegImage }, { id: "about", label: "About Me", icon: FaUserCircle }, { id: "facts", label: "Interesting Facts", icon: FaBriefcase }, { id: "experience", label: "Work Experience", icon: FaBriefcase }, { id: "video", label: "Video Presentation", icon: FaRegImage }, { id: "process", label: "Working Process", icon: FaBriefcase }, { id: "skills", label: "Skills Section", icon: FaBriefcase }, { id: "featured-settings", label: "Featured Projects", icon: FaFolderOpen }, { id: "testimonials", label: "Client Testimonials", icon: FaUserCircle }, { id: "client-logos", label: "Client Logos", icon: FaRegImage }, { id: "cta", label: "Project Call To Action", icon: FaBriefcase }];
  const repeaterBuilderSections = [{ id: "repeater-builder", label: "Hero Section", icon: FaRegImage }];
  const portfolioPageSections = [{ id: "portfolio", label: "Portfolio Projects", icon: FaFolderOpen }];
  const profileSetupSections = [{ id: "profiles", label: "Profile Setup & Hero Appearance", icon: FaUserCircle }];
  const wordpressPageSections = [...profileSetupSections, { id: "custom-plugins", label: "Custom Plugins", icon: FaFolderOpen }];
  const pageDirectory = [
    { id: "home", title: "Home Page", slug: "/", description: "Your primary landing page and its content sections.", sections: homeContentMenu },
    { id: "portfolio", title: "Portfolio Page", slug: "/portfolio/", description: "A full gallery of published portfolio projects.", sections: portfolioPageSections },
    { id: "wordpress", title: "WordPress Profile", slug: "/wordpress/", description: "Focused WordPress profile and its plugin workspace.", sections: wordpressPageSections, listInAllPages: false, profilePage: true },
    { id: "motion", title: "Video & Motion Profile", slug: "/motion/", description: "Focused profile for motion graphics and video editing work.", sections: profileSetupSections, listInAllPages: false, profilePage: true },
    { id: "multimedia", title: "Multimedia Profile", slug: "/multimedia/", description: "Focused profile for multimedia design work.", sections: profileSetupSections, listInAllPages: false, profilePage: true },
    { id: "repeater-builder", title: "Repeater Builder", slug: "/repeater-plugins/", description: "The Repeater Builder product page.", sections: repeaterBuilderSections },
  ];
  const activeProfilePage = pageDirectory.find((page) => page.id === profilePageContext) || null;
  const selectedProfile = profilePageContext
    ? allSectorProfiles.find((profile) => profile.id === profilePageContext || profile.slug === profilePageContext)
    : null;
  const profilesForEditor = selectedProfile ? [selectedProfile] : allSectorProfiles;
  const sectorProfiles = profilesForEditor;
  const profilePageTitle = activeProfilePage?.title || selectedProfile?.name || "Portfolio Profiles";
  const profileNavigationPages = pageDirectory.filter((page) => page.profilePage);
  const profileContentGroups = [
    { type: PROJECTS, label: "Portfolio Projects", items: projects },
    { type: HEROES, label: "Hero Slides", items: heroes },
    { type: ABOUT, label: "About Me", items: aboutItems },
    { type: FACTS, label: "Interesting Facts", items: factsItems },
    { type: EXPERIENCES, label: "Work Experience", items: experiences },
    { type: EXPERIENCE_SETTINGS, label: "Work Experience Section Title", items: experienceSettings },
    { type: VIDEO, label: "Video Presentation", items: videoItems },
    { type: PROCESS, label: "Working Process", items: processItems },
    { type: SKILLS, label: "Skills Introduction", items: skillsItems },
    { type: SKILL_GROUPS, label: "Skill Groups", items: skillGroups },
    { type: FEATURED, label: "Featured Projects", items: featuredItems },
    { type: TESTIMONIAL_SETTINGS, label: "Testimonials Section Title", items: testimonialSettings },
    { type: TESTIMONIALS, label: "Client Testimonials", items: testimonials },
    { type: CLIENT_LOGOS, label: "Client Logos", items: clientLogos },
    { type: CTA, label: "Project Call To Action", items: ctaItems },
  ];
  const openPageSection = (pageId, sectionId) => {
    setPageManagerSelection(pageId);
    setPageManagerMode(true);
    setPageManagerPanelOpen(true);
    setMainSidebarCollapsed(true);
    if (sectionId === "profiles") {
      setProfilePageContext(pageId);
      const profile = allSectorProfiles.find((item) => item.id === pageId || item.slug === pageId);
      if (profile) beginSectorProfile(profile);
    }
    if (sectionId === "custom-plugins") {
      const settings = customPluginsItems[0];
      if (settings) beginCustomPlugins(settings);
    }
    setActiveMenu(sectionId);
  };
  const returnToPageSections = () => { setProfilePageContext(null); setPageManagerMode(false); setMainSidebarCollapsed(true); setActiveMenu("pages"); };
  const renderPageTrail = (pageTitle) => <div className={styles.pageTrail}>
    <button type="button" onClick={returnToPageSections}><FaArrowLeft /> Back to Pages</button>
    <span aria-hidden="true"><FaArrowRight /></span>
    <strong>{pageTitle}</strong>
  </div>;
  const pagesMenuItem = { id: "pages", label: "Pages", icon: FaFolderOpen };
  const contentMenu = [pagesMenuItem, { id: "media", label: "Media Library", icon: FaImages }];
  const sitewideMenu = [{ id: "header", label: "Header & Navigation", icon: FaFolderOpen }, { id: "footer", label: "Footer", icon: FaBriefcase }, { id: "global-settings", label: "Global Profile & Resumes", icon: FaUserCircle }];
  const renderSidebar = (afterSelect = () => {}) => {
    const collapsed = mainSidebarCollapsed;
    const livePage = (activeMenu === "pages" || pageManagerMode)
      ? pageDirectory.find((page) => page.id === pageManagerSelection)
      : null;
    const selectMenu = (id) => {
      if (id === "pages") {
        setPageManagerSelection("all");
        setMainSidebarCollapsed(true);
        setPageManagerPanelOpen(true);
      } else {
        setMainSidebarCollapsed(false);
      }
      setPageManagerMode(false);
      setActiveMenu(id);
      afterSelect();
      if (sitewideMenu.some((item) => item.id === id)) setSitewideOpen(true);
    };
    const navButton = ({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => selectMenu(id)} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined}><Icon /><span>{label}</span></button>;
    return <aside className={`${styles.sidebar}${collapsed ? ` ${styles.sidebarCollapsed}` : ""}`}>
      <div className={styles.brand}><span>R</span>{!collapsed && <strong>Rashidverse</strong>}</div>
      <button type="button" className={styles.sidebarCollapseButton} onClick={() => setMainSidebarCollapsed((value) => !value)} aria-label={collapsed ? "Expand main sidebar" : "Collapse main sidebar"} title={collapsed ? "Expand main sidebar" : "Collapse main sidebar"}><SidebarToggleIcon collapsed={collapsed} /></button>
      <p className={styles.menuLabel}>Website content</p>
      <nav className={styles.contentNav}>{contentMenu.map(navButton)}</nav>
      <div className={styles.sitewideGroup}>
        <button type="button" className={styles.sitewideToggle} onClick={() => setSitewideOpen((open) => !open)} aria-expanded={sitewideOpen}>
          <span>Sitewide Settings</span><FaChevronDown className={sitewideOpen ? styles.rotate : ""} />
        </button>
        <nav className={`${styles.sitewideItems}${sitewideOpen ? ` ${styles.sitewideItemsOpen}` : ""}`} aria-hidden={!sitewideOpen}>{sitewideMenu.map(navButton)}</nav>
      </div>
      {livePage && <a className={styles.livePageButton} href={livePage.slug} target="_blank" rel="noreferrer"><FaExternalLinkAlt /> Live Page</a>}
      <div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div>
      <AdminLogoutButton className={styles.sidebarLogoutButton} />
    </aside>;
  };
  // Older content screens share this grouped navigation renderer as well.
  // It keeps Sitewide Settings visible while its links behave like an FAQ panel.
  const menu = {
    map: (renderItem) => <>
      {contentMenu.map(renderItem)}
      <div className={styles.sitewideGroup}>
        <button type="button" className={styles.sitewideToggle} onClick={() => setSitewideOpen((open) => !open)} aria-expanded={sitewideOpen}>
          <span>Sitewide Settings</span><FaChevronDown className={sitewideOpen ? styles.rotate : ""} />
        </button>
        <div className={`${styles.sitewideItems}${sitewideOpen ? ` ${styles.sitewideItemsOpen}` : ""}`} aria-hidden={!sitewideOpen}>{sitewideMenu.map(renderItem)}</div>
      </div>
    </>,
  };
  const activeItems = activeMenu === "portfolio" ? projects : experiences;
  const isProject = activeMenu === "portfolio";
  const filteredMedia = mediaFiles.filter((media) => media.name.toLowerCase().includes(mediaSearch.trim().toLowerCase()));
  const visiblePages = pageDirectory.filter((page) => page.listInAllPages !== false);
  const choosePage = (pageId) => {
    setPageManagerSelection(pageId || "all");
    setProfilePageContext(null);
    setPageManagerMode(false);
    setMainSidebarCollapsed(true);
    setActiveMenu("pages");
  };
  const toggleProfilePage = (pageId) => setPageManagerSelection((current) => current === pageId ? "all" : pageId);
  const renderPageManagerPanel = ({ dock = false } = {}) => <aside className={`${pageManagerStyles.panel}${dock ? ` ${pageManagerStyles.dock}` : ""}${!pageManagerPanelOpen ? ` ${pageManagerStyles.collapsed}` : ""}`}>
    <button type="button" className={pageManagerStyles.collapseButton} onClick={() => setPageManagerPanelOpen((open) => !open)} aria-label={pageManagerPanelOpen ? "Collapse Page Manager" : "Expand Page Manager"} title={pageManagerPanelOpen ? "Collapse Page Manager" : "Expand Page Manager"}><SidebarToggleIcon collapsed={pageManagerPanelOpen} /></button>
    {pageManagerPanelOpen && <div className={pageManagerStyles.panelContent}>
      <p className={pageManagerStyles.title}>Page Manager</p>
      <button type="button" className={`${pageManagerStyles.navigationItem}${pageManagerSelection === "all" && activeMenu === "pages" ? ` ${pageManagerStyles.navigationItemActive}` : ""}`} onClick={() => choosePage("all")}><FaFolderOpen /> All Pages</button>
      <label className={pageManagerStyles.selectLabel}>Select Page
        <select value={visiblePages.some((page) => page.id === pageManagerSelection) ? pageManagerSelection : ""} onChange={(event) => choosePage(event.target.value)}>
          <option value="">Select a page</option>
          {visiblePages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}
        </select>
      </label>
      {profileNavigationPages.map((page) => <div className={pageManagerStyles.profileGroup} key={page.id}>
        <button type="button" className={pageManagerStyles.profileToggle} onClick={() => toggleProfilePage(page.id)} aria-expanded={pageManagerSelection === page.id}><span>{page.title}</span><FaChevronDown className={pageManagerSelection === page.id ? styles.rotate : ""} /></button>
        {pageManagerSelection === page.id && <div className={pageManagerStyles.profileItems}>{page.sections.map(({ id, label, icon: Icon }) => <button type="button" className={`${pageManagerStyles.profileItem}${activeMenu === id && pageManagerMode ? ` ${pageManagerStyles.profileItemActive}` : ""}`} key={id} onClick={() => openPageSection(page.id, id)}><Icon /><span>{id === "profiles" ? `${page.title} settings` : label}</span></button>)}</div>}
      </div>)}
      <button type="button" className={`${pageManagerStyles.visibilityItem}${activeMenu === "profile-visibility" && pageManagerMode ? ` ${pageManagerStyles.navigationItemActive}` : ""}`} onClick={() => { setProfilePageContext(null); setPageManagerMode(true); setPageManagerPanelOpen(true); setActiveMenu("profile-visibility"); }}><FaEye /> Profile Content Visibility</button>
    </div>}
  </aside>;
  const renderEditorSidebar = (afterSelect = () => {}) => pageManagerMode ? <div className={styles.pageEditorSidebars}>{renderSidebar(afterSelect)}{renderPageManagerPanel({ dock: true })}</div> : renderSidebar(afterSelect);

  if (activeMenu === "pages") {
    const selectedPage = pageDirectory.find((page) => page.id === pageManagerSelection) || null;
    return <main className={styles.shell}>
      {renderSidebar()}
      {renderPageManagerPanel({ dock: true })}
      <section className={styles.workspace}>
        <header className={styles.topbar}><div><p>Website Content</p><h1>Pages</h1></div></header>
        {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>×</button></div>}
        <div className={styles.pageManagerContent}>
            {!selectedPage ? <>
              <div className={styles.pageManagerHeading}><div><p>All Pages</p><h2>Manage your website pages</h2><span>Select a page to view and edit its individual sections.</span></div><b>{visiblePages.length} pages</b></div>
              <div className={styles.pageCards}>{visiblePages.map((page) => <button className={styles.pageCard} key={page.id} type="button" onClick={() => choosePage(page.id)}><span className={styles.pageCardIcon}><FaFolderOpen /></span><span><b>{page.title}</b><small>{page.slug}</small><em>{page.description}</em></span><strong>{page.sections.length} {page.sections.length === 1 ? "section" : "sections"}<FaChevronDown /></strong></button>)}</div>
            </> : <>
              <div className={styles.pageManagerHeading}><div><p>{selectedPage.slug}</p><h2>{selectedPage.title} sections</h2><span>{selectedPage.description}</span></div><button type="button" className={styles.close} onClick={() => choosePage("all")}>All Pages</button></div>
              {selectedPage.profilePage ? <div className={styles.profilePagePrompt}><FaFolderOpen /><div><b>Choose a profile option from the left</b><span>Open settings or profile-specific tools from the expanded {selectedPage.title} menu.</span></div></div> : <div className={styles.pageSectionList}>{selectedPage.sections.map(({ id, label, icon: Icon }, index) => <button type="button" key={id} onClick={() => openPageSection(selectedPage.id, id)}><span className={styles.pageCardIcon}><Icon /></span><span><b>{label}</b><small>Section {index + 1} of {selectedPage.sections.length}</small></span><em>Edit section <FaChevronDown /></em></button>)}</div>}
            </>}
        </div>
      </section>
    </main>;
  }

  if (activeMenu === "repeater-builder") return <main className={styles.shell}>
    {renderEditorSidebar(() => setOpenRepeaterHero(null))}
    <section className={styles.workspace}>
      <header className={styles.topbar}><div><p>Page Manager</p><h1>Repeater Builder Page</h1></div>{repeaterHeroItems.length === 0 && <button className={styles.primary} onClick={() => beginRepeaterHero()}><FaPlus /> Add Hero section</button>}</header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>×</button></div>}
      <div className={styles.intro}><div><h2>Page sections</h2><p>This is the first dynamic section demo. Each future section—features, use cases, reviews and pricing—will appear here as its own editable row.</p></div><span>{repeaterHeroItems.length || 1} section</span></div>
      <section className={styles.list}><div className={styles.listHeader}><span>Section</span><span>Page</span><span>Content</span><span>Action</span></div>{repeaterHeroItems.length === 0 ? <div className={styles.empty}>Hero settings are being prepared. Use the add button to create them.</div> : repeaterHeroItems.slice(0, 1).map((item) => { const expanded = openRepeaterHero === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? setOpenRepeaterHero(null) : beginRepeaterHero(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaRegImage /></span><b>Hero Section</b><small>{item.titlePrefix} {item.titleHighlight}</small></span><span>/repeater-plugins/</span><span>Badge, heading, description & buttons</span><span className={styles.layoutTag}>Hero<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderRepeaterHeroForm()}<div className={styles.rowActions}><button onClick={() => beginRepeaterHero(item)}>Edit</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "profile-visibility") return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}>
      <header className={styles.topbar}><div><div className={styles.pageTrail}><button type="button" onClick={() => { setPageManagerSelection("all"); setActiveMenu("pages"); }}><FaArrowLeft /> Back to Pages</button><span aria-hidden="true"><FaArrowRight /></span><strong>Profile Content Visibility</strong></div><p>Profile content</p><h1>Profile Content Visibility</h1></div></header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>×</button></div>}
      <div className={styles.intro}><div><h2>Choose where each content item appears</h2><p>Use the eye controls below to make content shared across all profiles, or visible only in WordPress, Video & Motion, or Multimedia.</p></div><span>{profileContentGroups.length} sections</span></div>
      <div className={styles.visibilityGroups}>{profileContentGroups.map((group) => <section className={styles.visibilityGroup} key={group.type}>
        <header className={styles.visibilityGroupHeader}><span><FaEye /><b>{group.label}</b></span><small>{group.items.length} {group.items.length === 1 ? "item" : "items"}</small></header>
        {group.items.length === 0 ? <div className={styles.visibilityEmpty}>No saved items in this section yet.</div> : <div className={styles.visibilityRows}>{group.items.map((item) => <article className={styles.visibilityRow} key={item.id}>
          <div className={styles.visibilityItemName}><b>{item.title || item.heading || item.company || item.name || item.sectionLabel || "Untitled item"}</b><small>{item.description || item.role || item.subtitle || "Choose the profiles that can display this item."}</small></div>
          <div className={styles.visibilityScope}><SectorScopePicker value={item.sectors || []} onChange={(sectors) => saveSectorScope(group.type, item, sectors)} /></div>
        </article>)}</div>}
      </section>)}</div>
    </section>
  </main>;

  if (activeMenu === "custom-plugins") return <main className={styles.shell}>
    {renderEditorSidebar(() => setOpenCustomPlugins(null))}
    <section className={styles.workspace}>
      <header className={styles.topbar}><div>{renderPageTrail("WordPress Profile")}<p>WordPress Profile</p><h1>Custom Plugins</h1></div><div>{customPluginsItems.length === 0 && <button className={styles.primary} onClick={() => beginCustomPlugins()}><FaPlus /> Add title settings</button>}<button className={styles.primary} onClick={() => beginPluginItem()}><FaPlus /> Add plugin card</button></div></header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {openPluginItem === "new" && renderPluginItemForm()}
      <div className={styles.intro}><div><h2>Plugin workspace title</h2><p>Change the heading and description shown when the WordPress folder icon opens.</p></div><span>1 section</span></div>
      <section className={styles.list}><div className={styles.listHeader}><span>Section</span><span>Page</span><span>Content</span><span>Action</span></div>{customPluginsItems.length === 0 ? <div className={styles.empty}>Custom Plugins settings are being prepared. Add the first settings record.</div> : customPluginsItems.slice(0, 1).map((item) => { const expanded = openCustomPlugins === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? setOpenCustomPlugins(null) : beginCustomPlugins(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaFolderOpen /></span><b>{item.heading || "My WordPress Plugins & Extensions"}</b><small>{item.description || "Plugin workspace title"}</small></span><span>/wordpress/</span><span>Small title, heading & description</span><span className={styles.layoutTag}>Settings<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderCustomPluginsForm()}<div className={styles.rowActions}><button onClick={() => beginCustomPlugins(item)}>Edit</button></div></div>; })}</section>
      <div className={styles.intro}><div><h2>Plugin cards</h2><p>Each card can have its own icon, title, short description and GitHub, download, or plugin-page link. The first 10 cards are displayed in the folder layout.</p></div><span>{pluginItems.length} cards</span></div>
      <section className={styles.list}><div className={styles.listHeader}><span>Plugin card</span><span>Destination</span><span>Order</span><span>Icon</span></div>{pluginItems.length === 0 ? <div className={styles.empty}>No plugin cards yet. Use “Add plugin card” to create the first one.</div> : pluginItems.map((item) => { const expanded = openPluginItem === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetPluginItem() : beginPluginItem(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaFolderOpen /></span><b>{item.title}</b><small>{item.description || "No short description"}</small></span><span>{item.link || "No link yet"}</span><span>{item.order ?? 0}</span><span className={styles.layoutTag}>{pluginIconOptions.find(([value]) => value === item.icon)?.[1] || "Puzzle"}<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderPluginItemForm()}<div className={styles.rowActions}><button onClick={() => beginPluginItem(item)}>Edit</button><button className={styles.delete} onClick={() => destroy(item, PLUGIN_ITEMS)}>Delete</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "footer") return <main className={styles.shell}>
    {renderSidebar(resetFooter)}
    <section className={styles.workspace}>
      <header className={styles.topbar}><div><p>Website content</p><h1>Footer</h1></div>{footerItems.length === 0 && <button className={styles.primary} onClick={() => beginFooter()}><FaPlus /> Add footer settings</button>}</header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {openFooter === "new" && renderFooterForm()}
      <div className={styles.intro}><div><h2>Footer content and links</h2><p>Manage the About text, portfolio button, subscribe text, contact details, social links and copyright from one place.</p></div><span>Sitewide</span></div>
      <section className={styles.list}>{footerItems.length === 0 ? <div className={styles.empty}>Footer settings are loading. If needed, add the first footer settings here.</div> : footerItems.slice(0, 1).map((item) => { const expanded = openFooter === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetFooter() : beginFooter(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaBriefcase /></span><b>{item.siteName || "Rashidverse"}</b><small>{item.aboutHeading || "Footer content"}</small></span><span>{Array.isArray(item.socials) ? `${item.socials.filter((social) => social.url).length} social links` : "Social links"}</span><span>All pages</span><span className={styles.layoutTag}>Footer<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderFooterForm()}<div className={styles.rowActions}><button onClick={() => beginFooter(item)}>Edit</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "profiles") return <main className={styles.shell}>
    {renderEditorSidebar(() => setSectorProfileForm(null))}
    <section className={styles.workspace}>
      <header className={styles.topbar}><div>{selectedProfile && renderPageTrail(profilePageTitle)}<p>{selectedProfile ? profilePageTitle : "Portfolio system"}</p><h1>{selectedProfile ? `${profilePageTitle} settings` : "Portfolio Profiles"}</h1></div></header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>×</button></div>}
      <div className={styles.intro}><div><h2>{selectedProfile ? `${profilePageTitle} settings` : "Focused career links"}</h2><p>{selectedProfile ? "Manage this profile identity, shareable link, page title, description and Hero appearance from one place." : "Each profile has its own shareable homepage and portfolio page. Assign individual content below."}</p></div><span>{profilesForEditor.length} {profilesForEditor.length === 1 ? "profile" : "profiles"}</span></div>
      <section className={styles.list}><div className={styles.listHeader}><span>Profile</span><span>Home link</span><span>Portfolio link</span><span>Action</span></div>{sectorProfiles.map((profile) => <div className={styles.item} key={profile.id}><div className={styles.itemRow}><span className={styles.itemTitle}><span className={styles.iconCell}><FaFolderOpen /></span><b>{profile.name}</b><small>{profile.title}</small></span><span>/{profile.slug}/</span><span>/{profile.slug}/portfolio/</span><span className={styles.layoutTag}><button type="button" onClick={() => beginSectorProfile(profile)}>Edit profile</button></span></div>{sectorProfileForm?.id === profile.id && <form className={styles.editor} onSubmit={saveSectorProfile}><div className={styles.editorHead}><h3>Edit {profile.name}</h3><button className={styles.close} type="button" onClick={() => setSectorProfileForm(null)}>Close</button></div><div className={styles.formGrid}><Field label="Menu label"><input required value={sectorProfileForm.label} onChange={(event) => setSectorProfileForm({ ...sectorProfileForm, label: event.target.value })} /></Field><Field label="Profile name"><input required value={sectorProfileForm.name} onChange={(event) => setSectorProfileForm({ ...sectorProfileForm, name: event.target.value })} /></Field><Field label="Main title" wide><input required value={sectorProfileForm.title} onChange={(event) => setSectorProfileForm({ ...sectorProfileForm, title: event.target.value })} /></Field><Field label="Profile description" wide><textarea rows="3" value={sectorProfileForm.description} onChange={(event) => setSectorProfileForm({ ...sectorProfileForm, description: event.target.value })} /></Field></div>{renderProfileHeroOverlayFields()}<div className={styles.formActions}><button className={styles.primary} disabled={saving}>{saving ? "Saving..." : "Save profile & Hero appearance"}</button></div></form>}</div>)}</section>
    </section>
  </main>;

  if (activeMenu === "global-settings") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Sitewide settings</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={`${activeMenu === id ? styles.activeNav : ""}${id === "global-settings" || id === "header" ? ` ${styles.sitewideNav}` : ""}`} onClick={() => { setActiveMenu(id); setEditingGlobalSettings(null); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Sitewide settings</p><h1>Global Profile & Resumes</h1></div><button className={styles.primary} onClick={() => beginGlobalSettings()}><FaPlus /> {globalSettings.length ? "Edit global settings" : "Create global settings"}</button></header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}{editingGlobalSettings !== null ? renderGlobalSettingsForm() : <><div className={styles.intro}><div><h2>One place for shared information</h2><p>Contact drawer details, social links and all three resumes are stored here. Every Resume Center button updates automatically.</p></div><span>Global</span></div><section className={styles.list}>{globalSettings.length === 0 ? <div className={styles.empty}>No global settings found. Create the first shared profile.</div> : globalSettings.slice(0, 1).map((item) => <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => beginGlobalSettings(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaUserCircle /></span><b>{item.fullName || "Global profile"}</b><small>{item.email || "Contact and resume center"}</small></span><span>{Array.isArray(item.resumes) ? `${item.resumes.filter((resume) => resume.url).length} resumes linked` : "0 resumes linked"}</span><span>All pages</span><span className={styles.layoutTag}>Global<FaChevronDown /></span></button><div className={styles.rowActions}><button onClick={() => beginGlobalSettings(item)}>Edit</button></div></div>)}</section></>}</section></main>;

  if (activeMenu === "header") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={`${activeMenu === id ? styles.activeNav : ""}${id === "header" ? ` ${styles.sitewideNav}` : ""}`} onClick={() => { setActiveMenu(id); resetHeader(); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Sitewide Settings</p><h1>Header & Navigation</h1></div>{headerItems.length === 0 && <button className={styles.primary} onClick={() => beginHeader()}><FaPlus /> Add header settings</button>}</header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}{openHeader === "new" && renderHeaderForm()}<section className={styles.list}>{headerItems.length === 0 ? <div className={styles.empty}>Template header is active. Add settings to control it.</div> : headerItems.slice(0, 1).map((item) => { const expanded = openHeader === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetHeader() : beginHeader(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaFolderOpen /></span><b>{item.siteName}</b><small>{item.menuLabel} Â· {item.logoLink}</small></span><span>Global</span><span>Header</span><span className={styles.layoutTag}>Settings<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderHeaderForm()}<div className={styles.rowActions}><button onClick={() => beginHeader(item)}>Edit</button></div></div>; })}</section></section></main>;

  if (activeMenu === "client-logos") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetClientLogo(); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Client Logos</h1></div><button className={styles.primary} onClick={() => beginClientLogo()}><FaPlus /> Add client logo</button></header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}{openClientLogo === "new" && renderClientLogoForm()}<section className={styles.list}><div className={styles.listHeader}><span>Company</span><span>Website link</span><span>Order</span><span>Open</span></div>{clientLogos.length === 0 ? <div className={styles.empty}>No client logos yet. Add the first one from Media Library.</div> : clientLogos.map((item) => { const expanded = openClientLogo === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetClientLogo() : beginClientLogo(item)}><span className={styles.itemTitle}>{item.image ? <img src={item.image} alt="" /> : <span className={styles.iconCell}><FaRegImage /></span>}<b>{item.name}</b><small>Client logo</small></span><span>{item.link || "No link"}</span><span>{item.order ?? 0}</span><span className={styles.layoutTag}>{item.linkTarget === "same" ? "Same tab" : "New tab"}<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderClientLogoForm()}<div className={styles.rowActions}><button onClick={() => beginClientLogo(item)}>Edit</button><button className={styles.delete} onClick={() => destroy(item, CLIENT_LOGOS)}>Delete</button></div></div>; })}</section></section></main>;

  if (activeMenu === "cta") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetCta(); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Project Call To Action</h1></div>{ctaItems.length === 0 && <button className={styles.primary} onClick={() => beginCta()}><FaPlus /> Add section</button>}</header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}{openCta === "new" && renderCtaForm()}<section className={styles.list}>{ctaItems.length === 0 ? <div className={styles.empty}>Template content is active. Add the section to control its heading and button.</div> : ctaItems.slice(0, 1).map((item) => { const expanded = openCta === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetCta() : beginCta(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaBriefcase /></span><b>{item.heading}</b><small>{item.buttonText} â†’ {item.buttonLink}</small></span><span>After testimonials</span><span>Button</span><span className={styles.layoutTag}>CTA<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderCtaForm()}<div className={styles.rowActions}><button onClick={() => beginCta(item)}>Edit</button><button className={styles.delete} onClick={() => destroy(item, CTA)}>Delete</button></div></div>; })}</section></section></main>;

  if (activeMenu === "testimonials") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetTestimonial(); setOpenTestimonialSettings(null); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Client Testimonials</h1></div><div>{testimonialSettings.length === 0 && <button className={styles.primary} onClick={() => beginTestimonialSettings()}><FaPlus /> Title section</button>}<button className={styles.primary} onClick={() => beginTestimonial()}><FaPlus /> Add testimonial</button></div></header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}{openTestimonialSettings === "new" && renderTestimonialSettingsForm()}{testimonialSettings.map((item) => openTestimonialSettings === item.id ? renderTestimonialSettingsForm() : <div className={styles.intro} key={item.id}><div><h2>{item.heading || "Testimonials"}</h2><p>{item.description || "Title section settings"}</p></div><button className={styles.close} onClick={() => beginTestimonialSettings(item)}>Edit title section</button></div>)}{openTestimonial === "new" && renderTestimonialForm()}<section className={styles.list}><div className={styles.listHeader}><span>Client & quote</span><span>Role</span><span>Order</span><span>Rating</span></div>{testimonials.length === 0 ? <div className={styles.empty}>No testimonials yet. Add the first client review.</div> : testimonials.map((item) => { const expanded = openTestimonial === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetTestimonial() : beginTestimonial(item)}><span className={styles.itemTitle}>{item.avatar ? <img src={item.avatar} alt="" /> : <span className={styles.iconCell}><FaUserCircle /></span>}<b>{item.name}</b><small>{item.quote}</small></span><span>{item.role}</span><span>{item.order ?? 0}</span><span className={styles.layoutTag}>{item.rating || 5} / 5<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderTestimonialForm()}<div className={styles.rowActions}><button onClick={() => beginTestimonial(item)}>Edit</button><button className={styles.delete} onClick={() => destroy(item, TESTIMONIALS)}>Delete</button></div></div>; })}</section></section></main>;

  if (activeMenu === "featured-settings") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetFeatured(); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Featured Projects</h1></div>{featuredItems.length === 0 && <button className={styles.primary} onClick={() => beginFeatured()}><FaPlus /> Add section settings</button>}</header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}<div className={styles.intro}><div><h2>Section title and description</h2><p>Projects are selected from Portfolio Admin. Turn on Featured Project there and set its order.</p></div><span>{featuredItems.length ? "Configured" : "Template"}</span></div>{openFeatured === "new" && renderFeaturedSettingsForm()}<section className={styles.list}>{featuredItems.length === 0 ? <div className={styles.empty}>The template title is active. Add settings to customize it.</div> : featuredItems.slice(0, 1).map((item) => { const expanded = openFeatured === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetFeatured() : beginFeatured(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaFolderOpen /></span><b>{item.heading || "Featured Projects"}</b><small>{item.description || "Section settings"}</small></span><span>Shared projects</span><span>After skills</span><span className={styles.layoutTag}>Section<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderFeaturedSettingsForm()}<div className={styles.rowActions}><button onClick={() => beginFeatured(item)}>Edit</button></div></div>; })}</section></section></main>;

  if (activeMenu === "featured") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetFeatured(); }}><Icon />{label}</button>)}</nav></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Featured Projects</h1></div>{featuredItems.length === 0 && <button className={styles.primary} onClick={() => beginFeatured()}><FaPlus /> Add Featured Projects</button>}</header>{notice && <div className={styles.notice}>{notice}</div>}<div className={styles.intro}><div><h2>Manage homepage carousel</h2><p>Add project slides, change the section text and choose each project link behavior.</p></div><span>{featuredItems.length} section</span></div>{openFeatured === "new" && renderFeaturedForm()}<section className={styles.list}>{featuredItems.length === 0 ? <div className={styles.empty}>No featured carousel yet. Add it to replace the template projects.</div> : featuredItems.map((item) => { const expanded = openFeatured === item.id; return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => expanded ? resetFeatured() : beginFeatured(item)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaFolderOpen /></span><b>{item.heading}</b><small>{Array.isArray(item.items) ? `${item.items.length} projects` : "0 projects"}</small></span><span>Carousel</span><span>After skills</span><span className={styles.layoutTag}>Featured<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderFeaturedForm()}<div className={styles.rowActions}><button onClick={() => beginFeatured(item)}>Edit</button><button className={styles.delete} onClick={() => destroy(item, FEATURED)}>Delete</button></div></div>; })}</section></section></main>;

  if (activeMenu === "skills") return <main className={styles.shell}><aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetProject(); resetExperience(); resetHero(); resetAbout(); resetFacts(); resetVideo(); resetProcess(); resetSkills(); resetSkillGroup(); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside><section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Skills Section</h1></div><div>{skillsItems.length === 0 && <button className={styles.primary} onClick={() => beginSkills()}><FaPlus /> Skills intro</button>}<button className={styles.primary} onClick={() => beginSkillGroup()}><FaPlus /> Add main skill</button></div></header>{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ãƒâ€”</button></div>}<div className={styles.intro}><div><h2>Skills intro and skill groups</h2><p>Add each main skill separately. Every main skill can have unlimited sub-skills with percentage circles or bars.</p></div><span>{skillGroups.length} main skills</span></div>{openSkills === "new" && renderSkillsForm()}{openSkillGroup === "new" && renderSkillGroupForm()}<section className={styles.list}>{skillsItems.length === 0 ? <div className={styles.empty}>No Skills intro yet.</div> : skillsItems.map((skills) => { const expanded = openSkills === skills.id; return <div className={styles.item} key={skills.id}><button className={styles.itemRow} onClick={() => expanded ? resetSkills() : beginSkills(skills)}><span className={styles.itemTitle}>{skills.image ? <img src={skills.image} alt="" /> : <span className={styles.iconCell}><FaBriefcase /></span>}<b>{skills.heading || "Skills intro"}</b><small>{skills.subtitle || "Power"}</small></span><span>Parallax intro</span><span>After process</span><span className={styles.layoutTag}>Intro<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderSkillsForm()}<div className={styles.rowActions}><button onClick={() => beginSkills(skills)}>Edit</button><button className={styles.delete} onClick={() => destroy(skills, SKILLS)}>Delete</button></div></div>; })}</section><div className={styles.intro}><div><h2>Main skills</h2><p>Click any skill to edit its sub-skills, percentages and display style.</p></div></div><section className={styles.list}>{skillGroups.length === 0 ? <div className={styles.empty}>No main skills yet. Use â€œAdd main skillâ€ to create the first one.</div> : skillGroups.map((group) => { const expanded = openSkillGroup === group.id; return <div className={styles.item} key={group.id}><button className={styles.itemRow} onClick={() => expanded ? resetSkillGroup() : beginSkillGroup(group)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaBriefcase /></span><b>{group.title}</b><small>{group.description || "Skill group"}</small></span><span>{Array.isArray(group.items) ? `${group.items.length} sub-skills` : "0 sub-skills"}</span><span>{group.order ?? 0}</span><span className={styles.layoutTag}>{group.display === "bar" ? "Bars" : "Circles"}<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderSkillGroupForm()}<div className={styles.rowActions}><button onClick={() => beginSkillGroup(group)}>Edit</button><button className={styles.delete} onClick={() => destroy(group, SKILL_GROUPS)}>Delete</button></div></div>; })}</section></section></main>;

  if (activeMenu === "process") return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Working Process</h1></div>{processItems.length === 0 && <button className={styles.primary} onClick={() => beginProcess()}><FaPlus /> Add Working Process</button>}</header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ãƒâ€”</button></div>}
      <div className={styles.intro}><div><h2>Manage section after Video Presentation</h2><p>Change the section heading, three process steps, their icons and the CTA at the bottom.</p></div><span>{processItems.length} section</span></div>
      {openProcess === "new" && renderProcessForm()}
      <section className={styles.list}>{processItems.length === 0 ? <div className={styles.empty}>No Working Process content yet. Add it to replace the template section.</div> : processItems.map((process) => { const expanded = openProcess === process.id; return <div className={styles.item} key={process.id}><button className={styles.itemRow} onClick={() => expanded ? resetProcess() : beginProcess(process)}><span className={styles.itemTitle}><span className={styles.iconCell}><FaBriefcase /></span><b>{process.heading || "My Working Process"}</b><small>{process.eyebrow || "How I Work"}</small></span><span>{Array.isArray(process.steps) ? `${process.steps.length} steps` : "3 steps"}</span><span>After video</span><span className={styles.layoutTag}>Process<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderProcessForm()}<div className={styles.rowActions}><button onClick={() => beginProcess(process)}>Edit</button><button className={styles.delete} onClick={() => destroy(process, PROCESS)}>Delete</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "video") return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Video Presentation</h1></div>{videoItems.length === 0 && <button className={styles.primary} onClick={() => beginVideo()}><FaPlus /> Add video section</button>}</header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}
      <div className={styles.intro}><div><h2>Manage section after Work Experience</h2><p>Change the preview image, popup video link, title, description and button.</p></div><span>{videoItems.length} section</span></div>
      {openVideo === "new" && renderVideoForm()}
      <section className={styles.list}>{videoItems.length === 0 ? <div className={styles.empty}>No video content yet. Add it to replace the template section.</div> : videoItems.map((video) => { const expanded = openVideo === video.id; return <div className={styles.item} key={video.id}><button className={styles.itemRow} onClick={() => expanded ? resetVideo() : beginVideo(video)}><span className={styles.itemTitle}>{video.image ? <img src={video.image} alt="" /> : <span className={styles.iconCell}><FaRegImage /></span>}<b>{video.title || "Video Presentation"}</b><small>{video.videoUrl || "No video link"}</small></span><span>Video</span><span>After experience</span><span className={styles.layoutTag}>Video<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderVideoForm()}<div className={styles.rowActions}><button onClick={() => beginVideo(video)}>Edit</button><button className={styles.delete} onClick={() => destroy(video, VIDEO)}>Delete</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "facts") return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Interesting Facts</h1></div>{factsItems.length === 0 && <button className={styles.primary} onClick={() => beginFacts()}><FaPlus /> Add facts content</button>}</header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}
      <div className={styles.intro}><div><h2>Manage third homepage section</h2><p>Edit its heading, parallax background, overlay and four counters.</p></div><span>{factsItems.length} section</span></div>
      {openFacts === "new" && renderFactsForm()}
      <section className={styles.list}>{factsItems.length === 0 ? <div className={styles.empty}>No facts content yet. Add it to replace the template section.</div> : factsItems.map((facts) => { const expanded = openFacts === facts.id; return <div className={styles.item} key={facts.id}><button className={styles.itemRow} onClick={() => expanded ? resetFacts() : beginFacts(facts)}><span className={styles.itemTitle}>{facts.image ? <img src={facts.image} alt="" /> : <span className={styles.iconCell}><FaBriefcase /></span>}<b>{facts.heading || "Interesting Facts"}</b><small>{facts.subtitle || "Numbers"}</small></span><span>{Array.isArray(facts.items) ? `${facts.items.length} counters` : "4 counters"}</span><span>3rd</span><span className={styles.layoutTag}>Facts<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderFactsForm()}<div className={styles.rowActions}><button onClick={() => beginFacts(facts)}>Edit</button><button className={styles.delete} onClick={() => destroy(facts, FACTS)}>Delete</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "about") return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>About Me</h1></div>{aboutItems.length === 0 && <button className={styles.primary} onClick={() => beginAbout()}><FaPlus /> Add About content</button>}</header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}
      <div className={styles.intro}><div><h2>Manage second homepage section</h2><p>Edit the image, heading, description, button and all four service cards.</p></div><span>{aboutItems.length} section</span></div>
      {openAbout === "new" && renderAboutForm()}
      <section className={styles.list}>{aboutItems.length === 0 ? <div className={styles.empty}>No About content yet. Add it to replace the template section.</div> : aboutItems.map((about) => { const expanded = openAbout === about.id; return <div className={styles.item} key={about.id}><button className={styles.itemRow} onClick={() => expanded ? resetAbout() : beginAbout(about)}><span className={styles.itemTitle}>{about.image ? <img src={about.image} alt="" /> : <span className={styles.iconCell}><FaUserCircle /></span>}<b>{about.heading || "About Me"}</b><small>{about.eyebrow || "Homepage section"}</small></span><span>{about.sectionLabel || "Words About"}</span><span>2nd</span><span className={styles.layoutTag}>About<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderAboutForm()}<div className={styles.rowActions}><button onClick={() => beginAbout(about)}>Edit</button><button className={styles.delete} onClick={() => destroy(about, ABOUT)}>Delete</button></div></div>; })}</section>
    </section>
  </main>;

  if (activeMenu === "hero") return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Hero Section</h1></div><button className={styles.primary} onClick={() => beginHero()}><FaPlus /> Add hero slide</button></header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}
      <div className={styles.intro}><div><h2>Manage home slider</h2><p>Change heading, categories, link and background image. Lower order appears first. If no slide is added, the original template slides stay visible.</p></div><span>{heroes.length} slides</span></div>
      {openHero === "new" && renderHeroForm()}
      <section className={styles.list}><div className={styles.listHeader}><span>Heading</span><span>Categories</span><span>Order</span><span>Image</span></div>
        {heroes.length === 0 ? <div className={styles.empty}>No hero slides yet. Use the add button to create your first one.</div> : heroes.map((hero) => { const expanded = openHero === hero.id; return <div className={styles.item} key={hero.id}><button className={styles.itemRow} onClick={() => expanded ? resetHero() : beginHero(hero)}><span className={styles.itemTitle}>{hero.image ? <img src={hero.image} alt="" /> : <span className={styles.iconCell}><FaRegImage /></span>}<b>{hero.title}</b><small>{hero.link || "No button link"}</small></span><span>{[hero.categoryOne, hero.categoryTwo].filter(Boolean).join(" Â· ") || "â€”"}</span><span>{hero.order ?? 0}</span><span className={styles.layoutTag}>Hero<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && renderHeroForm()}<div className={styles.rowActions}><button onClick={() => beginHero(hero)}>Edit</button><button className={styles.delete} onClick={() => destroy(hero, HEROES)}>Delete</button></div></div>; })}
      </section>
    </section>
  </main>;

  if (activeMenu === "media") return <main className={styles.shell}>
    <aside className={styles.sidebar}><div className={styles.brand}><span>R</span> Rashidverse</div><p className={styles.menuLabel}>Website content</p><nav>{menu.map(({ id, label, icon: Icon }) => <button key={id} className={activeMenu === id ? styles.activeNav : ""} onClick={() => { setActiveMenu(id); resetProject(); resetExperience(); resetHero(); resetAbout(); }}><Icon />{label}</button>)}</nav><div className={styles.profile}><FaUserCircle /><div><strong>Local Admin</strong><small>Desktop server</small></div></div></aside>
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>Media Library</h1></div><div className={mediaStyles.mediaActions}><input type="search" value={mediaSearch} onChange={(e) => setMediaSearch(e.target.value)} placeholder="Search media nameâ€¦" aria-label="Search media name" /><label className={styles.primary}><FaPlus /> Upload media<input type="file" accept="image/*,.zip,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rar" onChange={uploadMedia} hidden /></label></div></header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}
      <div className={styles.intro}><div><h2>Website media</h2><p>Images, icons, and downloadable files uploaded for website content appear here. Used media is protected from accidental deletion.</p></div><span>{mediaFiles.length} files</span></div>
      {mediaFiles.length === 0 ? <div className={styles.empty}>No media yet. Upload an image or downloadable file from here or a content form.</div> : filteredMedia.length === 0 ? <div className={styles.empty}>No media matches â€œ{mediaSearch}â€.</div> : <div className={mediaStyles.grid}>{filteredMedia.map((media) => <article className={mediaStyles.card} key={media.url}>{media.kind === "file" ? <span className={mediaStyles.cardFile}>FILE</span> : <img src={media.url} alt={media.name} />}<div><span>{media.name}</span><button type="button" onClick={() => removeMedia(media.url)} aria-label={`Delete ${media.name}`}><FaTrash /><em>Delete</em></button></div></article>)}</div>}
    </section>
  </main>;

  return <main className={styles.shell}>
    {renderEditorSidebar()}
    <section className={styles.workspace}><header className={styles.topbar}><div><p>Content Manager</p><h1>{isProject ? "Portfolio Section" : "Work Experience"}</h1></div><div>{!isProject && <button className={styles.primary} onClick={() => experienceSettings.length ? beginExperienceSettings(experienceSettings[0]) : beginExperienceSettings()}><FaPlus /> {experienceSettings.length ? "Edit section title" : "Add section title"}</button>}<button className={styles.primary} onClick={() => isProject ? beginProject() : beginExperience()}><FaPlus /> Add {isProject ? "project" : "experience"}</button></div></header>
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}>Ã—</button></div>}
      {!isProject && openExperienceSettings === "new" && renderExperienceSettingsForm()}{!isProject && experienceSettings.map((item) => openExperienceSettings === item.id ? renderExperienceSettingsForm() : <div className={styles.intro} key={item.id}><div><h2>{String(item.heading || "Work Experience title").replace(/\[\/?highlight\]/g, "")}</h2><p>{item.description || "Edit the small heading, main title, description and resume button."}</p></div><button className={styles.close} onClick={() => beginExperienceSettings(item)}>Edit section title</button></div>)}
      <div className={styles.intro}><div><h2>{isProject ? "Manage portfolio projects" : "Manage job history"}</h2><p>{isProject ? "Click a project row to edit it without leaving this page." : "Add each company, choose its order, and alternate the image/text layout whenever you need."}</p></div><span>{activeItems.length} {isProject ? "projects" : "entries"}</span></div>
      {isProject && openProject === "new" && renderProjectForm()}{!isProject && openExperience === "new" && renderExperienceForm()}
      <section className={styles.list}><div className={styles.listHeader}><span>{isProject ? "Project" : "Company & role"}</span><span>{isProject ? "Main category / subcategory" : "Period"}</span><span>Order</span><span>Layout</span></div>
        {activeItems.length === 0 ? <div className={styles.empty}>No {isProject ? "projects" : "work experience"} yet. Use the add button to create the first one.</div> : activeItems.map((item) => {
          const expanded = isProject ? openProject === item.id : openExperience === item.id;
          const title = isProject ? item.title : item.company;
          const subtext = isProject ? item.link : item.role;
          return <div className={styles.item} key={item.id}><button className={styles.itemRow} onClick={() => { if (expanded) { if (isProject) resetProject(); else resetExperience(); } else if (isProject) beginProject(item); else beginExperience(item); }}><span className={styles.itemTitle}>{isProject && item.thumb ? <img src={item.thumb} alt="" /> : <span className={styles.iconCell}>{isProject ? <FaFolderOpen /> : <FaBriefcase />}</span>}<b>{title}</b><small>{subtext}</small></span><span>{isProject ? [item.mainCategory || item.category, item.subcategory].filter(Boolean).join(" Â· ") : item.period}</span><span>{isProject && item.featured ? `Featured ${item.featuredOrder ?? 0}` : item.order ?? 0}</span><span className={styles.layoutTag}>{isProject ? item.published === false ? "Draft" : "Project" : item.layout === "reverse" ? "Reversed" : "Standard"}<FaChevronDown className={expanded ? styles.rotate : ""} /></span></button>{expanded && (isProject ? renderProjectForm() : renderExperienceForm())}<div className={styles.rowActions}><button onClick={() => { if (isProject) beginProject(item); else beginExperience(item); }}>Edit</button><button className={styles.delete} onClick={() => destroy(item, isProject ? PROJECTS : EXPERIENCES)}>Delete</button></div></div>;
        })}
      </section>
    </section>
  </main>;
}
