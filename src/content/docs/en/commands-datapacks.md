---
title: Commands and datapacks
lead: Every command runs on the server thread, whoever launches it. A command costs exactly the same cost it has in vanilla.
---

## Datapacks
For the Data Driven so the `.json and .nbt` files nothing to report, Leafs does nothing special they simply work like the base game.

## A command borrows what it touches

The server thread borrows a region the moment the command touches one of its chunks or one of its entities, keeps it until the end of the command, then gives it back. What the command touches decides what it borrows:

- A `/say` borrows nothing.
- A `/give @a` borrows the regions where there are players.
- A `/setblock` borrows the region of the targeted chunk, and loads the chunk first if needed. This load blocks the server thread, like in vanilla.
- A `/kill @e` borrows every region, because that is what the command means.

An mcfunction datapack therefore costs exactly what it costs in vanilla. A heavy datapack living in `tick.json` stays on a single thread and does not benefit from multithreading. It slows down the server thread and the regions it borrows during its commands, not the others.

## About mcfunctions
The mcfunction model is by nature impossible to multithread, unlike the game which plays a consequence in response to an action.

:::note
Example, the player attacks, they send the information to the server, which triggers the attack action.
:::

The mcfunctions in `tick.json` ask the server to go through all the players and their position (`execute as @a at @s`), then run a condition and if it passes run a series of commands. This model therefore requires going through all the players so all the regions every tick which is incompatible with the region model, because the gain is felt in every region.

The region `borrowing` system partly fixes this problem by targeting only the regions concerned by the command.

An `@a` or `@e` selector means communicating with all the players and so all the regions and so impacting the global performance of the server.

However an `actions -> consequences` model that only uses `@s` is perfectly compatible, an advancement trigger or an enchantment effect that fires an mcfunction.

## Command blocks

A command block, or a command block minecart, triggered by redstone runs one tick later than in vanilla. The redstone runs on the region and the command on the server thread, and going from one to the other waits for the next tick. A command typed in chat or run by a datapack has no such delay. See the [Trade-offs](/docs/trade-offs).

:::note{tone="warn"}
It is recommended to limit commands on a big server. Support exists and costs vanilla, but everything that runs on the server thread does not benefit from the extra cores.
:::
