---
title: La commande /leafs
lead: Une seule commande pour voir les régions, les timings, les compteurs et la mémoire. Réservée aux opérateurs.
---

## Les régions

`/leafs regions` affiche le nombre de workers, le TPS du thread serveur, puis une ligne par dimension : régions, chunks, entités, le TPS de la partie sérielle et la région la plus lente. La dernière ligne dit dans quelle région vous êtes.

`/leafs regions <dimension>` détaille une dimension : sections vivantes et mortes, régions créées, détruites, fusionnées et scindées, puis une ligne par région avec son id, son état, son TPS, sa durée de tick, ses chunks et ses entités.

## Les timings

`/leafs timings` affiche le coût de chaque étape d'un tick, en moyenne sur les cent derniers ticks. Le TPS affiché en tête vient d'une fenêtre de cinq secondes.

- `/leafs timings` : le thread serveur. Les dimensions, la file globale, les connexions, la liste des joueurs et l'autosave.
- `/leafs timings <dimension>` : la partie sérielle de la dimension. La bordure, la météo, l'heure, les raids, les tickets, la vue, les déchargements, le dragon et la gestion.
- `/leafs timings <dimension> <id>` : une région. Ses quinze étapes, son TPS, ses chunks, ses entités et son retard moyen au départ.

## Les compteurs

`/leafs metrics` affiche la dernière minute : les emprunts pour les évènements Fabric, les travaux passés à une autre région et les abandons par raison, les paquets entrants et sortants, les chunks chargés et déchargés, et les fois où deux threads ont voulu le même joueur.

## La mémoire

`/leafs ram` affiche la RAM utilisée par le serveur, le heap engagé et maximum, le nombre de collectes et leur durée par ramasse-miettes, et par dimension le nombre de holders et de sections des graphes.

## La config et le crash

`/leafs config [clé] [valeur]` affiche toutes les clés réglables, ou une seule, ou en réécrit une dans le fichier. La nouvelle valeur prend effet au prochain démarrage.

`/leafs crash <dimension> <region>` fait crasher une région, pour vérifier que le crash report isolé fonctionne. La région écrit son rapport dans `crash-reports/region-crash-<date>.txt` avec son id, sa dimension, son tick, ses chunks, ses entités, le mod suspect et la pile.

## Dans le code

Le dossier `debug/` porte une classe par sous-commande. `TimingsCommand` moyenne sur `AVERAGE_WINDOW_TICKS`, cent ticks, et lit le TPS dans `StageTimings`, une fenêtre de `WINDOW_NANOS`, cinq secondes. `MetricsCommand` lit `ServerMetrics`, dont chaque compteur est un `MinuteCounter` de soixante seaux d'une seconde. `RegionCrashReport` et `RegionCrashWriter` écrivent le rapport d'une région, et `ModAttribution` retrouve le mod d'une trame de pile par les chemins du loader.
