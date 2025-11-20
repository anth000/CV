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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#a7c4df', 12, 28);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0.4, 1.6, 4.8);
    camera.lookAt(0, 0.4, 0);

    const ambientLight = new THREE.AmbientLight('#fefefe', 0.85);
    scene.add(ambientLight);

    const hemi = new THREE.HemisphereLight('#d7e9ff', '#2f5d4e', 0.6);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.15);
    dirLight.position.set(3, 5, 2);
    dirLight.castShadow = false;
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

    // Ground & Low poly hillscape
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: '#8bc28c', flatShading: true, roughness: 0.9 })
    );
    ground.position.y = -1.35;
    scene.add(ground);

    const hillGeometry = new THREE.ConeGeometry(3.4, 2.4, 14);
    hillGeometry.translate(0, -1, 0);
    const hillMaterial = new THREE.MeshStandardMaterial({ color: '#4b885f', flatShading: true });
    const hill = new THREE.Mesh(hillGeometry, hillMaterial);
    scene.add(hill);

    const hillBack = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, 1.6, 12).translate(0, -0.7, 0),
      new THREE.MeshStandardMaterial({ color: '#69a072', flatShading: true })
    );
    hillBack.position.set(1.8, 0, -1.6);
    scene.add(hillBack);

    const createTree = (x, z, scale = 1) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.6 * scale, 6),
        new THREE.MeshStandardMaterial({ color: '#8d5c3d', flatShading: true })
      );
      trunk.position.y = 0.3 * scale;
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(0.6 * scale, 1.1 * scale, 8),
        new THREE.MeshStandardMaterial({ color: '#5fa86a', flatShading: true })
      );
      foliage.position.y = 1 * scale;
      tree.add(trunk, foliage);
      tree.position.set(x, 0.05 * scale, z);
      tree.rotation.y = Math.random() * Math.PI * 2;
      return tree;
    };

    [-1.8, 0.6, 2.1, -2.4].forEach((x, index) => {
      const z = index % 2 === 0 ? -1.2 : 1.3;
      const scale = 0.85 + Math.random() * 0.4;
      scene.add(createTree(x, z, scale));
    });

    const clouds = new THREE.Group();
    const cloudMaterial = new THREE.MeshStandardMaterial({ color: '#f7f7ff', flatShading: true, transparent: true, opacity: 0.95 });
    const makeCloud = (position) => {
      const geo = new THREE.IcosahedronGeometry(0.25, 1);
      const blob1 = new THREE.Mesh(geo, cloudMaterial);
      blob1.position.set(0, 0, 0);
      const blob2 = new THREE.Mesh(geo, cloudMaterial);
      blob2.position.set(0.4, 0.05, -0.1);
      const blob3 = new THREE.Mesh(geo, cloudMaterial);
      blob3.position.set(-0.35, 0.02, 0.1);
      const group = new THREE.Group();
      group.add(blob1, blob2, blob3);
      group.position.copy(position);
      clouds.add(group);
    };

    makeCloud(new THREE.Vector3(-2.2, 2.4, -1.5));
    makeCloud(new THREE.Vector3(2.4, 2.8, -2.2));
    makeCloud(new THREE.Vector3(0.8, 2.2, 1.5));
    scene.add(clouds);

    // Character
    const bodyGeometry = new THREE.CapsuleGeometry(0.18, 0.35, 6, 12);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#ffbf69', flatShading: true });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(-0.35, 0.55, 0.22);
    body.rotation.z = -0.25;
    scene.add(body);

    const headGeometry = new THREE.SphereGeometry(0.18, 12, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: '#ffd4a3', flatShading: true });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(-0.25, 0.95, 0.32);
    scene.add(head);

    const legsGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 6);
    const legsMaterial = new THREE.MeshStandardMaterial({ color: '#233142', flatShading: true });
    const legLeft = new THREE.Mesh(legsGeometry, legsMaterial);
    const legRight = legLeft.clone();
    legLeft.position.set(-0.52, 0.22, 0.32);
    legLeft.rotation.x = 1.35;
    legRight.position.set(-0.22, 0.2, 0.08);
    legRight.rotation.x = 1.15;
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
      clouds.children.forEach((cloud, index) => {
        cloud.position.x += Math.sin(Date.now() * 0.00015 + index) * 0.0004;
        cloud.position.z += Math.cos(Date.now() * 0.00012 + index) * 0.0003;
      });
      requestAnimationFrame(animate);
    };

    animate();

    stateRef.current = { renderer, scene, camera, uniforms, sun, moon, stars, starMaterial, hill, hillBack, clouds };

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

    const topColor = lerpColor(currentStop.skyTop, nextStop.skyTop);
    const bottomColor = lerpColor(currentStop.skyBottom, nextStop.skyBottom);
    state.uniforms.topColor.value.copy(topColor);
    state.uniforms.bottomColor.value.copy(bottomColor);
    state.scene.fog.color.copy(bottomColor.clone().lerp(topColor, 0.15));

    const angle = eased * Math.PI * 2;
    state.sun.position.set(Math.cos(angle) * 5, Math.sin(angle) * 3 + 1, -3);
    state.moon.position.set(Math.cos(angle + Math.PI) * 5, Math.sin(angle + Math.PI) * 3 + 1, 3);
    state.sun.material.color.copy(lerpColor(currentStop.sunColor, nextStop.sunColor));
    state.moon.material.color.copy(lerpColor(currentStop.moonColor, nextStop.moonColor));

    state.starMaterial.opacity = THREE.MathUtils.lerp(currentStop.starOpacity, nextStop.starOpacity, clamp(localT));

    const cameraBaseX = 0.4 + Math.sin(eased * Math.PI * 2) * 0.15;
    const cameraBaseY = 1.6 + Math.cos(eased * Math.PI) * 0.12;
    state.camera.position.x = cameraBaseX;
    state.camera.position.y = cameraBaseY;
    state.camera.lookAt(0, 0.4, 0);
  }, [progress]);

  return <div className="canvas-layer" ref={mountRef} />;
};

export default CanvasScene;
