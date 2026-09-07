import type { DocPage } from "@/content/docs/types";

export default {
    title: "Courrier et emprunt",
    lead: "Deux concepts, et seulement deux, pour que des threads se parlent. Une boîte aux lettres par région, et l'emprunt d'une région par le thread serveur.",
    blocks: [
        { p: "Une règle avant tout : le thread serveur ne touche jamais une région sans l'emprunter. Commandes, évènements Fabric, arrivée et départ d'un joueur, tout passe par là." },
        { h2: "Le courrier" },
        {
            p: "Chaque région a une boîte aux lettres. Ce que les autres régions veulent faire chez elle attend dedans, et elle le fait à la fin de son tick, dans l'ordre d'arrivée. La boîte a deux files :"
        },
        {
            ul: [
                "Le travail de chunk. Publier un chunk généré, le démonter, le sauvegarder. Ça n'attend jamais.",
                "Le travail de jeu. Poser un bloc, téléporter, respawn. Ça peut avoir besoin d'un chunk pas encore chargé, donc ça peut attendre."
            ]
        },
        {
            p: "Une région sert sa boîte dans ce que la période lui laisse, et au moins un dixième de la période. Un tick lourd publie encore, un tick léger publie tout, le reste attend la passe suivante dans l'ordre."
        },
        { h2: "L'emprunt" },
        {
            p: "L'emprunt sert surtout aux commandes. Le thread serveur vise une entité ou un chunk, et cela emprunte leur région. Il fait alors le travail lui-même, dans le même ordre que vanilla, et rend tout à la fin."
        },
        { p: "Une région empruntée ne tick pas pendant ce temps, comme si le thread serveur était son worker. C'est court : une connexion prend moins d'une milliseconde." },
        { h2: "Dans le code" },
        { h3: "La boîte" },
        {
            p: "`RegionInbox` garde deux `ArrayDeque`, `chunkWork` et `gameWork`. `drain()` sert le travail de chunk puis le travail de jeu, autant de tâches qu'il y en avait avant l'appel. Une tâche qui se reposte attend la passe suivante. `drain(deadline)` s'arrête à l'échéance."
        },
        {
            p: "`drainChunkWork()` est ce qu'une attente a le droit de faire tourner. Un thread qui attend un chunk peut ainsi atteindre la publication qui le bloque, sans jamais exécuter de travail de jeu au milieu d'une écriture. Une tâche posée sur un chunk que la région ne possède plus repart par `ChunkOwners.submit`."
        },
        { h3: "L'emprunt" },
        {
            p: "`RegionBorrow` est ce qu'un thread tient pour un travail de jeu. Seule la tête, le thread serveur, attend et prend des régions. Tout autre thread ne fait que lire une région et n'attend jamais."
        },
        {
            ul: [
                "`borrow(regions, x, z)` prend la région qui couvre le chunk, ou le chunk lui-même s'il n'a pas de région.",
                "`take()` boucle tant que la région n'est pas morte : `tryMarkTicking()` réussit, ou la région est promise à une fusion, alors l'emprunt relâche tout pour laisser la fusion se faire et reprend la survivante, sinon il attend en parkant 50 µs entre deux essais.",
                "`borrowAll` prend toutes les régions de toutes les dimensions, jusqu'à ce qu'une passe complète ne prenne ni ne rende plus rien.",
                "`releaseAll()` rend les régions d'abord, puis le courrier restant de chaque chunk emprunté."
            ]
        },
        { h3: "Le travail différé" },
        {
            p: "`DeferredWork` est une tâche de jeu qui part chez le propriétaire d'un chunk avec une raison, `DeferReason` : `RESPAWN`, `PORTAL`, `TELEPORT`, `PLAYER_TELEPORT` ou `BLOCK_WRITE`. Elle revalide sa condition à l'arrivée, par exemple que l'entité est encore vivante, et compte un abandon si elle échoue. `/leafs metrics` affiche ces compteurs."
        },
        { p: "`GlobalScheduler` est la file du thread serveur : tout `MinecraftServer.execute` venu d'un autre thread y atterrit, et le thread serveur la vide une passe à la fois." }
    ]
} satisfies DocPage;
