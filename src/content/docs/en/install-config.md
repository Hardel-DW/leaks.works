---
title: Installation and configuration
lead: Leafs writes its configuration file on first startup. The defaults suit most servers.
---

## Installation

Drop Leafs into the `mods` folder of a Fabric 26.2 server running Java 25, together with Fabric API, Mapple, ScalableLux and FastNoise. Without one of these dependencies, the server refuses to start and says so clearly.

On first startup, Leafs writes `config/leafs.json` with the default values, and sets `sync-chunk-writes` to `false` in `server.properties`. The admin can set it back to `true`, and Leafs never touches it again after that.

## Threads and regions

| Key | Default | Meaning |
| --- | --- | --- |
| `region_threads` | `-1` | The number of region workers. `-1` takes all cores. From 1 to 1024. |
| `chunk_threads` | `-1` | The number of chunk workers. `-1` takes half the cores, at least 1. From 1 to 1024. |
| `section_size` | `2` | The number of chunks per side of a section. A power of two, from 2 to 256. The bigger the section, the bigger the region. |
| `region_merge_distance` | `1` | The distance in sections below which two neighboring regions merge. From 1 to 8. |
| `region_buffer_distance` | `1` | The thickness in sections of the crown a region owns without ticking it. From 1 to 8. |

## Gameplay

| Key | Default | Meaning |
| --- | --- | --- |
| `gameplay.mob_cap_scope` | `level` | With `level`, the mob cap is computed over the whole dimension, like vanilla. With `region`, each region has its own mob cap. |
| `gameplay.mob_cap` | vanilla | The number of entities that can spawn per category: `monster`, `creature`, `ambient` and the others. From 0 to 100000. |

## Debug

| Key | Default | Meaning |
| --- | --- | --- |
| `debug.watchdog_warn_seconds` | `15` | Past this delay, a stuck tick is logged with its thread's stack and the chunk it is waiting on. From 1 to 600. |
| `debug.slow_task_warn_millis` | `50` | Past this delay, a thread that waited for a chunk is logged, and so is an abnormally long mailbox task, with its class. From 0 to 60000. |
| `debug.per_region_logs` | `false` | Each worker takes the name of its region, `R#id dimension`, during its tick. Every log line then says which region wrote it. |

The forced shutdown follows `max-tick-time` from `server.properties`, like vanilla. Past this delay on a region, Leafs writes a crash report with all threads and then kills the JVM. `-1` disables it, and in singleplayer there is no forced shutdown.

```json title="config/leafs.json"
{
    "region_threads": -1,
    "chunk_threads": -1,
    "section_size": 2,
    "region_merge_distance": 1,
    "region_buffer_distance": 1,
    "gameplay": {
        "mob_cap_scope": "level"
    },
    "debug": {
        "watchdog_warn_seconds": 15,
        "slow_task_warn_millis": 50,
        "per_region_logs": false
    }
}
```

:::note
A value changed with `/leafs config` takes effect on the next startup.
:::

## In the code

`LeafsConfig.register` reads the file, checks every range, and writes the defaults if it does not exist. `sectionShift()` is the logarithm of `section_size`, and `Regionizer` requires a shift between 1 and 8. `effectiveRegionThreads()` and `effectiveChunkThreads()` translate the `-1`. `ServerProperties` is the only point that touches `server.properties`, and it only does so on first startup.
