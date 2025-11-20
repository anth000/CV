export const timeStops = [
  {
    id: 'dawn',
    label: 'Aube',
    start: 0,
    end: 0.25,
    description: 'La lumière rosée caresse la colline et introduit le manifeste.',
    skyTop: '#1a1f3f',
    skyBottom: '#f7e4cf',
    accent: '#f3a39f',
    sunColor: '#ffc86b',
    moonColor: '#d9e2ff',
    starOpacity: 0
  },
  {
    id: 'day',
    label: 'Jour',
    start: 0.25,
    end: 0.5,
    description: 'Midi dévoile les compétences dans une atmosphère limpide et optimiste.',
    skyTop: '#5eb6e2',
    skyBottom: '#d7f2ff',
    accent: '#63d3c6',
    sunColor: '#ffd166',
    moonColor: '#f8fbff',
    starOpacity: 0.1
  },
  {
    id: 'sunset',
    label: 'Crépuscule',
    start: 0.5,
    end: 0.75,
    description: 'Le ciel se teinte d’or et de lilas pendant que les projets se dévoilent.',
    skyTop: '#3a215a',
    skyBottom: '#f6b49a',
    accent: '#f3a6b4',
    sunColor: '#ffb15b',
    moonColor: '#dfe8ff',
    starOpacity: 0.35
  },
  {
    id: 'night',
    label: 'Nuit',
    start: 0.75,
    end: 1,
    description: 'Les constellations révèlent l’expérience et ouvrent au contact.',
    skyTop: '#0b1230',
    skyBottom: '#1c2f5d',
    accent: '#9fb7ff',
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
