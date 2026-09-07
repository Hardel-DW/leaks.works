---
title: Frequently asked questions
lead: The questions players and admins ask the most.
---

## Do redstone machines work near the edges of a region?

If a machine sticks out of the simulated area, it freezes, like vanilla. Nothing new. Each region also has a crown that does not tick, an area around the region that absorbs overflow: pistons, projectiles and the rest.

## What about orbital cannons and very fast entities?

The code does nothing special for a fast entity, and does not need to. No entity is ever sent between threads. A region does not own its entities: at the start of each tick it takes a snapshot of its chunks' entities and ticks those. A TNT that crosses the border simply changes chunk section, like vanilla, and on the next tick the other region sees it in its snapshot. A hundred or a thousand TNT cost the same as in vanilla.

## How are entities crossing regions handled?

- For teleports and portals, the origin region does the work, then sends mail to the target region, which places the entity.
- For entities leaving a region, the answer is the same as for cannons: the next region sees it in its snapshot on the following tick.
- An entity that leaves every simulated area freezes, like in the original game. The ender pearl is the original game's exception: it grows the region or creates one, like a player.

:::note
Regions are always separated by an unsimulated section beyond the crown. An entity leaving a region freezes in that area, just like beyond the simulation distance in vanilla. If players are close enough, their regions merge.
:::

## Do chunk loaders and forceload work?

Yes, and it is the cleanest part of the model. `forceload` and chunk loaders make areas simulated. The model is based on simulated areas, so this creates a region or extends an existing one.

## Do datapacks and commands work?

Every command runs on the server thread, no matter who triggers it. It borrows a region the moment the command touches one of its chunks or one of its entities, keeps it until the end, then gives it back. A command costs exactly its vanilla cost. A heavy datapack in `tick.json` stays on a single thread: it slows down the server thread and the regions it borrows, not the others.

## Can a cheater detect regions?

By nature, yes. If you move from an area at 20 TPS to an area at 15 TPS, you do not need a mod to know something is loaded there: a player, an ender pearl, a forceload, a chunk loader.

The mob cap is per dimension by default, or per region depending on the config. Two farms in two nearby regions then each run with a full mob cap. On the other hand, certain obscure techniques based on analyzing randomness become harder, since each region has its own seed.

## Any recommendations for a large server?

The locator bar becomes unreadable with a lot of players. Disable it with `/gamerule locator_bar false`. Leafs then cleanly cuts every related computation.
