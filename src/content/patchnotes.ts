import type { Locale } from "@/lib/store/locale";

type Localized = Record<Locale, string>;

export type Release = { version: string; date: string; minecraft: string; summary: Localized; changes: Record<Locale, string[]> };

export const PATCHNOTES: Release[] = [
    {
        version: "1.0.0",
        date: "2026",
        minecraft: "Minecraft 26.2 · Fabric",
        summary: {
            fr: "Première version. Le monde tick par régions, sur un pool de workers, à côté d'un thread serveur à coût fixe.",
            en: "First release. The world ticks by regions, on a pool of workers, beside a fixed-cost server thread."
        },
        changes: {
            fr: [
                "Régions découpées en sections de `section_size` chunks, avec couronne, fusion et scission entre deux ticks.",
                "Un pool de workers de régions et un pool de workers de chunks indépendants, à priorité système minimale.",
                "Trois graphes de tickets, joueurs, simulation et chargement, alimentés et drainés depuis n'importe quel thread.",
                "Le propriétaire d'un chunk est le seul à écrire. Le premier écrivain prend un chunk sans région.",
                "Courrier par région à deux files, travail de chunk et travail de jeu, et emprunt par le thread serveur pour les commandes, les évènements Fabric et les connexions.",
                "Autosave par époque fait par les régions. Les chunks partent au disque en octets, encodés sur le pool.",
                "La commande `/leafs` : `regions`, `timings`, `metrics`, `ram`, `config`, `crash`.",
                "Watchdog par thread et crash report isolé par région, avec le mod suspect.",
                "Dépendances : Fabric API, Mapple, ScalableLux, FastNoise. Incompatible avec C2ME, Moonrise et VMP."
            ],
            en: [
                "Regions cut into sections of `section_size` chunks, with a crown, merging and splitting between two ticks.",
                "Independent region worker and chunk worker pools, chunk workers at the lowest system priority.",
                "Three ticket graphs, players, simulation and loading, fed and drained from any thread.",
                "The owner of a chunk is the only writer. The first writer takes a chunk without a region.",
                "Per-region mail with two queues, chunk work and game work, and borrowing by the server thread for commands, Fabric events and connections.",
                "Epoch-based autosave done by regions. Chunks reach the disk as bytes, encoded on the pool.",
                "The `/leafs` command: `regions`, `timings`, `metrics`, `ram`, `config`, `crash`.",
                "A per-thread watchdog and an isolated crash report per region, naming the suspect mod.",
                "Dependencies: Fabric API, Mapple, ScalableLux, FastNoise. Incompatible with C2ME, Moonrise and VMP."
            ]
        }
    }
];
