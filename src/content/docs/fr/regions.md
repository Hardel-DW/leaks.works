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

Une région possède ses chunks, ses entités, ses joueurs, ses block entities, les paquets réseau de ses joueurs et son propre générateur aléatoire. Pendant son tick, personne d'autre n'écrit dans son contenu. Lire chez une autre région reste libre pour tout le monde.

## Dans le code

Le dossier `region/` découpe le monde sans aucune dépendance à Minecraft. `Regionizer` tient les sections et les régions sous un `StampedLock`. `RegionSection` couvre `section_size` chunks de côté, une puissance de deux, sous forme d'un bitset. `Region` porte ses clés de sections, ses sections mortes et son état.

`LevelRegions`, une instance par dimension, écoute le graphe de tickets de simulation. Quand le niveau d'un chunk passe ou quitte `block ticking`, il appelle `addChunk` ou `removeChunk`. Ce sont donc uniquement les chunks qui tickent des blocs qui dessinent les régions.

### La couronne et la fusion

Quand un chunk arrive dans une section vide, le régioniseur crée la section, puis crée ou compte chaque voisine dans un rayon de `region_buffer_distance`. Ces voisines appartiennent à la région mais ne tickent jamais : c'est la couronne.

Il cherche ensuite les régions voisines dans un rayon de `region_merge_distance` plus `region_buffer_distance`. La première sert de cible, de préférence une qui ne tick pas. Les autres reçoivent une fusion différée. La fusion s'exécute dès que ni la source ni la cible ne tickent, au moment même ou à la fin du tick en cours dans `markNotTicking`.

### Les états

| État | Sens |
| --- | --- |
| `READY` | Vivante et planifiable. C'est l'état de départ. |
| `TICKING` | Un worker la tick. Elle peut encore gagner des sections, jamais en perdre. |
| `TRANSIENT` | Vivante mais promise à une fusion dont la cible tick. Jamais planifiée. |
| `DEAD` | Fusionnée ou scindée. L'objet ne s'utilise plus. |

### La scission

Quand le dernier chunk d'une section part, la section devient morte si aucune voisine n'a de chunk. Le régioniseur les récupère paresseusement, à la fin d'un tick, quand les sections mortes atteignent un sixième de la région. Il calcule alors les composantes connexes. S'il y en a plusieurs, chaque composante devient une région enfant, et `RegionCallbacks.split` prévient le reste du mod.

Sur une fusion, `LevelRegions.merge` recale les ticks programmés des chunks déplacés sur l'horloge de la région cible. Sur une scission, les enfants repartent du tick du parent. Rien d'autre ne bouge : ce qu'une région garde entre deux ticks, `RegionWorldData`, reste à sa place.
