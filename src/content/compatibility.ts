import { slugify } from "../lib/utils";
import type { Locale } from "./content";

export const STATUSES = ["works", "partial", "broken"] as const;
export type Status = (typeof STATUSES)[number];
export type Mod = { name: string; status: Status; note?: Record<Locale, string> };
const works = (name: string): Mod => ({ name, status: "works" });

const ENTRIES: Mod[] = [
    works("Advanced AE"),
    works("Apotheosis"),
    works("Apothic Attributes"),
    works("Apothic Enchanting"),
    works("Apothic Spawners"),
    works("Applied Energistics 2"),
    works("Architectury"),
    works("AttributeFix"),
    works("Balm"),
    works("Chunk Loaders"),
    works("Clumps"),
    works("Common Capabilities"),
    works("Construction Sticks"),
    works("Copper Hopper"),
    works("Cyclops Core"),
    works("Easy Villagers"),
    works("Ender IO"),
    works("Entangled"),
    works("Ex Deorum"),
    works("Explorer's Compass"),
    works("Extended AE"),
    works("Extended Crafting"),
    works("FastWorkbench"),
    works("Integrated Dynamics"),
    works("Iron Furnaces"),
    works("Iron Jetpacks"),
    works("Item Collectors"),
    works("Just Hammers"),
    {
        name: "LootR",
        status: "partial",
        note: {
            fr: "Se charge et ne cause aucun souci en jeu, mais ne fonctionne pas : les coffres restent ceux de vanilla.",
            en: "Loads and causes no issue in game, but does not work: chests stay the vanilla ones."
        }
    },
    works("Mahou Tsukai"),
    works("ModernFix"),
    works("Modonomicon"),
    works("Modular Routers"),
    works("Mystical Agriculture"),
    works("Nature's Compass"),
    works("NeoVitae"),
    works("Oritech"),
    works("Pipez"),
    works("Powah"),
    works("Pylons"),
    works("Refined Storage"),
    works("Sophisticated Backpacks"),
    works("Sophisticated Core"),
    works("Sophisticated Storage"),
    works("Trash Cans")
];

export const MODS: Mod[] = ENTRIES.toSorted((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
export const searchMods = (query: string): Mod[] => MODS.filter((mod) => slugify(mod.name).includes(slugify(query)));
