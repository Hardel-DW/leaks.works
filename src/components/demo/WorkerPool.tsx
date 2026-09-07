import { useState } from "react";
import DemoFrame, { DemoBar, DemoStat, Stepper } from "@/components/demo/DemoFrame";
import { useTicker } from "@/lib/hook/useTicker";
import { useText } from "@/lib/i18n";
import { BUDGET, isLate, MAX_REGIONS, MAX_WORKERS, type Placement, RANGE, randomTasks, schedule, type Task } from "@/lib/sim/pool";
import { cn } from "@/lib/utils";

const PLOT_HEIGHT = 260;
const STEP_MS = 100;
const HOLD_STEPS = 12;
const FADE_STEPS = 5;

type Pool = { workers: number; tasks: Task[]; step: number };

const percent = (ms: number) => `${(ms / RANGE) * 100}%`;
const isShown = (placement: Placement, step: number, count: number) => placement.id < step && step < count + HOLD_STEPS;

const advance = (state: Pool): Pool => {
    const step = state.step + 1;
    if (step < state.tasks.length + HOLD_STEPS + FADE_STEPS) return { ...state, step };
    return { ...state, step: 0, tasks: randomTasks(state.tasks.length) };
};

function Block({ placement, rowHeight, shown }: { placement: Placement; rowHeight: number; shown: boolean }) {
    return (
        <div
            className={cn("absolute rounded-[1px] opacity-80 transition-opacity duration-300 ease-soft", isLate(placement) && "ring-1 ring-ember-400 ring-inset", !shown && "opacity-0")}
            style={{
                left: percent(placement.start),
                width: percent(placement.cost),
                top: `calc(${placement.worker * rowHeight}% + 2px)`,
                height: `calc(${rowHeight}% - 4px)`,
                backgroundColor: `var(--color-region-${placement.tone})`
            }}
        />
    );
}

export default function WorkerPool({ className }: { className?: string }) {
    const text = useText();
    const [pool, setPool] = useState<Pool>({ workers: 12, tasks: randomTasks(40), step: 0 });

    useTicker(true, STEP_MS, () => setPool(advance));

    const placements = schedule(pool.tasks, pool.workers);
    const late = placements.filter((placement) => placement.id < pool.step && isLate(placement)).length;
    const rowHeight = 100 / pool.workers;
    const workers = Array.from({ length: pool.workers }, (_, index) => index + 1);

    return (
        <DemoFrame className={className}>
            <DemoBar>
                <Stepper label={text.pool.threads} value={pool.workers} min={1} max={MAX_WORKERS} onChange={(workers) => setPool((state) => ({ ...state, workers, step: 0 }))} />
                <Stepper label={text.pool.regions} value={pool.tasks.length} min={1} max={MAX_REGIONS} onChange={(count) => setPool((state) => ({ ...state, tasks: randomTasks(count), step: 0 }))} />
                <DemoStat value={late} unit={text.pool.late} className={cn("ml-auto", late > 0 && "text-ember-400")} />
            </DemoBar>
            <div className="grid grid-cols-[1.5rem_1fr] pt-3 pr-3">
                <div className="flex flex-col" style={{ height: PLOT_HEIGHT }}>
                    {workers.map((worker) => (
                        <span key={worker} className="flex flex-1 items-center justify-center font-mono text-[9px] text-cream-700">
                            {worker}
                        </span>
                    ))}
                </div>
                <div className="relative overflow-hidden" style={{ height: PLOT_HEIGHT }}>
                    <div className="absolute inset-0 flex flex-col">
                        {workers.map((worker) => (
                            <div key={worker} className="flex-1 border-t border-line last:border-b" />
                        ))}
                    </div>
                    <div className="absolute inset-y-0 flex flex-col items-center gap-1" style={{ left: percent(BUDGET) }}>
                        <span className="w-px flex-1 border-l border-dashed border-cream-500/60" />
                        <span className="font-mono text-[10px] tabular text-cream-500">{text.pool.budget}</span>
                    </div>
                    {placements.map((placement) => (
                        <Block key={placement.id} placement={placement} rowHeight={rowHeight} shown={isShown(placement, pool.step, placements.length)} />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-[1.5rem_1fr] border-t border-line py-1.5 pr-3 font-mono text-[9px] text-cream-700">
                <span />
                <div className="flex justify-between">
                    <span>0 ms</span>
                    <span>{RANGE} ms</span>
                </div>
            </div>
        </DemoFrame>
    );
}
