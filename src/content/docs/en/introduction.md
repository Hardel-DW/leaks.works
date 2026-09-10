---
title: Introduction
lead: Leafs is a server side Fabric mod. It splits the Minecraft world into independent regions and ticks each region on its own thread.
---

On a classic server, every cost is shared. Each player, each machine, each area being generated weighs on the same thread. Leafs splits the world into independent regions, and each region lives its own tick at 20 TPS.

Leafs adds multithreading, and nothing else. No gameplay feature, no API, no hidden optimization. The RAM and CPU gains live in a separate mod, **Mapple**, which works with or without Leafs.

## Dependencies and compatible mods

Leafs depends on **Mapple**, **Fabric API**, **ScalableLux** and **FastNoise**, they are automatically installed by Modrinth/CurseForge when you install Leafs.

Leafs is available on Fabric and NeoForge from 26.1 to 26.3. Content mods like AE2 are compatible, for more information see [Mod compatibility](/docs/mod-compatibility)

The following optimization mods, **Lithium**, **Ferrite**, **ModernFix**, **Krypton** are compatible. Leafs itself disables the few Lithium options that would touch the chunk engine, there is nothing to configure.

## What is incompatible

**C2ME**, **Moonrise** and **VMP** rewrite the game in depth their own way. Leafs declares them incompatible and the game refuses to load them together.
Leafs has a lighter architecture, different from C2ME, but in practice the same gains and advantages as it, for more information see the [Benchmark](/docs/benchmark)

## How to read this documentation

This documentation is simplified as much as possible and accessible to everyone, some parts are nevertheless a bit more detailed and require more knowledge of the game.
Here are the chapters I recommend.

1. [Minecraft, a single thread](/docs/vanilla). Why the vanilla server does not benefit from your cores.
2. [Regions](/docs/regions). How the world splits around players.
3. [Threads](/docs/threads). The server thread, the region threads and the chunk threads.
4. [Read and write](/docs/read-write). Who has the right to write where.
5. [Mail and borrowing](/docs/mail-borrow). The only two coordination tools.
6. [Trade-offs](/docs/trade-offs). Every departure from vanilla, and why it exists.
