---
title: Benchmark
lead: Leafs in numbers, how the tests are run, the figures Leafs aims for, and a comparison with C2ME on the chunk side.
---

# Benchmark
A blank server starts on a blank world with the same `seed`. Leafs uses the Overstress mod, which simulates players as authentic as real ones, driven by scenarios. The bots therefore perform the same actions in the same order, with no randomness in the game.
This benchmark runs in a private `repository` with 12 cores / 24 threads on a Ryzen 5900X, with 12 chunk threads and 12 region threads.
Several scenarios exist, only a few are mentioned here, `worldgen` and `ramp`.

## Leafs aims for
- A player alone in their region holds 20 TPS, whatever the world generation around them.
- Loading and unloading during `worldgen`, as well as connecting and disconnecting, must not affect a region's TPS.
- The server thread must have a fixed cost, under 1 ms, independent of the number of chunks, entities or players.
- The serial part per dimension stays under 0.5 ms.
- Chunk generation must scale linearly with the number of chunk threads.
- The number of players and regions must scale linearly with threads and RAM.
- Memory must be stable and constant, with no memory leaks.
- No stuck thread must ever be detected.
- The CPU must not exceed 70 % on the established benchmark.
- Chunk reads and writes from third-party mods, commands, datapacks and redstone machines must work.
- An exception in a region's tick stops the server with that region's crash report.

## The worldgen scenario
5 bots fly at 36 blocks/s with a `view distance` of 10 for 3 minutes. This scenario measures generation and its effect on the regions.

| measure | target | reference run |
|---|---|---|
| Minimum TPS | 19.9 or 20 | 20 |
| Server thread mspt | under 1 | 0.5 |
| Full chunks/s | linear with the chunk workers | 383 |
| Bot speed | 36.0 | 36.0 |
| View generated over the last 60 seconds | 100 % | 100 % |
| Samples with an incomplete view | 0 % | 0 % |
| Cores consumed | under 14 | 12.8 |
| Memory heap at end of run | Stable < 1 GB | 0.68 GB |
| Holders waiting for teardown | 0 | 0 |
| Worst tick of a region stage | under 50 ms | tasks 37 ms |

## The ramp scenario
One bot every 3 seconds up to 300, over 20,000 blocks, for fifteen minutes, with `locator_bar` disabled. The bots walk through untouched terrain.
This gives the number of players the machine holds at 20 TPS. This is the hardware limit.
The number of full chunks per second is lower in this scenario because the region threads are busier, so fewer resources go to the world generation threads. This works as expected. The game experience at 20 TPS matters more than the world generation speed.

| measure | reference run |
|---|---|
| Capacity | 208 players at 622 s |
| Full chunks/s | 195 |
| Cores consumed | 13.4 |
| Server thread mspt | 1.3 ms |

## Comparing to C2ME
Leafs has roughly the same values on 12 threads: `329` announced by C2ME, but we measured `366` internally. Leafs gets `383`. That is slightly higher, by a few chunks per second, and the gain comes down to measurement noise.
C2ME and Leafs are both based on ScalableLux and FastNoise, and the approach stays fairly similar.
Like C2ME, the gains scale linearly with the number of threads.
Lithium/VMP/Chunky were not used for the benchmarks.
