# Portfolio 3D Low Poly

Expérience web immersive simulant une colline low poly et un ciel évolutif qui dévoile un CV interactif au fil du scroll.

## Aperçu créatif
- Colline et personnage stylisés low poly ancrés au premier plan.
- Ciel animé synchronisé au scroll (aube → jour → crépuscule → nuit).
- Sections du CV qui apparaissent dans la couche UI au rythme du cycle du temps.
- Soleil, lune et étoiles évoluent en Three.js pour renforcer le storytelling.

## Lancer le projet
1. Servez les fichiers statiques avec n'importe quel serveur local (Vite, `npx serve`, Live Server, etc.).
2. Ouvrez `index.html` dans un navigateur moderne compatible WebGL 2.

```bash
npx serve .
```

## Technologies principales
- **Three.js** pour la scène low poly (colline, personnage, soleil/lune, étoiles).
- **ShaderMaterial** personnalisé pour le dégradé du ciel.
- **Scroll driven animation** en JavaScript pour synchroniser les sections du CV avec la lumière du ciel.
- **CSS glassmorphism** pour les panneaux de contenu.

## Hébergement & performance
- Hébergez l'expérience sur un service statique (Vercel, Netlify, GitHub Pages ou Cloudflare Pages) afin de bénéficier d'un CDN mondial et de la compression automatique.
- Activez `cache-control` long sur `three.module.js` servi depuis CDN et servez vos assets via HTTP/2 pour des temps de chargement minimisés.
- Maintenez la taille du canvas à `devicePixelRatio` limité à 2 (déjà géré dans `main.js`) pour équilibrer finesse et performance sur mobile.
- Lorsque vous ajouterez des modèles 3D supplémentaires, préférez des géométries low poly, compressez-les en Draco/GLTF et chargez-les de manière paresseuse pour préserver la fluidité du scroll.
