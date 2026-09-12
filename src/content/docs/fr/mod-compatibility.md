---
title: Compatibilité des mods
lead: Les mods ne s'adaptent pas à Leafs. C'est Leafs qui s'adapte aux mods. C'est la règle qui passe avant toutes les autres.
---

## Les primitives

Les **primitives** comme j'aime les appeler sont les méthodes les plus utilisées du code de Minecraft, celles où passe le plus de trafic, lire et écrire un bloc, récupérer les données d'un chunk, téléporter une entité, envoyer un paquet. Leafs modifie ces primitives pour faire fonctionner les régions. Les mods les utilisent sans le savoir et sont donc automatiquement compatibles.

En pratique, pour les développeurs l'utilisation de ces méthodes est identique, Leafs se contente de `wrap` ces méthodes avec un mixin. Ce qui permet la compatibilité des mixins tiers.

:::note{tone="warn"}
Leafs ne doit en aucun cas créer de bugs ou de problèmes dans un mod. Si c'est le cas, c'est un bug de Leafs : ouvrez un ticket.
:::

## Ce qui est connu

- Compatibles : Lithium, Ferrite, Mapple.
- Incompatibles : C2ME, VMP, Moonrise. Ils réécrivent le même moteur de chunks.

## Mods testés

**Tous les mods client sont compatibles**, car Leafs tourne côté serveur.

La liste des mods testés est sur la page [Compatibilité](/compatibility), avec une recherche.

Les mods du tableau ont été testés, pas à 100 % car ils restent massifs pour certains. Leafs n'a fait aucune modification ni correctif spécifique pour eux, ils fonctionnent tels quels. Je n'ai pas encore eu le temps de tester davantage.

Un mod qui est absent de cette liste n'est pas incompatible. Il est sûrement compatible, je n'ai juste pas eu le temps de tout tester. La liste s'allonge au fil du temps. Idéalement je voudrais tester tous les mods qui composent ATM 11 et un peu plus.

## All The Mods 11

All The Mods 11 démarre, mais ne fonctionne pas encore. Je ne sais pas pour l'instant quel mod crée le problème.

## Les évènements Fabric

Les mods qui utilisent `END_SERVER_TICK` via la Fabric API s'exécutent toujours sur le thread serveur. Quand cela touche un chunk ou une entité, le thread serveur emprunte sa région.
Comme les mcfunctions, cet évènement est à éviter, il impacte globalement les performances du serveur, et ne peut pas être parallélisé.

De plus `END_SERVER_TICK` a un souci, la région n'a pas forcément avancé d'un tick entre deux appels. Une région à 10 TPS a fait un tick sur deux. Un mod qui suppose que tout le monde a tické exactement une fois depuis son dernier appel peut se tromper.

## Mapple

Leafs ne rajoute aucune optimisation CPU, RAM ou GC. Ces optimisations vivent dans Mapple, un mod indépendant qui fonctionne avec ou sans Leafs, sans config et sans compromis, mais pensé pour tirer le meilleur du multithreading de Leafs.