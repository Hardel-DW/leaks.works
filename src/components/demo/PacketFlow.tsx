import { useState } from "react";
import { useTicker } from "@/lib/hook/useTicker";
import { REGION_TINTS } from "@/lib/sim/palette";
import { cn } from "@/lib/utils";

const PLAYERS = [
    { id: "a", name: "Alix", region: 0, period: 4 },
    { id: "b", name: "Bo", region: 0, period: 4 },
    { id: "c", name: "Cam", region: 1, period: 6 }
];

interface Flow {
    frame: number;
    queues: Record<string, number>;
    drained: Record<string, number>;
}

const START: Flow = { frame: 0, queues: { a: 0, b: 0, c: 0 }, drained: { a: 0, b: 0, c: 0 } };

function advance(flow: Flow): Flow {
    const frame = flow.frame + 1;
    const queues = { ...flow.queues };
    const drained = { ...flow.drained };

    for (const player of PLAYERS) {
        if (Math.random() < 0.55) queues[player.id] += 1;
        if (frame % player.period === 0) {
            drained[player.id] = queues[player.id];
            queues[player.id] = 0;
        }
    }

    return { frame, queues, drained };
}

export default function PacketFlow() {
    const [flow, setFlow] = useState(START);
    useTicker(true, 300, () => setFlow(advance));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                {PLAYERS.map((player) => {
                    const ticking = flow.frame % player.period === 0;
                    return (
                        <div key={player.id} className="flex items-center gap-3">
                            <span className="w-14 shrink-0 text-[12px] text-zinc-300">{player.name}</span>
                            <div className="relative flex h-8 flex-1 items-center gap-1 overflow-hidden rounded-md bg-zinc-900 px-2">
                                {Array.from({ length: Math.min(flow.queues[player.id], 12) }, (_, index) => `${player.id}-${index}`).map((id) => (
                                    <span key={id} className="h-4 w-2 rounded-[2px] bg-zinc-400" />
                                ))}
                                {flow.queues[player.id] === 0 && <span className="text-[11px] text-zinc-600">file vide</span>}
                            </div>
                            <div
                                className={cn(
                                    "flex h-8 w-40 shrink-0 items-center justify-center rounded-md text-[11px] font-bold transition-all duration-150",
                                    ticking ? "text-zinc-950" : "text-zinc-600"
                                )}
                                style={{ backgroundColor: ticking ? REGION_TINTS[player.region] : "#18181b" }}>
                                {ticking ? `R${player.region + 1} draine ${flow.drained[player.id]}` : `R${player.region + 1} en attente`}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Entrant</span>
                    <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                        Chaque paquet est rangé dans la file du joueur qui l'a envoyé. Il attend là, dans l'ordre d'arrivée, jusqu'à ce que la région propriétaire du joueur commence son tick.
                    </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Sortant</span>
                    <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                        Les envois partent directement depuis le thread de la région, sans file, parce que la méthode d'envoi de vanilla est sûre entre threads. Leafs groupe les envois d'un même tick
                        pour qu'ils partent ensemble.
                    </p>
                </div>
            </div>

            <p className="text-[12px] leading-relaxed text-zinc-500">
                Alix et Bo sont dans la même région, ils sont donc traités par le même thread, l'un après l'autre. Cam est ailleurs, sa région tourne à son propre rythme. Chaque joueur retrouve le
                contrat de vanilla, un seul thread traite tout ce qui le concerne.
            </p>
        </div>
    );
}
