import React, { useEffect, useMemo, useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Brain,
  Lightbulb
} from 'lucide-react';
import CanvasScene from './three/CanvasScene.jsx';
import TimelineSection from './components/TimelineSection.jsx';
import { getStopFromProgress } from './data/timeStops.js';

const timeline = [
  {
    id: 'formation',
    title: 'Formation — Ingénieur Civil',
    content:
      "Spécialisation IA & aide à la décision : algorithmes avancés, optimisation, data science et modélisation d'écosystèmes complexes.",
    tags: ['IA & Data', 'Décisionnel', 'Math appliquées'],
    phase: 'Aube',
    range: '0% → 20%',
    start: 0,
    end: 0.2,
    accent: '#f6b08f',
    icon: GraduationCap
  },
  {
    id: 'skills',
    title: 'Expertise — Creative Coding',
    content:
      'WebGL / Three.js, React, Spline, shaders GLSL, micro-interactions, narration au scroll, design systems sensibles.',
    tags: ['Three.js', 'Spline', 'GLSL', 'React'],
    phase: 'Matin clair',
    range: '20% → 45%',
    start: 0.2,
    end: 0.45,
    accent: '#5ed2c1',
    icon: Code
  },
  {
    id: 'experience',
    title: 'Expériences — Lead Creative Dev',
    content:
      'Pilote des expériences immersives (2021-2024) : 40+ projets, Webby & Awwwards SOTD. Direction tech/design et coaching R&D.',
    tags: ['Direction tech', 'Storytelling', 'Motion'],
    phase: 'Crépuscule',
    range: '45% → 65%',
    start: 0.45,
    end: 0.65,
    accent: '#f59cc1',
    icon: Briefcase
  },
  {
    id: 'projects',
    title: 'Projets signatures',
    content:
      'Atlas Voyager (VR narrative), Bloom District (site expérimental), Polaris (dataviz émotionnelle). Low poly, poésie et précision.',
    tags: ['VR', 'Installation', 'Dataviz', 'Narration'],
    phase: 'Nuit douce',
    range: '65% → 80%',
    start: 0.65,
    end: 0.8,
    accent: '#a7bcff',
    icon: Award
  },
  {
    id: 'ai',
    title: 'IA & Décisionnel',
    content:
      'Machine learning, deep learning, NLP, optimisation, systèmes de recommandation. Bridger technique et vision produit.',
    tags: ['ML', 'Optimisation', 'NLP', 'Recommandation'],
    phase: 'Constellations',
    range: '80% → 92%',
    start: 0.8,
    end: 0.92,
    accent: '#c2d0ff',
    icon: Brain
  },
  {
    id: 'contact',
    title: 'Contact & collaborations',
    content:
      'Disponible pour missions freelance, workshops, accompagnement produit et prototypage immersif partout dans le monde.',
    tags: ['Remote', 'Workshops', 'Freelance'],
    phase: 'Aurore stellaire',
    range: '92% → 100%',
    start: 0.92,
    end: 1,
    accent: '#d9e4ff',
    icon: Lightbulb
  }
];

const starTexts = [
  { x: 15, y: 20, size: 3, delay: 0.2, text: 'Intelligence Artificielle', section: 0.5 },
  { x: 28, y: 16, size: 2, delay: 0.35, text: 'Machine Learning', section: 0.52 },
  { x: 35, y: 25, size: 2.5, delay: 0.45, text: 'Deep Learning', section: 0.55 },
  { x: 62, y: 14, size: 2.4, delay: 0.35, text: 'Data Science', section: 0.58 },
  { x: 75, y: 21, size: 3, delay: 0.5, text: 'Aide à la décision', section: 0.62 },
  { x: 82, y: 30, size: 2.6, delay: 0.65, text: 'Optimisation', section: 0.64 },
  { x: 18, y: 36, size: 2.5, delay: 0.8, text: 'Python', section: 0.7 },
  { x: 32, y: 42, size: 2, delay: 0.9, text: 'TensorFlow', section: 0.72 },
  { x: 74, y: 36, size: 2, delay: 1, text: 'PyTorch', section: 0.74 },
  { x: 86, y: 44, size: 3.1, delay: 1.1, text: 'SQL', section: 0.75 },
  { x: 52, y: 18, size: 4, delay: 0.25, text: 'Innovation', section: 0.82 }
];

const useScrollProgress = () => {
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

  return progress;
};

const computeSky = (progress) => {
  if (progress < 0.33) {
    const local = progress / 0.33;
    return {
      top: `rgb(${135 + local * 55}, ${165 + local * 55}, ${200 + local * 55})`,
      middle: `rgb(${255 - local * 50}, ${182 + local * 73}, ${120 + local * 73})`,
      bottom: `rgb(${255 - local * 100}, ${200 - local * 50}, ${150 - local * 50})`
    };
  }
  if (progress < 0.66) {
    const local = (progress - 0.33) / 0.33;
    return {
      top: `rgb(${190 - local * 55}, ${220 - local * 100}, ${255 - local * 100})`,
      middle: `rgb(${205 + local * 50}, ${255 - local * 100}, ${193 - local * 93})`,
      bottom: `rgb(${155 + local * 100}, ${150 - local * 50}, ${100 - local * 50})`
    };
  }
  const local = (progress - 0.66) / 0.34;
  return {
    top: `rgb(${135 - local * 105}, ${120 - local * 100}, ${155 - local * 125})`,
    middle: `rgb(${255 - local * 185}, ${155 - local * 85}, ${100 - local * 60})`,
    bottom: `rgb(${255 - local * 205}, ${100 - local * 50}, ${50 - local * 20})`
  };
};

const App = () => {
  const progress = useScrollProgress();
  const stop = useMemo(() => getStopFromProgress(progress), [progress]);
  const sky = useMemo(() => computeSky(progress), [progress]);

  const sunOpacity = Math.max(0, 1 - progress * 1.4);
  const starsOpacity = Math.max(0, progress - 0.35) * 1.4;
  const sunY = 16 + progress * 50;
  const sunX = 52 - progress * 8;

  return (
    <div className="app-shell">
      <div
        className="sky-gradient"
        style={{ background: `linear-gradient(to bottom, ${sky.top} 0%, ${sky.middle} 50%, ${sky.bottom} 100%)` }}
      >
        <div
          className="sun-or-moon"
          style={{
            top: `${sunY}%`,
            left: `${sunX}%`,
            opacity: sunOpacity,
            background:
              progress > 0.7
                ? `radial-gradient(circle, rgba(240,240,255,${sunOpacity}) 0%, rgba(200,200,220,${sunOpacity * 0.5}) 100%)`
                : `radial-gradient(circle, rgba(255,235,180,${sunOpacity}) 0%, rgba(255,200,100,${sunOpacity * 0.35}) 100%)`,
            boxShadow:
              progress > 0.7
                ? `0 0 60px rgba(240,240,255,${sunOpacity * 0.85})`
                : `0 0 80px rgba(255,220,100,${sunOpacity})`
          }}
        />
        {starTexts.map((star, index) => {
          const isVisible = progress > star.section;
          return (
            <div
              key={index}
              className="star-chip"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: isVisible ? starsOpacity : 0,
                transform: `scale(${isVisible ? 1 : 0})`,
                transitionDelay: `${star.delay}s`
              }}
            >
              <span style={{ width: `${star.size}px`, height: `${star.size}px` }} />
              <p>{star.text}</p>
            </div>
          );
        })}
      </div>

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
            { label: 'Timeline', href: '#timeline' },
            { label: 'Expertise', href: '#skills' },
            { label: 'Projets', href: '#projects' },
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
            Une colline low poly, un personnage rêveur,
            <br />
            <span className="serif">et un CV qui suit le soleil.</span>
          </h1>
          <p className="intro" id="about">
            Le cycle jour/nuit orchestre la narration : formation à l’aube, compétences en plein jour, expériences au crépuscule,
            puis les constellations de projets et de collaborations. Scroll pour voir le ciel évoluer.
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
          <div className="scroll-hint">↓ Scroll pour faire défiler le temps</div>
        </header>

        <section className="timeline" id="timeline">
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
            <a href="https://www.linkedin.com" className="btn ghost" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>

        <footer>
          <p>© {new Date().getFullYear()} Anthony Moulin — CV immersif low poly.</p>
          <div className="socials">
            <a href="mailto:hello@anthonymoulin.dev">
              <Mail size={18} />
              Email
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <Linkedin size={18} />
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github size={18} />
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
