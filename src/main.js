import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('portfolio-scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 2.5, 8);
scene.add(camera);

// Sky dome with gradient shader
const skyUniforms = {
  topColor: { value: new THREE.Color('#1a2f6d') },
  bottomColor: { value: new THREE.Color('#f4cfa7') }
};

const skyMaterial = new THREE.ShaderMaterial({
  uniforms: skyUniforms,
  side: THREE.BackSide,
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vWorldPosition;
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    void main() {
      float h = normalize(vWorldPosition + vec3(0.0, 0.6, 0.0)).y;
      float mixValue = smoothstep(-0.1, 0.9, h);
      vec3 color = mix(bottomColor, topColor, mixValue);
      gl_FragColor = vec4(color, 1.0);
    }
  `
});

const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 32), skyMaterial);
scene.add(sky);

// Lighting
const hemiLight = new THREE.HemisphereLight(0x95baff, 0x1d2d1d, 0.6);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Hill
const hillGeometry = new THREE.SphereGeometry(6, 64, 32);
const hillMaterial = new THREE.MeshStandardMaterial({
  color: 0x436b4f,
  roughness: 0.9,
  metalness: 0.1,
  flatShading: true
});
const hill = new THREE.Mesh(hillGeometry, hillMaterial);
hill.scale.set(1.8, 0.7, 1.6);
hill.position.set(0, -2.2, -2.5);
scene.add(hill);

// Character
const heroGroup = new THREE.Group();
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf2efe9, flatShading: true });
const tunicMaterial = new THREE.MeshStandardMaterial({ color: 0x1d8dd0, flatShading: true });

const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.7, 6), tunicMaterial);
legs.position.set(0, -0.35, 0);
heroGroup.add(legs);

const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 0.8, 8, 16), tunicMaterial);
torso.position.set(0, 0.5, 0);
heroGroup.add(torso);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), bodyMaterial);
head.position.set(0, 1.4, 0.08);
heroGroup.add(head);

const hair = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshStandardMaterial({ color: 0x2a2a2e, flatShading: true }));
hair.scale.set(1, 0.7, 1);
hair.position.set(0, 1.55, -0.1);
heroGroup.add(hair);

heroGroup.position.set(-0.1, -0.2, -0.8);
heroGroup.rotation.y = Math.PI * 0.15;
scene.add(heroGroup);

// Floating stones for depth
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x506a4c, roughness: 1, flatShading: true });
for (let i = 0; i < 8; i += 1) {
  const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.3), stoneMaterial);
  stone.position.set((Math.random() - 0.5) * 5, -2.2 + Math.random() * 0.4, -2 + Math.random() * 1.2);
  stone.rotation.set(Math.random(), Math.random(), Math.random());
  scene.add(stone);
}

// Sun & Moon
const celestialMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffffff,
  emissiveIntensity: 1.3,
  color: 0xffffff
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), celestialMaterial.clone());
sun.material.emissive.setHex(0xfff7c0);
const moon = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), celestialMaterial.clone());
moon.material.emissive.setHex(0x9bc7ff);
scene.add(sun, moon);

// Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 500;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;
  const radius = 30 + Math.random() * 15;
  starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
  starPositions[i * 3 + 1] = Math.cos(phi) * radius * 0.6 + 10;
  starPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0 });
const stars = new THREE.Points(starGeometry, starsMaterial);
scene.add(stars);

let scrollProgress = 0;
const gradientStops = [
  { t: 0, top: '#0c1b3f', bottom: '#f8c09d' },
  { t: 0.25, top: '#3881d2', bottom: '#9ee8ff' },
  { t: 0.5, top: '#ff7b6b', bottom: '#ffe29f' },
  { t: 0.75, top: '#1a2158', bottom: '#f17c67' },
  { t: 1, top: '#03051c', bottom: '#09122c' }
];

const stageElements = [...document.querySelectorAll('.stage')].map((el) => ({
  el,
  start: Number(el.dataset.start ?? 0),
  end: Number(el.dataset.end ?? 1)
}));

function lerpColorHex(a, b, t) {
  const colorA = new THREE.Color(a);
  const colorB = new THREE.Color(b);
  return colorA.lerp(colorB, t);
}

function sampleGradient(progress) {
  for (let i = 0; i < gradientStops.length - 1; i += 1) {
    const current = gradientStops[i];
    const next = gradientStops[i + 1];
    if (progress >= current.t && progress <= next.t) {
      const localT = (progress - current.t) / (next.t - current.t);
      const topColor = lerpColorHex(current.top, next.top, localT);
      const bottomColor = lerpColorHex(current.bottom, next.bottom, localT);
      return { topColor, bottomColor };
    }
  }
  const last = gradientStops[gradientStops.length - 1];
  return { topColor: new THREE.Color(last.top), bottomColor: new THREE.Color(last.bottom) };
}

function updateCelestialBodies() {
  const cycle = scrollProgress;
  const sunAngle = cycle * Math.PI * 2;
  const moonAngle = sunAngle + Math.PI;
  const radius = 12;
  sun.position.set(Math.cos(sunAngle) * radius, Math.sin(sunAngle) * 4 + 4, -8);
  moon.position.set(Math.cos(moonAngle) * radius * 0.8, Math.sin(moonAngle) * 4 + 4, -8);
  const daylight = Math.max(Math.sin(sunAngle) * 0.5 + 0.5, 0);
  dirLight.intensity = THREE.MathUtils.lerp(0.25, 1.1, daylight);
  hemiLight.intensity = THREE.MathUtils.lerp(0.2, 0.9, daylight);
  starsMaterial.opacity = THREE.MathUtils.clamp((scrollProgress - 0.6) / 0.4, 0, 1);
}

function updateStages() {
  stageElements.forEach(({ el, start, end }) => {
    if (scrollProgress >= start && scrollProgress < end) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

function updateSceneByScroll() {
  const gradient = sampleGradient(scrollProgress);
  skyUniforms.topColor.value.copy(gradient.topColor);
  skyUniforms.bottomColor.value.copy(gradient.bottomColor);
  updateCelestialBodies();
  updateStages();
}

function handleScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
  scrollProgress = THREE.MathUtils.clamp(scrollProgress, 0, 1);
  updateSceneByScroll();
}

function handleResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', handleResize);

handleScroll();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
