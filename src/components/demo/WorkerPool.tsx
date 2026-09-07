import { useState } from "react";
import DemoFrame, { DemoBar, DemoStat, Stepper } from "@/components/demo/DemoFrame";
import { regionColor } from "@/components/demo/RegionGrid";
import { useTicker } from "@/lib/hook/useTicker";
import { useText } from "@/lib/i18n";
import { BUDGET, baseCost, jitter, MAX_REGIONS, MAX_WORKERS, type Placement, RANGE, schedule } from "@/lib/sim/pool";
import { cn } from "@/lib/utils";

const PLOT_HEIGHT = 260;
const SCALE = PLOT_HEIGHT / RANGE;

type Pool = { workers: number; costs: number[] };

const costsFor = (count: number) => Array.from({ length: count }, (_, id) => jitter(baseCost(id)));
const isLate = (placement: Placement) => placement.start + placement.cost > BUDGET;

function Block({ placement, columnWidth }: { placement: Placement; columnWidth: number }) {
    return (
        <div
            className={cn("absolute rounded-[1px] border border-bark-950/60 transition-all duration-500 ease-emphasized", isLate(placement) ? "bg-ember-400 opacity-95" : "opacity-80")}
            style={{
                left: `calc(${placement.worker * columnWidth}% + 2px)`,
                width: `calc(${columnWidth}% - 4px)`,
                bottom: placement.start * SCALE,
                height: Math.max(3, placement.cost * SCALE - 1),
                backgroundColor: isLate(placement) ? undefined : regionColor(placement.id + 1)
            }}
        />
    );
}

export default function WorkerPool({ className }: { className?: string }) {
    const text = useText();
    const [pool, setPool] = useState<Pool>({ workers: 12, costs: costsFor(20) });

    useTicker(true, 900, () => setPool((state) => ({ ...state, costs: state.costs.map((_, id) => jitter(baseCost(id))) })));

    const placements = schedule(pool.costs, pool.workers);
    const late = placements.filter(isLate).length;
    const columnWidth = 100 / pool.workers;
    const workers = Array.from({ length: pool.workers }, (_, index) => index + 1);

    return (
        <DemoFrame className={className}>
            <DemoBar>
                <Stepper label={text.pool.threads} value={pool.workers} min={1} max={MAX_WORKERS} onChange={(workers) => setPool((state) => ({ ...state, workers }))} />
                <Stepper label={text.pool.regions} value={pool.costs.length} min={1} max={MAX_REGIONS} onChange={(count) => setPool((state) => ({ ...state, costs: costsFor(count) }))} />
                <DemoStat value={late} unit={text.pool.late} className={cn("ml-auto", late > 0 && "text-ember-400")} />
            </DemoBar>
            <div className="relative mx-3 mt-3 overflow-hidden" style={{ height: PLOT_HEIGHT }}>
                <div className="absolute inset-0 flex">
                    {workers.map((worker) => (
                        <div key={worker} className="flex-1 border-l border-line last:border-r" />
                    ))}
                </div>
                <div className="absolute inset-x-0 flex items-center gap-2" style={{ bottom: BUDGET * SCALE }}>
                    <span className="h-px flex-1 border-t border-dashed border-cream-500/60" />
                    <span className="font-mono text-[10px] tabular text-cream-500">{text.pool.budget}</span>
                </div>
                {placements.map((placement) => (
                    <Block key={placement.id} placement={placement} columnWidth={columnWidth} />
                ))}
            </div>
            <div className="mx-3 flex border-t border-line py-1.5">
                {workers.map((worker) => (
                    <span key={worker} className="flex-1 text-center font-mono text-[9px] text-cream-700">
                        {worker}
                    </span>
                ))}
            </div>
        </DemoFrame>
    );
}
