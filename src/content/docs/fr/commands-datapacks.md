---
title: Commandes et datapacks
lead: Toutes les commandes tournent sur le thread serveur, peu importe qui les lance. Une commande coûte exactement le même coût qu'elle a en vanilla.
---

## Une commande emprunte ce qu'elle touche

Le thread serveur emprunte une région au moment où la commande touche un de ses chunks ou une de ses entités, la garde jusqu'à la fin de la commande, puis la rend. Ce que la commande touche décide de ce qu'elle emprunte :

- Un `/say` n'emprunte rien.
- Un `/give @a` emprunte les régions où il y a des joueurs.
- Un `/setblock` emprunte la région du chunk visé, et charge le chunk avant si besoin. Ce chargement bloque le thread serveur, comme en vanilla.
- Un `/kill @e` emprunte toutes les régions, parce que c'est ce que la commande veut dire.

Un datapack coûte donc exactement ce qu'il coûte en vanilla. Un datapack lourd qui vit dans `tick.json` reste sur un seul thread et ne profite pas du multithreading. Il ralentit le thread serveur et les régions qu'il emprunte pendant ses commandes, pas les autres.

## Les command blocks

Un command block, ou un minecart à command block, déclenché par la redstone s'exécute un tick plus tard qu'en vanilla. La redstone tourne sur la région et la commande sur le thread serveur, et le passage de l'un à l'autre attend le tick suivant. Une commande tapée dans le chat ou lancée par un datapack n'a pas ce retard. Voir les [Compromis](/docs/trade-offs).

:::note{tone="warn"}
Il est recommandé de limiter les commandes sur un gros serveur. Le support existe et coûte vanilla, mais tout ce qui tourne sur le thread serveur ne profite pas des cœurs supplémentaires.
:::