import type { DocPage } from "@/content/docs/types";

export default {
    title: "Les threads",
    lead: "Trois familles de threads se partagent le travail : le thread serveur vanilla, les workers de régions et les workers de chunks.",
    blocks: [
        { h2: "Le thread serveur existe toujours" },
        {
            p: "Les régions tickent en même temps que lui. Il fait une fois par tick ce qui est global par nature : l'heure du monde, la météo, la bordure, la liste des joueurs et le déclencheur d'autosave. Il exécute aussi toutes les commandes. Son coût est fixe et minime, il ne dépend ni du nombre de chunks ni du nombre d'entités."
        },
        { demo: "clocks" },
        { h2: "Les workers de régions" },
        {
            p: "Une région n'est pas un thread. Une région est une tâche. Les régions attendent dans une seule liste, triée par le moment de leur prochain tick. Un worker libre prend la première et la tick. Un worker occupé par une grosse région ne bloque personne, les autres prennent la suite."
        },
        {
            p: "Les TPS en vanilla sont globaux. Sur Leafs ils sont par région. Si une région est plus lourde, son TPS baisse, et cela n'affecte pas les autres régions qui gardent leur TPS au maximum."
        },
        { demo: "pool" },
        { h3: "Deux horloges" },
        {
            ul: [
                "L'heure de la journée reste globale, gérée par le thread serveur. La météo et le soleil avancent à la même vitesse pour tout le monde, peu importe le TPS de votre région.",
                "Tout ce qui mesure une durée relative, la cuisson d'un four, les entités, la redstone, suit l'horloge de la région. Un four ne cuira pas à la même vitesse dans deux régions à des TPS différents."
            ]
        },
        { h3: "Une région n'attend jamais" },
        {
            p: "Une région n'attend jamais un autre thread. Elle attend seulement le pool pour un chunk, parce que le pool n'attend jamais rien en retour. Un joueur, ou une entité, est tenu par un seul thread à la fois. Une région qui trouve un joueur tenu par un autre thread le saute et le reprend au tick suivant."
        },
        { h2: "Les workers de chunks" },
        {
            p: "Les workers de chunks sont indépendants des workers de régions. Ils génèrent, éclairent, chargent et déchargent les chunks, et préparent les octets à écrire sur le disque. Le thread disque de vanilla ne fait plus que lire et écrire ces octets."
        },
        {
            p: "Ces workers tournent à la priorité système la plus basse. Quand la machine n'a plus assez de ressources, les ticks de régions passent devant, parce qu'eux ont une échéance de 50 ms à tenir. Les chunks prennent le reste."
        },
        {
            ul: [
                "Un joueur qui explore ne fait plus laguer les autres joueurs, même ceux de sa propre région.",
                "Une zone très dense, avec un TPS bas, n'affecte pas la vitesse de génération du monde. Un joueur qui s'en éloigne continue d'avancer fluidement.",
                "Quand un thread a besoin d'un chunk pas encore là, il le demande au pool, qui le fait passer devant tout le reste, et il attend. Le chunk reçu reste chargé jusqu'à la fin du tick ou de la commande, comme en vanilla."
            ]
        },
        { h2: "L'ordre du thread serveur" },
        { p: "À chaque tick, le thread serveur fait dans l'ordre :" },
        {
            ol: [
                "Le `tick.json` des datapacks.",
                "La mise à jour de l'heure du monde.",
                "Pour chaque dimension : l'heure, la météo, la bordure, les tickets et la vue des joueurs, les déchargements, les spawns spéciaux comme les phantoms ou le marchand ambulant, puis une seule demande aux workers de chunks pour leur passe sur les chunks sans région. Les raids et le combat du dragon tickent sur la région qui possède leur centre.",
                "Ce qui est redirigé vers le thread serveur : command blocks, respawn, commandes du chat.",
                "Le réseau de chaque connexion. Le transport seulement, le tick du joueur tourne sur sa région.",
                "La liste des joueurs.",
                "L'horloge de l'autosave. Ce sont ensuite les régions et les workers de chunks qui sauvegardent.",
                "Debug et monitoring."
            ]
        },
        {
            p: "Les points 2, 7 et 8 sont des coûts fixes, identiques quel que soit le serveur. Les points 5 et 6 varient avec le nombre de joueurs, mais si peu que d'un serveur à l'autre le coût est pratiquement identique. Les points 1 et 4 sont liés aux commandes, donc évitables. Le point 3 a une quinzaine d'étapes, une bonne partie à zéro parce que déplacées sur les régions."
        },
        { h2: "Dans le code" },
        { h3: "Le scheduler des régions" },
        {
            p: "`RegionTickScheduler` tient une `DelayQueue` de tâches ordonnée par leur prochain départ. Chaque worker, un thread `Leafs Region Worker #N`, prend la tâche la plus proche de son échéance. La période est `TICK_PERIOD_NANOS`, 50 ms, et suit `ServerTickRateManager` quand la tick rate change. Après un tick, le prochain départ est le maximum entre maintenant et le départ précédent plus la période : une région en retard repart de maintenant, elle ne rattrape jamais."
        },
        {
            p: "`RegionTickHandle` est la tâche d'une région. Elle commence par `tryMarkTicking()`. Si ça échoue, parce qu'une fusion est en attente, la passe est simplement sautée. Elle finit par `markNotTicking()`, l'endroit où fusions, scissions et récupérations de sections ont leur chance."
        },
        {
            p: "`LevelTickUnit` est le reste vanilla du tick d'une dimension. Il tourne en ligne sur le thread serveur, jamais en file, donc son retard reste à zéro. `RegionClock` est le compteur d'une région, avancé une fois par passe. Le TPS d'une région se mesure sur une fenêtre de 5 secondes dans `StageTimings`."
        },
        { h3: "Le tick d'une région" },
        { p: "`RegionTickBody.tick` enchaîne les étapes, chacune mesurée sous `leafs:region/<étape>` :" },
        {
            ol: [
                "`tickets`. Le décompte des tickets à durée des sections de la région, puis la photo des chunks.",
                "`packets`. La photo des entités, puis les paquets en attente de chaque joueur.",
                "`block_ticks`, `fluid_ticks`, `spawn_census`, `chunk_tick`. Les ticks programmés, le recensement des mobs et le tick de chaque chunk : orage, ticks aléatoires, spawn naturel.",
                "`broadcast`. L'envoi des blocs changés aux clients.",
                "`tracking`. Quelles entités chaque joueur voit.",
                "`block_events`. Pistons et notes de musique, dans l'ordre vanilla.",
                "`entities`, `block_entities`. Le tick des entités et des block entities, plus les ancres comme les raids.",
                "`players`. Le tick du listener de chaque joueur et l'envoi de ses chunks.",
                "`autosave`. La part de l'autosave de ce tick, au plus un dixième de la période.",
                "`tasks`. La boîte aux lettres, dans ce que la période laisse et au moins un dixième."
            ]
        },
        { h3: "Le pool de chunks" },
        {
            p: "`ChunkPool` a une file par niveau de priorité, la priorité 0 en premier. Ses threads `Leafs Chunk Worker #N` passent en `Thread.MIN_PRIORITY`, et sous Linux `NativeThreadPriority` pose un nice de 19 par un appel natif, parce que Linux ignore la priorité Java. Une tâche réserve les chunks qu'elle écrit, `Reservations`. Une tâche qui ne peut pas réserver se range derrière celle qui la bloque et repart quand elle se libère : personne n'attend."
        },
        {
            p: "`PlacedTasks` indexe les tâches en file par chunk. Quand un joueur change de chunk, le pool recalcule la priorité des tâches concernées. Ce qu'un thread attend passe en première file, c'est `expedite`."
        },
        { p: "Le nombre de workers vient de `region_threads` et `chunk_threads`. Par défaut, tous les coeurs pour les régions et la moitié pour les chunks." }
    ]
} satisfies DocPage;
