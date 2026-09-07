import type { DocPage } from "@/content/docs/types";

export default {
    title: "Installation et configuration",
    lead: "Leafs crée son fichier de configuration au premier démarrage. Les valeurs par défaut conviennent à la plupart des serveurs.",
    blocks: [
        { h2: "Installation" },
        {
            p: "Déposez Leafs dans le dossier `mods` d'un serveur Fabric 26.2 sous Java 25, avec Fabric API, Mapple, ScalableLux et FastNoise. Sans l'une de ces dépendances, le serveur refuse de démarrer et le dit clairement."
        },
        {
            p: "Au premier démarrage, Leafs écrit `config/leafs.json` avec les valeurs par défaut, et met `sync-chunk-writes` à `false` dans `server.properties`. L'admin peut le remettre à `true`, Leafs n'y touche plus ensuite."
        },
        { h2: "Les threads et les régions" },
        {
            table: {
                head: ["Clé", "Défaut", "Sens"],
                rows: [
                    ["`region_threads`", "`-1`", "Le nombre de workers de régions. `-1` prend tous les coeurs. De 1 à 1024."],
                    ["`chunk_threads`", "`-1`", "Le nombre de workers de chunks. `-1` prend la moitié des coeurs, au moins 1. De 1 à 1024."],
                    ["`section_size`", "`2`", "Le nombre de chunks de côté d'une section. Une puissance de deux, de 2 à 256. Plus la section est grande, plus la région est grande."],
                    ["`region_merge_distance`", "`1`", "La distance en sections sous laquelle deux régions voisines fusionnent. De 1 à 8."],
                    ["`region_buffer_distance`", "`1`", "L'épaisseur en sections de la couronne qu'une région possède sans la ticker. De 1 à 8."]
                ]
            }
        },
        { h2: "Gameplay" },
        {
            table: {
                head: ["Clé", "Défaut", "Sens"],
                rows: [
                    ["`gameplay.mob_cap_scope`", "`level`", "Avec `level`, le mob cap se calcule sur toute la dimension comme en vanilla. Avec `region`, chaque région a son propre mob cap."],
                    ["`gameplay.mob_cap`", "vanilla", "Le nombre d'entités qui peuvent apparaître par catégorie : `monster`, `creature`, `ambient` et les autres. De 0 à 100000."]
                ]
            }
        },
        { h2: "Debug" },
        {
            table: {
                head: ["Clé", "Défaut", "Sens"],
                rows: [
                    ["`debug.watchdog_warn_seconds`", "`15`", "Au-delà de ce délai, un tick bloqué est journalisé avec la pile de son thread et le chunk qu'il attend. De 1 à 600."],
                    [
                        "`debug.slow_task_warn_millis`",
                        "`50`",
                        "Au-delà, un thread qui a attendu un chunk est journalisé, et une tâche de boîte anormalement longue aussi, avec sa classe. De 0 à 60000."
                    ],
                    ["`debug.per_region_logs`", "`false`", "Chaque worker prend le nom de sa région, `R#id dimension`, pendant son tick. Chaque ligne de log dit alors quelle région l'a écrite."]
                ]
            }
        },
        {
            p: "L'arrêt forcé suit `max-tick-time` de `server.properties`, comme en vanilla. Au-delà de ce délai sur une région, Leafs écrit un crash report avec tous les threads puis tue la JVM. `-1` désactive, et en solo il n'y a pas d'arrêt forcé."
        },
        {
            code: '{\n    "region_threads": -1,\n    "chunk_threads": -1,\n    "section_size": 2,\n    "region_merge_distance": 1,\n    "region_buffer_distance": 1,\n    "gameplay": {\n        "mob_cap_scope": "level"\n    },\n    "debug": {\n        "watchdog_warn_seconds": 15,\n        "slow_task_warn_millis": 50,\n        "per_region_logs": false\n    }\n}',
            title: "config/leafs.json"
        },
        { note: "Une valeur changée par `/leafs config` prend effet au prochain démarrage." },
        { h2: "Dans le code" },
        {
            p: "`LeafsConfig.register` lit le fichier, vérifie chaque plage, et écrit les défauts s'il n'existe pas. `sectionShift()` est le logarithme de `section_size`, et `Regionizer` exige un décalage entre 1 et 8. `effectiveRegionThreads()` et `effectiveChunkThreads()` traduisent le `-1`. `ServerProperties` est le seul point qui touche `server.properties`, et il ne le fait qu'au premier démarrage."
        }
    ]
} satisfies DocPage;
