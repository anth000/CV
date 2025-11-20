# Portfolio 3D Low Poly (React + Three.js)

Expérience WebGL en React qui raconte le CV d’Anthony Moulin grâce à un cycle jour/nuit synchronisé au scroll. La colline low poly et
le personnage restent fixes pendant que le ciel, les astres et les cartes de contenu évoluent.

## Aperçu créatif
- Canvas Three.js géré par React qui interpole les gradients du ciel, la position du soleil/de la lune et l’opacité des étoiles selon le scroll.
- Timeline UI en glassmorphism : chaque carte du CV se remplit à mesure que l’utilisateur progresse dans la journée.
- Section CTA et footer social pour conclure l’expérience avec un appel à collaboration.

## Démarrer le projet
```bash
npm install
npm run dev
```
Le serveur Vite s’ouvre par défaut sur [http://localhost:4173](http://localhost:4173).

### Build de production
```bash
npm run build
npm run preview
```

### Dépannage installation
Si `npm install` retourne un `403 Forbidden`, il s’agit généralement d’une restriction réseau et non d’un problème de dépendances (React 18, Three.js et Vite sont des versions publiques stables). Vérifications rapides :

- Assurez-vous que le registre npm par défaut est accessible : `npm config set registry https://registry.npmjs.org/`.
- Nettoyez un éventuel proxy bloquant : `npm config delete proxy` et `npm config delete https-proxy`.
- Réessayez après avoir vidé le cache : `npm cache clean --force` puis `npm install`.
- En environnement d’entreprise, ajoutez un `.npmrc` local avec les identifiants/proxy nécessaires (un `.npmrc` de base est fourni à la racine avec le registre public configuré).

## Technologies principales
- **React 18 + Vite** pour une structure moderne, rapide et prête au déploiement CDN.
- **Three.js** pour la scène low poly personnalisée (shader du ciel, soleil/lune, particules d’étoiles, personnage stylisé).
- **Scroll-driven storytelling** via React (calcul de la progression, synchronisation UI ↔ scène 3D).
- **Design system** Space Grotesk, glassmorphism, boutons capsules et transitions fluides.

## Hébergement & optimisation
- Déployez le dossier `dist/` sur Vercel, Netlify, Cloudflare Pages ou GitHub Pages pour bénéficier d’un CDN global.
- Activez `splitChunks` (déjà géré par Vite) et servez `three` depuis le bundle local pour éviter des requêtes externes.
- Maintenez `devicePixelRatio` plafonné à 2 (géré dans `CanvasScene`) pour équilibrer finesse et performances sur mobile.
- Optimisez les assets futurs : privilégiez des géométries low poly, compressez vos GLTF avec Draco et chargez-les de façon paresseuse si la scène grossit.
