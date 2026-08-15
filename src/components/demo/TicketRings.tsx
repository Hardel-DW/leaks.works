import { type PointerEvent, useState } from "react";
import { Legend } from "@/components/docs/Figure";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { gridCells } from "@/lib/sim/grid";
import { mix, SURFACE } from "@/lib/sim/palette";

const GRID = { width: 34, height: 17 };
const CELLS = gridCells(GRID);
const TIERS = [
    { radius: 5, level: 31, label: "Simulation", color: "#79c894" },
    { radius: 8, level: 33, label: "Vue", color: "#38bdf8" },
    { radius: 10, level: 41, label: "Chargé", color: "#8b5cf6" }
];

const START = [
    { id: "a", name: "Alix", x: 11, z: 8 },
    { id: "b", name: "Bo", x: 22, z: 8 }
];

const tierOf = (distance: number) => TIERS.find((tier) => distance <= tier.radius);

export default function TicketRings() {
    const [players, setPlayers] = useState(START);
    const [dragged, setDragged] = useState<string | null>(null);
    const [showCounts, setShowCounts] = useState(true);

    const cells = new Map<string, { color: string; holders: number; level: number }>();
    for (const player of players) {
        for (const cell of CELLS) {
            const tier = tierOf(Math.max(Math.abs(cell.x - player.x), Math.abs(cell.z - player.z)));
            if (!tier) continue;
            const current = cells.get(cell.id);
            if (!current || tier.level < current.level) cells.set(cell.id, { color: tier.color, holders: (current?.holders ?? 0) + 1, level: tier.level });
            else cells.set(cell.id, { ...current, holders: current.holders + 1 });
        }
    }

    const move = (event: PointerEvent<SVGSVGElement>, start: boolean) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = Math.round(((event.clientX - rect.left) / rect.width) * GRID.width);
        const z = Math.round(((event.clientY - rect.top) / rect.height) * GRID.height);
        if (start) {
            const nearest = players.find((player) => Math.hypot(player.x - x, player.z - z) < 3);
            if (!nearest) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragged(nearest.id);
            return;
        }
        if (!dragged) return;
        setPlayers(players.map((player) => (player.id === dragged ? { ...player, x: Math.min(GRID.width - 1, Math.max(0, x)), z: Math.min(GRID.height - 1, Math.max(0, z)) } : player)));
    };

    const shared = [...cells.values()].filter((cell) => cell.holders > 1).length;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Switch label="Montrer les chunks tenus par deux joueurs" isChecked={showCounts} setIsChecked={setShowCounts} />
                <Button variant="ghost_border" size="sm" className="ml-auto" onClick={() => setPlayers(START)}>
                    Réinitialiser
                </Button>
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950" style={{ aspectRatio: `${GRID.width} / ${GRID.height}` }}>
                <svg
                    viewBox={`0 0 ${GRID.width} ${GRID.height}`}
                    className="size-full touch-none select-none"
                    onPointerDown={(event) => move(event, true)}
                    onPointerMove={(event) => move(event, false)}
                    onPointerUp={() => setDragged(null)}
                    onPointerCancel={() => setDragged(null)}>
                    <title>Anneaux de tickets autour des joueurs</title>
                    {CELLS.map(({ x, z, id }) => {
                        const cell = cells.get(id);
                        const doubled = showCounts && cell && cell.holders > 1;
                        return (
                            <rect
                                key={id}
                                x={x + 0.06}
                                y={z + 0.06}
                                width={0.88}
                                height={0.88}
                                rx={0.1}
                                fill={cell ? mix(cell.color, doubled ? 0.58 : 0.26) : SURFACE}
                                stroke={cell ? mix(cell.color, 0.44) : "#1c1c1f"}
                                strokeWidth={0.04}
                            />
                        );
                    })}
                    {players.map((player) => (
                        <g key={player.id} style={{ cursor: dragged === player.id ? "grabbing" : "grab" }}>
                            <circle cx={player.x + 0.5} cy={player.z + 0.5} r={0.75} fill="#f4f4f5" stroke="#09090b" strokeWidth={0.15} />
                            <text x={player.x + 0.5} y={player.z + 2.4} textAnchor="middle" fill="#e4e4e7" fontSize={0.9} fontWeight={600}>
                                {player.name}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <Legend items={TIERS.map((tier) => ({ color: mix(tier.color, 0.26), label: `${tier.label}, ticket niveau ${tier.level}` }))} />

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-[12.5px] leading-relaxed text-zinc-400">
                <span className="font-semibold text-zinc-100">{shared} chunks</span> sont tenus par les deux joueurs en même temps. Chaque joueur pose son propre ticket dessus, et un compteur retient
                combien de joueurs le réclament. Si l'un des deux part, son ticket disparaît mais celui de l'autre reste, donc le chunk ne se décharge pas.
            </div>
        </div>
    );
}
