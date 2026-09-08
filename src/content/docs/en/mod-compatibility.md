---
title: Mod compatibility
lead: Mods do not adapt to Leafs. Leafs adapts to mods. This rule comes before every other one.
---

## Primitives

Primitives are the lowest, most used methods in Minecraft's code, the ones that carry the most traffic: reading and writing a block, loading a chunk, teleporting an entity, sending a packet. Leafs modifies these primitives, and only these. Mods use them without knowing it, and are therefore automatically compatible.

Every change to an internal Mojang function was designed to stay identical in practice. A mod that reads a block on the other side of the world reads it. A mod that places a block at home sees it placed. A mod that teleports an entity finds it at the destination.

:::note{tone="warn"}
Leafs must never create bugs or issues in a mod. If it does, that is a Leafs bug: open a ticket.
:::

## What is known

- Compatible: Lithium, Ferrite, Mapple.
- Incompatible: C2ME, VMP, Moonrise. They rewrite the same chunk engine.

## Fabric events

Mods that do their work once per tick through the Fabric API still run twenty times per second, on the server thread. When a subscriber touches a chunk or an entity, the server thread borrows its region on contact. A mod that touches nothing stops no one.

The world around it has not necessarily advanced by one tick between two calls. A region at 10 TPS has ticked every other tick. A mod that assumes everyone has ticked exactly once since its last call may be wrong. This is [trade-off 6](/docs/trade-offs).

## Mapple

Leafs adds no optimization of its own, neither CPU, RAM, nor garbage collector. Every optimization lives in Mapple, an independent mod that works with or without Leafs, with no config and no trade-off, but designed to get the best out of Leafs's multithreading.

## Debug and metrics

Leafs creates the metrics and provides `/leafs` to read them. `Leafs Debug and Metrics` is an additional, independent mod that displays this data client-side in F3 and enables RAM analysis.

## In the code

`FabricTickEvents` wraps `START_SERVER_TICK` and `END_SERVER_TICK` with a borrow, only when the event has subscribers, which `FabricEventAccess` reveals. `ServerTickEventsShim` places the hook around the vanilla calls that surround each emission. These borrows are counted and visible in `/leafs metrics`.

`SharedStateMonitor` serializes global server state, scoreboard, saved data, maps, random sequences, between the other threads and the server thread. `LockedRandomSource` protects a shared sequence on the same monitor as its save. `ConcurrentWaypointManager` is the locator bar's manager without its lock, one line per receiver, and it walks nothing when the `locator_bar` rule is off.

In `fabric.mod.json`, `breaks` declares C2ME, Moonrise and VMP, and `lithium:options` turns off the Lithium mixins that would touch the chunk engine, palettes and random ticks. When a region crashes, `ModAttribution` finds the mod for a stack frame for the suspect mod line of the report.
