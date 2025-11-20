import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { clamp, timeStops } from '../data/timeStops.js';

const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const CanvasScene = ({ progress }) => {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    // Gradient sky dome
    const uniforms = {
      topColor: { value: new THREE.Color(timeStops[0].skyTop) },
      bottomColor: { value: new THREE.Color(timeStops[0].skyBottom) }
    };

    const skyMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms,
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
          float h = normalize(vWorldPosition + vec3(0.0, 10.0, 0.0)).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(h, 0.5), 0.0)), 1.0);
        }
      `
    });

    const sky = new THREE.Mesh(new THREE.SphereGeometry(35, 64, 32), skyMaterial);
    scene.add(sky);

    // Low poly hill
    const hillGeometry = new THREE.ConeGeometry(3, 2, 10);
    hillGeometry.translate(0, -1, 0);
    const hillMaterial = new THREE.MeshStandardMaterial({ color: '#2f5d4e', flatShading: true });
    const hill = new THREE.Mesh(hillGeometry, hillMaterial);
    scene.add(hill);

    // Character
    const bodyGeometry = new THREE.CapsuleGeometry(0.18, 0.35, 6, 12);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#ffbf69', flatShading: true });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(-0.4, 0.35, 0.2);
    body.rotation.z = -0.25;
    scene.add(body);

    const headGeometry = new THREE.SphereGeometry(0.18, 12, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: '#ffd4a3', flatShading: true });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(-0.25, 0.75, 0.3);
    scene.add(head);

    const legsGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 6);
    const legsMaterial = new THREE.MeshStandardMaterial({ color: '#233142', flatShading: true });
    const legLeft = new THREE.Mesh(legsGeometry, legsMaterial);
    const legRight = legLeft.clone();
    legLeft.position.set(-0.55, 0.05, 0.35);
    legLeft.rotation.x = 1.3;
    legRight.position.set(-0.25, 0.05, 0.1);
    legRight.rotation.x = 1.1;
    scene.add(legLeft, legRight);

    // Sun & Moon
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 32, 16),
      new THREE.MeshBasicMaterial({ color: timeStops[0].sunColor })
    );
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 16),
      new THREE.MeshBasicMaterial({ color: timeStops[0].moonColor })
    );
    scene.add(sun);
    scene.add(moon);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 600;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 12 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: '#f8f9ff', size: 0.08, transparent: true, opacity: 0 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const resize = () => {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resize);

    const animate = () => {
      renderer.render(scene, camera);
      stars.rotation.y += 0.0007;
      hill.rotation.y = Math.sin(Date.now() * 0.0001) * 0.05;
      requestAnimationFrame(animate);
    };

    animate();

    stateRef.current = { renderer, scene, camera, uniforms, sun, moon, stars, starMaterial };

    return () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;

    const eased = easeInOut(clamp(progress));
    const currentStopIndex = timeStops.findIndex((stop) => eased >= stop.start && eased <= stop.end);
    const index = currentStopIndex === -1 ? timeStops.length - 1 : currentStopIndex;
    const currentStop = timeStops[index];
    const nextStop = timeStops[Math.min(index + 1, timeStops.length - 1)];
    const localT = (eased - currentStop.start) / (currentStop.end - currentStop.start || 1);
    const lerpColor = (a, b) => new THREE.Color(a).lerp(new THREE.Color(b), clamp(localT));

    state.uniforms.topColor.value.copy(lerpColor(currentStop.skyTop, nextStop.skyTop));
    state.uniforms.bottomColor.value.copy(lerpColor(currentStop.skyBottom, nextStop.skyBottom));

    const angle = eased * Math.PI * 2;
    state.sun.position.set(Math.cos(angle) * 5, Math.sin(angle) * 3 + 1, -3);
    state.moon.position.set(Math.cos(angle + Math.PI) * 5, Math.sin(angle + Math.PI) * 3 + 1, 3);
    state.sun.material.color.copy(lerpColor(currentStop.sunColor, nextStop.sunColor));
    state.moon.material.color.copy(lerpColor(currentStop.moonColor, nextStop.moonColor));

    state.starMaterial.opacity = THREE.MathUtils.lerp(currentStop.starOpacity, nextStop.starOpacity, clamp(localT));
  }, [progress]);

  return <div className="canvas-layer" ref={mountRef} />;
};

export default CanvasScene;
