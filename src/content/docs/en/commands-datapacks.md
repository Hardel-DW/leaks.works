---
title: Commands and datapacks
lead: Every command runs on the server thread, whoever launches it. A command costs exactly the same cost it has in vanilla.
---

## A command borrows what it touches

The server thread borrows a region the moment the command touches one of its chunks or one of its entities, keeps it until the end of the command, then gives it back. What the command touches decides what it borrows:

- A `/say` borrows nothing.
- A `/give @a` borrows the regions where there are players.
- A `/setblock` borrows the region of the targeted chunk, and loads the chunk first if needed. This load blocks the server thread, like in vanilla.
- A `/kill @e` borrows every region, because that is what the command means.

A datapack therefore costs exactly what it costs in vanilla. A heavy datapack living in `tick.json` stays on a single thread and does not benefit from multithreading. It slows down the server thread and the regions it borrows during its commands, not the others.

## Command blocks

A command block, or a command block minecart, triggered by redstone runs one tick later than in vanilla. The redstone runs on the region and the command on the server thread, and going from one to the other waits for the next tick. A command typed in chat or run by a datapack has no such delay. See the [Trade-offs](/docs/trade-offs).

:::note{tone="warn"}
It is recommended to limit commands on a big server. Support exists and costs vanilla, but everything that runs on the server thread does not benefit from the extra cores.
:::
