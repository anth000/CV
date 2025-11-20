export const timeStops = [
  {
    id: 'dawn',
    label: 'Aube',
    start: 0,
    end: 0.25,
    description: 'La scène se réveille tout en douceur, idéale pour présenter le profil.',
    skyTop: '#1e1f4b',
    skyBottom: '#f5c77a',
    accent: '#ff9a9e',
    sunColor: '#ffd166',
    moonColor: '#c3dafe',
    starOpacity: 0
  },
  {
    id: 'day',
    label: 'Jour',
    start: 0.25,
    end: 0.5,
    description: 'Midi dévoile les compétences clés avec une lumière franche et énergique.',
    skyTop: '#4c7aff',
    skyBottom: '#d1f4ff',
    accent: '#56cfe1',
    sunColor: '#ffd166',
    moonColor: '#f2f4ff',
    starOpacity: 0.1
  },
  {
    id: 'sunset',
    label: 'Crépuscule',
    start: 0.5,
    end: 0.75,
    description: 'Le soleil frôle la colline tandis que les projets prennent vie.',
    skyTop: '#49215d',
    skyBottom: '#ff8e72',
    accent: '#f28482',
    sunColor: '#ff9f1c',
    moonColor: '#d9e7ff',
    starOpacity: 0.35
  },
  {
    id: 'night',
    label: 'Nuit',
    start: 0.75,
    end: 1,
    description: 'Les étoiles guident vers les expériences et l’appel à contact.',
    skyTop: '#090c2b',
    skyBottom: '#1f3b73',
    accent: '#9d4edd',
    sunColor: '#f8c537',
    moonColor: '#f5f6ff',
    starOpacity: 0.8
  }
];

export const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const getStopFromProgress = (progress) => {
  return (
    timeStops.find((stop) => progress >= stop.start && progress <= stop.end) || timeStops[timeStops.length - 1]
  );
};

export const lerp = (a, b, t) => a + (b - a) * clamp(t);
