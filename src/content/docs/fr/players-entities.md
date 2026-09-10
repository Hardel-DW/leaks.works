---
title: Joueurs et entités
lead: Un joueur tick sur sa région. Ses paquets suivent son entité. Une entité qui traverse une frontière change simplement de photo.
---

## Connexion et déconnexion

Le thread serveur gère l'arrivée et le départ d'un joueur. Il emprunte la région du joueur le temps de l'opération, moins d'une milliseconde. Les autres régions ne voient rien, aucun joueur ne ressent de différence, même sur une vague de cent connexions.

Le respawn part de la région du joueur vers la région de son point de réapparition, ou vers le thread serveur si aucune région ne couvre ce point.

## Les paquets

Voici les règles relatives au fonctionnement des paquets :
- Les paquets d'un joueur sont traités par sa région au début de son tick.
- Un joueur est tenu par un seul thread à la fois.
- Une région qui trouve un joueur tenu par un autre thread le saute et le reprend au tick suivant.
- Quand aucune région ne tick le joueur, le thread serveur lit sa file lui-même.

## Les entités qui traversent des régions

Les règles relatives au fonctionnement des entités :
- Aucune entité n'est envoyée entre les threads. Au début de chaque tick la région prend une photo des entités de ses chunks et les tick. Une TNT qui traverse la frontière change simplement de section de chunk, et au tick suivant l'autre région la voit dans sa photo. Cent ou mille TNT coûtent la même chose qu'en vanilla.
- Pour les téléportations et les portails, la région d'origine fait le travail, puis envoie un courrier à la région cible qui place l'entité.
- Une entité qui sort de toute zone simulée gèle, comme dans le jeu d'origine au-delà de la simulation distance. L'ender pearl est l'exception du jeu d'origine : elle agrandit la région ou en crée une, comme un joueur.

:::note
Les régions sont toujours séparées par au moins une section non simulée au-delà de la couronne. Une entité qui sort d'une région gèle dans cette zone comme dans le jeu d'origine.
:::