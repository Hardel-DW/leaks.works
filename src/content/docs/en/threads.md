---
title: Threads
lead: Three thread families share the work: the vanilla server thread, the region threads and the chunk threads.
---

## The server thread still exists

Regions tick at the same time as it does. It does once per tick what is global by nature: the world time, the weather, the border, the player list and the autosave trigger. It also runs every command. Its cost is fixed and minimal, it depends neither on the number of chunks nor on the number of entities.

::clocks

## Region threads

A region is not a thread. A region is a task. Regions wait in a single list, then they are spread out to take the thread with the least load. This means a thread busy with a heavy region does not block anyone else, the others move on.

TPS in vanilla is global. On Leafs it is per region. If a region is heavier, its TPS drops, and that does not affect the other regions, which keep their TPS at maximum.

::pool

### Two clocks

- The time of day stays global, handled by the server thread. Weather and the sun advance at the same speed for everyone, regardless of your region's TPS.
- Everything that measures a relative duration, a furnace cooking, entities, redstone, follows the region's clock. A furnace will not cook at the same speed in two regions at different TPS.

### A region never waits

A command typed in the console, for example a `/tp` on a player, runs on the server thread. To touch that player, the server thread waits for their region to finish its current tick, then holds the player for the duration of the command. If the region starts again while the command is still running, it does not pause. It skips that player for this tick and picks them up again on the next one.

The rule is the same for everyone. A player or an entity is held by only one thread at a time, and it is always the server thread that waits, never a region. A region waiting on another thread would see its TPS drop because of it, which is exactly what Leafs avoids.

The only thing a region can wait for is a chunk. When it needs a chunk not yet loaded, it asks the chunk threads and waits for it to arrive.

This wait cannot trap it in a mutual block where two threads need each other and freeze forever (`deadlock`), because the chunk threads never ask anything of the regions in return.

## Chunk threads

Chunk threads are independent from region threads. They generate, light, load and unload chunks, and prepare the bytes to be written to disk. Vanilla's disk thread now only reads and writes those bytes.

These threads run at the lowest system priority. When the machine runs short on resources, region ticks go first, because they have a 50 ms deadline to keep. Chunks take the rest of the machine's resources.

- A player who explores no longer lags other players, even those in their own region.
- A very dense area with a low TPS does not affect the speed of world generation. A player moving away from it keeps moving smoothly.
- When a thread needs a chunk that is not there yet, it asks the pool, which moves it ahead of everything else, and it waits. The received chunk stays loaded until the end of the tick or command, just like in vanilla.

## The server thread's order

On each tick, the server thread does, in order:

1. The `tick.json` of datapacks.
2. The world time update.
3. For each dimension: the time, the weather, the border, the tickets and the players' view, unloads, special spawns like phantoms or the wandering trader, then a single request to the chunk threads for their pass over regionless chunks. Raids and the dragon fight tick on the region that owns their center.
4. What is redirected to the server thread: command blocks, respawn, chat commands.
5. The network of each connection. Transport only, the player's tick runs on its region.
6. The player list.
7. The autosave clock. It is then the regions and the chunk threads that save.
8. Debug and monitoring.

Points 2, 7 and 8 are fixed costs, identical no matter the server. Points 5 and 6 vary with the number of players, but so little that the cost is practically the same from one server to another. Points 1 and 4 are tied to commands, so they are avoidable. Point 3 has about fifteen steps, a good part of them at zero because they moved onto the regions.

## In the code

### The region scheduler

`RegionTickScheduler` holds a `DelayQueue` of tasks ordered by their next departure. Each thread, a `Leafs Region Worker #N`, takes the task closest to its deadline. The period is `TICK_PERIOD_NANOS`, 50 ms, and follows `ServerTickRateManager` when the tick rate changes. After a tick, the next departure is the maximum between now and the previous departure plus the period: a late region resumes from now, it never catches up.

`RegionTickHandle` is a region's task. It starts with `tryMarkTicking()`. If that fails, because a merge is pending, the pass is simply skipped. It ends with `markNotTicking()`, the place where merges, splits and section reclaims get their chance.

`LevelTickUnit` is the remaining vanilla part of a dimension's tick. It runs inline on the server thread, never queued, so its delay stays at zero. `RegionClock` is a region's counter, advanced once per pass. A region's TPS is measured over a 5 second window in `StageTimings`.

### A region's tick

`RegionTickBody.tick` chains the steps, each measured under `leafs:region/<step>`:

1. `tickets`. Counting down the timed tickets of the region's sections, then the chunk snapshot.
2. `packets`. The entity snapshot, then each player's pending packets.
3. `block_ticks`, `fluid_ticks`, `spawn_census`, `chunk_tick`. Scheduled ticks, the mob census and each chunk's tick: thunder, random ticks, natural spawning.
4. `broadcast`. Sending changed blocks to clients.
5. `tracking`. Which entities each player sees.
6. `block_events`. Pistons and note blocks, in vanilla order.
7. `entities`, `block_entities`. The tick of entities and block entities, plus anchors like raids.
8. `players`. Each player's listener tick and sending their chunks.
9. `autosave`. This tick's share of the autosave, at most a tenth of the period.
10. `tasks`. The mail, within whatever the period leaves, and at least a tenth.

### The chunk pool

`ChunkPool` has one queue per priority level, priority 0 first. Its `Leafs Chunk Worker #N` threads run at `Thread.MIN_PRIORITY`, and on Linux `NativeThreadPriority` sets a nice of 19 through a native call, because Linux ignores Java priority. A task reserves the chunks it writes, `Reservations`. A task that cannot reserve gets in line behind the one blocking it and resumes when it frees up: no one waits.

`PlacedTasks` indexes queued tasks by chunk. When a player changes chunk, the pool recomputes the priority of the affected tasks. What a thread is waiting for moves to the front of the queue, that is `expedite`.

The number of threads comes from `region_threads` and `chunk_threads`. By default, all cores for regions and half for chunks.
