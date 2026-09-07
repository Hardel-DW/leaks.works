export const fr = {
    nav: {
        docs: "Docs",
        patchnote: "Patchnote",
        download: "Télécharger",
        menu: "Menu",
        language: "Langue"
    },
    hero: {
        eyebrow: "Fabric · Minecraft 26.2 · serveur",
        title: "Minecraft, en parallèle.",
        subtitle: "Leafs découpe le monde en régions indépendantes. Chaque région vit son propre tick, sur son propre thread. Rien d'autre ne change.",
        primary: "Télécharger sur Modrinth",
        secondary: "Lire la doc"
    },
    regions: {
        title: "Des régions autour des joueurs",
        text: "Les chunks simulés autour d'un joueur forment une région. Deux joueurs qui se rapprochent fusionnent. Une région qui s'étire se scinde.",
        addPlayer: "Ajouter un joueur",
        removePlayer: "Retirer un joueur",
        hint: "Glissez un joueur pour voir la fusion et la scission.",
        legendSimulated: "chunk simulé",
        legendOwned: "possédé, pas simulé",
        legendLoading: "en génération",
        legendCrown: "couronne",
        players: "joueurs",
        regions: "régions"
    },
    clocks: {
        title: "Deux horloges, un seul monde",
        text: "Le thread serveur garde ce qui est global, l'heure et la météo, à coût fixe. Les régions tickent à côté, chacune à son rythme.",
        world: "Horloge monde",
        ticks: "ticks",
        furnace: "un four cuit un lingot",
        legend: "L'heure avance au même rythme partout. La cuisson suit le TPS de la région."
    },
    pool: {
        title: "Une région est une tâche",
        text: "Les régions attendent dans une seule file, triée par prochain tick. Un worker libre prend la première. Une région lourde ne bloque que ses propres joueurs.",
        threads: "Workers",
        regions: "Régions",
        budget: "50 ms",
        late: "en retard"
    },
    pillars: [
        { title: "Zéro feature", text: "Leafs ajoute le multithreading et rien d'autre. Pas d'API, pas de gameplay, pas d'optimisation cachée." },
        { title: "Les mods ne voient rien", text: "Les primitives de Minecraft font la même chose qu'avant. Leafs s'adapte aux mods, jamais l'inverse." },
        { title: "Les commandes coûtent vanilla", text: "Toutes les commandes tournent sur le thread serveur et empruntent les régions qu'elles touchent." }
    ],
    cta: {
        title: "Lisez comment ça marche",
        text: "Les régions, les threads, les emprunts, le courrier. Expliqués simplement, puis en détail dans le code.",
        button: "Ouvrir la doc"
    },
    docs: {
        onThisPage: "Sur cette page",
        previous: "Précédent",
        next: "Suivant",
        groups: { start: "Commencer", model: "Le modèle", use: "Utiliser Leafs", project: "Le projet" }
    },
    patchnote: {
        title: "Patchnote",
        subtitle: "Ce qui change de version en version."
    },
    notFound: {
        title: "Page introuvable",
        text: "Cette page n'existe pas ou a changé d'adresse.",
        back: "Retour à l'accueil"
    },
    footer: {
        made: "Un mod par Hardel.",
        requires: "Nécessite Fabric API, Mapple, ScalableLux et FastNoise."
    }
};
