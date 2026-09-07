# CLAUDE.md
Site de Leafs, le mod Fabric qui fait tourner le monde de Minecraft en parallèle. Une page d'accueil courte avec des simulations interactives, une doc en chapitres, un patchnote. Deux langues, français et anglais, sans lib.
Frontend pur et statique. Pas de backend, pas de clef de trad externe, pas d'upload, pas de download, pas de compilation.
Je suis dev senior, sois concis. On privilégie une bonne implémentation à un correctif rapide.

## Sources de vérité
La doc du mod fait foi, elle est dans `..\leafs-template-26.2\docs\` et le code dans `..\leafs-template-26.2\src\main\java\fr\hardel\leafs\`. Rien sur le site ne doit contredire ces fichiers. Une affirmation qu'on ne peut pas retrouver dans le code ne s'écrit pas. Les fichiers de `docs\ia\` ne sont pas relus par un humain et ne servent pas de source.

## Commandes
- **Dev** : `npm run dev`, ne pas démarrer un serveur si un tourne déjà.
- **Build** : `npm run build`, **Preview** : `npm run preview`.
- **Typecheck** : `npm run lint`. **Format** : `npm run biome:format`. **Lint** : `npm run biome:check`.
- Le site est une SPA : l'hébergeur doit renvoyer `index.html` pour toute route.

## Stack
Vite 8, React 19 sans compiler, Zustand, Tailwind 4, TypeScript, Biome, `@voxelio/markdown` pour le contenu. Indentation 4 espaces, largeur 200, guillemets doubles. Alias `@/` vers `src`.

## Arborescence
- `src/routes/` : le routing par fichiers. `index.tsx` la racine, `docs/$slug.tsx` un paramètre, `__root.tsx` le shell commun. Une route câble, elle ne construit pas.
- `src/content/content.ts` : les collections et la nav des docs. `NAV` est la seule liste des slugs et des groupes, chaque collection déclare son frontmatter. Ce fichier est chargé par Vite côté node, il n'importe rien du navigateur.
- `src/content/docs/<lang>/<slug>.md` : une page de doc par fichier, frontmatter `title` et `lead`. Les démos s'insèrent par `::regions`, `::clocks`, `::pool`, une note par `:::note{tone="warn"}`.
- `src/content/patchnotes/<lang>/<version>.md` : une version par fichier, frontmatter `date` et `minecraft`.
- `src/lib/content/` : `plugin.ts` compile chaque markdown en arbre de blocs au build et au dev, et refuse un frontmatter incomplet ou un slug absent d'une langue. `schema.ts` le lecteur de frontmatter, `load.ts` les collections côté navigateur. Le parseur est `@voxelio/markdown`.
- `src/lib/i18n/` : les textes d'interface, `fr.ts` est la référence de type, `en.ts` doit avoir les mêmes clés.
- `src/lib/sim/` : la logique pure des simulations, sans React.
- `src/lib/store/` : Zustand. `src/lib/hook/` : les hooks. `src/lib/router.tsx`, `src/lib/utils.ts` (`cn`), `src/lib/links.ts` (liens externes).
- `src/components/ui/` : les briques communes, `Button`, `Icon`, `Leaf`. Ajouter ici demande une approbation.
- `src/components/demo/` : les simulations interactives, `RegionGrid`, `ThreadClocks`, `WorkerPool`, et leur cadre `DemoFrame`.
- `src/components/docs/`, `src/components/home/`, `src/components/layout/` : par surface.

## Direction artistique
Les règles sont universelles, chaque écran les applique toutes. Les tokens vivent dans `globals.css`, en `@theme static` : chaque variable existe toujours, même lue en `var()` depuis un SVG ou un style inline. La palette Tailwind par défaut est désactivée.
- **La grille**. Un seul conteneur, `frame`, bordé de deux lignes verticales. Sur l'accueil, les bandes hors du cadre sont hachurées en `hatched`, couleur `line`. Chaque section est une `row`, fermée par une ligne, avec une petite croix aux deux intersections. Des cellules côte à côte passent par `cells`. Aucune autre bordure de page.
- **Les îlots**. Tout panneau, démo, tableau ou bloc de code est un `island` : bordure 1px `line`, rayon 2px, fond `bark-900`. Pas d'ombre, pas de dégradé.
- **Les boutons**. Coins haut droit et bas gauche coupés en biseau par `bevel`, `corner-shape: bevel` sur un rayon `md`, avec repli sur le rayon 2px quand le navigateur ne connaît pas `corner-shape`.
- **Les couleurs**. Fond `bark-950`, texte `cream-200`, titres `cream-50`, secondaire `cream-400`, discret `cream-500`. Accent `leaf-400`, or `honey-400` pour les avertissements, `ember-400` pour le retard. Les régions des démos prennent `region-1` à `region-6`, dans cet ordre.
- **La typo**. Manrope pour tout, JetBrains Mono pour le code et les nombres. Titres de section 3xl/4xl `tracking-display` et `text-balance`. Prose 16.5px, interligne 1.75, 44rem de large, `text-pretty`. Libellés en `label`, petites majuscules espacées.
- **Le mouvement**. Trois seulement : l'entrée (`rise`, `reveal`), le survol (couleurs, 150 ms) et les simulations. Rien d'autre ne bouge. `prefers-reduced-motion` coupe tout.

## Règles de code
- Pas de biome-ignore ni de ts-ignore. Pas de `any`. Pas de commentaire. Pas de cast `as` hors `as const`.
- `useEffect` et `useLayoutEffect` demandent une approbation. Accordé pour `lib/hook/useTicker.ts`, l'horloge des démos. Un observateur DOM passe par un callback de `ref` qui rend son nettoyage.
- `useMemo` et `useCallback` sont bannis. Les données sont minuscules.
- Pas de `forEach`, `for of`. Pas de props qui transportent des composants, seulement `children`.
- Une méthode fait moins de dix lignes et une seule chose. La signature d'un composant tient sur une ligne.
- Aucune constante ne stocke des classes Tailwind, sauf un objet de variantes consommé par un seul composant. Un motif de style pur qui se répète devient une `@utility` dans `globals.css`.
- Tailwind 4, pas 3 : échelle numérique, tokens de rayon, `ease-soft`, opacités `/25`, variables `(--x)`. Les crochets restent l'exception.
- Quand je modifie un fichier, tiens-en compte et ne reviens pas dessus. Si tu as un doute, demande. Si tu es certain que j'ai tort, on en discute.

## Écriture
Français simple et moderne, comme à l'oral. Phrases courtes, complètes, une idée par phrase. Pas de tiret cadratin. Pas de jargon sans l'avoir expliqué juste avant. Un chapitre commence toujours par le concret et finit par la section **Dans le code**. Les noms de classes s'écrivent tels quels, entre accents graves, ils viennent du dépôt du mod. L'anglais suit les mêmes règles.

# Long Term
No leaving work for later. We do everything end-to-end, cleanly and completely. Clean up dead code and duplication as we go. Good code quality over multiple years, no hacks.
