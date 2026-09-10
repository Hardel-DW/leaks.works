---
title: Methodology
lead: How Leafs was designed. These rules have proven themselves.
---

## The absolute rule

Leafs does what vanilla does, but multithreaded. Mods do not see Leafs, they call the same functions as usual, and these functions must do the same thing as before.

The modders' development experience comes before optimizations. Telling them that what they do will work, but differently, is not an option.

Leafs targets the small **quality of life** mods, as well as the big mods like `Mekanism`, `Applied Energistics`, `Create`, `Ars Nouveau`. Mods that bring mechanics that do not exist in the original game such as magic, pollution, machines, energy, Dyson spheres.

## Think about mods in every decision

During development, when a concept was touched, for example the points of interest `POI`, the raids or the dragon, I tried to put it at the core level so that mods that have their own `POI` are compatible.
This pattern was applied to every concept touched.

## Fixing a bug

The cycle is always the same. We detect, we reproduce in game or in a single unit test that must be red, we fix, that test and every other test of the project must be green, we validate in headless, we run the benchmark to see possible regressions, then a test in real conditions. A fix without a reproduction has no value.

When a crash comes from a region, we have the id, the dimension, the tick and the stack. We read the whole stack before touching the code. The root cause is rarely the first line.

## Testing

- Unit tests, `gradlew test`, run with the real Minecraft bootstrapped when needed.
- In-game validation follows: connect, disconnect, break and place, depending on the bug of course.
- Load is tested with bots ramping up gradually, and spark in `--thread *`, otherwise we only see the server thread.
