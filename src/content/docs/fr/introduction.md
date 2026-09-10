---
title: Introduction
lead: Leafs est un mod Fabric côté serveur. Il découpe le monde de Minecraft en régions indépendantes et fait ticker chaque région sur son propre thread.
---

Dans un serveur classique, tous les coûts sont partagés. Chaque joueur, chaque machine, chaque zone qui se génère pèse sur le même thread. Leafs découpe le monde en régions indépendantes, et chaque région vit son propre tick à 20 TPS.

Leafs ajoute le multithreading, et rien d'autre. Aucune feature de gameplay, aucune API, aucune optimisation cachée. Les gains de RAM et de CPU vivent dans un mod séparé, **Mapple**, qui fonctionne avec ou sans Leafs.

## Dépendance et mods compatibles

Leafs dépend de **Mapple**, **Fabric API**, **ScalableLux** et **FastNoise**, ils sont automatiquement installés par Modrinth/CurseForge lorsque vous installez Leafs.

Leafs est disponible sur Fabric et NeoForge de la 26.1 à la 26.3. Les mods de contenu comme AE2 sont compatibles, pour plus d'informations [Compatibilité des mods](/docs/mod-compatibility)

Les mods d'optimisation suivants, **Lithium**, **Ferrite**, **ModernFix**, **Krypton** sont compatibles. Leafs désactive lui-même les quelques options de Lithium qui toucheraient au moteur de chunks, il n'y a rien à configurer.

## Ce qui est incompatible

**C2ME**, **Moonrise** et **VMP** réécrivent le jeu en profondeur à leur manière. Leafs les déclare incompatibles et le jeu refuse de les charger ensemble.
Leafs intègre une architecture plus légère et différente de C2ME mais en pratique les mêmes gains et avantages que lui, pour plus d'informations voir les [Benchmark](/docs/benchmark)

## Comment lire cette documentation

Cette documentation est vulgarisée au plus simple possible et accessible à tous, certaines parties sont néanmoins un peu plus détaillées et nécessitent plus de connaissances dans le jeu.
Voici les chapitres que je vous conseille.

1. [Minecraft, un seul thread](/docs/vanilla). Pourquoi le serveur vanilla ne profite pas de vos cœurs.
2. [Les régions](/docs/regions). Comment le monde se découpe autour des joueurs.
3. [Les threads](/docs/threads). Le thread serveur, les threads de régions et les threads de chunks.
4. [Lecture et écriture](/docs/read-write). Qui a le droit d'écrire où.
5. [Courrier et emprunt](/docs/mail-borrow). Les deux seuls outils de coordination.
6. [Compromis](/docs/trade-offs). Chaque écart avec vanilla, et pourquoi il existe.