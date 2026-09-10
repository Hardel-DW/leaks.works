---
title: Threads
lead: Three thread families share the work: the vanilla server thread, the region threads and the chunk threads.
---

## The server thread still exists

Regions tick at the same time as it does. Once per tick it does what is global by nature: the world time, the weather, the border, the player list and the autosave trigger. It also runs every command. Its cost is fixed and minimal, it depends neither on the number of chunks nor on the number of entities.

::clocks

## Region threads

A region is not a thread. A region is a task. Regions wait in a single list, then they are spread out to take the thread with the least load. This means a thread busy with a heavy region blocks nobody, the others take over.

TPS in vanilla is global. On Leafs it is per region. If a region is heavier, its TPS drops, and that does not affect the other regions, which keep their TPS at maximum.

::pool

### Two clocks

- The time of day stays global, handled by the server thread. Weather and the sun advance at the same speed for everyone, regardless of your region's TPS.
- Everything that measures a relative duration, a furnace cooking, entities, redstone, follows the region's clock. A furnace will not cook at the same speed in two regions at different TPS.

### A region never waits

A command typed in the console, for example a `/tp` on a player, runs on the server thread. To touch that player, the server thread waits for their region to finish its current tick, then holds the player for the duration of the command. If the region starts again while the command is still running, it does not pause. It skips that player for this tick and picks them up again on the next tick.

The rule is the same for everyone. A player or an entity is held by a single thread at a time, and it is always the server thread that waits, never a region. A region that waited for another thread would see its TPS drop because of it, which is exactly what Leafs avoids.

The only thing a region can wait for is a chunk. When it needs a chunk not yet loaded, it asks the chunk threads and waits for it to arrive.

This wait cannot trap it in a mutual block where two threads need each other and freeze forever (`deadlock`), because the chunk threads never ask anything of the regions in return.

## Chunk threads

Chunk threads are independent from region threads. They generate, light, load and unload chunks, and prepare the bytes to write to disk. Vanilla's disk thread now only reads and writes those bytes.

These threads run at the lowest system priority. When the machine no longer has enough resources, region ticks go first, because they have a 50 ms deadline to meet. Chunks take the rest of the machine's resources.

- A player who explores no longer lags the other players, even those of their own region.
- A very dense area, with a low TPS, does not affect the world generation speed. A player moving away from it keeps moving smoothly.
- When a thread needs a chunk that is not there yet, it asks the pool, which puts it ahead of everything else, and it waits. The received chunk stays loaded until the end of the tick or of the command, like in vanilla.

## The server thread's order

On each tick, the server thread does, in order:

1. The `tick.json` of datapacks.
2. The world time update.
3. For each dimension: the time, the weather, the border, the tickets and the players' view, unloads, special spawns like phantoms or the wandering trader, then a single request to the chunk threads for their pass over the chunks without a region. Raids and the dragon fight tick on the region that owns their center.
4. What is redirected to the server thread: command blocks, respawn, chat commands.
5. The network of each connection. Transport only, the player's tick runs on their region.
6. The player list.
7. The autosave clock. The regions and the chunk threads then do the saving.
8. Debug and monitoring.

**Note:**
- Points 2, 7 and 8 are fixed costs, identical whatever the server.
- Points 5 and 6 vary with the number of players, but so little that from one server to another the cost is practically identical.
- Points 1 and 4 are tied to commands, so avoidable.
- Point 3 has about fifteen steps, a good part of them at zero because moved onto the regions.
