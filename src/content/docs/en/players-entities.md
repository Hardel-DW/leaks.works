---
title: Players and entities
lead: A player ticks on their region. Their packets follow their entity. An entity crossing a border simply changes snapshot.
---

## Connection and disconnection

The server thread handles a player's arrival and departure. It borrows the player's region for the duration of the operation, less than a millisecond. The other regions see nothing, no player feels any difference, even on a wave of a hundred connections.

The respawn goes from the player's region to the region of their respawn point, or to the server thread if no region covers that point.

## Packets

Here are the rules about how packets work:
- A player's packets are processed by their region at the start of its tick.
- A player is held by a single thread at a time.
- A region that finds a player held by another thread skips them and picks them up again on the next tick.
- When no region ticks the player, the server thread reads their queue itself.

## Entities that cross regions

The rules about how entities work:
- No entity is sent between threads. At the start of each tick the region takes a snapshot of the entities of its chunks and ticks them. A TNT that crosses the border simply changes chunk section, and on the next tick the other region sees it in its snapshot. A hundred or a thousand TNT cost the same as in vanilla.
- For teleportations and portals, the origin region does the work, then sends mail to the target region, which places the entity.
- An entity that leaves every simulated area freezes, like in the original game beyond the simulation distance. The ender pearl is the original game's exception: it grows the region or creates one, like a player.

:::note
Regions are always separated by at least one non-simulated section beyond the crown. An entity that leaves a region freezes in that area like in the original game.
:::
