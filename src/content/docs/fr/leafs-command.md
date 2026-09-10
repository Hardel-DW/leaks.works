---
title: La commande /leafs
lead: Une seule commande pour voir les régions, les timings, les compteurs et la mémoire. Réservée aux opérateurs.
---

## Les régions

`/leafs regions` affiche le nombre de threads, le TPS du thread serveur, puis une ligne par dimension contenant le numéro de la région, nombre de chunks, nombre d'entités, la région la plus lente. La dernière ligne dit dans quelle région vous êtes.

`/leafs regions <dimension>` détaille les régions de la dimension, ses sections vivantes ou mortes, les régions créées ou détruites, celles fusionnées ou scindées, puis une ligne par région avec son identifiant, son état, son TPS, sa durée de tick, ses chunks et ses entités.

## Les timings

`/leafs timings` affiche le coût de chaque étape d'un tick soit du serveur, soit de la dimension, c'est une moyenne sur les cent derniers ticks. Le TPS affiché est calculé sur les cinq dernières secondes.

- `/leafs timings` : Affiche les étapes de chaque tick en ms du thread serveur.
- `/leafs timings <dimension>` : Affiche les étapes de chaque tick en ms de la dimension. La bordure, la météo, l'heure, les raids etc...
- `/leafs timings <dimension> <id>` : Affiche les étapes de chaque tick en ms de la région. Ses étapes, son TPS, ses chunks, ses entités.

## Les compteurs

`/leafs metrics` affiche les informations de la dernière minute, les emprunts, les messages que s'envoient les régions et les abandons, les paquets entrants et sortants, les chunks chargés et déchargés, et les fois où deux threads ont voulu le même joueur.

## La mémoire

`/leafs ram` affiche la RAM utilisée par le serveur, le heap et la RAM totale, le nombre de fois que le garbage collector s'est activé, et des informations plus techniques.

## La config et le crash

- `/leafs config [clé]` affiche la valeur de la clé.
- `/leafs config [clé] [valeur]` modifie le fichier de configuration, cela prend effet au prochain redémarrage.

`/leafs crash <dimension> <region>` fait crasher le jeu. À l'origine il servait à une fonctionnalité supprimée depuis qui isolait les crashs par région.