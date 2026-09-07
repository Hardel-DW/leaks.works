---
title: Introduction
lead: Leafs est un mod Fabric côté serveur. Il découpe le monde de Minecraft en régions indépendantes et fait ticker chaque région sur son propre thread.
---

Dans un serveur classique, tous les coûts sont partagés. Chaque joueur, chaque machine, chaque zone qui se génère pèse sur le même thread. Leafs découpe le monde en régions indépendantes, et chaque région vit son propre tick à 20 TPS.

Leafs ajoute le multithreading, et rien d'autre. Aucune feature de gameplay, aucune API, aucune optimisation cachée. Les gains de RAM et de CPU vivent dans un mod séparé, **Mapple**, qui fonctionne avec ou sans Leafs.

## Ce qu'il faut installer

- Minecraft 26.2, Java 25 et Fabric Loader 0.19.3 ou plus récent.
- Fabric API.
- Mapple, ScalableLux et FastNoise. Leafs en dépend et refuse de démarrer sans eux.

## Ce qui est incompatible

C2ME, Moonrise et VMP réécrivent le moteur de chunks à leur manière. Leafs les déclare incompatibles et le jeu refuse de les charger ensemble.

Lithium, Ferrite et Mapple sont compatibles. Leafs désactive lui-même les quelques options de Lithium qui toucheraient au moteur de chunks, il n'y a rien à configurer.

## Comment lire cette documentation

Chaque chapitre se lit à deux étages. D'abord l'explication simple, pour comprendre le modèle sans avoir ouvert le code. Ensuite une section **Dans le code**, avec les vraies classes du dépôt, pour un développeur qui veut savoir où regarder.

1. [Minecraft, un seul thread](/docs/vanilla). Pourquoi le serveur vanilla ne profite pas de vos coeurs.
2. [Les régions](/docs/regions). Comment le monde se découpe autour des joueurs.
3. [Les threads](/docs/threads). Le thread serveur, les workers de régions et les workers de chunks.
4. [Lecture et écriture](/docs/read-write). Qui a le droit d'écrire où.
5. [Courrier et emprunt](/docs/mail-borrow). Les deux seuls outils de coordination.
6. [Compromis](/docs/trade-offs). Chaque écart avec vanilla, et pourquoi il existe.

:::note
Tout ce qui est écrit ici se retrouve dans le code du mod. Une affirmation qu'on ne peut pas retrouver dans le code ne s'écrit pas.
:::
