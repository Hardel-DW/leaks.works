export const fr = {
    nav: {
        docs: "Docs",
        patchnote: "Patchnote",
        compatibility: "Compatibilité",
        download: "Télécharger",
        menu: "Menu",
        language: "Langue"
    },
    hero: {
        eyebrow: "Fabric · 26.2 · serveur",
        title: "Plus de coeurs, plus de joueurs.",
        subtitle: "Leafs fait tourner le monde en parallèle. Chaque coeur ajoute des joueurs, sur Fabric, avec vos mods et vos datapacks.",
        primary: "Télécharger sur Modrinth",
        secondary: "Lire la doc"
    },
    scale: {
        context: "24 threads · 32 Go",
        unit: "joueurs simultanés",
        rows: { vanilla: "En Vanilla", paper: "Paper", leafs: "Leafs sur Fabric" },
        note: "Mesuré sur un serveur de test.",
        joined: "a rejoint la partie"
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
        text: "Les régions attendent dans une seule file, triée par prochain tick. Un thread libre prend la première. Une région lourde ne bloque que ses propres joueurs.",
        threads: "Threads",
        regions: "Régions",
        budget: "50 ms",
        late: "en retard"
    },
    pillars: [
        { title: "Zéro feature", text: "Leafs ajoute le multithreading et rien d'autre. Pas d'API, pas de gameplay, pas d'optimisation cachée." },
        { title: "Les mods ne voient rien", text: "Les primitives de Minecraft font la même chose qu'avant. Leafs s'adapte aux mods, jamais l'inverse." },
        { title: "Les commandes ont le même coût que en vanilla", text: "Toutes les commandes tournent sur le thread serveur et empruntent les régions qu'elles touchent." }
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
    compatibility: {
        title: "Compatibilité des mods",
        subtitle: "Les mods testés avec Leafs, tels quels, sans correctif spécifique. Un mod absent de la liste n'est pas incompatible, il n'a juste pas encore été testé.",
        search: "Chercher un mod",
        hint: "Les mods client et les datapacks sont tous compatibles.",
        count: "mods",
        empty: "Aucun mod ne correspond.",
        columns: { mod: "Mod", status: "Statut" },
        statuses: { works: "Fonctionne", partial: "Partiel", broken: "Incompatible" }
    },
    notFound: {
        title: "Page introuvable",
        text: "Cette page n'existe pas ou a changé d'adresse.",
        back: "Retour à l'accueil"
    },
    footer: {
        made: "Un mod par Hardel.",
        requires: "Nécessite",
        and: "et"
    }
};
