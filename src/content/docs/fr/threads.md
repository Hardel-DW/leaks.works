---
title: Les threads
lead: Trois familles de threads se partagent le travail : le thread serveur vanilla, les threads de régions et les threads de chunks.
---

## Le thread serveur existe toujours

Les régions tickent en même temps que lui. Il fait une fois par tick ce qui est global par nature : l'heure du monde, la météo, la bordure, la liste des joueurs et le déclencheur d'autosave. Il exécute aussi toutes les commandes. Son coût est fixe et minime, il ne dépend ni du nombre de chunks ni du nombre d'entités.

::clocks

## Les threads de régions

Une région n'est pas un thread. Une région est une tâche. Les régions attendent dans une seule liste, les régions sont ensuite dispersées de manière à prendre le thread qui a le moins de charge. Cela veut donc dire qu'un thread occupé par une grosse région ne bloque personne, les autres prennent la suite.

Les TPS en vanilla sont globaux. Sur Leafs ils sont par région. Si une région est plus lourde, son TPS baisse, et cela n'affecte pas les autres régions qui gardent leur TPS au maximum.

::pool

### Deux horloges

- L'heure de la journée reste globale, gérée par le thread serveur. La météo et le soleil avancent à la même vitesse pour tout le monde, peu importe le TPS de votre région.
- Tout ce qui mesure une durée relative, la cuisson d'un four, les entités, la redstone, suit l'horloge de la région. Un four ne cuira pas à la même vitesse dans deux régions à des TPS différents.

### Une région n'attend jamais

Une commande tapée dans la console, par exemple un `/tp` sur un joueur, tourne sur le thread serveur. Pour toucher ce joueur, le thread serveur attend que sa région finisse le tick en cours, puis il tient le joueur le temps de la commande. Si la région repart pendant que la commande tourne encore, elle ne se met pas en pause. Elle saute ce joueur pour ce tick et le reprend au tick suivant.

La règle est la même pour tout le monde. Un joueur ou une entité est tenu par un seul thread à la fois, et c'est toujours le thread serveur qui attend, jamais une région. Une région qui attendrait un autre thread verrait son TPS baisser à cause de lui, ce qui est justement ce que Leafs évite.

La seule chose qu'une région peut attendre est un chunk. Quand elle a besoin d'un chunk pas encore chargé, elle le demande aux threads de chunks et attend qu'il arrive.

Cette attente ne peut pas la coincer dans un blocage mutuel où deux threads ont besoin l'un de l'autre et se figent pour toujours (`deadlock`), parce que les threads de chunks ne demandent jamais rien aux régions en retour.

## Les threads de chunks

Les threads de chunks sont indépendants des threads de régions. Ils génèrent, éclairent, chargent et déchargent les chunks, et préparent les octets à écrire sur le disque. Le thread disque de vanilla ne fait plus que lire et écrire ces octets.

Ces threads tournent à la priorité système la plus basse. Quand la machine n'a plus assez de ressources, les ticks de régions passent devant, parce qu'eux ont une échéance de 50 ms à tenir. Les chunks prennent le reste des ressources de la machine.

- Un joueur qui explore ne fait plus laguer les autres joueurs, même ceux de sa propre région.
- Une zone très dense, avec un TPS bas, n'affecte pas la vitesse de génération du monde. Un joueur qui s'en éloigne continue d'avancer fluidement.
- Quand un thread a besoin d'un chunk pas encore là, il le demande au pool, qui le fait passer devant tout le reste, et il attend. Le chunk reçu reste chargé jusqu'à la fin du tick ou de la commande, comme en vanilla.


## L'ordre du thread serveur

À chaque tick, le thread serveur fait dans l'ordre :

1. Le `tick.json` des datapacks.
2. La mise à jour de l'heure du monde.
3. Pour chaque dimension : l'heure, la météo, la bordure, les tickets et la vue des joueurs, les déchargements, les spawns spéciaux comme les phantoms ou le marchand ambulant, puis une seule demande aux threads de chunks pour leur passe sur les chunks sans région. Les raids et le combat du dragon tickent sur la région qui possède leur centre.
4. Ce qui est redirigé vers le thread serveur : command blocks, respawn, commandes du chat.
5. Le réseau de chaque connexion. Le transport seulement, le tick du joueur tourne sur sa région.
6. La liste des joueurs.
7. L'horloge de l'autosave. Ce sont ensuite les régions et les threads de chunks qui sauvegardent.
8. Debug et monitoring.

**Note :**
- Les points 2, 7 et 8 sont des coûts fixes, identiques quel que soit le serveur.
- Les points 5 et 6 varient avec le nombre de joueurs, mais si peu que d'un serveur à l'autre le coût est pratiquement identique. 
- Les points 1 et 4 sont liés aux commandes, donc évitables. 
- Le point 3 a une quinzaine d'étapes, une bonne partie à zéro parce que déplacées sur les régions.