---
title: Commandes et datapacks
lead: Toutes les commandes tournent sur le thread serveur, peu importe qui les lance. Une commande coûte exactement le même coût qu'elle a en vanilla.
---

## Datapacks
Pour les Data Driven donc les fichiers `.json` et `.nbt` rien à signaler, Leafs ne fait rien de particulier ils fonctionnent tout simplement comme le jeu de base.

## Une commande emprunte ce qu'elle touche

Le thread serveur emprunte une région au moment où la commande touche un de ses chunks ou une de ses entités, la garde jusqu'à la fin de la commande, puis la rend. Ce que la commande touche décide de ce qu'elle emprunte :

- Un `/say` n'emprunte rien.
- Un `/give @a` emprunte les régions où il y a des joueurs.
- Un `/setblock` emprunte la région du chunk visé, et charge le chunk avant si besoin. Ce chargement bloque le thread serveur, comme en vanilla.
- Un `/kill @e` emprunte toutes les régions, parce que c'est ce que la commande veut dire.

Un datapack de mcfunction coûte donc exactement ce qu'il coûte en vanilla. Un datapack lourd qui vit dans `tick.json` reste sur un seul thread et ne profite pas du multithreading. Il ralentit le thread serveur et les régions qu'il emprunte pendant ses commandes, pas les autres.

## À propos des mcfunctions
Le modèle mcfunction est par nature impossible à multithread, contrairement au jeu qui joue une conséquence en réponse à une action.

:::note
Exemple, le joueur attaque, il envoie l'information au serveur, qui déclenche l'action d'attaquer.
:::

Les mcfunctions dans le `tick.json` demandent au serveur de parcourir tous les joueurs et leur position (`execute as @a at @s`), puis tester une condition et si elle est bonne lancer une suite de commandes. Ce modèle demande donc de parcourir tous les joueurs donc toutes les régions à chaque tick ce qui est incompatible pour le modèle par régions, car le gain se ressent dans toutes les régions.

Le système `d'emprunt` de régions règle en partie ce problème pour ne cibler que les régions qui sont concernées par la commande.

Un sélecteur `@a` ou `@e` implique de communiquer avec tous les joueurs et donc toutes les régions et donc d'impacter les performances globales du serveur.

Cependant un modèle `actions -> conséquences` qui utilise seulement `@s` est parfaitement compatible, un trigger d'avancement ou un effet d'enchantement qui déclenche une mcfunction.

## Les command blocks

Un command block, ou un minecart à command block, déclenché par la redstone s'exécute un tick plus tard qu'en vanilla. La redstone tourne sur la région et la commande sur le thread serveur, et le passage de l'un à l'autre attend le tick suivant. Une commande tapée dans le chat ou lancée par un datapack n'a pas ce retard. Voir les [Compromis](/docs/trade-offs).

:::note{tone="warn"}
Il est recommandé de limiter les commandes sur un gros serveur. Le support existe et coûte vanilla, mais tout ce qui tourne sur le thread serveur ne profite pas des cœurs supplémentaires.
:::
