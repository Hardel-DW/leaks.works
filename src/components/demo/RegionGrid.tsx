import type React from "react";
import { useId, useRef, useState } from "react";
import DemoFrame, { DemoBar, DemoStat } from "@/components/demo/DemoFrame";
import { useTicker } from "@/lib/hook/useTicker";
import { useVisible } from "@/lib/hook/useVisible";
import { useText } from "@/lib/i18n";
import { advanceLoading, computeRegions, fromKey, GRID, type Loaded, outline, ownedChunks, type Player, type Regions, regionOfPlayer, SECTION, simulatedChunks, spawnPlayer } from "@/lib/sim/regions";
import { cn } from "@/lib/utils";

const CELL = 18;
const WIDTH = GRID.width * CELL;
const HEIGHT = GRID.height * CELL;
const MAX_PLAYERS = 6;

type Sim = { tick: number; players: Player[]; loaded: Loaded };

const regionColor = (id: number) => `var(--color-region-${((id - 1) % 6) + 1})`;

const initial = (): Sim => ({
    tick: 0,
    players: [
        { id: 1, x: 14.5, z: 12.5 },
        { id: 2, x: 37.5, z: 13.5 }
    ],
    loaded: new Map()
});

function toChunk(event: React.PointerEvent<SVGElement>): { x: number; z: number } {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return { x: 0, z: 0 };
    const box = svg.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * GRID.width;
    const z = ((event.clientY - box.top) / box.height) * GRID.height;
    return { x: Math.min(GRID.width - 0.5, Math.max(0.5, x)), z: Math.min(GRID.height - 0.5, Math.max(0.5, z)) };
}

function Outline({ cells, stroke, dashed }: { cells: Set<number>; stroke: string; dashed?: boolean }) {
    return (
        <g stroke={stroke} strokeWidth={dashed ? 1 : 1.5} strokeDasharray={dashed ? "3 4" : undefined} strokeLinecap="square" opacity={dashed ? 0.7 : 1}>
            {outline(cells, SECTION * CELL).map((edge) => (
                <line key={`${edge.x1}-${edge.z1}-${edge.x2}-${edge.z2}`} x1={edge.x1} y1={edge.z1} x2={edge.x2} y2={edge.z2} />
            ))}
        </g>
    );
}

function RegionOutlines({ regions }: { regions: Regions }) {
    const byRegion = new Map<number, Set<number>>();
    for (const [section, region] of regions.active) {
        const cells = byRegion.get(region) ?? new Set<number>();
        cells.add(section);
        byRegion.set(region, cells);
    }
    return (
        <>
            <Outline cells={new Set([...regions.active.keys(), ...regions.crown])} stroke="var(--color-cream-500)" dashed />
            {[...byRegion].map(([region, cells]) => (
                <Outline key={region} cells={cells} stroke={regionColor(region)} />
            ))}
        </>
    );
}

function Legend({ swatch, children }: { swatch: string; children: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-xs", swatch)} />
            {children}
        </span>
    );
}

export default function RegionGrid({ className }: { className?: string }) {
    const text = useText();
    const [sim, setSim] = useState<Sim>(initial);
    const dragging = useRef<number | null>(null);

    const [visible, frame] = useVisible();
    useTicker(visible, 110, () => setSim((state) => ({ ...state, tick: state.tick + 1, loaded: advanceLoading(state.loaded, state.players, state.tick + 1) })));

    const simulated = simulatedChunks(sim.loaded, sim.players);
    const regions = computeRegions(simulated, sim.players);
    const owned = ownedChunks(regions);
    const regionCount = new Set(regions.active.values()).size;
    const gridId = useId();

    const grab = (event: React.PointerEvent<SVGElement>, id: number) => {
        dragging.current = id;
        event.currentTarget.setPointerCapture(event.pointerId);
    };
    const move = (event: React.PointerEvent<SVGElement>) => {
        if (dragging.current === null) return;
        const target = toChunk(event);
        setSim((state) => ({ ...state, players: state.players.map((player) => (player.id === dragging.current ? { ...player, ...target } : player)) }));
    };
    const release = () => {
        dragging.current = null;
    };
    const addPlayer = () => setSim((state) => ({ ...state, players: [...state.players, spawnPlayer(state.players)] }));
    const removePlayer = () => setSim((state) => ({ ...state, players: state.players.slice(0, -1) }));

    return (
        <DemoFrame ref={frame} className={className}>
            <DemoBar>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={addPlayer}
                        disabled={sim.players.length >= MAX_PLAYERS}
                        className="bevel h-7 cursor-pointer border border-line px-2.5 text-xs font-semibold text-cream-200 transition-colors hover:bg-bark-800 disabled:opacity-30">
                        {text.regions.addPlayer}
                    </button>
                    <button
                        type="button"
                        onClick={removePlayer}
                        disabled={sim.players.length <= 1}
                        className="bevel h-7 cursor-pointer border border-line px-2.5 text-xs font-semibold text-cream-400 transition-colors hover:bg-bark-800 disabled:opacity-30">
                        {text.regions.removePlayer}
                    </button>
                </div>
                <span className="hidden text-xs text-cream-500 md:block">{text.regions.hint}</span>
                <div className="ml-auto flex items-center gap-4">
                    <DemoStat value={sim.players.length} unit={text.regions.players} />
                    <DemoStat value={regionCount} unit={text.regions.regions} className="text-leaf-300" />
                </div>
            </DemoBar>
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="min-w-140 w-full touch-none select-none" role="img" aria-label={text.regions.title}>
                    <defs>
                        <pattern id={gridId} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                            <path d={`M ${CELL} 0.5 H 0.5 V ${CELL}`} fill="none" stroke="var(--color-line)" />
                        </pattern>
                    </defs>
                    <rect width={WIDTH} height={HEIGHT} fill={`url(#${gridId})`} />
                    {[...sim.loaded.keys()].map((packed) => {
                        const cell = fromKey(packed);
                        return <rect key={packed} x={cell.x * CELL + 1} y={cell.z * CELL + 1} width={CELL - 1} height={CELL - 1} className="rise fill-bark-800" />;
                    })}
                    {[...owned].map(([packed, region]) => {
                        const cell = fromKey(packed);
                        return (
                            <rect
                                key={packed}
                                x={cell.x * CELL + 1}
                                y={cell.z * CELL + 1}
                                width={CELL - 1}
                                height={CELL - 1}
                                fill={regionColor(region)}
                                opacity={simulated.has(packed) ? 0.26 : 0.09}
                            />
                        );
                    })}
                    <RegionOutlines regions={regions} />
                    {sim.players.map((player) => (
                        <g key={player.id} transform={`translate(${player.x * CELL} ${player.z * CELL})`} className="cursor-grab active:cursor-grabbing">
                            <circle r={14} fill="transparent" onPointerDown={(event) => grab(event, player.id)} onPointerMove={move} onPointerUp={release} onPointerCancel={release} />
                            <circle
                                r={6.5}
                                fill={regionColor(regionOfPlayer(regions, player))}
                                stroke="var(--color-bark-950)"
                                strokeWidth={2}
                                className="pointer-events-none transition-[fill] duration-300"
                            />
                            <circle r={2} fill="var(--color-bark-950)" className="pointer-events-none" />
                        </g>
                    ))}
                </svg>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-3 py-2 text-xs text-cream-500">
                <Legend swatch="border border-region-1 bg-region-1/25">{text.regions.legendSimulated}</Legend>
                <Legend swatch="bg-region-1/10">{text.regions.legendOwned}</Legend>
                <Legend swatch="bg-bark-800">{text.regions.legendLoading}</Legend>
                <Legend swatch="border border-dashed border-cream-500">{text.regions.legendCrown}</Legend>
            </div>
        </DemoFrame>
    );
}
