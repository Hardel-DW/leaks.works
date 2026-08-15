# CLAUDE.md
Site de vulgarisation de Leafs, le mod Fabric qui fait tourner le monde de Minecraft en parallèle. Le but est qu'un lecteur qui ne joue pas comprenne le modèle, et qu'un développeur reparte avec les vraies classes en tête. Chaque chapitre se lit à deux étages : l'explication simple d'abord, le détail du code ensuite.
Frontend pur. Pas de backend, pas de clef de trad, pas d'upload, pas de download, pas de compilation.
Je suis dev senior, sois concis. On privilégie une bonne implémentation à un correctif rapide.

## Sources de vérité
La doc du mod fait foi, elle est dans `..\leafs-template-26.2\docs\` et le code dans `..\leafs-template-26.2\src\main\java\fr\hardel\leafs\`. Rien sur le site ne doit contredire ces fichiers. Une affirmation qu'on ne peut pas retrouver dans le code ne s'écrit pas.
Le kit UI et le design viennent de `..\voxel.studio.mock`. On copie ses composants, on ne les redéveloppe pas. Même palette, même grille, même lumière, aucun style inventé.

## Development Commands
- **Dev server**: `npm run dev`, ne pas démarrer un serveur si un tourne déjà.
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint/Typecheck**: `npm run lint`
- **Format**: `npm run biome:format`
- **Lint check**: `npm run biome:check`
- **Auto-fix**: `npm run biome:unsafefix`

### Core Technologies
- **Build Tool**: Vite 8 with Rolldown
- **Framework**: React 19 (pas de React Compiler, Babel a été retiré pour diviser les deps par deux)
- **State Management**: Zustand
- **Styling**: TailwindCSS v4
- **Linting/Formatting**: Biome

#### Code Style
- **Biome Configuration**: indentation 4 espaces, largeur 200, guillemets doubles
- **Import Aliases**: `@/` pour la racine de src, `@lib/*` et `@routes/*`

Rules:
- No biome-ignore or ts-ignore. you must ask for permission.
- No comment.
- No code redundancy.
- No "any" type. For type "unknown", it is preferable to request authorization.
- Avoid globalthis.
- Prefer modern and standards logic 2024 and 2025 and 2026.
- Methods must be less than 10 lines of code and must do one thing correctly.
- No Legacy or Deprecated support.
- At the end of each sessions, check with `npm run lint`.
- Avoid unnecessary re-renders with zustand or React.
- useEffect et useLayoutEffect demandent une approbation. Accordé pour `lib/hook/useTicker.ts`, l'horloge des démos animées, parce qu'un intervalle n'est attaché à aucun noeud du DOM et que le hook nettoie correctement. Toute autre utilisation se redemande.
- useMemo, useCallback are banned: les données sont minuscules, les re-renders sont gratuits et les sélecteurs zustand font le vrai travail.
- useForwardRef is deprecated, use ref as props.
- no .foreach prefer for of or any loop or new set/map ECMAScript 2025 syntax.
- Quand je prends le temps de modifier un fichier, tiens-en compte et ne reviens pas dessus. Si tu as un doute, demande.
- Je ne sais pas tout, si tu es certain que j'ai tort, on en discute.
- Ne contourne jamais une règle en tordant l'architecture. Demande l'approbation.

## Écriture
Français simple et moderne, comme à l'oral. Phrases courtes, complètes, une idée par phrase. Pas de tiret cadratin, pas de tiret de ponctuation. Pas de jargon sans l'avoir expliqué juste avant. Un chapitre commence toujours par le concret, jamais par la classe Java.
Les noms de classes et de dossiers s'écrivent tels quels, ils viennent du dépôt du mod.

# Long Term:
No leaving work for later. We do everything end-to-end, cleanly and completely. We can potentially make several commits, but no leaving things for later. No shortcuts, no hacks. Everything done properly.
With good coding practices, clean up dead code, duplication, etc.
We do it really clean, for the long term. Good code quality without hacks.
Removing code can sometimes require writing a bit of new code to eliminate a lot more. We're not aiming for fast delivery but for code quality over multiple years.
