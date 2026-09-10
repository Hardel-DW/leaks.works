---
title: Méthodologie
lead: Comment Leafs a été pensé. Ces règles ont fait leurs preuves.
---

## La règle absolue

Leafs fait ce que vanilla fait, mais en multithread. Les mods ne voient pas Leafs, ils appellent les mêmes fonctions que d'habitude, et ces fonctions doivent faire la même chose qu'avant.

L'expérience de développement des moddeurs passe avant les optimisations. Leur dire que ce qu'ils font fonctionnera, mais différemment, n'est pas une option.

Leafs vise les petits mods de **quality of life**, comme les gros mods comme `Mekanism`, `Applied Energistics`, `Create`, `Ars Nouveau`. Des mods qui intègrent des mécaniques qui n'existent pas dans le jeu d'origine comme de la magie, de la pollution, des machines, de l'énergie, des sphères de Dyson.

## Penser aux mods dans chaque décision

Lors du développement, quand un concept était touché comme par exemple les points d'intérêt `POI`, les raids ou le dragon, j'ai essayé de le mettre au niveau du noyau pour que les mods qui ont leurs `POI` soient compatibles.
Ce schéma a été appliqué à tous les concepts touchés.

## Corriger un bug

Le cycle est toujours le même. On détecte, on reproduit en jeu ou dans un seul test unitaire qui doit être rouge, on corrige, le test ainsi que tous les autres tests du projet doivent être au vert, on valide en headless, on lance le benchmark pour voir les possibles dégradations, puis un test en conditions réelles. Un fix sans reproduction n'a aucune valeur.

Quand un crash vient d'une région, on a l'id, la dimension, le tick et la pile. On lit la pile en entier avant de toucher au code. La cause racine est rarement la première ligne.

## Tester

- Les tests unitaires, `gradlew test`, tournent avec le vrai Minecraft bootstrappé quand il le faut.
- La validation en jeu suit : connexion, déconnexion, casser et poser, en fonction du bug bien entendu.
- La charge se teste avec des bots en montée progressive, et spark en `--thread *`, sans quoi on ne voit que le thread serveur.