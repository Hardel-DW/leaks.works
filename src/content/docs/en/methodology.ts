import type { DocPage } from "@/content/docs/types";

export default {
    title: "Methodology",
    lead: "How we work on Leafs. These rules have proven themselves, we do not work around them.",
    blocks: [
        { h2: "The absolute rule" },
        {
            p: "Leafs does what vanilla does, but multithreaded. When one of our rules duplicates a vanilla rule, we remove ours. Mods do not see Leafs: they call the same functions as usual, and those functions do the same thing as before. It is better to remove logic to get closer to vanilla than to add more."
        },
        {
            p: "Modders' development experience comes before optimizations. We would rather sacrifice an optimization and let mods work perfectly. Telling them that what they do will work, but differently, is not an option either."
        },
        {
            p: "When we talk about mods, we mean the big ones: Mekanism, Applied Energistics, Create, Ars Nouveau. Mods that bring in mechanics unknown to vanilla: magic, pollution, machines, energy."
        },
        { h2: "Think about mods in every decision" },
        {
            p: "If we have an issue with points of interest, we do not just fix the raid or the dragon. We take into account mods that have their own points of interest. We always consider custom portals, blocks, entities, structures, and concepts that do not exist in vanilla."
        },
        { h2: "Fixing a bug" },
        {
            p: "The cycle is always the same. We detect it, reproduce it in a single unit test that must be red, fix it, the test turns green, we validate in game. A fix without a reproduction has no value."
        },
        { p: "When a crash comes from a region, we have the id, the dimension, the tick and the stack. We read the whole stack before touching the code. The root cause is rarely the first line." },
        { h2: "Writing code" },
        {
            p: "The logic lives in our modules, mixins are only hooks, written for compatibility between mods: targeted injection or a wrap that composes with other mods' mixins. No single-use function, no dead code, no commented-out code, no duplicating a source of truth. Concurrency primitives stay in our classes. We avoid unchecked casts through architecture rather than through annotations."
        },
        { p: "A comment is one sentence, two at most when there is a bug trail to keep. It says what the code cannot say: a constraint, a why. Never a paraphrase of the code." },
        {
            p: "We think long term. No quick fix that becomes debt, no case by case handling when a single crossing point covers the whole class of the problem. If a clean fix requires rethinking a piece of architecture, we do it."
        },
        { h2: "Testing" },
        {
            ul: [
                "Unit tests, `gradlew test`, run with real Minecraft bootstrapped when needed.",
                "In-game validation follows: connect, disconnect, break and place, chests, furnace, chat, command, death and respawn, round-trip portal.",
                "Load is tested with bots ramping up gradually, and spark in `--thread *`, without which you only see the server thread."
            ]
        }
    ]
} satisfies DocPage;
