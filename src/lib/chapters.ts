export interface Chapter {
    path: string;
    title: string;
    summary: string;
    icon: string;
}

export interface ChapterPart {
    title: string;
    intent: string;
    tint: string;
    chapters: Chapter[];
}

export const PARTS: ChapterPart[] = [
    {
        title: "Les bases",
        intent: "Le problème que Leafs résout, et la géométrie qui rend la solution possible.",
        tint: "#38bdf8",
        chapters: [
            { path: "/problem", title: "Le probleme", summary: "Pourquoi un serveur Minecraft n'utilise qu'un seul cœur, et ce que ça coûte.", icon: "/icons/warning.svg" },
            { path: "/world-grid", title: "Le monde en grille", summary: "Blocs, chunks, sections. La grille sur laquelle tout le reste est construit.", icon: "/icons/block.svg" },
            { path: "/regions", title: "Les regions", summary: "Le découpage vivant du monde. Déplace des joueurs et regarde les régions naître, fusionner et se scinder.", icon: "/icons/globe.svg" }
        ]
    },
    {
        title: "Le moteur",
        intent: "Qui exécute quoi, quand, et comment personne ne se marche dessus.",
        tint: "#8b5cf6",
        chapters: [
            { path: "/threads", title: "Les threads", summary: "Les quatre familles de threads et le verrou qui les sépare par dimension.", icon: "/icons/session.svg" },
            { path: "/region-tick", title: "Le tick de region", summary: "Les phases qu'une région joue chaque tick, dans l'ordre exact de vanilla.", icon: "/icons/reload.svg" },
            { path: "/barrier", title: "Le thread global et la barriere", summary: "Ce qui reste global, et la fenêtre qui met tout le monde en pause quand il le faut.", icon: "/icons/lock.svg" },
            { path: "/clocks", title: "Les deux horloges", summary: "Le temps du jeu et le temps de région, et pourquoi un four a besoin des deux.", icon: "/icons/pending.svg" }
        ]
    },
    {
        title: "Le monde vivant",
        intent: "Les systèmes que tu vois en jeu, revus pour tourner sur plusieurs cœurs.",
        tint: "#79c894",
        chapters: [
            { path: "/tickets", title: "Les tickets et les chunks", summary: "Comment un chunk se charge, reste chargé, puis part. Niveaux 41, 33 et 31.", icon: "/icons/packs.svg" },
            { path: "/worldgen", title: "La generation parallele", summary: "Plusieurs chunks générés en même temps, sans que deux voisins s'écrivent dessus.", icon: "/icons/jigsaw.svg" },
            { path: "/network", title: "Le réseau et les joueurs", summary: "Une file de paquets par joueur, drainée par la région qui le possède.", icon: "/icons/navigation.svg" },
            { path: "/teleports", title: "Teleportations et portails", summary: "Ce qui se passe quand une entité sort de sa région ou change de dimension.", icon: "/icons/locate.svg" },
            { path: "/commands", title: "Commandes et command blocks", summary: "Où s'exécute une commande, et les deux gamerules qui coupent le coût.", icon: "/icons/terminal.svg" },
            { path: "/shared-state", title: "Les donnees partagees", summary: "Scoreboard, cartes, points d'intérêt. Ce que plusieurs régions touchent en même temps.", icon: "/icons/registries.svg" }
        ]
    },
    {
        title: "Le code",
        intent: "La surface de contact avec vanilla, les écarts assumés, et les réglages.",
        tint: "#e0776e",
        chapters: [
            { path: "/mixins", title: "Les mixins", summary: "Chaque point d'accroche dans le code de Minecraft, et pourquoi il existe.", icon: "/icons/code.svg" },
            { path: "/tradeoffs", title: "Les compromis", summary: "Les dix écarts avec vanilla, listés, expliqués, assumés.", icon: "/icons/ban.svg" },
            { path: "/config", title: "Config et débogage", summary: "leafs.json, les commandes de diagnostic, le watchdog.", icon: "/icons/settings.svg" },
            { path: "/codebase", title: "L'arborescence", summary: "Un dossier égale une responsabilité. La carte du dépôt.", icon: "/icons/folder.svg" }
        ]
    }
];

export const CHAPTERS: Chapter[] = PARTS.flatMap((part) => part.chapters);

export const chapterAt = (path: string) => CHAPTERS.find((chapter) => chapter.path === path);

export const partAt = (path: string) => PARTS.find((part) => part.chapters.some((chapter) => chapter.path === path));

export const neighbours = (path: string) => {
    const index = CHAPTERS.findIndex((chapter) => chapter.path === path);
    return { previous: index > 0 ? CHAPTERS[index - 1] : undefined, next: index >= 0 ? CHAPTERS[index + 1] : undefined };
};
