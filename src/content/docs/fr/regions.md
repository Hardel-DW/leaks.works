---
title: Les régions
lead: Le monde se découpe autour des joueurs. Les chunks simulés forment des régions, et chaque région tick seule.
---

## Des chunks simulés aux régions

Leafs regarde les chunks simulés, ceux autour du joueur définis par la `simulation distance`. Le monde est découpé en une grille fixe de sections de 2x2 chunks, réglable par `section_size`. Une section devient active quand un de ses chunks est simulé. Les sections actives qui se touchent sont regroupées en une région.

Les régions possèdent une couronne d'une section autour de leurs sections actives, qu'elles ne tickent pas. Deux couronnes de deux régions différentes ne se chevauchent jamais. La couronne absorbe ce qui déborde : un piston, un projectile, une mise à jour de voisinage.

::regions

## Fusion et scission

Deux joueurs éloignés sont chacun dans leur région. Les régions bougent avec les joueurs. Deux joueurs qui se rapprochent voient leurs régions fusionner en une seule. Une région qui s'étire jusqu'à se couper en deux morceaux se scinde. Ces opérations se font entre deux ticks, jamais au milieu d'un tick.

## Ce qu'une région possède

Une région possède ses chunks, ses entités, ses joueurs, ses block entities, les paquets réseau de ses joueurs et son propre générateur aléatoire. Pendant son tick, aucun thread étranger ne peut écrire dans la région. Lire chez une autre région reste libre pour tout le monde.