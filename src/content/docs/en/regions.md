---
title: Regions
lead: The world splits around players. Simulated chunks form regions, and each region ticks alone.
---

## From simulated chunks to regions

Leafs looks at the simulated chunks, the ones around the player defined by the `simulation distance`. The world is split into a fixed grid of 2x2 chunk sections, adjustable with `section_size`. A section becomes active when one of its chunks is simulated. Active sections that touch each other are grouped into a region.

Regions own a one section crown around their active sections, which they do not tick. Two crowns of two different regions never overlap. The crown absorbs what spills over: a piston, a projectile, a neighbor update.

::regions

## Merge and split

Two distant players are each in their own region. Regions move with the players. Two players who get closer see their regions merge into one. A region that stretches until it cuts into two pieces splits. These operations happen between two ticks, never in the middle of a tick.

## What a region owns

A region owns its chunks, its entities, its players, its block entities, the network packets of its players and its own random generator. During its tick, no foreign thread can write into the region. Reading from another region stays free for everyone.
