---
title: Compatibilité des mods
lead: Les mods ne s'adaptent pas à Leafs. C'est Leafs qui s'adapte aux mods. C'est la règle qui passe avant toutes les autres.
---

## Les primitives

Les primitives sont les méthodes les plus basses et les plus utilisées du code de Minecraft, celles où passe le plus de trafic : lire et écrire un bloc, charger un chunk, téléporter une entité, envoyer un paquet. Leafs modifie ces primitives, et seulement elles. Les mods les utilisent sans le savoir et sont donc automatiquement compatibles.

Chaque changement d'une fonction interne de Mojang a été pensé pour rester identique en pratique. Un mod qui lit un bloc à l'autre bout du monde le lit. Un mod qui pose un bloc chez lui le voit posé. Un mod qui téléporte une entité la retrouve à destination.

:::note{tone="warn"}
Leafs ne doit en aucun cas créer de bugs ou de problèmes dans un mod. Si c'est le cas, c'est un bug de Leafs : ouvrez un ticket.
:::

## Ce qui est connu

- Compatibles : Lithium, Ferrite, Mapple.
- Incompatibles : C2ME, VMP, Moonrise. Ils réécrivent le même moteur de chunks.

## Les évènements Fabric

Les mods qui font leur travail une fois par tick via la Fabric API tournent toujours vingt fois par seconde, sur le thread serveur. Quand un abonné touche un chunk ou une entité, le thread serveur emprunte sa région au contact. Un mod qui ne touche à rien n'arrête personne.

Le monde autour n'a pas forcément avancé d'un tick entre deux appels. Une région à 10 TPS a fait un tick sur deux. Un mod qui suppose que tout le monde a tické exactement une fois depuis son dernier appel peut se tromper. C'est le [compromis 6](/docs/trade-offs).

## Mapple

Leafs ne rajoute aucune optimisation, ni CPU, ni RAM, ni ramasse-miettes. Toute optimisation vit dans Mapple, un mod indépendant qui fonctionne avec ou sans Leafs, sans config et sans compromis, mais pensé pour tirer le meilleur du multithreading de Leafs.

## Debug et métriques

Leafs crée les métriques et fournit `/leafs` pour les lire. `Leafs Debug and Metrics` est un mod additionnel, indépendant, qui affiche ces données côté client dans F3 et permet l'analyse de la RAM.

## Dans le code

`FabricTickEvents` encadre `START_SERVER_TICK` et `END_SERVER_TICK` d'un emprunt, seulement quand l'évènement a des abonnés, ce que `FabricEventAccess` révèle. `ServerTickEventsShim` pose l'accroche autour des appels vanilla qui entourent chaque émission. Ces emprunts sont comptés et visibles dans `/leafs metrics`.

`SharedStateMonitor` sérialise l'état global du serveur, scoreboard, saved data, cartes, séquences aléatoires, entre les workers et le thread serveur. `LockedRandomSource` protège une séquence partagée sur le même moniteur que sa sauvegarde. `ConcurrentWaypointManager` est le gestionnaire de la locator bar sans son verrou, une ligne par récepteur, et il ne parcourt rien quand la règle `locator_bar` est éteinte.

Dans `fabric.mod.json`, `breaks` déclare C2ME, Moonrise et VMP, et `lithium:options` éteint les mixins de Lithium qui toucheraient au moteur de chunks, aux palettes et aux ticks aléatoires. Quand une région crashe, `ModAttribution` retrouve le mod d'une trame de pile pour la ligne du mod suspect du rapport.
