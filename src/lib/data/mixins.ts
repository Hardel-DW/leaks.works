export type MixinModule = "ticking" | "global" | "entity" | "network" | "chunk" | "world" | "compat";

export interface MixinEntry {
    vanilla: string;
    modules: MixinModule[];
    why: string;
}

export const MODULE_LABELS: Record<MixinModule, string> = {
    ticking: "ticking",
    global: "global",
    entity: "entity",
    network: "network",
    chunk: "chunk",
    world: "world",
    compat: "compat"
};

export const MIXINS: MixinEntry[] = [
    {
        vanilla: "MinecraftServer",
        modules: ["ticking", "global", "entity", "network", "compat"],
        why: "Le point d'entrée du serveur. Il porte le TickingManager, la fenêtre barrière, le registre des schedulers d'entités, le saut de la boucle d'envoi de chunks pour les joueurs qu'une région tique, et l'encadrement des évènements de tick de la Fabric API."
    },
    {
        vanilla: "DedicatedServer",
        modules: ["global"],
        why: "Les commandes tapées dans la console passent par la fenêtre barrière, parce qu'une commande op peut toucher n'importe quel état du monde."
    },
    {
        vanilla: "ServerLevel",
        modules: ["ticking", "chunk", "entity", "global", "world"],
        why: "Une dimension. Elle porte son Regionizer et son verrou, ses listes d'entités par région, son routeur de téléportation, sa TimerQueue déplacée dans la fenêtre, et le routage de ses ticks programmés vers la région propriétaire."
    },
    {
        vanilla: "Level",
        modules: ["world"],
        why: "Le compteur de sub-tick, le générateur aléatoire et le neighbor updater deviennent dépendants de la région qui tique. getBlockEntity répond correctement depuis un worker au lieu de renvoyer null."
    },
    {
        vanilla: "ChunkMap",
        modules: ["chunk", "entity"],
        why: "Le plus gros mixin du mod. Il construit le coeur concurrent du système de chunks au constructeur, route les promotions vers le propriétaire de la position, met les étapes transfrontalières sous exclusion spatiale, et découpe le tracking en deux."
    },
    {
        vanilla: "ServerChunkCache",
        modules: ["chunk", "world"],
        why: "Il répond depuis n'importe quel thread pour les chunks déjà publiés, intercepte les demandes d'un worker de région pour refuser au lieu de charger en synchrone, et sépare la part du tick des chunks qui revient au corps de région."
    },
    {
        vanilla: "ServerChunkCache.MainThreadExecutor",
        modules: ["ticking"],
        why: "Le drain de propriétaire universel. Un thread serveur qui attend un chunk en tenant l'exclusion exécute lui-même les tâches en file sur les régions, parce qu'aucune région ne peut le faire à sa place."
    },
    {
        vanilla: "DistanceManager",
        modules: ["chunk"],
        why: "Il porte le propagateur de tickets de Leafs, qui remplace le graphe de propagation vanilla, et débranche la moitié par joueur de vanilla que le chargeur par joueur remplace."
    },
    {
        vanilla: "ChunkStatusTasks",
        modules: ["chunk"],
        why: "Le pas FULL publie le chunk dans le monde vivant. Le mixin le route vers le propriétaire de la position au lieu de la pompe, et prend l'exclusion spatiale pendant la copie."
    },
    {
        vanilla: "ThreadedLevelLightEngine",
        modules: ["chunk"],
        why: "En vanilla, une tâche de lumière n'atteint le moteur que si la pompe du thread serveur la réveille. Le mixin fait que la voie de lumière se pilote elle-même, sinon un worker de chunks attendrait un thread qui attend les régions."
    },
    {
        vanilla: "TicketStorage",
        modules: ["chunk"],
        why: "La table de tickets passe sous un moniteur, pour qu'une région pose ses tickets elle-même. Un scheduler peut poser un ticket depuis une autre dimension pendant que la phase sérielle parcourt la table."
    },
    { vanilla: "SectionStorage", modules: ["chunk"], why: "La map de stockage devient concurrente, et la classe porte le verrou des villages. Le flush de sauvegarde passe sous ce verrou." },
    {
        vanilla: "PoiManager",
        modules: ["chunk"],
        why: "Le set des chunks chargés devient concurrent. Les opérations sur le graphe de distance des villages passent sous le verrou dédié, parce que ce graphe ne peut pas devenir concurrent par une façade."
    },
    {
        vanilla: "EntitySectionStorage, EntityLookup, PersistentEntitySectionManager, ChunkMap.TrackedEntity",
        modules: ["entity"],
        why: "Quatre façades concurrentes sur les index d'entités. TrackedEntity ré-ancre en plus la base de position au premier appairage, parce qu'un projectile spawné sur une région appaire son premier spectateur un tick après sa création."
    },
    {
        vanilla: "ServerEntity",
        modules: ["entity"],
        why: "Il expose le ré-ancrage de la base de position que TrackedEntity déclenche. Quand la construction et l'appairage partagent le tick, le calendrier vanilla, ça ne change rien."
    },
    {
        vanilla: "ServerLevel.EntityCallbacks",
        modules: ["entity"],
        why: "Les callbacks de section routent les entités vers les listes de tick de la région propriétaire, parce que les listes globales seraient écrites par plusieurs régions en même temps."
    },
    {
        vanilla: "PersistentEntitySectionManager.Callback",
        modules: ["entity"],
        why: "Il capture la section avant un déplacement et rattache l'entité aux listes de sa nouvelle région quand elle change de chunk, avant la mise à jour de son statut."
    },
    {
        vanilla: "Entity",
        modules: ["entity"],
        why: "Il retire le scheduler d'une entité qui quitte le monde, dévie les téléportations vers le routeur, et reporte la recherche de portail dans la fenêtre barrière."
    },
    {
        vanilla: "ServerPlayer",
        modules: ["entity"],
        why: "Le set de perles d'ender devient concurrent, parce qu'une perle lancée depuis une autre région s'y inscrit depuis un autre thread. Les téléportations sont déviées vers le routeur."
    },
    {
        vanilla: "Scoreboard, ServerScoreboard",
        modules: ["global"],
        why: "Toutes les mutations et les lectures qui parcourent le scoreboard passent sous le moniteur partagé, dirty flag, objectifs suivis, construction des paquets et sauvegarde compris."
    },
    { vanilla: "SavedDataStorage", modules: ["global"], why: "L'accès au cache et la collecte des données modifiées passent sous le moniteur. L'encodage prend le moniteur de la donnée elle-même." },
    {
        vanilla: "MapIndex, MapItemSavedData",
        modules: ["global"],
        why: "L'attribution des identifiants de carte est sérialisée, pour que deux régions ne produisent jamais le même numéro. Chaque carte a ensuite son propre moniteur."
    },
    { vanilla: "RandomSequences", modules: ["global"], why: "Les séquences passent sous le moniteur et chaque source est enveloppée. Le moniteur ordonne les tirages avec la sauvegarde." },
    { vanilla: "ServerWaypointManager", modules: ["global"], why: "Toutes les mutations de la table des waypoints passent sous le moniteur, et la lecture renvoie un instantané immuable." },
    {
        vanilla: "CommandBlock, MinecartCommandBlock",
        modules: ["global"],
        why: "L'exécution d'un command block est reportée dans la fenêtre barrière, parce qu'une commande peut toucher n'importe quel état du monde."
    },
    {
        vanilla: "PacketProcessor",
        modules: ["network"],
        why: "Les paquets de jeu sont routés vers la file du joueur au lieu de la file globale. Le thread qui vide une file de joueur est reconnu comme un thread de paquets valide."
    },
    {
        vanilla: "PacketUtils",
        modules: ["network"],
        why: "La vérification de thread de vanilla est remplacée. Le thread autorisé est celui qui vide la file du joueur, pas nécessairement le thread serveur."
    },
    {
        vanilla: "ServerGamePacketListenerImpl",
        modules: ["network"],
        why: "Il porte la file de paquets du joueur. Le chat signé, le filtrage des livres et pancartes, l'ack de batch de chunks s'exécutent dans cette file. Les commandes restent globales, le respawn passe par la fenêtre, et les clics de conteneur passent par un garde qui rétablit la synchronisation du menu si un handler lève."
    },
    {
        vanilla: "PlayerChunkSender",
        modules: ["network"],
        why: "Le set des chunks en attente d'envoi devient concurrent, parce que la phase sérielle y marque les chunks prêts pendant que la région du joueur collecte et envoie."
    },
    {
        vanilla: "Connection",
        modules: ["network"],
        why: "Le tick de connexion est coupé en deux. Le flush et la détection de déconnexion restent globaux, la physique du joueur et ses menus partent sur sa région."
    },
    {
        vanilla: "ServerCommonPacketListenerImpl",
        modules: ["network"],
        why: "Les envois sont groupés par tick de région pour partir ensemble. Une déconnexion demandée depuis un autre thread devient non bloquante, pour ne pas geler un worker."
    },
    {
        vanilla: "PlayerList",
        modules: ["network"],
        why: "Les listes de joueurs et les tables de stats deviennent concurrentes. Le placement d'un nouveau joueur s'exécute sur la région de son chunk de spawn, et le retrait exécute le corps vanilla entier sous la pause de toutes les régions."
    },
    {
        vanilla: "PrepareSpawnTask",
        modules: ["network"],
        why: "La phase de configuration sert de salle d'attente. Le mixin garde le NBT lu, lance la lecture des stats et des advancements sur le pool d'entrées sorties, et retient la tâche tant que les entités du spawn ne sont pas chargées."
    },
    {
        vanilla: "PlayerDataStorage, ServerStatsCounter, PlayerAdvancements",
        modules: ["global", "network"],
        why: "Les trois fichiers d'un joueur se sérialisent sur le thread appelant, qui tient la pause, et l'écriture disque part sur un thread d'écriture unique. Les lectures consultent d'abord les écritures en attente."
    },
    {
        vanilla: "BlockableEventLoop",
        modules: ["ticking"],
        why: "Un appel à MinecraftServer.execute depuis un worker de région est redirigé vers la phase globale, pour que la tâche s'exécute au bon moment."
    },
    { vanilla: "ServerTickRateManager", modules: ["ticking"], why: "Un changement de tick rate se propage à toutes les boucles de régions." },
    {
        vanilla: "ServerWatchdog",
        modules: ["ticking"],
        why: "Le watchdog vanilla mesure un unique game thread qui n'existe plus. Leafs le neutralise et le remplace par un watchdog par unité de tick."
    },
    {
        vanilla: "SerializableChunkData",
        modules: ["world"],
        why: "La sauvegarde d'un chunk packe ses ticks programmés par rapport à l'horloge de sa région, pas au temps du jeu, parce que les régions n'ont pas toutes vécu le même nombre de ticks."
    },
    {
        vanilla: "Fabric API",
        modules: ["compat"],
        why: "Quatre shims. Le cache de fabric-api-lookup est synchronisé, le set de chunks chargés de fabric-lifecycle-events devient concurrent, l'implémentation d'évènement expose si elle a des abonnés, et les évènements de tick serveur s'encadrent de la barrière."
    }
];
