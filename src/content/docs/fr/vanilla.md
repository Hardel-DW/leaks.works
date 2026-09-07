---
title: Minecraft, un seul thread
lead: Le serveur vanilla gère tout le monde en séquentiel, sur un seul thread. Voici ce que ça implique, et ce que Leafs change.
---

## La boucle de 50 millisecondes

Le serveur fait des boucles de 50 ms, vingt fois par seconde. C'est le fameux 20 TPS. À chaque tour, il fait avancer tout le monde : les joueurs, les entités, la redstone, les fours, la génération des chunks.

Quand il y a trop de travail, un tour prend plus de 50 ms. Le TPS chute et tout ralentit, sans exception. C'est le lag que vous ressentez. Comme tout est en commun, chaque joueur impacte tous les autres.

## Le problème

Si votre machine a 6, 12 ou 50 coeurs, le jeu en prend un seul pour tout gérer. Acheter du matériel plus cher n'apporte rien. Minecraft a été conçu il y a quinze ans, à une époque où plusieurs coeurs n'étaient pas la norme.

## Ce que Leafs vise

Leafs s'impose une règle simple, tirée des lois d'Amdahl et de Gustafson : le nombre de joueurs et de régions doit suivre la RAM et les threads disponibles. Pour accueillir plus de joueurs, on ajoute des coeurs ou de la RAM, de manière linéaire.

Pour y arriver, le thread serveur garde un coût fixe et déterministe, et il tourne en parallèle des threads de régions et de chunks. Pendant le développement, on essaie de ne rien laisser sur ce thread global.

:::note{tone="warn"}
Les gains supposent que les joueurs soient éparpillés dans le monde. Cent joueurs au même endroit forment une seule région, et cette région tient sur un seul thread, comme en vanilla.
:::
