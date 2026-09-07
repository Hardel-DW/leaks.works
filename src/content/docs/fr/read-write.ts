import type { DocPage } from "@/content/docs/types";

export default {
    title: "Lecture et écriture",
    lead: "Chaque chunk a un propriétaire, le seul qui a le droit d'écrire. Lire reste libre pour tout le monde, partout, tout le temps.",
    blocks: [
        { h2: "Le propriétaire d'un chunk" },
        { p: "Minecraft est fait de chunks de 16x16 blocs. Une région est un groupe de chunks qui tickent ensemble. Chaque chunk a un propriétaire, et c'est le seul qui a le droit d'y écrire." },
        {
            ul: [
                "Si une région simule le chunk, la région est le propriétaire.",
                "Sinon personne ne l'est. Le premier thread qui veut y écrire le prend le temps de son écriture, puis le rend.",
                "N'importe quel thread lit n'importe quel chunk, à n'importe quel moment. Un mod qui regarde un bloc à l'autre bout du monde le lit directement."
            ]
        },
        { h2: "Écrire un bloc" },
        { p: "Trois cas, et seulement trois." },
        {
            ol: [
                "Le bloc est chez toi, dans un chunk de ta région. Tu l'écris tout de suite, comme en vanilla.",
                "Le bloc est dans un chunk sans région, une dimension vide, une zone sans joueur. Tu prends le chunk, tu écris, tu relis ton bloc, comme en vanilla.",
                "Le bloc est dans un chunk qu'une autre région est en train de ticker. Tu ne peux pas y toucher pendant son tick. Tu lui envoies un courrier, et elle pose le bloc à son prochain tick. Si tu relis le bloc tout de suite, tu vois encore l'ancien."
            ]
        },
        { note: "Le troisième cas est le [compromis 4](/docs/trade-offs). Il ne se produit que quand on écrit chez un autre joueur pendant qu'il y est.", tone: "warn" },
        { h2: "Dans le code" },
        { p: "`ChunkOwners` est le seul arbitre. `submit(x, z, work, task)` décide où une écriture s'exécute :" },
        {
            ol: [
                "Si le thread courant tient déjà le chunk, la tâche tourne en ligne, et l'appelant relit ce qu'il a écrit.",
                "Si une boîte aux lettres couvre le chunk, celle d'une région ou celle d'un chunk emprunté, la tâche y est postée.",
                "Sans propriétaire, un travail de chunk part au pool, et un travail de jeu fait prendre le chunk au thread appelant.",
                "Un worker du pool ne prend jamais : son travail de jeu part au thread serveur, parce qu'il pourrait attendre un chunk sous sa propre réservation."
            ]
        },
        {
            p: "Deux natures de travail, `Work.CHUNK` et `Work.GAME`. Le travail de chunk, publier, démonter, sauvegarder, éclairer, n'attend jamais rien. Le travail de jeu, poser un bloc, téléporter, respawn, mettre à jour un voisin, peut charger un chunk et attendre."
        },
        { h3: "Le premier écrivain prend" },
        {
            p: "`ChunkOwners.borrow(x, z)` fait un `putIfAbsent` d'une `RegionInbox` sur la clé du chunk. Le premier thread qui insère gagne et reçoit la boîte. Les autres trouvent la boîte au tour suivant et y postent. `release` rend le chunk et redistribue ce qui restait dans la boîte."
        },
        { h3: "Le contrat de lecture" },
        {
            p: "`RegionChunkAccess` porte le contrat : tout thread lit ce qui est publié. Un chunk requis absent est attendu par le thread qui le demande, `ChunkWait`, qui exécute pendant ce temps ce qu'il possède, sa boîte pour une région, sa file pour le thread serveur. `LevelChunks.of(level)` est le composite d'une dimension, le seul que les mixins connaissent."
        },
        {
            p: "Le passage d'un chunk à `FULL` est coupé en deux dans `FullStep` : le pool construit le `LevelChunk`, le propriétaire le publie dans le monde vivant. C'est à cette publication qu'un chunk devient celui d'une région."
        }
    ]
} satisfies DocPage;
