---
title: Mod compatibility
lead: Mods do not adapt to Leafs. Leafs adapts to mods. This is the rule that comes before every other one.
---

## Primitives

The **primitives**, as I like to call them, are the most used methods of the Minecraft code, the ones where the most traffic goes through, reading and writing a block, getting a chunk's data, teleporting an entity, sending a packet. Leafs modifies these primitives to make the regions work. Mods use them without knowing it and are therefore automatically compatible.

In practice, for developers the use of these methods is identical, Leafs just `wraps` these methods with a mixin. Which allows compatibility with third-party mixins.

:::note{tone="warn"}
Leafs must in no case create bugs or problems in a mod. If it does, it is a Leafs bug: open a ticket.
:::

## What is known

- Compatible: Lithium, Ferrite, Mapple.
- Incompatible: C2ME, VMP, Moonrise. They rewrite the same chunk engine.

## Tested mods

**Every client mod is compatible**, because Leafs runs server side.

The mods in the table were tested, not at 100 % because some of them remain massive. Leafs made no change or fix specific to them, they work as they are. I have not had the time to test further yet.

A mod absent from this list is not incompatible. It is most likely compatible, I just have not had the time to test everything. The list grows over time. Ideally I would like to test every mod that makes up ATM 11 and a bit more.

| mod | status |
|---|---|
| Applied Energistics 2, with Advanced AE, Extended AE and its other addons | ✅ |
| Apotheosis, with Apothic Attributes, Apothic Enchanting and Apothic Spawners | ✅ |
| AttributeFix | ✅ |
| Chunk Loaders | ✅ |
| Clumps | ✅ |
| Construction Sticks | ✅ |
| Copper Hopper | ✅ |
| Easy Villagers | ✅ |
| Ender IO | ✅ |
| Entangled | ✅ |
| Ex Deorum | ✅ |
| Extended Crafting | ✅ |
| Iron Furnaces | ✅ |
| Iron Jetpacks | ✅ |
| Item Collectors | ✅ |
| Just Hammers | ✅ |
| Mahou Tsukai | ✅ |
| ModernFix | ✅ |
| Modular Routers | ✅ |
| Mystical Agriculture | ✅ |
| Oritech | ✅ |
| Pipez | ✅ |
| Powah | ✅ |
| Refined Storage | ✅ |
| Trash Cans | ✅ |

## All The Mods 11

All The Mods 11 starts, but does not work yet. I do not know for now which mod causes the problem.

## Fabric events

Mods that use `END_SERVER_TICK` through the Fabric API still run on the server thread. When that touches a chunk or an entity, the server thread borrows its region.
Like mcfunctions, this event is to be avoided, it impacts the server's performance globally, and cannot be parallelized.

Moreover `END_SERVER_TICK` has a problem, the region has not necessarily advanced by one tick between two calls. A region at 10 TPS has ticked once out of two. A mod that assumes everyone has ticked exactly once since its last call can be wrong.

## Mapple

Leafs adds no CPU, RAM or GC optimization. These optimizations live in Mapple, an independent mod that works with or without Leafs, without config and without trade-offs, but designed to get the best out of Leafs multithreading.
