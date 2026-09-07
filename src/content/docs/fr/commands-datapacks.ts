import type { DocPage } from "@/content/docs/types";

export default {
    title: "Commandes et datapacks",
    lead: "Toutes les commandes tournent sur le thread serveur, peu importe qui les lance. Une commande coûte exactement son coût vanilla.",
    blocks: [
        { h2: "Une commande emprunte ce qu'elle touche" },
        {
            p: "Le thread serveur emprunte une région au moment où la commande touche un de ses chunks ou une de ses entités, la garde jusqu'à la fin de la commande, puis la rend. Ce que la commande touche décide de ce qu'elle emprunte :"
        },
        {
            ul: [
                "Un `/say` n'emprunte rien.",
                "Un `/give @a` emprunte les régions où il y a des joueurs.",
                "Un `/setblock` emprunte la région du chunk visé, et charge le chunk avant si besoin. Ce chargement bloque le thread serveur, comme en vanilla.",
                "Un `/kill @e` emprunte toutes les régions, parce que c'est ce que la commande veut dire."
            ]
        },
        {
            p: "Un datapack coûte donc exactement ce qu'il coûte en vanilla. Un datapack lourd qui vit dans `tick.json` reste sur un seul thread et ne profite pas du multithreading. Il ralentit le thread serveur et les régions qu'il emprunte pendant ses commandes, pas les autres."
        },
        { h2: "Les command blocks" },
        {
            p: "Un command block, ou un minecart à command block, déclenché par la redstone s'exécute un tick plus tard qu'en vanilla. La redstone tourne sur la région et la commande sur le thread serveur, et le passage de l'un à l'autre attend le tick suivant. Une commande tapée dans le chat ou lancée par un datapack n'a pas ce retard. C'est le [compromis 7](/docs/trade-offs)."
        },
        {
            note: "Il est recommandé de limiter les commandes sur un gros serveur. Le support existe et coûte vanilla, mais tout ce qui tourne sur le thread serveur ne profite pas des coeurs supplémentaires.",
            tone: "warn"
        },
        { h2: "Dans le code" },
        {
            p: "`CommandEngine` accroche `Commands.executeCommandInContext`, le point de passage de toute commande et de toute fonction. Hors du thread serveur, l'exécution entière est postée dans `GlobalScheduler` et tourne au tick suivant. Sur le thread serveur, elle tourne comme une tête : un `RegionBorrow` qui prend d'abord la région de l'entité source, puis chaque région ou chunk sans région au premier contact, et rend tout à la fin."
        },
        {
            p: "`runCommandBlock` prend le chunk du command block pour toute la durée, écritures de sortie comprises. `runBorrowingAll` prend toutes les régions de toutes les dimensions d'abord : c'est le chemin des rechargements de datapacks et du flush de `save-all`."
        }
    ]
} satisfies DocPage;
