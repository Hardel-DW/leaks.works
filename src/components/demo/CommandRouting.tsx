import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

interface Rule {
    gate?: "functions" | "repeating";
    where: string;
    tint: string;
    why: string;
}

const SOURCES: { label: string; example: string; rule: Rule }[] = [
    {
        label: "Commande tapée dans le chat",
        example: "/tp Alix 4000 70 -2000",
        rule: { where: "Phase globale", tint: "#f4f4f5", why: "Une commande comme /locate doit pouvoir charger des chunks n'importe où, et seule la phase globale sait le faire." }
    },
    {
        label: "Commande tapée dans la console",
        example: "op Alix",
        rule: { where: "Fenêtre barrière", tint: "#e0776e", why: "Une commande op peut toucher n'importe quel état du monde, donc elle s'exécute avec toutes les régions en pause." }
    },
    {
        label: "Command block en impulse ou chain",
        example: "un bouton qui déclenche une chaîne",
        rule: { where: "Fenêtre barrière", tint: "#e0776e", why: "Une commande peut viser une entité de l'autre bout de la carte. La fenêtre lui donne le monde entier." }
    },
    {
        label: "Command block en repeat",
        example: "il tourne à chaque tick",
        rule: { gate: "repeating", where: "Fenêtre barrière, à chaque tick", tint: "#e0776e", why: "C'est le cas le plus coûteux. La fenêtre s'ouvre à chaque tick tant que le bloc est armé." }
    },
    {
        label: "Fonction du tag #minecraft:tick",
        example: "un datapack qui boucle",
        rule: { gate: "functions", where: "Fenêtre barrière, à chaque tick", tint: "#e0776e", why: "Même coût qu'un command block en repeat, pour la même raison." }
    },
    {
        label: "Appel manuel de /function",
        example: "/function pack:setup",
        rule: { where: "Phase globale", tint: "#f4f4f5", why: "C'est une commande comme une autre, elle suit le chemin des commandes de chat." }
    }
];

export default function CommandRouting() {
    const [functions, setFunctions] = useState(true);
    const [repeating, setRepeating] = useState(true);

    const enabled = { functions, repeating };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Les deux gamerules de Leafs</span>
                <Switch label="leafs:tick_functions_work" isChecked={functions} setIsChecked={setFunctions} />
                <Switch label="leafs:repeating_command_blocks_work" isChecked={repeating} setIsChecked={setRepeating} />
            </div>

            <div className="flex flex-col divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                {SOURCES.map((source) => {
                    const off = source.rule.gate ? !enabled[source.rule.gate] : false;
                    return (
                        <div key={source.label} className="flex flex-col gap-1.5 px-3 py-3">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="text-[13px] font-medium text-zinc-200">{source.label}</span>
                                <code className="font-mono text-[11px] text-zinc-600">{source.example}</code>
                                <span
                                    className={cn(
                                        "ml-auto shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase",
                                        off ? "border-zinc-800 text-zinc-600" : "border-zinc-700 text-zinc-200"
                                    )}
                                    style={off ? undefined : { borderColor: `${source.rule.tint}55`, color: source.rule.tint }}>
                                    {off ? "sautée" : source.rule.where}
                                </span>
                            </div>
                            <p className="text-[12px] leading-relaxed text-zinc-500">
                                {off
                                    ? "La gamerule est à false. Le bloc reste armé et se réarme à vide sur le thread de sa région, sans ouvrir la fenêtre. Il repart tout seul quand la règle revient à true."
                                    : source.rule.why}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
