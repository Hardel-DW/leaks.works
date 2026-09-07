import type { DocPage } from "@/content/docs/types";

export default {
    title: "Minecraft, a single thread",
    lead: "The vanilla server handles the whole world sequentially, on a single thread. Here is what that implies, and what Leafs changes.",
    blocks: [
        { h2: "The 50 millisecond loop" },
        { p: "The server runs loops of 50 ms, twenty times a second. That is the famous 20 TPS. On each pass it advances everyone: players, entities, redstone, furnaces, chunk generation." },
        {
            p: "When there is too much work, a pass takes more than 50 ms. TPS drops and everything slows down, with no exception. That is the lag you feel. Since everything is shared, every player affects everyone else."
        },
        { h2: "The problem" },
        {
            p: "If your machine has 6, 12 or 50 cores, the game uses only one to handle everything. Buying more expensive hardware brings nothing. Minecraft was designed fifteen years ago, at a time when several cores were not the norm."
        },
        { h2: "What Leafs aims for" },
        {
            p: "Leafs sets itself a simple rule, drawn from Amdahl's and Gustafson's laws: the number of players and regions must follow the available RAM and threads. To welcome more players, you add cores or RAM, linearly."
        },
        {
            p: "To get there, the server thread keeps a fixed and deterministic cost, and it runs in parallel with region and chunk threads. During development, we try to leave nothing on this global thread."
        },
        {
            note: "The gains assume players are spread across the world. A hundred players in the same spot form a single region, and that region runs on a single thread, just like in vanilla.",
            tone: "warn"
        }
    ]
} satisfies DocPage;
