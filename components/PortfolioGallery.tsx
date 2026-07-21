"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { db } from "@/lib/firebase";
import styles from "./PortfolioGallery.module.css";

type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  link: string;
  image: string;
  viewerImage: string;
  order: number;
  columns: number;
  rows: number;
  ratio: number;
};

type StoredProject = Omit<
  PortfolioProject,
  "columns" | "rows" | "ratio"
>;

type PortfolioCardStyle = CSSProperties & {
  "--portfolio-col": number;
  "--portfolio-row": number;
  "--portfolio-ratio": number;
};

type HoverDirection = "top" | "right" | "bottom" | "left";

const COLLECTION_NAME = "portfolio";

const layoutPattern = [
  { columns: 1, rows: 1, ratio: 460 / 305 },
  { columns: 1, rows: 1, ratio: 456 / 305 },
  { columns: 2, rows: 2, ratio: 919 / 611 },
  { columns: 1, rows: 2, ratio: 460 / 609 },
  { columns: 1, rows: 1, ratio: 456 / 303 },
  { columns: 1, rows: 1, ratio: 456 / 303 },
  { columns: 1, rows: 1, ratio: 460 / 303 },
  { columns: 1, rows: 1, ratio: 457 / 303 },
  { columns: 1, rows: 1, ratio: 460 / 304 },
  { columns: 1, rows: 1, ratio: 456 / 304 },
  { columns: 1, rows: 2, ratio: 460 / 612 },
  { columns: 1, rows: 1, ratio: 457 / 303 },
  { columns: 1, rows: 1, ratio: 460 / 305 },
  { columns: 1, rows: 1, ratio: 456 / 305 },
  { columns: 1, rows: 1, ratio: 457 / 306 },
] as const;

const transformByDirection: Record<HoverDirection, string> = {
  top: "translate3d(0,-100%,0)",
  right: "translate3d(100%,0,0)",
  bottom: "translate3d(0,100%,0)",
  left: "translate3d(-100%,0,0)",
};

function getHoverDirection(
  element: HTMLElement,
  event: ReactMouseEvent<HTMLElement>,
): HoverDirection {
  const rect = element.getBoundingClientRect();
  const { width, height } = rect;
  const x =
    (event.clientX - rect.left - width / 2) *
    (width > height ? height / width : 1);
  const y =
    (event.clientY - rect.top - height / 2) *
    (height > width ? width / height : 1);
  const direction =
    Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;

  return (["top", "right", "bottom", "left"] as const)[direction];
}

function isTouchLayout() {
  return window.matchMedia("(hover: none)").matches;
}

export default function PortfolioGallery() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const storedProjects = snapshot.docs
          .map((projectDocument): StoredProject | null => {
            const data = projectDocument.data();
            const title = String(data.title ?? "").trim();
            const image = String(data.thumb ?? "").trim();

            if (!title || !image) return null;

            return {
              id: projectDocument.id,
              title,
              category: String(data.category ?? "Uncategorized").trim(),
              link: String(data.link ?? "").trim(),
              image,
              viewerImage: String(data.hoverImg ?? image).trim() || image,
              order: Number(data.order) || 0,
            };
          })
          .filter((project): project is StoredProject => project !== null)
          .sort((first, second) => first.order - second.order);

        setProjects(
          storedProjects.map((project, index) => ({
            ...project,
            ...layoutPattern[index % layoutPattern.length],
          })),
        );
        setLoadError("");
        setLoading(false);
      },
      (error) => {
        setLoadError(`Projects could not be loaded: ${error.message}`);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const filters = useMemo(() => {
    const categories = Array.from(
      new Set(projects.map((project) => project.category)),
    );

    return ["all", ...categories];
  }, [projects]);

  useEffect(() => {
    if (activeFilter !== "all" && !filters.includes(activeFilter)) {
      setActiveFilter("all");
    }
  }, [activeFilter, filters]);

  const visibleProjects = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter, projects],
  );

  const activeProject =
    lightboxIndex === null ? null : visibleProjects[lightboxIndex] ?? null;
  const lightboxOpen = lightboxIndex !== null;

  const updateCellHeight = useCallback(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery || window.innerWidth <= 560) return;

    const columns =
      window.innerWidth <= 820 ? 2 : window.innerWidth <= 1080 ? 3 : 4;
    const columnWidth = gallery.clientWidth / columns;
    section.style.setProperty(
      "--portfolio-cell-height",
      `${columnWidth * 0.662}px`,
    );
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const resizeObserver = new ResizeObserver(updateCellHeight);
    resizeObserver.observe(gallery);
    window.addEventListener("resize", updateCellHeight, { passive: true });
    updateCellHeight();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCellHeight);
    };
  }, [updateCellHeight]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    window.requestAnimationFrame(() => lastFocusedElement.current?.focus());
  }, []);

  const moveLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null || visibleProjects.length === 0) return current;
        return (
          (current + delta + visibleProjects.length) % visibleProjects.length
        );
      });
    },
    [visibleProjects.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxOpen, moveLightbox]);

  const animateOverlay = (
    event: ReactMouseEvent<HTMLElement>,
    entering: boolean,
  ) => {
    if (isTouchLayout()) return;

    const card = event.currentTarget;
    const overlay = card.querySelector<HTMLElement>("[data-portfolio-overlay]");
    if (!overlay) return;

    const outsidePosition = transformByDirection[getHoverDirection(card, event)];

    if (entering) {
      overlay.style.transition = "none";
      overlay.style.transform = outsidePosition;
      void overlay.offsetWidth;

      window.requestAnimationFrame(() => {
        overlay.style.transition = "transform 300ms ease";
        overlay.style.transform = "translate3d(0,0,0)";
      });
      return;
    }

    overlay.style.transition = "transform 300ms ease";
    overlay.style.transform = outsidePosition;
  };

  const selectFilter = (filter: string) => {
    setActiveFilter(filter);
    setLightboxIndex(null);
  };

  const openLightbox = (
    project: PortfolioProject,
    trigger: HTMLButtonElement,
  ) => {
    const index = visibleProjects.findIndex((item) => item.id === project.id);
    if (index < 0) return;

    lastFocusedElement.current = trigger;
    setLightboxIndex(index);
  };

  const handleLightboxTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleLightboxTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const difference = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(difference) > 50) moveLightbox(difference > 0 ? -1 : 1);
    touchStartX.current = null;
  };

  return (
    <section
      className={styles.portfolioSection}
      id="projects"
      ref={sectionRef}
      aria-label="Selected portfolio projects"
      aria-busy={loading}
    >
      <motion.header
        className={styles.portfolioHeader}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.h2
          className={styles.portfolioHeading}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Design. Develop. Deliver. WordPress Excellence.
        </motion.h2>
        <motion.p
          className={styles.portfolioIntro}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          From idea to launch — I build clean, responsive, and powerful WordPress websites.
        </motion.p>
        <motion.div
          className={styles.filterButtons}
          role="group"
          aria-label="Portfolio filters"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.26 }}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                className={`${styles.filterButton}${isActive ? ` ${styles.activeFilter}` : ""}`}
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectFilter(filter)}
              >
                {filter === "all" ? "All" : filter}
              </button>
            );
          })}
        </motion.div>
        <p className={styles.srOnly} aria-live="polite">
          <span className={styles.visibleCount}>{visibleProjects.length}</span>
          <span> of </span>
          <span className={styles.totalCount}>{projects.length}</span>
          <span> projects shown</span>
        </p>
      </motion.header>

      <div className={styles.gallery} ref={galleryRef}>
        {loading || loadError ? (
          <p
            role="status"
            style={{
              gridColumn: "1 / -1",
              margin: 0,
              padding: "48px",
              color: "#9b9ba4",
              textAlign: "center",
            }}
          >
            {loadError || "Loading projects..."}
          </p>
        ) : null}

        <AnimatePresence mode="popLayout" initial={false}>
          {visibleProjects.map((project, index) => {
            const cardStyle: PortfolioCardStyle = {
              "--portfolio-col": project.columns,
              "--portfolio-row": project.rows,
              "--portfolio-ratio": project.ratio,
              cursor: project.link ? "pointer" : "default",
            };

            return (
              <motion.article
                className={styles.card}
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.25) }}
                style={cardStyle}
                onMouseEnter={(event) => animateOverlay(event, true)}
                onMouseLeave={(event) => animateOverlay(event, false)}
              >
              <div className={styles.cardMedia}>
                <img
                  className={styles.cardImage}
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                />

                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title} project`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 8,
                    }}
                  />
                ) : null}

                <button
                  className={styles.zoom}
                  type="button"
                  aria-label={`Open ${project.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    openLightbox(project, event.currentTarget);
                  }}
                >
                  <span aria-hidden="true" />
                </button>

                <div
                  className={styles.hoverBox}
                  data-portfolio-overlay
                  aria-hidden="true"
                >
                  <div className={styles.hoverInner}>
                    <div className={styles.hoverCopy}>
                      <h3>{project.title}</h3>
                      <p>{project.category}</p>
                    </div>
                  </div>
                </div>
              </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <div className={styles.order}>
        <div className={styles.orderCopy}>
          <h3>Ready To Order Your Project?</h3>
        </div>
        <a className={styles.contactLink} href="mailto:hello@rashidverse.com">
          Get In Touch
        </a>
      </div>

      {activeProject && lightboxIndex !== null ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <button
            className={styles.lightboxClose}
            type="button"
            aria-label="Close"
            ref={closeButtonRef}
            onClick={closeLightbox}
          >
            ×
          </button>
          <button
            className={styles.lightboxNav}
            type="button"
            aria-label="Previous"
            onClick={() => moveLightbox(-1)}
          >
            ‹
          </button>

          <figure className={styles.lightboxFigure}>
            <img
              className={styles.lightboxImage}
              src={activeProject.viewerImage}
              alt={activeProject.title}
              loading="eager"
              decoding="async"
            />
            <figcaption className={styles.lightboxCaption}>
              <strong>{activeProject.title}</strong>
              <span>{activeProject.category}</span>
            </figcaption>
          </figure>

          <button
            className={styles.lightboxNav}
            type="button"
            aria-label="Next"
            onClick={() => moveLightbox(1)}
          >
            ›
          </button>
          <div className={styles.lightboxCounter} aria-live="polite">
            {lightboxIndex + 1} / {visibleProjects.length}
          </div>
        </div>
      ) : null}
    </section>
  );
}
