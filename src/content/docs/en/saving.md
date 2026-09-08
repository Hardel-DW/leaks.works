---
title: Saving
lead: The autosave is done by regions, each its own. A flush or a shutdown freezes everything, just like in vanilla.
---

## Two paths

- The `/save-all flush` command and server shutdown. The server thread freezes every region for the duration of the save, just like vanilla freezes the server.
- The periodic autosave. It is done by regions, each for its own chunks and players, within a slice of its tick.

## The chunk goes out as bytes

A chunk reaches the disk thread already encoded. The thread saving it copies the chunk's state, a chunk thread encodes and compresses it, and vanilla's disk thread only writes bytes to the region file from then on. A reader requesting a chunk on its way to disk is served from the copy, without waiting.

On first startup, Leafs sets `sync-chunk-writes` to `false` in `server.properties`. The admin can set it back to `true`, Leafs does not touch it again after that.

## In the code

`LevelRegions` carries an autosave epoch per dimension. When the server thread triggers the autosave, it increments the epoch. `RegionAutosave` then does, on every region tick and within a slice of at most a tenth of the period: vanilla's urgent saves on the region's share, each player behind on the epoch, then a walk over the region's holders, which stops at the deadline and resumes on the next tick.

A merge resets the region's saved epoch to zero, so the arriving chunks get walked again. `ChunkSaves` sets `CHUNKS_PER_TICK` to 20 for budgeted passes. Chunks with no region are saved by `UnownedSweep`, one pass per dimension tick, on the pool.

`ChunkWrites` snapshots and compresses on the pool, `CompressedChunk` reproduces the region file's format, and `PendingWrite` serves readers from the snapshot then from the bytes. A more recent snapshot replaces the one still waiting. The flush goes through `CommandEngine.runBorrowingAll`, a head that takes every region then runs the vanilla body.
