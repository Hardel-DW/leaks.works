---
title: Joueurs et entités
lead: Un joueur tick sur sa région. Ses paquets suivent son entité. Une entité qui traverse une frontière change simplement de photo.
---

## Connexion et déconnexion

Le thread serveur gère l'arrivée et le départ d'un joueur. Il emprunte la région du joueur le temps de l'opération, moins d'une milliseconde. Les autres régions ne voient rien, aucun joueur ne ressent de différence, même sur une vague de cent connexions.

Le respawn part de la région du joueur vers la région de son point de réapparition, ou vers le thread serveur si aucune région ne couvre ce point.

## Les paquets

La file de paquets d'un joueur suit son entité. Sa région les traite au début de son tick, puis fait le tick du joueur à la fin. Un joueur est tenu par un seul thread à la fois. Une région qui trouve un joueur tenu par un autre thread le saute et le reprend au tick suivant, elle n'attend jamais. Quand aucune région ne tick le joueur, mort ou sans ticket, le thread serveur lit sa file lui-même.

## Les entités qui traversent

Aucune entité n'est envoyée entre les threads. Une région ne possède pas ses entités. Au début de chaque tick elle prend une photo des entités de ses chunks et tick celles-là. Une TNT qui traverse la frontière change simplement de section de chunk, comme en vanilla, et au tick suivant l'autre région la voit dans sa photo. Cent ou mille TNT coûtent la même chose qu'en vanilla.

Pour les téléportations et les portails, la région d'origine fait le travail, puis envoie un courrier à la région cible qui place l'entité. Une entité qui sort de toute zone simulée gèle, comme dans le jeu d'origine au-delà de la simulation distance. L'ender pearl est l'exception du jeu d'origine : elle agrandit la région ou en crée une, comme un joueur.

:::note
Les régions sont toujours séparées par au moins une section non simulée au-delà de la couronne. Une entité qui sort d'une région gèle dans cette zone. Si les joueurs sont assez proches, leurs régions fusionnent et il n'y a plus de zone gelée entre eux.
:::