---
title: The /leafs command
lead: A single command to see regions, timings, counters and memory. Reserved for operators.
---

## Regions

`/leafs regions` shows the number of workers, the server thread's TPS, then one line per dimension: regions, chunks, entities, the serial part's TPS and the slowest region. The last line says which region you are in.

`/leafs regions <dimension>` details a dimension: live and dead sections, regions created, destroyed, merged and split, then one line per region with its id, its state, its TPS, its tick duration, its chunks and its entities.

## Timings

`/leafs timings` shows the cost of each step of a tick, averaged over the last hundred ticks. The TPS shown at the top comes from a five-second window.

- `/leafs timings`: the server thread. Dimensions, the global queue, connections, the player list and the autosave.
- `/leafs timings <dimension>`: the dimension's serial part. Border, weather, time, raids, tickets, view, unloads, the dragon and management.
- `/leafs timings <dimension> <id>`: a region. Its fifteen steps, its TPS, its chunks, its entities and its average startup lag.

## Counters

`/leafs metrics` shows the last minute: borrows for Fabric events, work handed off to another region and drops by reason, incoming and outgoing packets, chunks loaded and unloaded, and how many times two threads wanted the same player.

## Memory

`/leafs ram` shows the RAM used by the server, the committed and maximum heap, the number of collections and their duration per garbage collector, and per dimension the number of holders and sections of the graphs.

## Config and crash

`/leafs config [key] [value]` shows every configurable key, or a single one, or rewrites one in the file. The new value takes effect on the next startup.

`/leafs crash <dimension> <region>` crashes a region, to check that the isolated crash report works. The region writes its report to `crash-reports/region-crash-<date>.txt` with its id, its dimension, its tick, its chunks, its entities, the suspect mod and the stack.

## In the code

The `debug/` folder has one class per subcommand. `TimingsCommand` averages over `AVERAGE_WINDOW_TICKS`, a hundred ticks, and reads the TPS from `StageTimings`, a `WINDOW_NANOS` window, five seconds. `MetricsCommand` reads `ServerMetrics`, where each counter is a `MinuteCounter` of sixty one-second buckets. `RegionCrashReport` and `RegionCrashWriter` write a region's report, and `ModAttribution` finds the mod for a stack frame using the loader's paths.
