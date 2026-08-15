import { type PointerEvent, useState } from "react";
import { Legend } from "@/components/docs/Figure";
import { Button } from "@/components/ui/Button";
import Stepper from "@/components/ui/Stepper";
import { Switch } from "@/components/ui/Switch";
import { cellCoords, type GridSize, gridCells } from "@/lib/sim/grid";
import { mix, SURFACE } from "@/lib/sim/palette";
import { activeSectionsOf, computeRegions, type Player } from "@/lib/sim/regions";

const GRID: GridSize = { width: 24, height: 13 };
const CELLS = gridCells(GRID);
const NAMES = ["Alix", "Bo", "Cam", "Dio", "Eli", "Flo"];

const START: Player[] = [
    { id: "p0", name: "Alix", x: 4.5, z: 4.5 },
    { id: "p1", name: "Bo", x: 12.5, z: 8.5 },
    { id: "p2", name: "Cam", x: 19.5, z: 3.5 }
];

const clamp = (value: number, max: number) => Math.min(max - 0.5, Math.max(0.5, value));

export default function RegionPlayground() {
    const [players, setPlayers] = useState(START);
    const [viewChunks, setViewChunks] = useState(10);
    const [showBuffer, setShowBuffer] = useState(true);
    const [dragged, setDragged] = useState<string | null>(null);

    const regions = computeRegions(players, viewChunks, GRID);
    const fills = new Map<string, { tint: string; active: boolean }>();
    for (const region of regions) {
        for (const section of region.active) fills.set(section, { tint: region.tint, active: true });
        for (const section of region.buffer) fills.set(section, { tint: region.tint, active: false });
    }

    const pointerAt = (event: PointerEvent<SVGSVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) / rect.width) * GRID.width,
            z: ((event.clientY - rect.top) / rect.height) * GRID.height
        };
    };

    const startDrag = (event: PointerEvent<SVGSVGElement>) => {
        const point = pointerAt(event);
        const nearest = players.find((player) => Math.hypot(player.x - point.x, player.z - point.z) < 0.9);
        if (!nearest) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragged(nearest.id);
    };

    const moveDrag = (event: PointerEvent<SVGSVGElement>) => {
        if (!dragged) return;
        const point = pointerAt(event);
        setPlayers(players.map((player) => (player.id === dragged ? { ...player, x: clamp(point.x, GRID.width), z: clamp(point.z, GRID.height) } : player)));
    };

    const addPlayer = () => setPlayers([...players, { id: `p${players.length}`, name: NAMES[players.length % NAMES.length], x: 2.5 + players.length, z: 11.5 }]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="flex items-center gap-2.5 text-[12px] text-zinc-400">
                    Distance de vue
                    <Stepper value={viewChunks} min={4} max={32} step={2} onChange={setViewChunks} />
                    <span className="text-zinc-600">chunks</span>
                </span>
                <Switch label="Marge tampon" isChecked={showBuffer} setIsChecked={setShowBuffer} />
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost_border" size="sm" onClick={addPlayer} disabled={players.length >= NAMES.length}>
                        Ajouter un joueur
                    </Button>
                    <Button variant="ghost_border" size="sm" onClick={() => setPlayers(START)}>
                        Réinitialiser
                    </Button>
                </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950" style={{ aspectRatio: `${GRID.width} / ${GRID.height}` }}>
                <svg
                    viewBox={`0 0 ${GRID.width} ${GRID.height}`}
                    className="size-full touch-none select-none"
                    onPointerDown={startDrag}
                    onPointerMove={moveDrag}
                    onPointerUp={() => setDragged(null)}
                    onPointerCancel={() => setDragged(null)}>
                    <title>Grille de sections, régions calculées en direct</title>
                    {CELLS.map((cell) => {
                        const fill = fills.get(cell.id);
                        const hidden = !fill || (!fill.active && !showBuffer);
                        return <Cell key={cell.id} x={cell.x} z={cell.z} tint={hidden ? undefined : fill?.tint} active={fill?.active} />;
                    })}

                    {players.map((player) => (
                        <PlayerMark key={player.id} player={player} viewChunks={viewChunks} dragged={dragged === player.id} />
                    ))}
                </svg>
            </div>

            <Legend
                items={[
                    { color: mix("#38bdf8", 0.32), label: "sections actives, la région les tique" },
                    { color: mix("#38bdf8", 0.1), label: "marge tampon, possédée mais vide" },
                    { color: SURFACE, label: "hors région" }
                ]}
            />

            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                <div className="flex items-baseline gap-2">
                    <span className="font-minecraft text-2xl text-white">{regions.length}</span>
                    <span className="text-[13px] text-zinc-400">{regions.length > 1 ? "régions vivantes, tickées en parallèle" : "région vivante, un seul thread suffit"}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {regions.map((region, index) => (
                        <div key={region.id} className="flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-2">
                            <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: region.tint }} />
                            <span className="text-[12px] font-medium text-zinc-200">R{index + 1}</span>
                            <span className="ml-auto text-[11px] text-zinc-500">
                                {region.active.length} sect. · {region.players.length} joueur{region.players.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Cell({ x, z, tint, active }: { x: number; z: number; tint?: string; active?: boolean }) {
    if (!tint) return <rect x={x + 0.04} y={z + 0.04} width={0.92} height={0.92} rx={0.08} fill={SURFACE} stroke="#1c1c1f" strokeWidth={0.02} />;

    return (
        <rect
            x={x + 0.04}
            y={z + 0.04}
            width={0.92}
            height={0.92}
            rx={0.08}
            fill={mix(tint, active ? 0.32 : 0.1)}
            stroke={mix(tint, active ? 0.75 : 0.34)}
            strokeWidth={0.03}
            strokeDasharray={active ? undefined : "0.14 0.1"}
        />
    );
}

function PlayerMark({ player, viewChunks, dragged }: { player: Player; viewChunks: number; dragged: boolean }) {
    const sections = activeSectionsOf(player, viewChunks, GRID).map(cellCoords);
    const minX = Math.min(...sections.map(([x]) => x));
    const maxX = Math.max(...sections.map(([x]) => x));
    const minZ = Math.min(...sections.map(([, z]) => z));
    const maxZ = Math.max(...sections.map(([, z]) => z));

    return (
        <g className="cursor-grab" style={{ cursor: dragged ? "grabbing" : "grab" }}>
            <rect x={minX} y={minZ} width={maxX - minX + 1} height={maxZ - minZ + 1} rx={0.1} fill="none" stroke={mix("#ffffff", dragged ? 0.55 : 0.26)} strokeWidth={0.035} />
            <circle cx={player.x} cy={player.z} r={0.3} fill="#f4f4f5" stroke="#09090b" strokeWidth={0.06} />
            <text x={player.x} y={player.z + 0.95} textAnchor="middle" fill="#e4e4e7" fontSize={0.38} fontWeight={600}>
                {player.name}
            </text>
        </g>
    );
}
