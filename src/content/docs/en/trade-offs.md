---
title: Trade-offs
lead: Every deliberate departure from vanilla is listed here, with its explanation. If it is here, it is because we had no choice.
---

## Trade-offs
1. Each region has its own randomness. No visible effect in game in theory, and it indirectly limits cheating.
2. Every command runs on the server thread, which borrows the regions it touches.
3. Writing a block where another region is doing its tick will be 1 tick late. The block is placed, but reading it back will return the old block.
4. Teleportations and portals land at the latest on the next tick of the target region.
5. Mods that use `END_SERVER_TICK` through the Fabric API still run on the server thread. When that touches a chunk or an entity, the server thread borrows its region. Since regions do not necessarily run at 20 TPS, you cannot check that the previous tick ran perfectly, you have to develop in an imperative way.
6. A command block, or a command block minecart, triggered by redstone runs one tick later than in vanilla. The redstone runs on the region and the command on the server thread. A command typed in chat or run by a datapack has no such delay.
