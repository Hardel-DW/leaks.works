import { useState } from "react";
import Stepper from "@/components/ui/Stepper";
import { useTicker } from "@/lib/hook/useTicker";
import { gridCells } from "@/lib/sim/grid";
import { mix } from "@/lib/sim/palette";
import { cn } from "@/lib/utils";

const STATUSES = [
    { name: "Vide", color: "#18181b", exclusion: 0 },
    { name: "Bruit", color: "#3f3f46", exclusion: 0 },
    { name: "Surface", color: "#52525b", exclusion: 0 },
    { name: "Grottes", color: "#4fb3b5", exclusion: 0 },
    { name: "Features", color: "#79c894", exclusion: 2 },
    { name: "Lumière", color: "#d8a13a", exclusion: 2 },
    { name: "Spawn", color: "#38bdf8", exclusion: 0 },
    { name: "Full", color: "#8b5cf6", exclusion: 1 }
];

const COLUMNS = 10;
const ROWS = 5;
const CELLS = gridCells({ width: COLUMNS, height: ROWS });
const TOTAL = CELLS.length;

interface Job {
    chunk: number;
    step: number;
}

interface State {
    workers: number;
    status: number[];
    jobs: (Job | null)[];
}

const build = (workers: number): State => ({ workers, status: Array.from({ length: TOTAL }, () => 0), jobs: Array.from({ length: workers }, () => null) });

const position = (chunk: number) => ({ x: chunk % COLUMNS, y: Math.floor(chunk / COLUMNS) });

function blocked(chunk: number, step: number, jobs: (Job | null)[]): boolean {
    const radius = STATUSES[step].exclusion;
    if (radius === 0) return false;
    const here = position(chunk);
    return jobs.some((job) => {
        if (!job || job.chunk === chunk || STATUSES[job.step].exclusion === 0) return false;
        const other = position(job.chunk);
        return Math.max(Math.abs(other.x - here.x), Math.abs(other.y - here.y)) <= Math.max(radius, STATUSES[job.step].exclusion);
    });
}

function advance(state: State): State {
    const status = [...state.status];
    const jobs: (Job | null)[] = state.jobs.map(() => null);
    for (const job of state.jobs) {
        if (job) status[job.chunk] = job.step;
    }

    for (const [index] of jobs.entries()) {
        const chunk = status.findIndex((value, candidate) => value < STATUSES.length - 1 && !jobs.some((job) => job?.chunk === candidate) && !blocked(candidate, value + 1, jobs));
        if (chunk < 0) break;
        jobs[index] = { chunk, step: status[chunk] + 1 };
    }

    if (status.every((value) => value === STATUSES.length - 1) && jobs.every((job) => job === null)) return build(state.workers);
    return { ...state, status, jobs };
}

export default function WorldgenPipeline() {
    const [state, setState] = useState(() => build(3));
    useTicker(true, 300, () => setState(advance));

    return (
        <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-[12px] text-zinc-400">
                Workers de chunks
                <Stepper value={state.workers} min={1} max={6} onChange={(value) => setState(build(value))} />
                <span className="text-zinc-600">réglage chunk_threads</span>
            </span>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <svg viewBox={`0 0 ${COLUMNS} ${ROWS}`} className="w-full">
                    <title>Chunks en cours de génération</title>
                    {CELLS.map((cell, chunk) => {
                        const { x, z } = cell;
                        const job = state.jobs.find((candidate) => candidate?.chunk === chunk);
                        const shown = job ? job.step : state.status[chunk];
                        return (
                            <g key={cell.id}>
                                {job && STATUSES[job.step].exclusion > 0 && (
                                    <rect
                                        x={x + 0.5 - (STATUSES[job.step].exclusion + 0.5)}
                                        y={z + 0.5 - (STATUSES[job.step].exclusion + 0.5)}
                                        width={STATUSES[job.step].exclusion * 2 + 1}
                                        height={STATUSES[job.step].exclusion * 2 + 1}
                                        rx={0.15}
                                        fill={mix(STATUSES[job.step].color, 0.09)}
                                        stroke={mix(STATUSES[job.step].color, 0.45)}
                                        strokeWidth={0.04}
                                        strokeDasharray="0.18 0.14"
                                    />
                                )}
                                <rect
                                    x={x + 0.08}
                                    y={z + 0.08}
                                    width={0.84}
                                    height={0.84}
                                    rx={0.1}
                                    fill={job ? STATUSES[shown].color : mix(STATUSES[shown].color, 0.78)}
                                    stroke={job ? mix("#ffffff", 0.85) : "#1c1c1f"}
                                    strokeWidth={0.05}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {STATUSES.map((status) => (
                    <span key={status.name} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: status.color }} />
                        {status.name}
                        {status.exclusion > 0 && <span className={cn("text-[10px] text-zinc-600")}>rayon {status.exclusion}</span>}
                    </span>
                ))}
            </div>

            <p className="text-[12px] leading-relaxed text-zinc-500">
                Le halo pointillé est l'exclusion spatiale. Tant qu'un chunk fait ses features ou sa lumière, aucun chunk de son voisinage ne peut faire une étape qui déborde, parce que les deux
                écriraient dans le même terrain. Les étapes qui ne touchent que leur propre chunk n'ont pas de halo et tournent librement.
            </p>
        </div>
    );
}
