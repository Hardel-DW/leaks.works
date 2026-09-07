---
title: Players and entities
lead: A player ticks on their region. Their packets follow their entity. An entity crossing a boundary simply changes snapshot.
---

## Joining and leaving

The server thread handles a player joining and leaving. It borrows the player's region for the duration of the operation, less than a millisecond. Other regions see nothing, no player feels a difference, even during a wave of a hundred connections.

Respawn goes from the player's region to the region of their respawn point, or to the server thread if no region covers that point.

## Packets

A player's packet queue follows their entity. Their region processes them at the start of its tick, then ticks the player at the end. A player is held by only one thread at a time. A region that finds a player held by another thread skips it and picks it up again on the next tick, it never waits. When no region ticks the player, dead or without a ticket, the server thread reads their queue itself.

## Entities that cross over

No entity is ever sent between threads. A region does not own its entities. At the start of each tick it takes a snapshot of the entities in its chunks and ticks those. A TNT crossing the boundary simply changes chunk section, just like in vanilla, and on the next tick the other region sees it in its own snapshot. A hundred or a thousand TNT cost the same as in vanilla.

For teleports and portals, the origin region does the work, then sends mail to the target region, which places the entity. An entity that leaves every simulated area freezes, just like in the original game beyond the simulation distance. The ender pearl is the original game's exception: it grows the region or creates one, like a player.

:::note
Regions are always separated by at least one unsimulated section beyond the crown. An entity leaving a region freezes in that area. If players are close enough, their regions merge and there is no more frozen area between them.
:::

## In the code

### The network

Netty decodes a packet, and `PacketRouting.routeToPlayer` puts it in the player's `PlayerPacketQueue`. Other listeners, handshake, login, configuration, keep the vanilla path. The queue has a `claimed` flag: only one thread at a time is the thread for a player's packets. `drain` returns false if another thread holds the player, and the region tick moves on to the next one. These cases are counted in `/leafs metrics`.

`RegionNetworkTick.drainOnRegion` drains the queue at the start of the region's tick. `tickPlayerOnRegion` runs the listener's full tick at the end, sending chunks and flushing the connection. `tickListenerGlobally` is the hook on `Connection.tick`: a player covered by a live region is skipped there, a player with no region is ticked there by the server thread acting as borrower.

### Entities

`RegionEntities` is the snapshot taken at the start of the tick from the entity sections of the region's chunks. It has two lists: entities that tick, and all entities accessible for the mob census. `forEach` skips an entity that has changed dimension since the snapshot.

`EntityTeleports.route` first checks whether the current thread holds the origin chunk. If so, vanilla runs as is. Otherwise the whole teleport becomes a `DeferredWork` at the origin's owner, revalidated on arrival. The move to the destination happens through the same add and remove primitives that the teleport itself calls.

`RegionEntityPersistence` runs the arrival, unloading and saving of entities at the chunk's owner. `RegionEntityTracking` restricts the tracking pass to players within range of the region's bounding box, plus those already seeing one of its entities so a departure disconnects them.
