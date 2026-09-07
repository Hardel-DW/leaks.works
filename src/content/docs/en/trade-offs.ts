import type { DocPage } from "@/content/docs/types";

export default {
    title: "Trade-offs",
    lead: "Every deliberate departure from vanilla is listed here, with its explanation. If it is here, it is because we had no choice.",
    blocks: [
        { h2: "Beneficial trade-offs" },
        { p: "These trade-offs are almost features. They are even beneficial for the game: less cheating, or more gameplay possibilities. We avoid removing them." },
        {
            ol: [
                "Each region has its own randomness. No visible effect in game.",
                "Each region lives at its own TPS. A furnace can be slower from one region to another.",
                "Every command runs on the server thread, which borrows the regions it touches."
            ]
        },
        { h2: "Real trade-offs" },
        {
            ol: [
                "Writing a block where another region is currently ticking happens on the next tick. The block is indeed placed, but reading it right back returns the old one. Everywhere else, including in a dimension where no one is present, the write is finished when the call returns, like vanilla. A region only ticks where a player is simulated, so this case requires writing at another player's location while it is happening.",
                "Teleports and portals arrive at the target region's next tick at the latest.",
                "`END_SERVER_TICK`. Mods that do their work once per tick through the Fabric API still run twenty times per second, but the world around it has not necessarily advanced by one tick between two calls. A region at 10 TPS has ticked every other tick.",
                "A command block, or a minecart with a command block, triggered by redstone runs one tick later than in vanilla. The redstone runs on the region and the command on the server thread. A command typed in chat or run by a datapack has no such delay."
            ]
        },
        { note: "The numbering follows the repository's own: trade-offs 1 to 3 are beneficial, trade-offs 4 to 7 are the real ones. The rest of the docs refer to them by these numbers." }
    ]
} satisfies DocPage;
