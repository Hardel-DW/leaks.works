import { useState } from "react";
import { useTicker } from "@/lib/hook/useTicker";
import { cn } from "@/lib/utils";

const REGION_PHASES = [
    { name: "Paquets des joueurs", detail: "La région vide la file de paquets de chacun de ses joueurs. Mouvement, clic, chat, tout ce que le client a envoyé depuis le tick précédent." },
    { name: "Ticks programmés", detail: "Les blocs et les fluides qui avaient rendez-vous à ce tick. Redstone, eau qui coule, cultures. Comptés en temps de région, pas en temps du jeu." },
    { name: "Orage", detail: "Les impacts de foudre sur les chunks que la région possède." },
    { name: "Spawn naturel", detail: "L'apparition des mobs. Les plafonds sont comptés par région, ce qui est le seul écart visible avec vanilla sur ce point." },
    { name: "Random ticks", detail: "Les tirages aléatoires par section de chunk. Herbe qui pousse, feuilles qui tombent, glace qui fond." },
    { name: "Diffusion des changements", detail: "Les blocs modifiés pendant le tick sont regroupés et envoyés aux clients qui regardent." },
    { name: "Tracking des entités", detail: "Qui voit quoi. La région calcule les appairages entre ses entités et les joueurs autour." },
    { name: "Évènements de blocs", detail: "Les actions différées des blocs, comme un piston qui finit son mouvement ou un coffre qui s'ouvre." },
    { name: "Tick des entités", detail: "Le gros morceau. Chaque mob, chaque item au sol, chaque projectile de la région avance d'un cran." },
    { name: "Block entities", detail: "Les fours, les hoppers, les brasseurs, les spawners. Tout ce qui a une logique attachée à un bloc." },
    { name: "Chargeur de chunks", detail: "Le pipeline de vue de chaque joueur avance. Les chunks entrent en anneaux, se chargent, se génèrent, passent en simulation." },
    { name: "Tick réseau", detail: "La physique du joueur, ses menus, sa faim, le keepalive. Le contrat single thread de vanilla, rendu au joueur." },
    { name: "Envoi des chunks", detail: "La région sérialise les chunks qu'elle possède et vide le canal de chaque joueur. Les paquets partent à la cadence de la région." }
];

const SERIAL_PHASES = ["Bordure du monde", "Météo", "Sommeil des joueurs", "Temps du jeu", "Raids", "Combat du dragon", "Expiration des tickets", "Décisions de déchargement"];

export default function TickPhases() {
    const [selected, setSelected] = useState(8);
    const [playhead, setPlayhead] = useState(0);

    useTicker(true, 420, () => setPlayhead((value) => (value + 1) % REGION_PHASES.length));

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Le tick d'une région, dans l'ordre</span>
                    <div className="flex flex-col gap-0.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1.5">
                        {REGION_PHASES.map((phase, index) => (
                            <button
                                key={phase.name}
                                type="button"
                                onClick={() => setSelected(index)}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors duration-150",
                                    selected === index ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                                )}>
                                <span className={cn("size-1.5 shrink-0 rounded-full transition-colors duration-200", playhead === index ? "bg-run-ok" : "bg-zinc-700")} />
                                {phase.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                        <span className="text-[13px] font-semibold text-zinc-100">{REGION_PHASES[selected].name}</span>
                        <p className="text-[12.5px] leading-relaxed text-zinc-400">{REGION_PHASES[selected].detail}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Ce qui reste au tick sériel</span>
                        {SERIAL_PHASES.map((phase) => (
                            <span key={phase} className="text-[12px] text-zinc-500">
                                {phase}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
