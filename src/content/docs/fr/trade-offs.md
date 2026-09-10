---
title: Les compromis
lead: Chaque écart volontaire avec vanilla est listé ici, avec son explication. S'il est là, c'est qu'on n'a pas eu le choix.
---

## Compromis
1. Chaque région a son propre aléatoire. Aucun effet visible en jeu théoriquement et indirectement limite la triche.
2. Toutes les commandes s'exécutent sur le thread serveur, qui emprunte les régions qu'elles touchent.
3. Écrire un bloc là où une autre région est en train de faire son tick aura 1 tick de retard. Le bloc est bien posé, mais le relire retournera l'ancien bloc.
4. Les téléportations et les portails arrivent au plus tard au tick suivant de la région cible.
5. Les mods qui utilisent `END_SERVER_TICK` via la Fabric API s'exécutent toujours sur le thread serveur. Quand cela touche un chunk ou une entité, le thread serveur emprunte sa région. Comme les régions ne tournent pas forcément à 20 TPS, vous ne pouvez pas vérifier que le tick d'avant s'est parfaitement exécuté, il faut développer d'une manière impérative.
6. Un command block, ou un minecart à command block, déclenché par la redstone s'exécute un tick plus tard qu'en vanilla. La redstone tourne sur la région et la commande sur le thread serveur. Une commande tapée dans le chat ou lancée par un datapack n'a pas ce retard.