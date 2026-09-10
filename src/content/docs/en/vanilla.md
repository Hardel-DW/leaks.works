---
title: Minecraft, a single thread
lead: The vanilla server handles the whole world sequentially, on a single thread. Here is what that implies, and what Leafs changes.
---

## The 50 millisecond loop

The Minecraft server runs loops of 50 ms, twenty times a second. That is the famous 20 TPS. On each pass, it advances everyone: players, entities, redstone, furnaces, chunk generation.

When there is too much work, so when the `tick` takes more than 50 ms, the TPS drops and everything slows down. That is the lag you feel. Since everything is shared, every player affects everyone else.

## The problem of the base game

If your machine has 6, 12 or 50 cores, the game uses only one to handle everything. Buying more expensive hardware brings nothing. Minecraft was designed fifteen years ago, at a time when several cores were not the norm.

## What Leafs aims for

Leafs sets itself a simple rule, drawn from the computing laws of `Amdahl` and `Gustafson`. In short, these laws applied to Minecraft imply that the number of players and regions must follow the available RAM and threads. To welcome more players, you add cores or RAM, linearly.

To get there, the server thread keeps a fixed and deterministic cost, and it runs in parallel with the region and chunk threads.

:::note{tone="warn"}
The gains assume players are spread across the world. A hundred players in the same spot form a single region, and that region runs on a single thread, like in vanilla.
:::
