'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

import styles from './plugins.module.css';

type FileKind = 'badge' | 'music' | 'video' | 'image' | 'footage' | 'document' | 'voice' | 'dots';

type FileCard = {
  name: string;
  description: string;
  kind: FileKind;
  badge?: string;
  className?: string;
  x: number;
  y: number;
  rotation: number;
  openDelay: number;
  closeDelay: number;
};

const fileCards: FileCard[] = [
  { name: '01_AE_Project', description: 'After Effects Project', kind: 'badge', badge: 'Ae', className: styles.aeCard, x: -376, y: -318, rotation: -10, openDelay: 40, closeDelay: 300 },
  { name: '02_PR_Project', description: 'Premiere Pro Project', kind: 'badge', badge: 'Pr', className: styles.prCard, x: -188, y: -358, rotation: -4, openDelay: 85, closeDelay: 260 },
  { name: '03_Sound', description: 'Audio Files', kind: 'music', x: 0, y: -370, rotation: 1, openDelay: 130, closeDelay: 220 },
  { name: '04_Render', description: 'Render Files', kind: 'video', x: 188, y: -345, rotation: 8, openDelay: 175, closeDelay: 180 },
  { name: '05_Graphics', description: 'Graphics & Images', kind: 'image', x: 376, y: -300, rotation: 13, openDelay: 220, closeDelay: 140 },
  { name: '06_Footage', description: 'Footage File', kind: 'footage', x: -340, y: -130, rotation: -9, openDelay: 265, closeDelay: 100 },
  { name: '07_Assets', description: 'Assets & Elements', kind: 'document', x: -148, y: -170, rotation: -4, openDelay: 310, closeDelay: 70 },
  { name: '08_Images', description: 'Image Files', kind: 'image', x: 52, y: -172, rotation: 2, openDelay: 355, closeDelay: 45 },
  { name: '09_Voiceover', description: 'Voiceover Files', kind: 'voice', x: 238, y: -162, rotation: 6, openDelay: 400, closeDelay: 20 },
  { name: '10_Misc', description: 'Other Files', kind: 'dots', x: 400, y: -108, rotation: 12, openDelay: 445, closeDelay: 0 },
];

function CardIcon({ kind }: { kind: FileKind }) {
  if (kind === 'music') {
    return <svg className={styles.cardIcon} viewBox="0 0 48 48" aria-hidden="true"><path d="M31 7v25.1a7.4 7.4 0 1 1-4-6.6V13.8L14 16.3v19.8a7.4 7.4 0 1 1-4-6.6V12.8L31 7z" /></svg>;
  }
  if (kind === 'video') {
    return <svg className={styles.cardIcon} viewBox="0 0 48 48" aria-hidden="true"><path d="M8 15a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v4.5l7-4.1a2 2 0 0 1 3 1.7v13.8a2 2 0 0 1-3 1.7l-7-4.1V33a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5V15z" /></svg>;
  }
  if (kind === 'footage') {
    return <svg className={`${styles.cardIcon} ${styles.stroked}`} viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="9" width="26" height="30" rx="3" /><path d="M18 9v30M30 9v30M11 17h8M29 17h8M11 25h8M29 25h8M11 33h8" /></svg>;
  }
  if (kind === 'document') {
    return <svg className={`${styles.cardIcon} ${styles.stroked}`} viewBox="0 0 48 48" aria-hidden="true"><path d="M13 7h16l8 8v26H13V7z" /><path d="M29 7v10h8M18 24h14M18 30h14M18 36h9" /></svg>;
  }
  if (kind === 'voice') {
    return <svg className={`${styles.cardIcon} ${styles.stroked}`} viewBox="0 0 48 48" aria-hidden="true"><rect x="18" y="8" width="12" height="24" rx="6" /><path d="M12 23v2a12 12 0 0 0 24 0v-2M24 37v6M17 43h14" /></svg>;
  }
  if (kind === 'dots') {
    return <svg className={styles.cardIcon} viewBox="0 0 48 48" aria-hidden="true"><circle cx="14" cy="24" r="4" /><circle cx="24" cy="24" r="4" /><circle cx="34" cy="24" r="4" /></svg>;
  }
  return <svg className={`${styles.cardIcon} ${styles.stroked}`} viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="32" height="28" rx="5" /><path d="m13 32 8-9 6 6 4-5 7 8" /><circle cx="31" cy="18" r="3" /></svg>;
}

export default function PluginsFolderPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.pageInner}>
        <section className={styles.heroCopy} aria-labelledby="plugins-page-title">
          <p className={styles.kicker}>
            <span>1 Click.</span>
            <span className={styles.clickCursor} aria-hidden="true" />
          </p>
          <h1 id="plugins-page-title" className={styles.title}>All Project Files Ready.</h1>
          <p className={styles.subline}>Automatically creates a complete, professional project folder with all essential files in 1 second.</p>
        </section>

        <section className={`${styles.stage}${isOpen ? ` ${styles.open}` : ''}`} aria-label="Project file menu">
          <div className={styles.lightRays} aria-hidden="true">
            {[-53, -39, -25, -10, 5, 20, 35, 50].map((rotation) => (
              <span key={rotation} style={{ '--ray-rotate': `${rotation}deg` } as CSSProperties} />
            ))}
          </div>

          <div className={styles.fileCloud}>
            {fileCards.map((card, index) => {
              const cardStyle = {
                '--x': `${card.x}px`,
                '--y': `${card.y}px`,
                '--r': `${card.rotation}deg`,
                '--open-delay': `${card.openDelay}ms`,
                '--close-delay': `${card.closeDelay}ms`,
              } as CSSProperties;

              return (
                <button
                  className={`${styles.fileCard}${card.className ? ` ${card.className}` : ''}${selectedCard === index ? ` ${styles.selected}` : ''}`}
                  key={card.name}
                  type="button"
                  style={cardStyle}
                  onClick={() => setSelectedCard(index)}
                >
                  <span className={styles.fileTab} />
                  {card.kind === 'badge' ? <span className={styles.appBadge}>{card.badge}</span> : <CardIcon kind={card.kind} />}
                  <strong>{card.name}</strong>
                  <small>{card.description}</small>
                </button>
              );
            })}
          </div>

          <button
            className={styles.folderButton}
            type="button"
            aria-expanded={isOpen}
            aria-label="Toggle project file menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className={styles.folderShadow} />
            <span className={styles.folderBack}><span className={styles.folderTab} /></span>
            <span className={styles.folderFront}>
              <svg className={styles.bolt} viewBox="0 0 64 64" aria-hidden="true"><path d="M36 4 13 35h17l-5 25 26-35H34L36 4z" /></svg>
            </span>
          </button>
        </section>

        <section className={styles.featureBar} aria-label="Highlights">
          <div><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 2 6 18h9l-2 12 13-18h-9l1-10z" /></svg><span>1 Click<br />All Files Ready</span></div>
          <div><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9a4 4 0 0 1 4-4h6l3 3h9a4 4 0 0 1 4 4v2H3V9zm0 7h26l-3 10H6L3 16z" /></svg><span>Organized<br />Structure</span></div>
          <div><svg className={styles.strokedMini} viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" /><path d="M16 8v8l6 4" /></svg><span>Saves Time<br />Boosts Workflow</span></div>
          <div><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 5 6v8c0 7 4.7 12.8 11 16 6.3-3.2 11-9 11-16V6L16 2zm1 8v5h5l-7 9v-6h-5l7-8z" /></svg><span>Professional<br />&amp; Reliable</span></div>
        </section>
      </div>
    </main>
  );
}
