---
title: Méthodologie
lead: Comment on travaille sur Leafs. Ces règles ont fait leurs preuves, on ne les contourne pas.
---

## La règle absolue

Leafs fait ce que vanilla fait, mais en multithread. Quand une règle à nous double une règle vanilla, on retire la nôtre. Les mods ne voient pas Leafs : ils appellent les mêmes fonctions que d'habitude, et ces fonctions font la même chose qu'avant. Il vaut mieux retirer de la logique pour se rapprocher de vanilla que d'en rajouter.

L'expérience de développement des moddeurs passe avant les optimisations. On préfère sacrifier une optimisation et permettre aux mods de marcher parfaitement. Leur dire que ce qu'ils font fonctionnera, mais différemment, n'est pas une option non plus.

Quand on parle de mods, ce sont les gros : Mekanism, Applied Energistics, Create, Ars Nouveau. Des mods qui intègrent des mécaniques inconnues de vanilla, magie, pollution, machines, énergie.

## Penser aux mods dans chaque décision

Si on a un souci sur les points d'intérêt, on ne corrige pas seulement le raid ou le dragon. On prend en compte les mods qui ont leurs propres points d'intérêt. On considère toujours les portails, blocs, entités, structures customs, et des concepts qui n'existent pas en vanilla.

## Corriger un bug

Le cycle est toujours le même. On détecte, on reproduit dans un seul test unitaire qui doit être rouge, on corrige, le test passe au vert, on valide en jeu. Un fix sans reproduction n'a aucune valeur.

Quand un crash vient d'une région, on a l'id, la dimension, le tick et la pile. On lit la pile en entier avant de toucher au code. La cause racine est rarement la première ligne.

## Écrire du code

La logique vit dans nos modules, les mixins ne sont que des accroches, écrites pour la compatibilité entre mods : injection ciblée ou wrap qui se compose avec les mixins des autres. Pas de fonction à usage unique, pas de code mort, pas de code commenté, pas de duplication de source de vérité. Les primitives de concurrence restent dans nos classes. On évite les casts non vérifiés par l'architecture plutôt que par l'annotation.

Un commentaire fait une phrase, deux au maximum quand il y a une trace de bug à garder. Il dit ce que le code ne peut pas dire : une contrainte, un pourquoi. Jamais une paraphrase du code.

On pense long terme. Pas de fix rapide qui devient une dette, pas de cas par cas quand un point de passage unique traite toute la classe du problème. Si une correction propre demande de repenser un morceau d'architecture, on le fait.

## Tester

- Les tests unitaires, `gradlew test`, tournent avec le vrai Minecraft bootstrappé quand il le faut.
- La validation en jeu suit : connexion, déconnexion, casser et poser, coffres, four, chat, commande, mort et respawn, portail aller retour.
- La charge se teste avec des bots en montée progressive, et spark en `--thread *`, sans quoi on ne voit que le thread serveur.
