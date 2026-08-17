import { useState } from "react";
import { useTicker } from "@/lib/hook/useTicker";
import { cn } from "@/lib/utils";

const PHASES = [
    "Paquets reçus des joueurs",
    "Fonctions datapack",
    "Horloges du monde",
    "Bordure du monde",
    "Météo",
    "Sommeil des joueurs",
    "Luminosité du ciel",
    "Temps de jeu et fonctions planifiées",
    "Block ticks planifiés",
    "Fluid ticks planifiés",
    "Raids",
    "Tickets et chargement des chunks",
    "Comptage du spawn naturel",
    "Tonnerre et spawn de mobs",
    "Random ticks (neige, glace, blocs)",
    "Custom spawners",
    "Broadcast des blocs modifiés",
    "Suivi des chunks par joueur",
    "Tracking et envoi des entités",
    "Déchargement des chunks",
    "Évènements de blocs",
    "Combat du dragon",
    "Tick des entités",
    "Block entities (fours, hoppers)",
    "Chargement et déchargement des entités",
    "Connexions réseau",
    "Liste des joueurs",
    "Envoi des chunks",
    "Autosave",
    "Attente du prochain tick"
];

export default function VanillaTick() {
    const [playhead, setPlayhead] = useState(0);

    useTicker(true, 350, () => setPlayhead((value) => (value + 1) % PHASES.length));

    return (
        <div className="flex flex-col gap-0.5">
            {PHASES.map((name, index) => (
                <div
                    key={name}
                    className={cn("flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] transition-colors duration-150", playhead === index ? "bg-zinc-800 text-zinc-100" : "text-zinc-500")}>
                    <span className={cn("size-1.5 shrink-0 rounded-full transition-colors duration-200", playhead === index ? "bg-run-ok" : "bg-zinc-700")} />
                    {name}
                </div>
            ))}
        </div>
    );
}
