---
title: Read and write
lead: Every chunk has an owner, the only one allowed to write. Reading stays free for everyone, everywhere, all the time.
---

## A chunk's owner

Minecraft is made of 16x16 block chunks. A region is a group of chunks that tick together. Every chunk has an owner, and it is the only one allowed to write to it.

- If a region simulates the chunk, the region is the owner.
- Otherwise no one is. The first thread that wants to write to it takes it for the duration of its write, then returns it.
- Any thread can read any chunk, at any time. A mod that looks at a block on the other side of the world reads it directly.

## Writing a block

Three cases, and only three.

1. The block is at home, in a chunk of your region. You write it right away, just like in vanilla.
2. The block is in a chunk with no region, an empty dimension, an area with no player. You take the chunk, write, read your block back, just like in vanilla.
3. The block is in a chunk that another region is currently ticking. You cannot touch it during its tick. You send it mail, and it places the block at its next tick. If you read the block right away, you still see the old one.

:::note{tone="warn"}
The third case is [trade-off 4](/docs/trade-offs). It only happens when writing to another player's area while they are there.
:::

## In the code

`ChunkOwners` is the sole arbiter. `submit(x, z, work, task)` decides where a write runs:

1. If the current thread already holds the chunk, the task runs inline, and the caller reads back what it wrote.
2. If an inbox covers the chunk, a region's or a borrowed chunk's, the task is posted there.
3. With no owner, a chunk task goes to the pool, and a game task makes the calling thread take the chunk.
4. A pool worker never takes: its game task goes to the server thread, because it could end up waiting on a chunk under its own reservation.

Two kinds of work, `Work.CHUNK` and `Work.GAME`. Chunk work, publish, tear down, save, light, never waits on anything. Game work, placing a block, teleporting, respawning, updating a neighbor, can load a chunk and wait.

### First writer takes it

`ChunkOwners.borrow(x, z)` does a `putIfAbsent` of a `RegionInbox` on the chunk's key. The first thread to insert wins and receives the inbox. The others find the inbox on the next pass and post to it. `release` returns the chunk and redistributes whatever was left in the inbox.

### The read contract

`RegionChunkAccess` carries the contract: any thread reads what is published. A required chunk that is absent is waited on by the requesting thread, `ChunkWait`, which meanwhile runs what it owns, its inbox for a region, its queue for the server thread. `LevelChunks.of(level)` is the composite for a dimension, the only one mixins know about.

The transition of a chunk to `FULL` is split in two in `FullStep`: the pool builds the `LevelChunk`, the owner publishes it into the living world. It is at that publication that a chunk becomes a region's.
