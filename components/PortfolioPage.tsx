"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import {
  FaBehance,
  FaBriefcase,
  FaCode,
  FaDribbble,
  FaFacebookF,
  FaFilm,
  FaGithub,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaPenNib,
  FaTwitter,
  FaWordpress,
  FaYoutube,
} from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import PortfolioGallery from "./PortfolioGallery";

const navItems = [
  { label: "Hero", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Resume", href: "#resume", id: "resume" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Clients", href: "#clients", id: "clients" },
];

type SocialLink = { platform?: string; label?: string; url?: string; visible?: boolean; order?: number };

const socialIconByPlatform = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  twitter: FaTwitter,
  github: FaGithub,
  behance: FaBehance,
  dribbble: FaDribbble,
  upwork: SiUpwork,
  custom: FaLink,
} as const;

const panels = [
  {
    title: ["WordPress Design", "& Developer"],
    tags: ["WordPress Design", "Development"],
    className: "rv-panel-1",
    number: "01.",
  },
  {
    title: ["Video Editor &", "Motion Graphic Expert"],
    tags: ["Video Edit", "Motion Graphic"],
    className: "rv-panel-2",
    number: "02.",
  },
  {
    title: ["Graphic", "Designer"],
    tags: ["Branding", "Visual Design"],
    className: "rv-panel-3",
    number: "03.",
  },
];

const sections = [
  {
    id: "about",
    label: "Who I Am",
    title: "About Me",
    text: "A passionate creative professional combining design expertise with technical development skills. Bringing ideas to life through purposeful visuals, fluid interfaces, and cinematic motion.",
  },
   {
    id: "projects",
    label: "My Work",
    title: "WordPress Portfolio",
    text: "From idea to launch — I build clean, responsive, and powerful WordPress websites.",
  },
  {
    id: "skills",
    label: "What I Do",
    title: "Skills",
    text: "WordPress, Elementor, PHP, HTML, CSS, JavaScript, Adobe Premiere Pro, After Effects, Photoshop, Illustrator, and a full creative production toolkit.",
  },
 
  {
    id: "clients",
    label: "Trusted By",
    title: "Clients",
    text: "Proud to have collaborated with local businesses, startups, and international brands, delivering results through clear design and reliable execution.",
  },
];

const aboutServices = [
  {
    title: "WordPress Design",
    text: "Fast, polished websites built to turn visitors into clients.",
    icon: FaWordpress,
  },
  {
    title: "Web Development",
    text: "Responsive, functional digital experiences made with care.",
    icon: FaCode,
  },
  {
    title: "Brand Identity",
    text: "Distinct visual systems that make brands feel memorable.",
    icon: FaPenNib,
  },
  {
    title: "Motion & Video",
    text: "Engaging edits and motion graphics with a clear story.",
    icon: FaFilm,
  },
];

const facts = [
  { value: "145", label: "Finished Projects" },
  { value: "357", label: "Happy Customers" },
  { value: "825", label: "Working Hours" },
  { value: "1124", label: "Coffee Cups" },
];

type WorkExperience = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  image: string;
  order: number;
  layout: "standard" | "reverse";
};

const fallbackExperience: WorkExperience[] = [{
  id: "intro-experience",
  company: "Independent Creative Professional",
  role: "Building ideas into digital experiences",
  period: "2019 — Present",
  summary: "I work across WordPress development, visual identity, and motion design to help brands communicate with clarity and confidence. Each project balances strong aesthetics with practical results.",
  highlights: ["WordPress websites & custom layouts", "Brand identity & visual design systems", "Video editing & motion graphics"],
  image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1000&q=85",
  order: 0,
  layout: "standard",
}];

function AboutSection() {
  return (
    <section className="rv-about" id="about">
      <span className="rv-about-slashes" aria-hidden="true">{"//"}</span>
      <span className="rv-about-ghost" aria-hidden="true">ABOUT</span>
      <div className="rv-about-inner rv-fade-up">
        <div className="rv-about-portrait-wrap">
          <div className="rv-about-yellow-block" aria-hidden="true" />
          <div className="rv-about-name">RASHIDVERSE</div>
          <div className="rv-about-portrait" role="img" aria-label="Creative professional working on a laptop" />
        </div>

        <div className="rv-about-content">
          <p className="rv-about-kicker">CREATIVE PROFESSIONAL · BANGLADESH</p>
          <h2>
            Design that makes your <em>creative vision</em> feel real.
          </h2>
          <span className="rv-about-rule" aria-hidden="true" />
          <p className="rv-about-intro">
            I&apos;m Abdul Rashid — a designer and developer who blends strategy,
            visual craft, and technology to create memorable digital experiences.
          </p>

          <div className="rv-about-services">
            {aboutServices.map(({ title, text, icon: Icon }) => (
              <article className="rv-about-service" key={title}>
                <span className="rv-about-icon" aria-hidden="true"><Icon /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>

          <a className="rv-about-cta" href="#projects">Explore My Portfolio</a>
        </div>
      </div>
    </section>
  );
}

function FactsSection() {
  return (
    <section className="rv-facts" aria-labelledby="facts-title">
      <div className="rv-facts-backdrop" aria-hidden="true" />
      <div className="rv-facts-shade" aria-hidden="true" />
      <span className="rv-facts-vertical" aria-hidden="true">NUMBERS</span>
      <div className="rv-facts-inner rv-fade-up">
        <div className="rv-facts-intro">
          <span className="rv-facts-mark" aria-hidden="true" />
          <h2 id="facts-title">Some interesting <em>facts</em><br />about me</h2>
          <span className="rv-facts-divider" aria-hidden="true" />
          <p>
            Every project is a new opportunity to solve a real problem with
            thoughtful design, clear communication, and dependable delivery.
          </p>
        </div>
        <div className="rv-facts-grid">
          {facts.map((fact) => (
            <article className="rv-fact" key={fact.label}>
              <strong>{fact.value}</strong>
              <span><i aria-hidden="true" />{fact.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Legacy single-entry layout retained as a design reference.
function StaticResumeStorySection() {
  return (
    <section className="rv-resume-story" id="resume" aria-labelledby="resume-title">
      <span className="rv-resume-ghost" aria-hidden="true">MY RESUME</span>
      <span className="rv-resume-slashes" aria-hidden="true">{"//"}</span>
      <div className="rv-resume-inner rv-fade-up">
        <header className="rv-resume-heading">
          <span className="rv-resume-line" aria-hidden="true" />
          <p>Some Words About Me</p>
          <h2 id="resume-title">My awesome <em>story</em></h2>
          <p className="rv-resume-summary">
            A creative journey shaped by curiosity, practical problem-solving,
            and a love for making every detail count.
          </p>
        </header>

        <div className="rv-resume-layout">
          <article className="rv-resume-job">
            <span className="rv-resume-job-dot" aria-hidden="true" />
            <div className="rv-resume-job-card">
              <span className="rv-resume-job-icon" aria-hidden="true"><FaBriefcase /></span>
              <div>
                <h3>Independent Creative Professional</h3>
                <p>2019 — Present</p>
              </div>
            </div>
            <span className="rv-resume-count" aria-hidden="true">01.</span>
          </article>

          <div className="rv-resume-image" role="img" aria-label="Creative team collaborating around a desk" />

          <article className="rv-resume-detail">
            <h3>Building ideas into digital experiences</h3>
            <p>
              I work across WordPress development, visual identity, and motion
              design to help brands communicate with clarity and confidence.
              Each project balances strong aesthetics with practical results.
            </p>
            <ol>
              <li>WordPress websites &amp; custom layouts</li>
              <li>Brand identity &amp; visual design systems</li>
              <li>Video editing &amp; motion graphics</li>
            </ol>
            <a href="#projects">View selected work <span aria-hidden="true">→</span></a>
          </article>
        </div>
      </div>
    </section>
  );
}

}
*/

function ResumeStorySection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>(fallbackExperience);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const response = await fetch("/api/content/experience/");
        if (!response.ok) throw new Error("Could not load experience");
        const snapshot: Array<Record<string, unknown>> = await response.json();
        const savedExperiences = snapshot
        .map((data: Record<string, unknown>): WorkExperience | null => {
          const company = String(data.company ?? "").trim();
          const role = String(data.role ?? "").trim();
          if (!company || !role) return null;

          const highlights = Array.isArray(data.highlights)
            ? data.highlights.map((item) => String(item).trim()).filter(Boolean)
            : String(data.highlights ?? "").split("\n").map((item) => item.trim()).filter(Boolean);

          return {
            id: String(data.id ?? ""),
            company,
            role,
            period: String(data.period ?? "").trim(),
            summary: String(data.summary ?? "").trim(),
            highlights,
            image: String(data.image ?? "").trim(),
            order: Number(data.order) || 0,
            layout: data.layout === "reverse" ? "reverse" : "standard",
          };
        })
        .filter((experience): experience is WorkExperience => experience !== null)
        .sort((first, second) => first.order - second.order);

        if (savedExperiences.length) setExperiences(savedExperiences);
      } catch {
        // Keep the introductory experience visible if local data has not been created yet.
      }
    };
    loadExperiences();
  }, []);

  return (
    <section className="rv-resume-story" id="resume" aria-labelledby="resume-title">
      <span className="rv-resume-ghost" aria-hidden="true">MY RESUME</span>
      <span className="rv-resume-slashes" aria-hidden="true">{"//"}</span>
      <div className="rv-resume-inner rv-fade-up">
        <header className="rv-resume-heading">
          <span className="rv-resume-line" aria-hidden="true" />
          <p>Some Words About Me</p>
          <h2 id="resume-title">My awesome <em>story</em></h2>
          <p className="rv-resume-summary">A creative journey shaped by curiosity, practical problem-solving, and a love for making every detail count.</p>
        </header>

        <div className="rv-resume-list">
          {experiences.map((experience, index) => (
            <div className={`rv-resume-layout${experience.layout === "reverse" ? " is-reverse" : ""}`} key={experience.id}>
              <article className="rv-resume-job">
                <span className="rv-resume-job-dot" aria-hidden="true" />
                <div className="rv-resume-job-card">
                  <span className="rv-resume-job-icon" aria-hidden="true"><FaBriefcase /></span>
                  <div><h3>{experience.company}</h3><p>{experience.period}</p></div>
                </div>
                <span className="rv-resume-count" aria-hidden="true">{String(index + 1).padStart(2, "0")}.</span>
              </article>
              <div className="rv-resume-image" role="img" aria-label={`${experience.company} workplace`} style={experience.image ? { backgroundImage: `url("${experience.image}")` } : undefined} />
              <article className="rv-resume-detail">
                <h3>{experience.role}</h3>
                <p>{experience.summary}</p>
                {experience.highlights.length > 0 && <ol>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ol>}
                <a href="#projects">View selected work <span aria-hidden="true">→</span></a>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function scrollToAbout() {
  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
}

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [barScrolled, setBarScrolled] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/content/globalsettings/")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load social links")))
      .then((items) => {
        const settings = Array.isArray(items) ? items[0] : items;
        const links = Array.isArray(settings?.socialLinks) ? settings.socialLinks : [];
        setSocialLinks(links.filter((link: SocialLink) => link?.visible !== false && link?.url).sort((first: SocialLink, second: SocialLink) => Number(first.order || 0) - Number(second.order || 0)));
      })
      .catch(() => setSocialLinks([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setBarScrolled(window.scrollY > 50);

      let current = "hero";
      navItems.forEach((item) => {
        const target = document.getElementById(item.id);
        if (!target) return;

        const top = target.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.5) {
          current = item.id;
        }
      });

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePanel((current) => (current + 1) % panels.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const animated = document.querySelectorAll(".rv-fade-up");

    if (!("IntersectionObserver" in window)) {
      animated.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    animated.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const setPanel = (index: number) => {
    setActivePanel((index + panels.length) % panels.length);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="rv-site">
      <aside className="rv-sidebar" aria-label="Sidebar navigation">
        <div className="rv-sidebar-top">
          <a className="rv-logo-wrap" href="#hero" aria-label="Rashidverse home">
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" />
              <polygon
                points="20,9 32,15.5 32,28.5 20,33 8,28.5 8,15.5"
                className="rv-logo-inner"
              />
              <line x1="20" y1="2" x2="20" y2="38" />
              <line x1="2" y1="12" x2="38" y2="28" />
              <line x1="38" y1="12" x2="2" y2="28" />
            </svg>
          </a>

          <button
            className="rv-menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-overlay"
            onClick={() => setMenuOpen(true)}
          >
            <span className="rv-menu-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="rv-menu-label">Menu</span>
          </button>
        </div>

        <div className="rv-social-icons" aria-label="Social media links">
          {socialLinks.map((social, index) => {
            const platform = String(social.platform || "custom").toLowerCase() as keyof typeof socialIconByPlatform;
            const Icon = socialIconByPlatform[platform] || FaLink;
            return <a key={`${platform}-${index}`} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label || platform}><Icon /></a>;
          })}
        </div>

        <button
          className="rv-sidebar-bottom"
          type="button"
          aria-label="Next portfolio panel"
          onClick={() => setPanel(activePanel + 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.6" />
          </svg>
        </button>
      </aside>

      <a className="rv-email-btn" href="mailto:hello@rashidverse.com" aria-label="Send email">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </a>

      <div
        className={`rv-menu-overlay${menuOpen ? " is-open" : ""}`}
        id="menu-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <button className="rv-close-menu" type="button" onClick={closeMenu}>
          Close
        </button>
        <nav className="rv-menu-nav" aria-label="Overlay navigation">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main className="rv-main">
        <section className="rv-hero" id="hero" aria-label="Featured services">
          {panels.map((panel, index) => (
            <article
              className={`rv-panel ${panel.className}${activePanel === index ? " is-active" : ""}`}
              key={panel.number}
              onMouseEnter={() => setActivePanel(index)}
            >
              <div className="rv-panel-bg" />
              <div className="rv-panel-content">
                <div className="rv-panel-tags">
                  {panel.tags.map((tag) => (
                    <span className="rv-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="rv-panel-title">
                  {panel.title.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
                <a className="rv-view-project" href="#projects">
                  View Projects
                </a>
              </div>
              <div className="rv-panel-number">{panel.number}</div>
            </article>
          ))}

          <div className="rv-dots-nav" aria-label="Panel navigation">
            {panels.map((panel, index) => (
              <button
                className={`rv-dot${activePanel === index ? " is-active" : ""}`}
                key={panel.number}
                type="button"
                aria-label={`Show panel ${index + 1}`}
                onClick={() => setPanel(index)}
              />
            ))}
          </div>
        </section>

        <header
          className={`rv-bottom-bar${barScrolled ? " is-scrolled" : ""}`}
          aria-label="Section navigation"
        >
          <div className="rv-scroll-down-wrap">
            <button className="rv-scroll-down" type="button" onClick={scrollToAbout}>
              <svg viewBox="0 0 20 36" aria-hidden="true">
                <rect x="2" y="2" width="16" height="32" rx="4" ry="4" />
                <circle cx="10" cy="8" r="2" />
              </svg>
              <span>Scroll Down</span>
            </button>
          </div>

          <div className="rv-section-nav-wrap">
            <nav className="rv-nav-links" aria-label="Section navigation">
              {navItems.map((item) => (
                <a
                  className={`rv-nav-link${activeSection === item.id ? " is-active" : ""}`}
                  href={item.href}
                  key={item.id}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="rv-section-title-wrap">
            <Link className="rv-nav-link rv-page-link" href="/repeater-plugins/">
              Repeater Plugins
            </Link>
            <div className="rv-nav-arrows">
              <button
                className="rv-nav-arrow"
                type="button"
                aria-label="Previous panel"
                onClick={() => setPanel(activePanel - 1)}
              >
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <polyline points="8,2 4,6 8,10" />
                </svg>
              </button>
              <button
                className="rv-nav-arrow"
                type="button"
                aria-label="Next panel"
                onClick={() => setPanel(activePanel + 1)}
              >
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <polyline points="4,2 8,6 4,10" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {sections.map((section) =>
          section.id === "projects" ? (
            <Fragment key={section.id}>
              <FactsSection />
              <ResumeStorySection />
              <PortfolioGallery
                label={section.label}
                title={section.title}
                text={section.text}
              />
            </Fragment>
          ) : section.id === "about" ? (
            <AboutSection key={section.id} />
          ) : (
            <section className="rv-section" id={section.id} key={section.id}>
              <div className="rv-section-inner rv-fade-up">
                <p className="rv-section-label">{section.label}</p>
                <h2 className="rv-section-title">{section.title}</h2>
                <p className="rv-section-text">{section.text}</p>
              </div>
            </section>
          ),
        )}
      </main>
    </div>
  );
}
