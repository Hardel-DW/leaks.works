---
title: Saving
lead: The autosave is done by the regions, each its own. A flush or the shutdown freezes everything, like in vanilla.
---

## Two paths

- The `/save-all flush` command and the server shutdown. The server thread freezes every region for the duration of the save, like vanilla freezes the server.
- The periodic autosave. It is done by the regions, each for its chunks and its players, within a slice of its tick.

## The chunk leaves as bytes

A chunk reaches the disk thread already encoded. The thread that saves copies the chunk's state, a chunk thread encodes and compresses it, and vanilla's disk thread only writes bytes into the region file. A reader that requests a chunk on its way to disk is served from the copy, without waiting.
