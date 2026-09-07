import type { DocPage } from "@/content/docs/types";

export default {
    title: "Commands and datapacks",
    lead: "Every command runs on the server thread, no matter who triggers it. A command costs exactly its vanilla cost.",
    blocks: [
        { h2: "A command borrows what it touches" },
        {
            p: "The server thread borrows a region the moment the command touches one of its chunks or one of its entities, keeps it until the command finishes, then gives it back. What the command touches decides what it borrows:"
        },
        {
            ul: [
                "A `/say` borrows nothing.",
                "A `/give @a` borrows the regions where there are players.",
                "A `/setblock` borrows the region of the targeted chunk, and loads the chunk beforehand if needed. This load blocks the server thread, like vanilla.",
                "A `/kill @e` borrows every region, because that is what the command means."
            ]
        },
        {
            p: "A datapack therefore costs exactly what it costs in vanilla. A heavy datapack living in `tick.json` stays on a single thread and does not benefit from multithreading. It slows down the server thread and the regions it borrows during its commands, not the others."
        },
        { h2: "Command blocks" },
        {
            p: "A command block, or a minecart with a command block, triggered by redstone runs one tick later than in vanilla. The redstone runs on the region and the command on the server thread, and the handoff between the two waits for the next tick. A command typed in chat or run by a datapack has no such delay. This is [trade-off 7](/docs/trade-offs)."
        },
        {
            note: "It is recommended to limit commands on a large server. Support exists and costs the vanilla amount, but anything that runs on the server thread does not benefit from the extra cores.",
            tone: "warn"
        },
        { h2: "In the code" },
        {
            p: "`CommandEngine` hooks `Commands.executeCommandInContext`, the crossing point for every command and every function. Off the server thread, the whole execution is posted to `GlobalScheduler` and runs on the next tick. On the server thread, it runs as a head: a `RegionBorrow` that first takes the source entity's region, then each region or unowned chunk on first contact, and gives everything back at the end."
        },
        {
            p: "`runCommandBlock` holds the command block's chunk for the whole duration, including output writes. `runBorrowingAll` takes every region of every dimension first: this is the path used by datapack reloads and by `save-all`'s flush."
        }
    ]
} satisfies DocPage;
