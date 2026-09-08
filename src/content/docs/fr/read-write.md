---
title: Lecture et écriture
lead: Chaque chunk a un propriétaire, le seul qui a le droit d'écrire. Lire reste libre pour tout le monde, partout, tout le temps.
---

## Le propriétaire d'un chunk

Minecraft est fait de chunks de 16x16 blocs. Une région est un groupe de chunks qui tickent ensemble. Chaque chunk a un propriétaire, et c'est le seul qui a le droit d'y écrire.

- Si une région simule le chunk, la région est le propriétaire.
- Sinon personne ne l'est. Le premier thread qui veut y écrire le prend le temps de son écriture, puis le rend.
- N'importe quel thread lit n'importe quel chunk, à n'importe quel moment. Un mod qui regarde un bloc à l'autre bout du monde le lit directement.

## Écrire un bloc

Trois cas, et seulement trois.

1. Le bloc est chez toi, dans un chunk de ta région. Tu l'écris tout de suite, comme en vanilla.
2. Le bloc est dans un chunk sans région, une dimension vide, une zone sans joueur. Tu prends le chunk, tu écris, tu relis ton bloc, comme en vanilla.
3. Le bloc est dans un chunk qu'une autre région est en train de ticker. Tu ne peux pas y toucher pendant son tick. Tu lui envoies un courrier, et elle pose le bloc à son prochain tick. Si tu relis le bloc tout de suite, tu vois encore l'ancien.

:::note{tone="warn"}
Le troisième cas est le [compromis 4](/docs/trade-offs). Il ne se produit que quand on écrit chez un autre joueur pendant qu'il y est.
:::