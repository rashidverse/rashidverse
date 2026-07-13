"use client";

import Image from "next/image";
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
import styles from "./PortfolioGallery.module.css";

type PortfolioFilter = "all" | "web" | "photography" | "branding" | "ui";

type PortfolioProject = {
  id: number;
  title: string;
  meta: string;
  categories: Exclude<PortfolioFilter, "all">[];
  image: string;
  width: number;
  height: number;
  columns: number;
  rows: number;
};

type PortfolioCardStyle = CSSProperties & {
  "--portfolio-col": number;
  "--portfolio-row": number;
  "--portfolio-ratio": number;
};

type HoverDirection = "top" | "right" | "bottom" | "left";

const filters: { value: PortfolioFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web Design" },
  { value: "photography", label: "Photo" },
  { value: "branding", label: "Branding" },
  { value: "ui", label: "UI Design" },
];

const projects: PortfolioProject[] = [
  {
    id: 1,
    title: "Kent Brant Concept",
    meta: "Design · Branding",
    categories: ["web", "branding"],
    image: "/portfolio/project-01.webp",
    width: 460,
    height: 305,
    columns: 1,
    rows: 1,
  },
  {
    id: 2,
    title: "Old Cars on Street",
    meta: "Photography · Development",
    categories: ["photography"],
    image: "/portfolio/project-02.webp",
    width: 456,
    height: 305,
    columns: 1,
    rows: 1,
  },
  {
    id: 3,
    title: "Mobile UI Interface",
    meta: "Development · Branding",
    categories: ["branding"],
    image: "/portfolio/project-03.webp",
    width: 919,
    height: 611,
    columns: 2,
    rows: 2,
  },
  {
    id: 4,
    title: "Video Project",
    meta: "Video · Branding",
    categories: ["web"],
    image: "/portfolio/project-04.webp",
    width: 460,
    height: 609,
    columns: 1,
    rows: 2,
  },
  {
    id: 5,
    title: "Barbershop Website",
    meta: "Photography · Web",
    categories: ["web", "branding"],
    image: "/portfolio/project-05.webp",
    width: 456,
    height: 303,
    columns: 1,
    rows: 1,
  },
  {
    id: 6,
    title: "Man in Old Town",
    meta: "Photography · UI",
    categories: ["ui"],
    image: "/portfolio/project-06.webp",
    width: 456,
    height: 303,
    columns: 1,
    rows: 1,
  },
  {
    id: 7,
    title: "YouTube Video Project",
    meta: "Video · Web Design",
    categories: ["branding", "photography"],
    image: "/portfolio/project-07.webp",
    width: 460,
    height: 303,
    columns: 1,
    rows: 1,
  },
  {
    id: 8,
    title: "Mobile UI Interface",
    meta: "Development · UI",
    categories: ["ui", "web"],
    image: "/portfolio/project-08.webp",
    width: 457,
    height: 303,
    columns: 1,
    rows: 1,
  },
  {
    id: 9,
    title: "Project Vimeo",
    meta: "Development · Video",
    categories: ["ui", "photography"],
    image: "/portfolio/project-09.webp",
    width: 460,
    height: 304,
    columns: 1,
    rows: 1,
  },
  {
    id: 10,
    title: "Architecture Agency",
    meta: "Development · Web Design",
    categories: ["web"],
    image: "/portfolio/project-10.webp",
    width: 456,
    height: 304,
    columns: 1,
    rows: 1,
  },
  {
    id: 11,
    title: "Corporate Website",
    meta: "Development · Web Design",
    categories: ["web", "photography"],
    image: "/portfolio/project-11.webp",
    width: 460,
    height: 612,
    columns: 1,
    rows: 2,
  },
  {
    id: 12,
    title: "Personal Website",
    meta: "Development · Web Design",
    categories: ["web", "ui"],
    image: "/portfolio/project-12.webp",
    width: 457,
    height: 303,
    columns: 1,
    rows: 1,
  },
  {
    id: 13,
    title: "Corporate Website",
    meta: "Development · Web Design",
    categories: ["photography"],
    image: "/portfolio/project-13.webp",
    width: 460,
    height: 305,
    columns: 1,
    rows: 1,
  },
  {
    id: 14,
    title: "Personal Portfolio",
    meta: "Development · Web Design",
    categories: ["branding", "ui"],
    image: "/portfolio/project-14.webp",
    width: 456,
    height: 305,
    columns: 1,
    rows: 1,
  },
  {
    id: 15,
    title: "Fashion Website",
    meta: "Development · Web Design",
    categories: ["ui"],
    image: "/portfolio/project-15.webp",
    width: 457,
    height: 306,
    columns: 1,
    rows: 1,
  },
];

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
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>("all");
  const [touchOpenId, setTouchOpenId] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const visibleProjects = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) =>
            project.categories.includes(activeFilter),
          ),
    [activeFilter],
  );

  const activeProject =
    lightboxIndex === null ? null : visibleProjects[lightboxIndex] ?? null;
  const lightboxOpen = lightboxIndex !== null;

  const updateCellHeight = useCallback(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery || window.innerWidth <= 560) return;

    const columns = window.innerWidth <= 820 ? 2 : window.innerWidth <= 1080 ? 3 : 4;
    const columnWidth = gallery.clientWidth / columns;
    section.style.setProperty("--portfolio-cell-height", `${columnWidth * 0.662}px`);
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
        return (current + delta + visibleProjects.length) % visibleProjects.length;
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

  const selectFilter = (filter: PortfolioFilter) => {
    setActiveFilter(filter);
    setTouchOpenId(null);
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

  const handleCardClick = (
    projectId: number,
    event: ReactMouseEvent<HTMLElement>,
  ) => {
    if (!isTouchLayout() || (event.target as HTMLElement).closest("button")) return;
    setTouchOpenId((current) => (current === projectId ? null : projectId));
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
    >
      <div className={styles.filterBar}>
        <div className={styles.filterTitle}>
          <span className={styles.filterSymbol} aria-hidden="true">
            <span />
          </span>
          <span>Portfolio Filter</span>
        </div>

        <div className={styles.filterButtons} role="group" aria-label="Portfolio filters">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                className={`${styles.filterButton}${isActive ? ` ${styles.activeFilter}` : ""}`}
                key={filter.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectFilter(filter.value)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className={styles.counter} aria-live="polite">
          <span className={styles.visibleCount}>{visibleProjects.length}</span>
          <span className={styles.counterSeparator} aria-hidden="true" />
          <span className={styles.totalCount}>{projects.length}</span>
        </div>
      </div>

      <div className={styles.gallery} ref={galleryRef}>
        {visibleProjects.map((project) => {
          const cardStyle: PortfolioCardStyle = {
            "--portfolio-col": project.columns,
            "--portfolio-row": project.rows,
            "--portfolio-ratio": project.width / project.height,
          };

          return (
            <article
              className={`${styles.card}${touchOpenId === project.id ? ` ${styles.touchOpen}` : ""}`}
              key={project.id}
              style={cardStyle}
              onMouseEnter={(event) => animateOverlay(event, true)}
              onMouseLeave={(event) => animateOverlay(event, false)}
              onClick={(event) => handleCardClick(project.id, event)}
            >
              <div className={styles.cardMedia}>
                <Image
                  className={styles.cardImage}
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 560px) calc(100vw - 54px), (max-width: 820px) 50vw, (max-width: 1080px) 33vw, 25vw"
                />

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
                      <p>{project.meta}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
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
            <Image
              className={styles.lightboxImage}
              src={activeProject.image}
              alt={activeProject.title}
              width={activeProject.width}
              height={activeProject.height}
              sizes="(max-width: 560px) calc(100vw - 112px), calc(100vw - 190px)"
              priority
            />
            <figcaption className={styles.lightboxCaption}>
              <strong>{activeProject.title}</strong>
              <span>{activeProject.meta}</span>
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
