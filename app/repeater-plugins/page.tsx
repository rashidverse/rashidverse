'use client';

import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import './repeater-plugins.css';

export default function RepeaterPluginsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleVisualMove = (event: MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 980) return;

    const visual = event.currentTarget;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    visual.querySelectorAll<HTMLElement>('.rp-panel').forEach((panel, index) => {
      const depth = index === 1 ? 18 : 10;
      panel.style.translate = `${x * depth}px ${y * depth}px`;
    });
  };

  const handleVisualLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>('.rp-panel').forEach((panel) => {
      panel.style.translate = '0 0';
    });
  };

  return (
    <div className={`rp-page${menuOpen ? ' is-menu-open' : ''}`}>
      <header className="rp-site-header" aria-label="Site header">
          <a className="rp-brand" href="#start" aria-label="Repeater Builder home">
            <span className="rp-brand-mark" aria-hidden="true" />
            <span>Repeater Builder</span>
          </a>

          <nav className="rp-nav-links" aria-label="Primary navigation">
            <a href="#features" onClick={closeMenu}>
              Features
            </a>
            <a href="#how" onClick={closeMenu}>
              How it works
            </a>
            <a href="#templates" onClick={closeMenu}>
              Templates
            </a>
            <a href="#pricing" onClick={closeMenu}>
              Pricing
            </a>
            <a href="#docs" onClick={closeMenu}>
              Docs
            </a>
          </nav>

          <div className="rp-header-actions">
            <a className="rp-pill-button primary" href="#start">
              Get Started
            </a>
            <button
              className="rp-menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
              <span />
            </button>
          </div>
      </header>

      <main className="rp-page-main">
        <div className="rp-page-shell">
        <section className="rp-hero" id="start">
          <div className="rp-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2 5 13h6l-1 9 9-13h-6l1-7Z" fill="currentColor" />
            </svg>
            ACF & SCF Supported<span className="rp-accent">Repeater</span> for Elementor
          </div>

          <h1 className="rp-hero-title">
            Build Dynamic Repeater <span className="rp-accent">Layouts</span> in Elementor
          </h1>

          <p className="rp-hero-copy">
            Visually build, style and manage ACF & SCF Repeater fields with real-time preview. No code, No restriction.
            Total design freedom.
          </p>

          <div className="rp-hero-actions">
            <a href="#pricing" className="rp-pill-button primary">
              Get Repeater Builder
            </a>
            <a href="#how" className="rp-pill-button secondary">
              See How It Works
            </a>
          </div>

          <div
            className="rp-builder-visual"
            aria-label="Repeater builder interface preview"
            onMouseMove={handleVisualMove}
            onMouseLeave={handleVisualLeave}
          >
            <div className="rp-glow" />
            <div className="rp-floating-shadow" />

            <article className="rp-panel rp-fields-card">
              <div className="rp-panel-top">
                <h4 className="rp-panel-title">Repeater Fields</h4>
              </div>

              <div className="rp-mini-window">
                <div className="rp-window-head">
                  <span>
                    <svg
                      className="rp-window-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M9 12h6M12 9v6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    ACF Repeater
                  </span>
                  <span>&times;</span>
                </div>

                <div className="rp-field-list">
                  <div className="rp-field-row">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 3 20 8v8l-8 5-8-5V8l8-5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 8v8M8 10l4 2 4-2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Icon
                    </span>
                    <i className="rp-chev" />
                  </div>
                  <div className="rp-field-row">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 6h14M5 12h10M5 18h7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Title
                    </span>
                    <i className="rp-chev" />
                  </div>
                  <div className="rp-field-row">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M8 9h8M8 13h5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Description
                    </span>
                    <i className="rp-chev" />
                  </div>
                  <div className="rp-field-row">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M10.5 13.5 13.5 10.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.7 8.3 7.6 6.2a3 3 0 0 0-4.2 4.2l2.1 2.1M14.3 15.7l2.1 2.1a3 3 0 1 0 4.2-4.2l-2.1-2.1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Link
                    </span>
                    <i className="rp-chev" />
                  </div>
                </div>

                <button className="rp-add-field" type="button">
                  + Add Field
                </button>
              </div>
            </article>

            <article className="rp-panel rp-loop-card">
              <div className="rp-loop-header">
                <div className="rp-panel-top">
                  <h4 className="rp-panel-title">
                    Repeater Loop <span className="rp-panel-subtitle">Team Members</span>
                  </h4>
                  <span className="rp-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>

              <div className="rp-loop-tabs" role="tablist" aria-label="Builder tabs">
                <div className="rp-tab active" role="tab" aria-selected="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="m4 15.5 9.8-9.8a2.1 2.1 0 0 1 3 0l1.5 1.5a2.1 2.1 0 0 1 0 3L8.5 20H4v-4.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path d="m13 6 5 5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Content
                </div>
                <div className="rp-tab" role="tab">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M12 8v8M8 12h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Style
                </div>
                <div className="rp-tab" role="tab">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 1 1-2.97 2.97l-.05-.05A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 2.1 2.1 0 1 1-4 0 1.8 1.8 0 0 0-1-.6 1.8 1.8 0 0 0-1.78.55l-.05.05a2.1 2.1 0 0 1-2.97-2.97l.05-.05A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 2.1 2.1 0 1 1 0-4 1.8 1.8 0 0 0 .6-1 1.8 1.8 0 0 0-.36-1.98l-.05-.05A2.1 2.1 0 1 1 7.16 4l.05.05A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 2.1 2.1 0 1 1 4 0 1.8 1.8 0 0 0 1 .6 1.8 1.8 0 0 0 1.78-.55l.05-.05a2.1 2.1 0 1 1 2.97 2.97l-.05.05A1.8 1.8 0 0 0 19.4 9c.1.38.3.72.6 1a2.1 2.1 0 1 1 0 4 1.8 1.8 0 0 0-.6 1Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  Advanced
                </div>
              </div>

              <div className="rp-query-box">
                <h3 className="rp-query-title">Query</h3>
                <div className="rp-form-grid">
                  <div className="rp-form-row">
                    <span>Repeater Field</span>
                    <div className="rp-fake-input">
                      team_members <i className="rp-chev" />
                    </div>
                  </div>
                  <div className="rp-form-row">
                    <span>Row Limit</span>
                    <div className="rp-fake-input">-1</div>
                  </div>
                  <div className="rp-form-row">
                    <span>Order By</span>
                    <div className="rp-fake-input">
                      Menu Order <i className="rp-chev" />
                    </div>
                  </div>
                  <div className="rp-form-row">
                    <span>Order</span>
                    <div className="rp-fake-input">
                      ASC <i className="rp-chev" />
                    </div>
                  </div>
                  <div className="rp-form-row">
                    <span>Enable Pagination</span>
                    <div className="rp-switch">
                      <i />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="rp-panel rp-preview-card">
              <div className="rp-panel-top">
                <h4 className="rp-panel-title">Preview</h4>
              </div>
              <div className="rp-profile-card">
                <div className="rp-badge" aria-hidden="true">
                  <img
                    src="https://github.com/rashidverse.png"
                    alt="Abdul Rashid"
                    className="rp-avatar-photo"
                    width={64}
                    height={64}
                  />
                  <div className="rp-badge-text">
                    <h3>Abdul Rashid</h3>
                    <small>Web Developer</small>
                  </div>
                </div>
                <p>Passionate developer focused on creating meaningful digital experiences.</p>
                <div className="rp-socials" aria-label="Social links">
                  <a href="https://www.linkedin.com/in/iamabdulrashid/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    in
                  </a>
                  <a href="https://www.facebook.com/abdul.rashed99" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    f
                  </a>
                  <a href="https://github.com/rashidverse" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    &#9678;
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rp-trusted-bar" aria-label="Trusted by logos">
          <h3 className="rp-trusted-title">
            Trusted by 10,000+ Web Creators
          </h3>
          <div className="rp-logo-row">
            <div className="rp-partner-logo rp-elementor">
              <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
                <circle cx="20" cy="20" r="18" />
                <rect x="12" y="11" width="4" height="18" fill="#fff" />
                <rect x="19" y="11" width="10" height="4" fill="#fff" />
                <rect x="19" y="18" width="10" height="4" fill="#fff" />
                <rect x="19" y="25" width="10" height="4" fill="#fff" />
              </svg>
              elementor
            </div>
            <div className="rp-partner-logo rp-acf">ACF</div>
            <div className="rp-partner-logo rp-wp">
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <text
                  x="20"
                  y="27"
                  textAnchor="middle"
                  fontSize="20"
                  fontFamily="Georgia"
                  fontWeight="700"
                  fill="currentColor"
                >
                  W
                </text>
              </svg>
              WordPress
            </div>
            <div className="rp-partner-logo">
              <span className="rp-code-mark">{'{}'}</span>
              <span className="rp-dynamic">
                DYNAMIC
                <br />
                CONTENT
              </span>
            </div>
            <div className="rp-partner-logo rp-pro">
              <span>
                Works with
                <br />
                <strong>Elementor Pro</strong>
              </span>
            </div>
          </div>
        </section>
        </div>

      <div className="rp-feature-process-section-container">
        <section className="rp-feature-process-section" id="features" aria-labelledby="rp-feature-process-title">
            <div className="rp-feature-process-container">
              <div className="rp-section-mini-badge">
                <span aria-hidden="true">✦</span>
                Powerful Features
              </div>

              <h2 className="rp-feature-process-title" id="rp-feature-process-title">
                Everything you need to build
                <br />
                dynamic content
              </h2>

              <div className="rp-feature-card-grid">
                <article className="rp-feature-info-card">
                  <div className="rp-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7 7h8.5a3.5 3.5 0 0 1 0 7H5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="m8 4-3 3 3 3M17 20l3-3-3-3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Repeater Loop Builder</h3>
                  <p>Connect any ACF Repeater field and loop through rows with powerful query controls.</p>
                </article>

                <article className="rp-feature-info-card">
                  <div className="rp-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect
                        x="5"
                        y="5"
                        width="10"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                      <path
                        d="M15 15h4v4h-4zM18 10v5M10 18h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h3>Drag &amp; Drop Control</h3>
                  <p>Design each repeater item visually in Elementor. Reorder, duplicate and style with ease.</p>
                </article>

                <article className="rp-feature-info-card">
                  <div className="rp-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <ellipse cx="12" cy="6" rx="6" ry="3" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M6 6v6c0 1.65 2.69 3 6 3s6-1.35 6-3V6M6 12v6c0 1.65 2.69 3 6 3s6-1.35 6-3v-6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <h3>Dynamic Field Mapping</h3>
                  <p>Map any ACF sub field to Elementor widgets. Supports text, image, link, icon, and more.</p>
                </article>

                <article className="rp-feature-info-card">
                  <div className="rp-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M10 5v14M4 11h16" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3>Flexible Layouts</h3>
                  <p>Create unlimited layouts inside repeater items. Use conditions, columns, tabs, accordions and more.</p>
                </article>
              </div>

              <div className="rp-process-area" id="how">
                <div className="rp-section-mini-badge">
                  <span aria-hidden="true">✦</span>
                  Simple 3-Step Process
                </div>

                <h2 className="rp-process-title">Build in minutes, not hours</h2>

                <div className="rp-process-card-grid">
                  <article className="rp-process-card">
                    <div className="rp-process-card-head">
                      <span className="rp-process-number">1</span>
                      <h3>Select Repeater Field</h3>
                    </div>
                    <p>Choose your ACF Repeater field from the dropdown.</p>

                    <div className="rp-select-demo-box">
                      <span>Select Field</span>
                      <div className="rp-demo-select">
                        testimonials
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </article>

                  <article className="rp-process-card">
                    <div className="rp-process-card-head">
                      <span className="rp-process-number">2</span>
                      <h3>Design Item Template</h3>
                    </div>
                    <p>Build the layout for a single repeater item using Elementor.</p>

                    <div className="rp-template-demo-box">
                      <div className="rp-template-image-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path
                            d="m8 15 2.4-2.4a1 1 0 0 1 1.4 0L14 15l1.2-1.2a1 1 0 0 1 1.4 0L19 16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="rp-template-lines">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </article>

                  <article className="rp-process-card">
                    <div className="rp-process-card-head">
                      <span className="rp-process-number">3</span>
                      <h3>Publish &amp; Display</h3>
                    </div>
                    <p>Display your dynamic content anywhere on your site.</p>

                    <div className="rp-publish-demo-box">
                      <div className="rp-publish-row">
                        <span className="rp-user-dot" />
                        <span className="rp-publish-line long" />
                        <span className="rp-check-dot">✓</span>
                      </div>
                      <div className="rp-publish-row">
                        <span className="rp-user-dot" />
                        <span className="rp-publish-line" />
                        <span className="rp-check-dot">✓</span>
                      </div>
                      <div className="rp-publish-row">
                        <span className="rp-user-dot" />
                        <span className="rp-publish-line medium" />
                        <span className="rp-check-dot">✓</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section> 
        </div>

         {/* ========================== Use Cases Section Start Create anything with ACF Repeater============================ */}
        <div className="rp-usecase-section-container">
          <section className="rp-usecase-section" id="templates" aria-labelledby="rp-usecase-title">
            <div className="rp-usecase-container">
              {/* Section Badge */}
              <div className="rp-usecase-mini-badge">
                <span aria-hidden="true">✦</span>
                Endless Possibilities
              </div>

              {/* Section Heading */}
              <h2 className="rp-usecase-title" id="rp-usecase-title">
                Create anything with ACF Repeater
              </h2>

              {/* Use Case Cards Grid */}
              <div className="rp-usecase-grid">
                {/* Team Members Card */}
                <article className="rp-usecase-card">
                  <div className="rp-usecase-card-head">
                    <div className="rp-usecase-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h3>Team Members</h3>
                  </div>

                  <p>Showcase your team with roles, photos and social links.</p>

                  <div className="rp-team-preview">
                    <span className="rp-team-avatar avatar-one" />
                    <span className="rp-team-avatar avatar-two" />
                    <span className="rp-team-avatar avatar-three" />
                  </div>
                </article>

                {/* Testimonials Card */}
                <article className="rp-usecase-card">
                  <div className="rp-usecase-card-head">
                    <div className="rp-usecase-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 3 19 7v7c0 4-3 6.5-7 7-4-.5-7-3-7-7V7l7-4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <h3>Testimonials</h3>
                  </div>

                  <p>Display client reviews and feedback beautifully.</p>

                  <div className="rp-testimonial-preview">
                    <div className="rp-star-row">★★★★★</div>
                    <div className="rp-review-line-wrap">
                      <span className="rp-review-dot" />
                      <span className="rp-review-line long" />
                    </div>
                    <div className="rp-quote-mark">❞</div>
                  </div>
                </article>

                {/* FAQs Card */}
                <article className="rp-usecase-card">
                  <div className="rp-usecase-card-head">
                    <div className="rp-usecase-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h3>FAQs</h3>
                  </div>

                  <p>Build accordion style FAQs from repeater data.</p>

                  <div className="rp-faq-preview">
                    <div className="rp-faq-row">
                      <span>+</span>
                      <i />
                    </div>
                    <div className="rp-faq-row">
                      <span>+</span>
                      <i />
                    </div>
                  </div>
                </article>

                {/* Pricing Tables Card */}
                <article className="rp-usecase-card">
                  <div className="rp-usecase-card-head">
                    <div className="rp-usecase-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h3>Pricing Tables</h3>
                  </div>

                  <p>Create dynamic pricing plans and packages.</p>

                  <div className="rp-price-preview">
                    <span>$29</span>
                    <span className="active">$49</span>
                    <span>$99</span>
                  </div>
                </article>

                {/* Gallery Card */}
                <article className="rp-usecase-card">
                  <div className="rp-usecase-card-head">
                    <div className="rp-usecase-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 3 19 7v7c0 4-3 6.5-7 7-4-.5-7-3-7-7V7l7-4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <h3>Gallery &amp; Portfolios</h3>
                  </div>

                  <p>Showcase images, videos or projects in stunning layouts.</p>

                  <div className="rp-gallery-preview">
                    <span className="rp-gallery-thumb thumb-one" />
                    <span className="rp-gallery-thumb thumb-two" />
                    <span className="rp-gallery-thumb thumb-three" />
                    <span className="rp-gallery-more">+12</span>
                  </div>
                </article>

                {/* Blog Card */}
                <article className="rp-usecase-card">
                  <div className="rp-usecase-card-head">
                    <div className="rp-usecase-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h3>Blog &amp; News Lists</h3>
                  </div>

                  <p>List blog posts, news or resources with dynamic content.</p>

                  <div className="rp-blog-preview">
                    <div className="rp-blog-row">
                      <span className="rp-blog-avatar avatar-one" />
                      <div>
                        <i className="rp-blog-line long" />
                        <i className="rp-blog-line short" />
                      </div>
                    </div>

                    <div className="rp-blog-row">
                      <span className="rp-blog-avatar avatar-two" />
                      <div>
                        <i className="rp-blog-line medium" />
                        <i className="rp-blog-line short" />
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
          {/* ================================Use Cases Section End ================================ */}     
        </div>
        <div className="rp-advanced-review-section-container">
          {/* ==============================Advanced Repeater + Reviews Section Start ============================ */}
          <section className="rp-advanced-review-section" aria-labelledby="rp-advanced-title">
            <div className="rp-advanced-container">
              {/* Top Advanced Feature Area */}
              <div className="rp-advanced-top">
                <div className="rp-advanced-left">
                  <div className="rp-advanced-mini-badge">
                    <span aria-hidden="true">✦</span>
                    Why Choose Repeater Builder?
                  </div>

                  <h2 className="rp-advanced-title" id="rp-advanced-title">
                    The most advanced ACF Repeater
                    <br />
                    solution for Elementor
                  </h2>

                  <div className="rp-advanced-list">
                    <div className="rp-advanced-list-item">
                      <span className="rp-orange-check">✓</span>
                      <div>
                        <h3>Native Elementor experience</h3>
                        <p>No coding required. Built for designers.</p>
                      </div>
                    </div>

                    <div className="rp-advanced-list-item">
                      <span className="rp-orange-check">✓</span>
                      <div>
                        <h3>Real-time preview</h3>
                        <p>See changes instantly as you build.</p>
                      </div>
                    </div>

                    <div className="rp-advanced-list-item">
                      <span className="rp-orange-check">✓</span>
                      <div>
                        <h3>Performance optimized</h3>
                        <p>Clean, efficient code for lightning fast sites.</p>
                      </div>
                    </div>

                    <div className="rp-advanced-list-item">
                      <span className="rp-orange-check">✓</span>
                      <div>
                        <h3>Works with any theme</h3>
                        <p>Built to be 100% theme and plugin friendly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elementor Style Settings Card */}
                <div className="rp-builder-settings-card">
                  <div className="rp-settings-head">
                    <span>Repeater Builder</span>
                    <i aria-hidden="true">⋮</i>
                  </div>

                  <div className="rp-settings-tabs">
                    <span className="active">Content</span>
                    <span>Style</span>
                    <span>Advanced</span>
                  </div>

                  <div className="rp-settings-body">
                    <h3>General</h3>

                    <div className="rp-settings-row">
                      <span>Repeater Field</span>
                      <strong>testimonials</strong>
                    </div>

                    <div className="rp-settings-row">
                      <span>Row Limit</span>
                      <strong>-1</strong>
                    </div>

                    <div className="rp-settings-row">
                      <span>Order By</span>
                      <strong>Menu Order</strong>
                    </div>

                    <div className="rp-settings-row">
                      <span>Order</span>
                      <strong>ASC</strong>
                    </div>

                    <div className="rp-settings-toggle-row">
                      <span>Enable Pagination</span>
                      <div className="rp-orange-toggle">
                        <i />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Review Card */}
                <article className="rp-client-review-card">
                  <h3>Client Review</h3>

                  <div className="rp-client-avatar" />

                  <div className="rp-client-stars">★★★★★</div>

                  <p>
                    Repeater Builder saved us countless hours. Now we can build dynamic layouts
                    visually and deliver faster.
                  </p>

                  <div className="rp-client-name">
                    <strong>Sarah Johnson</strong>
                    <span>Marketing Manager</span>
                  </div>
                </article>
              </div>

              {/* Users Review Area */}
              <div className="rp-users-review-area">
                <div className="rp-advanced-mini-badge">
                  <span aria-hidden="true">✦</span>
                  Loved by Web Creators
                </div>

                <h2 className="rp-users-review-title">What our users are saying</h2>

                <div className="rp-users-review-grid">
                  <article className="rp-user-review-card">
                    <div className="rp-review-quote">“</div>
                    <p>
                      This plugin is a game changer! Building dynamic layouts with ACF Repeater
                      has never been easier.
                    </p>

                    <div className="rp-review-card-bottom">
                      <span className="rp-review-avatar avatar-one" />
                      <div>
                        <strong>Alex P.</strong>
                        <small>Web Designer</small>
                      </div>
                      <span className="rp-review-stars">★★★★★</span>
                    </div>
                  </article>

                  <article className="rp-user-review-card">
                    <div className="rp-review-quote">“</div>
                    <p>
                      Clean UI, powerful features and excellent support. Highly recommended!
                    </p>

                    <div className="rp-review-card-bottom">
                      <span className="rp-review-avatar avatar-two" />
                      <div>
                        <strong>Maria S.</strong>
                        <small>Developer</small>
                      </div>
                      <span className="rp-review-stars">★★★★★</span>
                    </div>
                  </article>

                  <article className="rp-user-review-card">
                    <div className="rp-review-quote">“</div>
                    <p>
                      Finally, a repeater solution that works perfectly with Elementor. Love it!
                    </p>

                    <div className="rp-review-card-bottom">
                      <span className="rp-review-avatar avatar-three" />
                      <div>
                        <strong>James T.</strong>
                        <small>Agency Founder</small>
                      </div>
                      <span className="rp-review-stars">★★★★★</span>
                    </div>
                  </article>
                </div>
              </div>

              {/* Pricing CTA Area */}
              <div className="rp-final-pricing-box" id="pricing">
                <div className="rp-pricing-content-left">
                  <span>Simple pricing, powerful value</span>
                  <h2>One plan. Unlimited possibilities.</h2>

                  <ul>
                    <li>Unlimited websites</li>
                    <li>All features included</li>
                    <li>1 year updates &amp; support</li>
                    <li>30-day money-back guarantee</li>
                  </ul>
                </div>

                <div className="rp-pricing-content-right">
                  <article className="rp-pro-plan-card">
                    <h3>Pro Plan</h3>
                  
                    <p>Best for professionals</p>

                    <div className="rp-plan-price">
                      <strong>Free</strong>
                      <span>/Life-time</span>
                    </div>

                    <a href="#pricing" className="rp-dark-pricing-button">
                      Get Repeater Builder
                    </a>

                    <small>If you want you can suppot us</small>
                  </article>
                </div>
              </div>
            </div>
          </section>
          {/* ===================================Advanced Repeater + Reviews Section End =================================== */}
        </div>
        {/* ===================================Footer Section Start =================================== */}
      <footer className="rp-site-footer" aria-labelledby="rp-footer-brand-title">
        <div className="rp-footer-shell">
          {/* Footer Top Area */}
          <div className="rp-footer-top">
            {/* Footer Brand Column */}
            <div className="rp-footer-brand-col">
              <a className="rp-footer-brand" href="#start" aria-label="Repeater Builder home">
                <span className="rp-footer-brand-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3 19 7v10l-7 4-7-4V7l7-4Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 3v8m0 0 7-4m-7 4L5 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span id="rp-footer-brand-title">Repeater Builder</span>
              </a>

              <p className="rp-footer-brand-copy">
                The most advanced ACF Repeater builder for Elementor.
              </p>

              <div className="rp-footer-socials" aria-label="Social media links">
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V11H9v3h2.1v7h2.4Z" />
                  </svg>
                </a>

                <a href="#" aria-label="X">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.8 4H20l-4.9 5.6L21 20h-4.7l-3.7-4.8L8.4 20H6.2l5.3-6.1L3 4h4.8l3.3 4.4L17.8 4Zm-.8 14h1.3L7.1 5.9H5.7L17 18Z" />
                  </svg>
                </a>

                <a href="#" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
                  </svg>
                </a>

                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="17" cy="7" r="1" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="rp-footer-links-col">
              <h3>Product</h3>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how">How it works</a></li>
                <li><a href="#templates">Templates</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#docs">Changelog</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="rp-footer-links-col" id="docs">
              <h3>Resources</h3>
              <ul>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#docs">Video Tutorials</a></li>
                <li><a href="#docs">Help Center</a></li>
                <li><a href="#docs">Blog</a></li>
                <li><a href="#docs">Support</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="rp-footer-links-col">
              <h3>Company</h3>
              <ul>
                <li><a href="#start">About Us</a></li>
                <li><a href="#start">Affiliate</a></li>
                <li><a href="#start">Contact</a></li>
                <li><a href="#start">Privacy Policy</a></li>
                <li><a href="#start">Terms of Service</a></li>
              </ul>
            </div>

            {/* Subscribe Column */}
            <div className="rp-footer-subscribe-col">
              <h3>Stay in the loop</h3>
              <p>Get product updates and tips straight to your inbox.</p>

              <form
                className="rp-footer-subscribe-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input type="email" placeholder="Enter your email" aria-label="Enter your email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>

          {/* Footer Bottom Area */}
          <div className="rp-footer-bottom">
            <p>© 2024 Repeater Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
