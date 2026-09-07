import type { DocPage } from "@/content/docs/types";

export default {
    title: "Carte du code",
    lead: "Un dossier est une responsabilité, une brique indépendante. Le code vit dans `src/main/java/fr/hardel/leafs/`.",
    blocks: [
        { h2: "Les dossiers" },
        {
            table: {
                head: ["Dossier", "Responsabilité"],
                rows: [
                    [
                        "`region/`",
                        "Découpe le monde en sections et en régions, avec la fusion et la scission, sans aucune dépendance Minecraft. `Regionizer`, `Region`, `RegionSection`, `RegionState`."
                    ],
                    [
                        "`ticking/`",
                        "Le scheduler des régions, l'horloge de région, l'emprunt, le crash report par région, le watchdog. `RegionTickScheduler`, `RegionBorrow`, `LevelRegions`, `TickingManager`."
                    ],
                    ["`scheduler/`", "La file du thread serveur et le travail différé vers le propriétaire d'un chunk. `GlobalScheduler`, `DeferredWork`."],
                    [
                        "`world/`",
                        "Le tick d'une région : ce qu'un chunk tick lui-même, les ticks programmés, les block events, les block entities, et le peu qu'une région garde entre deux ticks. `RegionTickBody`, `RegionWorldData`, `RegionAutosave`."
                    ],
                    ["`chunk/`", "Le moteur de chunks, détaillé plus bas."],
                    ["`entity/`", "La photo des entités qu'une région tick, les téléportations et la persistance. `RegionEntities`, `EntityTeleports`."],
                    ["`network/`", "Les files de paquets par joueur, le routage, le tick réseau par région, la connexion. `PlayerPacketQueue`, `PacketRouting`, `RegionNetworkTick`."],
                    [
                        "`global/`",
                        "Le moteur des commandes, le moniteur d'état partagé, l'emprunt pendant les évènements Fabric, la locator bar, l'aléatoire. `CommandEngine`, `SharedStateMonitor`, `FabricTickEvents`."
                    ],
                    ["`metrics/`", "La télémétrie et le registre `leafs:tick_stage`. `TickStages`, `StageTimings`, `ServerMetrics`."],
                    ["`debug/`", "La commande `/leafs`, une classe par sous-commande."],
                    ["`mixin/`", "Les accroches dans Minecraft, dans la Fabric API sous `compat/` et dans ScalableLux sous `light/`. Les mixins ne portent pas de logique."]
                ]
            }
        },
        {
            p: "Le dossier `excess/`, à côté du mod, donne des classes utilitaires sans lien avec Minecraft : des maps et des ensembles concurrents sur clés primitives, `ConcurrentLong2ObjectMap`, `ConcurrentOrderedLongSet`, `CopyOnWriteListMap`, et `LongSpread`, un mélange bijectif des clés longues avant une `ConcurrentHashMap`."
        },
        { h2: "Le moteur de chunks" },
        {
            table: {
                head: ["Dossier", "Responsabilité"],
                rows: [
                    ["`pool/`", "Le pool de threads de chunks. `ChunkPool`, `ChunkTask` et sa place, `PlacedTasks`, `Reservations`, `PriorityBuckets`, `Urgency`, `NativeThreadPriority`."],
                    ["`ticket/`", "Les trois graphes de tickets, joueurs, simulation, chargement. `TicketGraphs`, `TicketTimeoutIndex`."],
                    ["`level/`", "Les niveaux de chunks propagés par graphe, en sections de 64x64 chunks sous 256 verrous. `ChunkLevels`, `Section`, `LevelListener`."],
                    ["`holder/`", "La table des holders, l'attente d'un chunk absent, les étapes de génération. `ChunkHolders`, `HolderTable`, `ChunkWait`, `GenerationSteps`, `FullStep`."],
                    ["`owner/`", "Qui écrit à une position du monde, la boîte aux lettres d'une région, les chunks sans région. `ChunkOwners`, `RegionInbox`, `Router`, `Work`, `UnownedSweep`."],
                    ["`view/`", "La vue des joueurs : sources, tickets de vue et de simulation. `PlayerView`, `PlayerSources`, `ViewTickets`."],
                    ["`disk/`", "Le chunk en octets vers le thread disque. `ChunkWrites`, `CompressedChunk`, `PendingWrite`."]
                ]
            }
        },
        { p: "`LevelChunks` est le composite d'une dimension, construit avec son `ChunkMap` et atteint par `LevelChunks.of(level)`. Les mixins ne connaissent que lui." },
        { h3: "La vie d'un chunk" },
        {
            p: "Une écriture de ticket alimente `TicketGraphs`. `ChunkLevels` propage le niveau, un de moins par chunk de distance. `ChunkHolders` crée le holder et lance ses futures chez le propriétaire. `GenerationSteps` fait tourner chaque étape sur le pool sous sa réservation. `FullStep` construit sur le pool et publie chez le propriétaire. Quand le chunk passe en `block ticking`, `LevelRegions` l'ajoute au régioniseur, qui crée, étend ou fusionne une région. Au déchargement, le holder passe dans `PendingUnloads` et le démontage va au propriétaire."
        },
        { h2: "Les étapes mesurées" },
        { p: "`TickStages` déclare trois familles. L'ordre de déclaration est l'ordre d'exécution, et chaque étape est enregistrée dans le registre `leafs:tick_stage` au démarrage." },
        {
            table: {
                head: ["Famille", "Étapes"],
                rows: [
                    ["`global`", "`levels`, `drain`, `connections`, `players`, `autosave`."],
                    ["`serial`", "`border`, `weather`, `time`, `raids`, `purge`, `view`, `unloads`, `dragon`, `management`."],
                    [
                        "`region`",
                        "`unloads`, `tickets`, `packets`, `block_ticks`, `fluid_ticks`, `spawn_census`, `chunk_tick`, `broadcast`, `tracking`, `block_events`, `entities`, `block_entities`, `players`, `autosave`, `tasks`."
                    ]
                ]
            }
        },
        { h2: "Le watchdog et les crashs" },
        {
            p: "`LeafsWatchdog` remplace celui de vanilla. Au-delà de `debug.watchdog_warn_seconds`, il journalise la pile du thread bloqué et le chunk qu'il attend. Au-delà de `max-tick-time`, sur un serveur dédié seulement, `WatchdogKill` écrit un crash report avec tous les threads et arrête la JVM. Il surveille aussi les attentes de chunk trop longues sur n'importe quel thread."
        },
        {
            p: "Quand le tick d'une région lève une exception, `RegionCrashReport` écrit un rapport limité à cette région dans `crash-reports/`, avec le mod suspect trouvé par `ModAttribution`, puis `TickingManager` arrête le serveur proprement."
        },
        { h2: "Quelques constantes" },
        {
            table: {
                head: ["Constante", "Valeur", "Où"],
                rows: [
                    ["Période d'un tick de région", "50 ms", "`RegionTickScheduler.TICK_PERIOD_NANOS`"],
                    ["Seuil de récupération des sections mortes", "un sixième de la région", "`Regionizer.DEAD_SECTION_DIVISOR`"],
                    ["Attente entre deux essais d'emprunt", "50 µs", "`RegionBorrow.WAIT_NANOS`"],
                    ["Fenêtre de mesure du TPS", "5 s sur 240 ticks", "`StageTimings`"],
                    ["Tranche d'autosave et de boîte", "un dixième de la période", "`RegionTickBody`"],
                    ["Chunks par passe sans région", "20", "`ChunkSaves.CHUNKS_PER_TICK`"],
                    ["Section d'un graphe de niveaux", "64x64 chunks, 256 verrous", "`chunk/level/Section`"],
                    ["Alerte d'âge d'un paquet en file", "250 ms", "`PlayerPacketQueue.QUEUE_AGE_WARN_NANOS`"]
                ]
            }
        }
    ]
} satisfies DocPage;
