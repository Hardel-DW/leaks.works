---
title: The /leafs command
lead: A single command to see the regions, the timings, the counters and the memory. Reserved for operators.
---

## Regions

`/leafs regions` shows the number of threads, the server thread's TPS, then one line per dimension containing the region number, number of chunks, number of entities, the slowest region. The last line says which region you are in.

`/leafs regions <dimension>` details the regions of the dimension, its live or dead sections, the regions created or destroyed, those merged or split, then one line per region with its id, its state, its TPS, its tick duration, its chunks and its entities.

## Timings

`/leafs timings` shows the cost of each step of a tick, either of the server or of the dimension, it is an average over the last hundred ticks. The TPS shown is computed over the last five seconds.

- `/leafs timings` : Shows the steps of each tick in ms of the server thread.
- `/leafs timings <dimension>` : Shows the steps of each tick in ms of the dimension. The border, the weather, the time, the raids etc...
- `/leafs timings <dimension> <id>` : Shows the steps of each tick in ms of the region. Its steps, its TPS, its chunks, its entities.

## Counters

`/leafs metrics` shows the information of the last minute, the borrows, the messages the regions send each other and the drops, the incoming and outgoing packets, the chunks loaded and unloaded, and the times two threads wanted the same player.

## Memory

`/leafs ram` shows the RAM used by the server, the heap and the total RAM, the number of times the garbage collector ran, and more technical information.

## Config and crash

- `/leafs config [key]` shows the value of the key.
- `/leafs config [key] [value]` modifies the configuration file, it takes effect on the next restart.

`/leafs crash <dimension> <region>` crashes the game. Originally it served a feature since removed that isolated crashes per region.
