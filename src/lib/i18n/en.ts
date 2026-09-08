import type { Text } from "@/lib/i18n";

export const en: Text = {
    nav: {
        docs: "Docs",
        patchnote: "Patchnote",
        download: "Download",
        menu: "Menu",
        language: "Language"
    },
    hero: {
        eyebrow: "Fabric · 26.2 · server side",
        title: "More cores, more players.",
        subtitle: "Leafs runs the world in parallel. Every core adds players, on Fabric, with your mods and your datapacks.",
        primary: "Download on Modrinth",
        secondary: "Read the docs"
    },
    scale: {
        context: "24 threads · 32 GB",
        unit: "concurrent players",
        rows: { vanilla: "Vanilla", paper: "Paper", leafs: "Leafs on Fabric" },
        note: "Measured on a test server.",
        joined: "joined the game"
    },
    regions: {
        title: "Regions grow around players",
        text: "The simulated chunks around a player form a region. Two players who get close merge. A region that stretches too far splits.",
        addPlayer: "Add a player",
        removePlayer: "Remove a player",
        hint: "Drag a player to watch regions merge and split.",
        legendSimulated: "simulated chunk",
        legendOwned: "owned, not simulated",
        legendLoading: "generating",
        legendCrown: "crown",
        players: "players",
        regions: "regions"
    },
    clocks: {
        title: "Two clocks, one world",
        text: "The server thread keeps what is global, time and weather, at a fixed cost. Regions tick beside it, each at its own pace.",
        world: "World clock",
        ticks: "ticks",
        furnace: "a furnace smelts one ingot",
        legend: "Time of day advances at the same pace everywhere. Smelting follows the TPS of the region."
    },
    pool: {
        title: "A region is a task",
        text: "Regions wait in a single queue, sorted by next tick. A free thread takes the first one. A heavy region only slows its own players.",
        threads: "Threads",
        regions: "Regions",
        budget: "50 ms",
        late: "late"
    },
    pillars: [
        { title: "Zero features", text: "Leafs adds multithreading and nothing else. No API, no gameplay, no hidden optimisation." },
        { title: "Mods see nothing", text: "Minecraft's primitives do what they always did. Leafs adapts to mods, never the other way around." },
        { title: "Same command cost as vanilla.", text: "Every command runs on the server thread and borrows the regions it touches." }
    ],
    cta: {
        title: "Read how it works",
        text: "Regions, threads, borrowing, mail. Explained simply first, then in detail through the code.",
        button: "Open the docs"
    },
    docs: {
        onThisPage: "On this page",
        previous: "Previous",
        next: "Next",
        groups: { start: "Start", model: "The model", use: "Using Leafs", project: "The project" }
    },
    patchnote: {
        title: "Patchnote",
        subtitle: "What changes from one version to the next."
    },
    notFound: {
        title: "Page not found",
        text: "This page does not exist or has moved.",
        back: "Back to home"
    },
    footer: {
        made: "A mod by Hardel.",
        requires: "Requires",
        and: "and"
    }
};
