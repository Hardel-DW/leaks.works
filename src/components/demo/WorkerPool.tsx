import { useState } from "react";
import Stepper from "@/components/ui/Stepper";
import { useTicker } from "@/lib/hook/useTicker";
import { REGION_TINTS } from "@/lib/sim/palette";

const COSTS = [3, 5, 2, 4, 3, 6, 2, 4];

interface Slot {
    region: number;
    left: number;
    total: number;
}

interface Worker {
    id: string;
    job: Slot | null;
}

interface Pool {
    workers: number;
    regions: number;
    queue: number[];
    running: Worker[];
}

const build = (workers: number, regions: number): Pool => ({
    workers,
    regions,
    queue: Array.from({ length: regions }, (_, index) => index),
    running: Array.from({ length: workers }, (_, index) => ({ id: `worker-${index}`, job: null }))
});

function advance(pool: Pool): Pool {
    const queue = [...pool.queue];
    const running = pool.running.map((worker) => {
        if (!worker.job) return worker;
        if (worker.job.left > 1) return { ...worker, job: { ...worker.job, left: worker.job.left - 1 } };
        queue.push(worker.job.region);
        return { ...worker, job: null };
    });

    for (const worker of running) {
        if (worker.job || queue.length === 0) continue;
        const region = queue.shift() as number;
        worker.job = { region, left: COSTS[region % COSTS.length], total: COSTS[region % COSTS.length] };
    }

    return { ...pool, queue, running };
}

export default function WorkerPool() {
    const [pool, setPool] = useState(() => build(3, 6));

    useTicker(true, 380, () => setPool(advance));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="flex items-center gap-2.5 text-[12px] text-zinc-400">
                    Workers
                    <Stepper value={pool.workers} min={1} max={6} onChange={(value) => setPool(build(value, pool.regions))} />
                </span>
                <span className="flex items-center gap-2.5 text-[12px] text-zinc-400">
                    Régions
                    <Stepper value={pool.regions} min={1} max={8} onChange={(value) => setPool(build(pool.workers, value))} />
                </span>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
                <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">File des régions dont le tick est dû</span>
                    <div className="flex min-h-16 flex-wrap content-start gap-1.5">
                        {pool.queue.map((region) => (
                            <span
                                key={region}
                                className="flex size-7 items-center justify-center rounded-md text-[11px] font-bold text-zinc-950"
                                style={{ backgroundColor: REGION_TINTS[region % REGION_TINTS.length] }}>
                                R{region + 1}
                            </span>
                        ))}
                        {pool.queue.length === 0 && <span className="text-[11px] text-zinc-600">vide, tout le monde travaille</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Workers</span>
                    <div className="flex flex-col gap-1.5">
                        {pool.running.map((worker, index) => (
                            <div key={worker.id} className="flex items-center gap-2.5">
                                <span className="w-16 shrink-0 text-[11px] text-zinc-500">Worker {index + 1}</span>
                                <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-zinc-900">
                                    {worker.job ? (
                                        <div
                                            className="flex h-full items-center justify-center text-[11px] font-bold text-zinc-950 transition-[width] duration-300 ease-linear"
                                            style={{
                                                width: `${((worker.job.total - worker.job.left + 1) / worker.job.total) * 100}%`,
                                                backgroundColor: REGION_TINTS[worker.job.region % REGION_TINTS.length]
                                            }}>
                                            R{worker.job.region + 1}
                                        </div>
                                    ) : (
                                        <span className="flex h-full items-center pl-2 text-[11px] text-zinc-600">libre</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-[12px] leading-relaxed text-zinc-500">
                Une région n'est pas un thread, c'est une tâche. Un worker libre prend la prochaine région dont le tick est dû. Avec plus de régions que de workers, la file s'allonge mais rien ne se
                perd. Avec plus de workers que de régions, les workers en trop restent libres et ne coûtent rien.
            </p>
        </div>
    );
}
