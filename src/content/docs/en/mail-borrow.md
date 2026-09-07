---
title: Mail and borrowing
lead: Two concepts, and only two, for threads to talk to each other. An inbox per region, and the server thread borrowing a region.
---

One rule above all: the server thread never touches a region without borrowing it. Commands, Fabric events, a player joining or leaving, all of it goes through this.

## Mail

Each region has an inbox. What other regions want to do at its place waits inside, and it does the work at the end of its tick, in arrival order. The inbox has two queues:

- Chunk work. Publishing a generated chunk, tearing it down, saving it. This never waits.
- Game work. Placing a block, teleporting, respawning. This can need a chunk that is not loaded yet, so it can wait.

A region serves its inbox with whatever the period leaves it, and at least a tenth of the period. A heavy tick still publishes, a light tick publishes everything, the rest waits for the next pass in order.

## Borrowing

Borrowing is mostly used by commands. The server thread targets an entity or a chunk, and that borrows their region. It then does the work itself, in the same order as vanilla, and returns everything at the end.

A borrowed region does not tick during that time, as if the server thread were its worker. It is short: a connection takes less than a millisecond.

## In the code

### The inbox

`RegionInbox` keeps two `ArrayDeque`, `chunkWork` and `gameWork`. `drain()` serves chunk work then game work, as many tasks as there were before the call. A task that reposts itself waits for the next pass. `drain(deadline)` stops at the deadline.

`drainChunkWork()` is what a wait is allowed to run. A thread waiting on a chunk can thus reach the publication that is blocking it, without ever running game work in the middle of a write. A task posted on a chunk the region no longer owns goes back through `ChunkOwners.submit`.

### Borrowing

`RegionBorrow` is what a thread holds for a piece of game work. Only the head, the server thread, waits and takes regions. Any other thread only reads a region and never waits.

- `borrow(regions, x, z)` takes the region covering the chunk, or the chunk itself if it has no region.
- `take()` loops as long as the region is not dead: `tryMarkTicking()` succeeds, or the region is promised to a merge, in which case the borrow releases everything to let the merge happen and picks up the survivor, otherwise it waits by parking 50 microseconds between two tries.
- `borrowAll` takes every region in every dimension, until a full pass takes or returns nothing more.
- `releaseAll()` returns the regions first, then the remaining mail of each borrowed chunk.

### Deferred work

`DeferredWork` is a game task that goes to a chunk's owner with a reason, `DeferReason`: `RESPAWN`, `PORTAL`, `TELEPORT`, `PLAYER_TELEPORT` or `BLOCK_WRITE`. It revalidates its condition on arrival, for instance that the entity is still alive, and counts a drop if it fails. `/leafs metrics` shows these counters.

`GlobalScheduler` is the server thread's queue: every `MinecraftServer.execute` coming from another thread lands there, and the server thread drains it one pass at a time.
