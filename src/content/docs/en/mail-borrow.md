---
title: Mail and borrowing
lead: Two concepts, and only two, for threads to talk to each other. An inbox per region, and the server thread borrowing a region.
---

One rule above all: the server thread never touches a region without borrowing it. Commands, Fabric events, a player's arrival and departure, everything goes through it.

## Mail

Each region has an inbox. What the other regions want to do at its place waits inside, and it does it at the end of its tick, in order of arrival. The inbox has two queues:

- Chunk work. Publishing a generated chunk, tearing it down, saving it. This never waits.
- Game work. Placing a block, teleporting, respawning. This may need a chunk not yet loaded, so it may wait.

## Borrowing

Borrowing is mostly used by commands and Fabric events. The server thread targets an entity or a chunk, and that borrows their region. It then does the work itself, in the same order as vanilla, and gives everything back at the end.

A borrowed region does not tick during that time, as if the server thread ticked it itself. It is short: a connection takes less than a millisecond.
