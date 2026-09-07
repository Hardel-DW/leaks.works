import type { DocPage } from "@/content/docs/types";

export default {
    title: "Les compromis",
    lead: "Chaque écart volontaire avec vanilla est listé ici, avec son explication. S'il est là, c'est qu'on n'a pas eu le choix.",
    blocks: [
        { h2: "Compromis bénéfiques" },
        { p: "Ces compromis sont un peu des fonctionnalités. Ils sont même bénéfiques pour le jeu : moins de triche, ou plus de possibilités de gameplay. On évite de les supprimer." },
        {
            ol: [
                "Chaque région a son propre aléatoire. Aucun effet visible en jeu.",
                "Chaque région vit à son propre TPS. Un four peut être plus lent d'une région à l'autre.",
                "Toutes les commandes s'exécutent sur le thread serveur, qui emprunte les régions qu'elles touchent."
            ]
        },
        { h2: "Vrais compromis" },
        {
            ol: [
                "Écrire un bloc là où une autre région est en train de ticker arrive au tick suivant. Le bloc est bien posé, mais le relire tout de suite rend l'ancien. Partout ailleurs, y compris dans une dimension où personne ne se trouve, l'écriture est finie quand l'appel rend la main, comme en vanilla. Une région ne tick que là où un joueur est simulé, donc ce cas demande d'écrire chez un autre joueur pendant qu'il y est.",
                "Les téléportations et les portails arrivent au plus tard au tick suivant de la région cible.",
                "`END_SERVER_TICK`. Les mods qui font leur travail une fois par tick via la Fabric API tournent toujours vingt fois par seconde, mais le monde autour n'a pas forcément avancé d'un tick entre deux appels. Une région à 10 TPS a fait un tick sur deux.",
                "Un command block, ou un minecart à command block, déclenché par la redstone s'exécute un tick plus tard qu'en vanilla. La redstone tourne sur la région et la commande sur le thread serveur. Une commande tapée dans le chat ou lancée par un datapack n'a pas ce retard."
            ]
        },
        { note: "La numérotation suit celle du dépôt : les compromis 1 à 3 sont bénéfiques, les compromis 4 à 7 sont les vrais. Le reste de la doc y renvoie par ces numéros." }
    ]
} satisfies DocPage;
