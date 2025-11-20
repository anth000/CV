import React, { useEffect, useMemo, useState } from 'react';
import CanvasScene from './three/CanvasScene.jsx';
import TimelineSection from './components/TimelineSection.jsx';
import { getStopFromProgress } from './data/timeStops.js';

const timeline = [
  {
    id: 'profil',
    title: 'Profil & manifeste',
    content:
      'Narrateur numérique, je conçois des expériences immersives mêlant low poly et storytelling sensible pour traduire une personnalité de marque.',
    tags: ['Creative coding', 'Direction artistique', 'WebGL', 'Motion'],
    phase: 'Aube',
    range: '0% → 20%',
    start: 0,
    end: 0.2,
    accent: '#f3a39f'
  },
  {
    id: 'skills',
    title: 'Compétences essentielles',
    content:
      'React, Three.js, Spline, GLSL, animation scroll-driven, design systems, prototypage Figma → WebGL, accessibilité, performance.',
    tags: ['React', 'Three.js', 'Spline', 'GLSL'],
    phase: 'Plein jour',
    range: '20% → 45%',
    start: 0.2,
    end: 0.45,
    accent: '#63d3c6'
  },
  {
    id: 'experience',
    title: 'Expériences marquantes',
    content:
      'Lead Creative Developer chez Nérée Studio (2021-2024) — 40+ expériences interactives, Webby Awards & Awwwards SOTD.',
    tags: ['Lead dev', 'Story-driven', 'R&D'],
    phase: 'Crépuscule',
    range: '45% → 70%',
    start: 0.45,
    end: 0.7,
    accent: '#f3a6b4'
  },
  {
    id: 'projects',
    title: 'Projets signatures',
    content:
      'Atlas Voyager (installation VR), Bloom District (site expérimental), Polaris (dataviz émotionnelle).',
    tags: ['VR', 'Installation', 'Dataviz'],
    phase: 'Nuit claire',
    range: '70% → 85%',
    start: 0.7,
    end: 0.85,
    accent: '#9fb7ff'
  },
  {
    id: 'contact',
    title: 'Contact & collaborations',
    content:
      'Disponible pour missions freelance, workshops et collaborations agence/studio partout dans le monde.',
    tags: ['Remote', 'Workshops', 'Freelance'],
    phase: 'Constellations',
    range: '85% → 100%',
    start: 0.85,
    end: 1,
    accent: '#cbd6ff'
  }
];

const App = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const ratio = Math.min(Math.max(current / scrollable, 0), 1);
      setProgress(ratio);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const stop = useMemo(() => getStopFromProgress(progress), [progress]);

  return (
    <div className="app-shell">
      <CanvasScene progress={progress} />
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-mark">AM</span>
          <div>
            <p className="nav-label">Creative WebGL / React</p>
            <p className="nav-name">Anthony Moulin</p>
          </div>
        </div>
        <ul className="nav-links">
          {[
            { label: 'Home', href: '#top' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
            { label: 'Contact', href: '#contact-cta' }
          ].map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-dot" style={{ background: stop.accent }} />
      </nav>
      <main>
        <header className="hero" id="top">
          <p className="eyebrow">Portfolio immersif</p>
          <h1>
            Welcome —<br />
            <span className="serif">Explore the passage of time</span> on my journey.
          </h1>
          <p className="intro" id="about">
            Le soleil se lève, passe, se couche et laisse place aux étoiles. Mon parcours suit ce rythme :
            <span className="pill" style={{ background: stop.accent }}> {stop.label} </span>
            révèle la bonne étape à chaque scroll.
          </p>
          <div className="hero-meta">
            <div className="halo" style={{ boxShadow: `0 0 0 18px ${stop.accent}15, 0 20px 50px ${stop.accent}40` }}>
              <p className="label">Phase actuelle</p>
              <p className="value" style={{ color: stop.accent }}>
                {stop.label}
              </p>
              <p className="caption">{stop.description}</p>
            </div>
            <div>
              <p className="label">Progression</p>
              <div className="progress-shell">
                <span style={{ width: `${Math.round(progress * 100)}%`, background: stop.accent }} />
              </div>
              <p className="value">{Math.round(progress * 100)}%</p>
              <p className="caption">Du soleil levant aux constellations.</p>
            </div>
          </div>
          <div className="scroll-hint">Scroll pour voyager du matin à la nuit</div>
        </header>

        <section className="timeline">
          {timeline.map((section) => (
            <TimelineSection key={section.id} section={section} progress={progress} />
          ))}
        </section>

        <section className="cta" id="contact-cta">
          <div>
            <p className="eyebrow">Collaboration</p>
            <h2>Raconter votre histoire avec poésie et précision technique.</h2>
            <p>
              Besoin d’un site manifeste, d’une installation interactive ou d’un prototype R&D ? Écrivez-moi pour imaginer une
              expérience sur mesure.
            </p>
          </div>
          <div className="cta-actions">
            <a href="mailto:hello@anthonymoulin.dev" className="btn primary">
              Écrire un message
            </a>
            <a href="https://cal.com" className="btn ghost" target="_blank" rel="noreferrer">
              Planifier un call
            </a>
          </div>
        </section>

        <footer>
          <p>© {new Date().getFullYear()} Anthony Moulin — CV immersif low poly.</p>
          <div className="socials">
            <a href="https://dribbble.com" target="_blank" rel="noreferrer">
              Dribbble
            </a>
            <a href="https://www.behance.net" target="_blank" rel="noreferrer">
              Behance
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
