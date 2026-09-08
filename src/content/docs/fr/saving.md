---
title: La sauvegarde
lead: L'autosave est fait par les régions, chacune la sienne. Un flush ou l'arrêt fige tout, comme en vanilla.
---

## Deux chemins

- La commande `/save-all flush` et l'arrêt du serveur. Le thread serveur fige toutes les régions le temps de la sauvegarde, comme vanilla fige le serveur.
- L'autosave périodique. Il est fait par les régions, chacune pour ses chunks et ses joueurs, dans une tranche de son tick.

## Le chunk part en octets

Un chunk arrive au thread disque déjà encodé. Le thread qui sauvegarde copie l'état du chunk, un thread de chunks l'encode et le compresse, et le thread disque de vanilla n'écrit plus que des octets dans le fichier de région. Un lecteur qui demande un chunk en route vers le disque est servi depuis la copie, sans attendre.

Au premier démarrage, Leafs met `sync-chunk-writes` à `false` dans `server.properties`. L'admin peut le remettre à `true`, Leafs n'y touche plus ensuite.