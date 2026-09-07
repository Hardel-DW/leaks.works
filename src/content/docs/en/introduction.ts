import type { DocPage } from "@/content/docs/types";

export default {
    title: "Introduction",
    lead: "Leafs is a server side Fabric mod. It splits the Minecraft world into independent regions and ticks each region on its own thread.",
    blocks: [
        {
            p: "On a classic server, every cost is shared. Each player, each machine, each area being generated weighs on the same thread. Leafs splits the world into independent regions, and each region lives its own tick at 20 TPS."
        },
        {
            p: "Leafs adds multithreading, and nothing else. No gameplay feature, no API, no hidden optimization. The RAM and CPU gains live in a separate mod, **Mapple**, which works with or without Leafs."
        },
        { h2: "What to install" },
        { ul: ["Minecraft 26.2, Java 25 and Fabric Loader 0.19.3 or newer.", "Fabric API.", "Mapple, ScalableLux and FastNoise. Leafs depends on them and refuses to start without them."] },
        { h2: "What is incompatible" },
        { p: "C2ME, Moonrise and VMP rewrite the chunk engine their own way. Leafs declares them incompatible and the game refuses to load them together." },
        { p: "Lithium, Ferrite and Mapple are compatible. Leafs itself disables the few Lithium options that would touch the chunk engine, there is nothing to configure." },
        { h2: "How to read this documentation" },
        {
            p: "Each chapter reads on two levels. First the simple explanation, to understand the model without opening the code. Then a **In the code** section, with the real classes from the repository, for a developer who wants to know where to look."
        },
        {
            ol: [
                "[Minecraft, a single thread](/docs/vanilla). Why the vanilla server does not benefit from your cores.",
                "[Regions](/docs/regions). How the world splits around players.",
                "[Threads](/docs/threads). The server thread, the region workers and the chunk workers.",
                "[Read and write](/docs/read-write). Who has the right to write where.",
                "[Mail and borrowing](/docs/mail-borrow). The only two coordination tools.",
                "[Trade-offs](/docs/trade-offs). Every departure from vanilla, and why it exists."
            ]
        },
        { note: "Everything written here can be found in the mod's code. A statement that cannot be found in the code does not get written." }
    ]
} satisfies DocPage;
