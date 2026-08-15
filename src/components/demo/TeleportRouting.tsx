import { useState } from "react";
import { cn } from "@/lib/utils";

const SCENARIOS = [
    {
        key: "local",
        label: "Dans la même région",
        delay: "aucun retard",
        tint: "#79c894",
        steps: ["La région constate que la destination lui appartient", "Le mouvement s'exécute sur place, comme en vanilla"]
    },
    {
        key: "region",
        label: "Vers une autre région",
        delay: "au plus 1 tick, 50 ms",
        tint: "#38bdf8",
        steps: ["La région refuse d'exécuter, la destination n'est pas à elle", "Le mouvement est mis en file", "Il est rejoué au prochain tick sériel du niveau, sous le verrou exclusif"]
    },
    {
        key: "dimension",
        label: "Changement de dimension",
        delay: "au plus 1 tick, 50 ms",
        tint: "#8b5cf6",
        steps: [
            "L'arbre monture et passagers est détaché côté départ",
            "Il est recopié dans la dimension d'arrivée",
            "Il est replacé comme une tâche de la région d'arrivée",
            "Cette région l'exécute pendant son propre tick"
        ]
    },
    {
        key: "portal",
        label: "Portail Nether ou End",
        delay: "1 tick, parfois plus si le terrain manque",
        tint: "#d8a13a",
        steps: [
            "La recherche de destination part dans la fenêtre barrière",
            "Toutes les régions sont en pause, la sémantique vanilla est exacte",
            "La fenêtre ne génère jamais de terrain, un chunk absent dépose un ticket",
            "Le pool génère la destination entre deux fenêtres, la tentative se rejoue"
        ]
    },
    {
        key: "respawn",
        label: "Respawn d'un joueur",
        delay: "1 tick",
        tint: "#e0776e",
        steps: ["Le respawn passe par la fenêtre barrière", "La branche vanilla entière est rejouée avec toutes les régions en pause", "Le joueur repart dans la dimension que vanilla aurait choisie"]
    }
];

export default function TeleportRouting() {
    const [selected, setSelected] = useState("region");
    const scenario = SCENARIOS.find((entry) => entry.key === selected) ?? SCENARIOS[0];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
                {SCENARIOS.map((entry) => (
                    <button
                        key={entry.key}
                        type="button"
                        onClick={() => setSelected(entry.key)}
                        className={cn(
                            "cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] transition-colors duration-150 ease-standard",
                            selected === entry.key ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "border-zinc-800 bg-zinc-925 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        )}>
                        {entry.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2.5">
                    <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: scenario.tint }} />
                    <span className="text-[13px] font-semibold text-zinc-100">{scenario.label}</span>
                    <span className="ml-auto rounded-md border border-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-400">{scenario.delay}</span>
                </div>

                <div className="flex flex-col gap-0">
                    {scenario.steps.map((step, index) => (
                        <div key={step} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: scenario.tint }} />
                                {index < scenario.steps.length - 1 && <span className="w-px flex-1 bg-zinc-800" />}
                            </div>
                            <span className={cn("text-[12.5px] leading-relaxed text-zinc-400", index < scenario.steps.length - 1 && "pb-3")}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
