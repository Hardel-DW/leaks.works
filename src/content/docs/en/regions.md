---
title: Regions
lead: The world splits around players. Simulated chunks form regions, and each region ticks alone.
---

## From simulated chunks to regions

Leafs looks at the simulated chunks, the ones around a player defined by the `simulation distance`. The world is split into a fixed grid of 2x2 chunk sections, adjustable with `section_size`. A section becomes active when one of its chunks is simulated. Active sections that touch each other are grouped into a region.

Regions own a one section crown around their active sections, which they do not tick. Two crowns from two different regions never overlap. The crown absorbs what spills over: a piston, a projectile, a neighbor update.

::regions

## Merge and split

Two distant players each sit in their own region. Regions move with players. Two players who get closer see their regions merge into one. A region that stretches until it splits in two breaks apart. These operations happen between two ticks, never in the middle of a tick.

## What a region owns

A region owns its chunks, its entities, its players, its block entities, the network packets of its players, and its own random generator. During its tick, no one else writes to its content. Reading from another region stays free for everyone.

## In the code

The `region/` folder splits the world with no dependency on Minecraft. `Regionizer` holds the sections and regions under a `StampedLock`. `RegionSection` covers `section_size` chunks per side, a power of two, as a bitset. `Region` carries its section keys, its dead sections and its state.

`LevelRegions`, one instance per dimension, listens to the simulation ticket graph. When a chunk's level crosses into or out of `block ticking`, it calls `addChunk` or `removeChunk`. So it is only the chunks that tick blocks that shape the regions.

### The crown and the merge

When a chunk arrives in an empty section, the regionizer creates the section, then creates or counts every neighbor within a radius of `region_buffer_distance`. These neighbors belong to the region but never tick: that is the crown.

It then looks for neighboring regions within a radius of `region_merge_distance` plus `region_buffer_distance`. The first one serves as the target, preferably one that is not ticking. The others receive a deferred merge. The merge runs as soon as neither the source nor the target is ticking, either right away or at the end of the current tick in `markNotTicking`.

### The states

| State | Meaning |
| --- | --- |
| `READY` | Alive and schedulable. This is the starting state. |
| `TICKING` | A thread is ticking it. It can still gain sections, never lose them. |
| `TRANSIENT` | Alive but promised to a merge whose target is ticking. Never scheduled. |
| `DEAD` | Merged or split. The object is no longer used. |

### The split

When the last chunk of a section leaves, the section becomes dead if no neighbor has a chunk. The regionizer reclaims them lazily, at the end of a tick, once dead sections reach a sixth of the region. It then computes the connected components. If there is more than one, each component becomes a child region, and `RegionCallbacks.split` notifies the rest of the mod.

On a merge, `LevelRegions.merge` realigns the scheduled ticks of the moved chunks onto the target region's clock. On a split, the children resume from the parent's tick. Nothing else moves: what a region keeps between two ticks, `RegionWorldData`, stays in place.
