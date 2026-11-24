"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { FaArrowDown, FaArrowLeft, FaEnvelope, FaSearch, FaTimes } from "react-icons/fa";
import "./portfolio.css";

type Project = { id: string; title: string; description?: string; link?: string; mainCategory?: string; subcategory?: string; thumb?: string; hoverImg?: string; published?: boolean; order?: number };
type PortfolioProfile = { id: string; slug: string; name: string; title: string; description: string };

export default function PortfolioPage({ sector, profile }: { sector?: string; profile?: PortfolioProfile | null }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState("All");
  const [preview, setPreview] = useState<Project | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<string[]>([]);
  const masonryRef = useRef<HTMLElement | null>(null);
  const previousPositions = useRef<Map<string, DOMRect>>(new Map());
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const previewFrame = useRef<number | null>(null);

  useEffect(() => {
    const query = sector ? `?sector=${encodeURIComponent(sector)}` : "";
    fetch(`/api/content/portfolio/${query}`).then((r) => r.ok ? r.json() : []).then((items) => setProjects(items.filter((item: Project) => item.published !== false)));
  }, [sector]);
  const tabs = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.subcategory || p.mainCategory).filter(Boolean) as string[]))], [projects]);
  const visible = useMemo(() => projects.filter((p) => (p.thumb || p.hoverImg) && !brokenImageIds.includes(p.id) && (active === "All" || (p.subcategory || p.mainCategory) === active)), [projects, active, brokenImageIds]);
  const openLive = (project: Project) => { if (project.link) window.open(project.link, "_blank", "noopener,noreferrer"); };
  const stopPreviewScroll = () => { if (previewFrame.current !== null) cancelAnimationFrame(previewFrame.current); previewFrame.current = null; };
  const autoScrollPreview = () => {
    const area = previewScrollRef.current;
    if (!area) return;
    stopPreviewScroll();
    area.scrollTop = 0;
    const maximum = Math.max(0, area.scrollHeight - area.clientHeight);
    const start = performance.now(), duration = 9000;
    const tick = (now: number) => { const progress = Math.min(1, (now - start) / duration); area.scrollTop = maximum * progress; if (progress < 1) previewFrame.current = requestAnimationFrame(tick); };
    previewFrame.current = requestAnimationFrame(tick);
  };
  const scrollPreviewToBottom = () => { const area = previewScrollRef.current; if (!area) return; stopPreviewScroll(); area.scrollTo({ top: area.scrollHeight, behavior: "smooth" }); };
  const closePreview = () => { stopPreviewScroll(); setPreview(null); };
  const setDirectionalHover = (event: ReactMouseEvent<HTMLElement>, entering: boolean) => {
    const card = event.currentTarget, overlay = card.querySelector<HTMLElement>("[data-portfolio-overlay]");
    if (!overlay) return;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const side = Math.abs(x / bounds.width) > Math.abs(y / bounds.height) ? (x > 0 ? "right" : "left") : (y > 0 ? "bottom" : "top");
    const outsidePosition = { top: "translate3d(0,-100%,0)", right: "translate3d(100%,0,0)", bottom: "translate3d(0,100%,0)", left: "translate3d(-100%,0,0)" }[side];
    if (entering) {
      overlay.style.transition = "none";
      overlay.style.transform = outsidePosition;
      void overlay.offsetWidth;
      requestAnimationFrame(() => { overlay.style.transition = "transform 300ms ease"; overlay.style.transform = "translate3d(0,0,0)"; });
      return;
    }
    overlay.style.transition = "transform 300ms ease";
    overlay.style.transform = outsidePosition;
  };
  const selectTab = (tab: string) => {
    if (tab === active || !masonryRef.current) return;
    previousPositions.current = new Map(Array.from(masonryRef.current.querySelectorAll<HTMLElement>("[data-project-id]")).map((card) => [card.dataset.projectId || "", card.getBoundingClientRect()]));
    setActive(tab);
  };

  useLayoutEffect(() => {
    if (!previousPositions.current.size || !masonryRef.current) return;
    masonryRef.current.querySelectorAll<HTMLElement>("[data-project-id]").forEach((card) => {
      const previous = previousPositions.current.get(card.dataset.projectId || "");
      if (!previous) return;
      const next = card.getBoundingClientRect();
      const x = previous.left - next.left;
      const y = previous.top - next.top;
      if (x || y) card.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: "translate(0, 0)" }], { duration: 950, easing: "cubic-bezier(.22, 1, .36, 1)" });
    });
    previousPositions.current.clear();
  }, [active]);
  useEffect(() => () => stopPreviewScroll(), []);

  return <main className="portfolio-page">
    <aside className="portfolio-rail"><a href={sector ? `/${sector}/` : "/"} aria-label="Back to home"><FaArrowLeft /></a><span>PORTFOLIO</span></aside>
    <button type="button" className="rv-contact-trigger" data-contact-drawer-trigger aria-label="Open contact panel"><FaEnvelope /></button>
    <section className="portfolio-content">
      <header className="portfolio-intro"><a className="portfolio-home" href={sector ? `/${sector}/` : "/"}>← Home</a><h1>{profile?.title || <><span>DESIGN. DEVELOP.</span><br />DELIVER. WORDPRESS EXCELLENCE.</>}</h1><p>{profile?.description || "From idea to launch — I build clean, responsive, and powerful WordPress websites."}</p><div className="portfolio-tabs">{tabs.map((tab) => <button key={tab} className={active === tab ? "active" : ""} onClick={() => selectTab(tab)}>{tab}</button>)}</div></header>
      <section ref={masonryRef} className="portfolio-masonry" aria-live="polite">{visible.map((project, index) => <article className={`portfolio-card portfolio-size-${index % 15}`} data-project-id={project.id} key={project.id} style={{ animation: "none" }} onMouseEnter={(e) => setDirectionalHover(e, true)} onMouseLeave={(e) => setDirectionalHover(e, false)} onFocus={(e) => { const overlay = e.currentTarget.querySelector<HTMLElement>("[data-portfolio-overlay]"); if (overlay) overlay.style.transform = "translate3d(0,0,0)"; }} onBlur={(e) => { const overlay = e.currentTarget.querySelector<HTMLElement>("[data-portfolio-overlay]"); if (overlay) overlay.style.transform = "translate3d(-100%,0,0)"; }} onClick={() => openLive(project)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openLive(project)}><img src={project.thumb || project.hoverImg || ""} alt={project.title} onError={() => setBrokenImageIds((ids) => ids.includes(project.id) ? ids : [...ids, project.id])} /><button className="portfolio-preview" aria-label={`Preview ${project.title}`} onClick={(e) => { e.stopPropagation(); setPreview(project); }}><FaSearch /></button><div className="portfolio-shade" data-portfolio-overlay aria-hidden="true"><div className="portfolio-hover-inner"><div className="portfolio-hover-copy"><h2>{project.title}</h2><span>{project.subcategory || project.mainCategory || "Project"}</span></div></div></div></article>)}</section>
      {!visible.length && <p className="portfolio-empty">No projects in this category yet.</p>}
    </section>
    {preview && <div className="portfolio-modal" role="dialog" aria-modal="true" aria-label={`${preview.title} preview`} onClick={closePreview}><div className="portfolio-preview-window" onClick={(e) => e.stopPropagation()}><div className="portfolio-preview-toolbar"><strong>{preview.title}</strong><div><button type="button" className="portfolio-scroll-arrow" aria-label="Scroll preview to bottom" onClick={scrollPreviewToBottom}><FaArrowDown /></button><button type="button" className="portfolio-close" aria-label="Close preview" onClick={closePreview}><FaTimes /></button></div></div><div ref={previewScrollRef} className="portfolio-preview-scroll"><img src={preview.hoverImg || preview.thumb || ""} onLoad={autoScrollPreview} alt={`${preview.title} full preview`} /></div></div></div>}
  </main>;
}
