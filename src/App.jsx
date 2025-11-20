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
    end: 0.2
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
    end: 0.45
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
    end: 0.7
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
    end: 0.85
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
    end: 1
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
      <main>
        <header className="hero">
          <p className="eyebrow">Portfolio immersif</p>
          <h1>
            Anthony Moulin —<br /> Creative WebGL & React Developer
          </h1>
          <p className="intro">
            Scroll pour faire défiler le temps : la colline reste immobile, le ciel se transforme et mon parcours apparaît dans la
            lumière du moment.
          </p>
          <div className="hero-meta">
            <div>
              <p className="label">Phase actuelle</p>
              <p className="value" style={{ color: stop.accent }}>
                {stop.label}
              </p>
              <p className="caption">{stop.description}</p>
            </div>
            <div>
              <p className="label">Progression</p>
              <p className="value">{Math.round(progress * 100)}%</p>
              <p className="caption">Du soleil levant aux constellations.</p>
            </div>
          </div>
        </header>

        <section className="timeline">
          {timeline.map((section) => (
            <TimelineSection key={section.id} section={section} progress={progress} />
          ))}
        </section>

        <section className="cta" id="contact">
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
