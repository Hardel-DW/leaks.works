import type { DocPage } from "@/content/docs/types";

export default {
    title: "Code map",
    lead: "A folder is a responsibility, an independent building block. The code lives in `src/main/java/fr/hardel/leafs/`.",
    blocks: [
        { h2: "The folders" },
        {
            table: {
                head: ["Folder", "Responsibility"],
                rows: [
                    [
                        "`region/`",
                        "Splits the world into sections and regions, with merging and splitting, with no Minecraft dependency at all. `Regionizer`, `Region`, `RegionSection`, `RegionState`."
                    ],
                    [
                        "`ticking/`",
                        "The region scheduler, the region clock, borrowing, the per-region crash report, the watchdog. `RegionTickScheduler`, `RegionBorrow`, `LevelRegions`, `TickingManager`."
                    ],
                    ["`scheduler/`", "The server thread's queue and deferred work to a chunk's owner. `GlobalScheduler`, `DeferredWork`."],
                    [
                        "`world/`",
                        "A region's tick: what a chunk ticks itself, scheduled ticks, block events, block entities, and the little a region keeps between two ticks. `RegionTickBody`, `RegionWorldData`, `RegionAutosave`."
                    ],
                    ["`chunk/`", "The chunk engine, detailed below."],
                    ["`entity/`", "The snapshot of entities a region ticks, teleports and persistence. `RegionEntities`, `EntityTeleports`."],
                    ["`network/`", "Per-player packet queues, routing, per-region network tick, connection. `PlayerPacketQueue`, `PacketRouting`, `RegionNetworkTick`."],
                    [
                        "`global/`",
                        "The command engine, the shared state monitor, borrowing during Fabric events, the locator bar, randomness. `CommandEngine`, `SharedStateMonitor`, `FabricTickEvents`."
                    ],
                    ["`metrics/`", "Telemetry and the `leafs:tick_stage` registry. `TickStages`, `StageTimings`, `ServerMetrics`."],
                    ["`debug/`", "The `/leafs` command, one class per subcommand."],
                    ["`mixin/`", "Hooks into Minecraft, into the Fabric API under `compat/`, and into ScalableLux under `light/`. Mixins carry no logic."]
                ]
            }
        },
        {
            p: "The `excess/` folder, next to the mod, provides utility classes with no link to Minecraft: concurrent maps and sets on primitive keys, `ConcurrentLong2ObjectMap`, `ConcurrentOrderedLongSet`, `CopyOnWriteListMap`, and `LongSpread`, a bijective mix of long keys before a `ConcurrentHashMap`."
        },
        { h2: "The chunk engine" },
        {
            table: {
                head: ["Folder", "Responsibility"],
                rows: [
                    ["`pool/`", "The chunk thread pool. `ChunkPool`, `ChunkTask` and its place, `PlacedTasks`, `Reservations`, `PriorityBuckets`, `Urgency`, `NativeThreadPriority`."],
                    ["`ticket/`", "The three ticket graphs: players, simulation, loading. `TicketGraphs`, `TicketTimeoutIndex`."],
                    ["`level/`", "Chunk levels propagated per graph, in 64x64-chunk sections under 256 locks. `ChunkLevels`, `Section`, `LevelListener`."],
                    ["`holder/`", "The holder table, waiting for a missing chunk, generation steps. `ChunkHolders`, `HolderTable`, `ChunkWait`, `GenerationSteps`, `FullStep`."],
                    ["`owner/`", "Who writes to a position in the world, a region's inbox, chunks with no region. `ChunkOwners`, `RegionInbox`, `Router`, `Work`, `UnownedSweep`."],
                    ["`view/`", "Player view: sources, view and simulation tickets. `PlayerView`, `PlayerSources`, `ViewTickets`."],
                    ["`disk/`", "A chunk in bytes on its way to the disk thread. `ChunkWrites`, `CompressedChunk`, `PendingWrite`."]
                ]
            }
        },
        { p: "`LevelChunks` is the composite for a dimension, built with its `ChunkMap` and reached through `LevelChunks.of(level)`. The mixins only know this one." },
        { h3: "The life of a chunk" },
        {
            p: "A ticket write feeds `TicketGraphs`. `ChunkLevels` propagates the level, one less per chunk of distance. `ChunkHolders` creates the holder and launches its futures at the owner. `GenerationSteps` runs each step on the pool under its reservation. `FullStep` builds on the pool and publishes to the owner. When the chunk reaches `block ticking`, `LevelRegions` adds it to the regionizer, which creates, extends or merges a region. On unload, the holder moves into `PendingUnloads` and teardown goes to the owner."
        },
        { h2: "Measured stages" },
        { p: "`TickStages` declares three families. Declaration order is execution order, and each stage is registered in the `leafs:tick_stage` registry at startup." },
        {
            table: {
                head: ["Family", "Stages"],
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
        { h2: "The watchdog and crashes" },
        {
            p: "`LeafsWatchdog` replaces vanilla's. Past `debug.watchdog_warn_seconds`, it logs the blocked thread's stack and the chunk it is waiting on. Past `max-tick-time`, on a dedicated server only, `WatchdogKill` writes a crash report with all threads and stops the JVM. It also watches for chunk waits that run too long on any thread."
        },
        {
            p: "When a region's tick throws an exception, `RegionCrashReport` writes a report limited to that region in `crash-reports/`, with the suspect mod found by `ModAttribution`, then `TickingManager` stops the server cleanly."
        },
        { h2: "A few constants" },
        {
            table: {
                head: ["Constant", "Value", "Where"],
                rows: [
                    ["Region tick period", "50 ms", "`RegionTickScheduler.TICK_PERIOD_NANOS`"],
                    ["Dead section reclaim threshold", "one sixth of the region", "`Regionizer.DEAD_SECTION_DIVISOR`"],
                    ["Wait between two borrow attempts", "50 µs", "`RegionBorrow.WAIT_NANOS`"],
                    ["TPS measurement window", "5 s over 240 ticks", "`StageTimings`"],
                    ["Autosave and mailbox slice", "one tenth of the period", "`RegionTickBody`"],
                    ["Chunks per unowned pass", "20", "`ChunkSaves.CHUNKS_PER_TICK`"],
                    ["Level graph section", "64x64 chunks, 256 locks", "`chunk/level/Section`"],
                    ["Queued packet age warning", "250 ms", "`PlayerPacketQueue.QUEUE_AGE_WARN_NANOS`"]
                ]
            }
        }
    ]
} satisfies DocPage;
