"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBehance,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import PortfolioGallery from "./PortfolioGallery";

const navItems = [
  { label: "Hero", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Resume", href: "#resume", id: "resume" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Clients", href: "#clients", id: "clients" },
];

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
    title: "Projects",
    text: "A curated collection of websites, motion pieces, brand identities, and digital campaigns crafted with precision and creative intent.",
  },
  {
    id: "resume",
    label: "My Journey",
    title: "Resume",
    text: "Years of hands-on experience across design, development, and multimedia production, building brands and digital experiences that resonate.",
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

function scrollToAbout() {
  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
}

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [barScrolled, setBarScrolled] = useState(false);

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

        <div className="rv-social-icons">
          <a
            href="https://www.facebook.com/abdul.rashed99"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a
            href="https://www.linkedin.com/in/iamabdulrashid/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.behance.net/arclub9909d3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Behance"
          >
            <FaBehance />
          </a>
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
            <PortfolioGallery key={section.id} />
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
