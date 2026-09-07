---
title: La sauvegarde
lead: L'autosave est fait par les régions, chacune la sienne. Un flush ou l'arrêt fige tout, comme en vanilla.
---

## Deux chemins

- La commande `/save-all flush` et l'arrêt du serveur. Le thread serveur fige toutes les régions le temps de la sauvegarde, comme vanilla fige le serveur.
- L'autosave périodique. Il est fait par les régions, chacune pour ses chunks et ses joueurs, dans une tranche de son tick.

## Le chunk part en octets

Un chunk arrive au thread disque déjà encodé. Le thread qui sauvegarde copie l'état du chunk, un worker de chunks l'encode et le compresse, et le thread disque de vanilla n'écrit plus que des octets dans le fichier de région. Un lecteur qui demande un chunk en route vers le disque est servi depuis la copie, sans attendre.

Au premier démarrage, Leafs met `sync-chunk-writes` à `false` dans `server.properties`. L'admin peut le remettre à `true`, Leafs n'y touche plus ensuite.

## Dans le code

`LevelRegions` porte une époque d'autosave par dimension. Quand le thread serveur déclenche l'autosave, il incrémente l'époque. `RegionAutosave` fait ensuite, à chaque tick de région et dans une tranche d'au plus un dixième de la période : les sauvegardes urgentes de vanilla sur la part de la région, chaque joueur en retard sur l'époque, puis la marche sur les holders de la région, qui s'arrête à l'échéance et reprend au tick suivant.

Une fusion remet l'époque sauvée de la région à zéro, pour que les chunks arrivés soient parcourus à nouveau. `ChunkSaves` fixe `CHUNKS_PER_TICK` à 20 pour les passes à budget. Les chunks sans région sont sauvegardés par `UnownedSweep`, une passe par tick de dimension, sur le pool.

`ChunkWrites` photographie et compresse sur le pool, `CompressedChunk` reproduit le format du fichier de région, et `PendingWrite` sert les lecteurs depuis la photo puis depuis les octets. Une photo plus récente remplace celle qui attend encore. Le flush passe par `CommandEngine.runBorrowingAll`, une tête qui prend toutes les régions puis exécute le corps vanilla.
