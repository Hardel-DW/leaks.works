---
title: Courrier et emprunt
lead: Deux concepts, et seulement deux, pour que des threads se parlent. Une boîte aux lettres par région, et l'emprunt d'une région par le thread serveur.
---

Une règle avant tout : le thread serveur ne touche jamais une région sans l'emprunter. Commandes, évènements Fabric, arrivée et départ d'un joueur, tout passe par là.

## Le courrier

Chaque région a une boîte aux lettres. Ce que les autres régions veulent faire chez elle attend dedans, et elle le fait à la fin de son tick, dans l'ordre d'arrivée. La boîte a deux files :

- Le travail de chunk. Publier un chunk généré, le démonter, le sauvegarder. Ça n'attend jamais.
- Le travail de jeu. Poser un bloc, téléporter, respawn. Ça peut avoir besoin d'un chunk pas encore chargé, donc ça peut attendre.

Une région sert sa boîte dans ce que la période lui laisse, et au moins un dixième de la période. Un tick lourd publie encore, un tick léger publie tout, le reste attend la passe suivante dans l'ordre.

## L'emprunt

L'emprunt sert surtout aux commandes. Le thread serveur vise une entité ou un chunk, et cela emprunte leur région. Il fait alors le travail lui-même, dans le même ordre que vanilla, et rend tout à la fin.

Une région empruntée ne tick pas pendant ce temps, comme si le thread serveur la tickait lui-même. C'est court : une connexion prend moins d'une milliseconde.