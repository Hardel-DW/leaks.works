---
title: Read and write
lead: Every chunk has an owner, the only one allowed to write. Reading stays free for everyone, everywhere, all the time.
---

## A chunk's owner

Minecraft is made of 16x16 block chunks. A region is a group of chunks that tick together. Every chunk has an owner, and it is the only one allowed to write to it.
- If a region simulates the chunk, the region is the owner.
- Otherwise nobody is. The first thread that wants to write to it takes it for the duration of its write, then gives it back.
- Any thread reads any chunk, at any time. A mod that looks at a block on the other side of the world reads it directly.

## Writing a block

Three cases, and only three.
1. The block is at your place, in a chunk of your region. You write it right away, like in vanilla.
2. The block is in a chunk without a region, an empty dimension, an area without a player. You take the chunk, you write, you read your block back, like in vanilla.
3. The block is in a chunk that another region is currently ticking. You cannot touch it during its tick. You send it mail, and it places the block on its next tick. If you read the block back right away, you still see the old one.

:::note{tone="warn"}
The third case is mentioned in the [Trade-offs](/docs/trade-offs). It only happens when writing at another player's place while they are there.
:::
