import { useState } from "react";
import DemoFrame, { DemoStat } from "@/components/demo/DemoFrame";
import { useTicker } from "@/lib/hook/useTicker";
import { useText } from "@/lib/i18n";
import { advance, dayTime, FURNACE_TICKS, initialLanes, type Lane, PERIOD, tps } from "@/lib/sim/clocks";
import { cn } from "@/lib/utils";

const STEP = PERIOD * 2;

function WorldClock({ lane }: { lane: Lane }) {
    const text = useText();
    return (
        <div className="flex flex-col gap-1 border-b border-line p-5 md:border-b-0 md:border-r">
            <span className="label">{text.clocks.world}</span>
            <span className="font-mono text-4xl font-semibold tabular text-cream-50">{dayTime(lane.count)}</span>
            <span className="font-mono text-xs tabular text-cream-500">
                {lane.count} {text.clocks.ticks}
            </span>
            <span className="mt-2 font-mono text-xs tabular text-cream-400">20 TPS</span>
        </div>
    );
}

function RegionRow({ lane, index, world, now }: { lane: Lane; index: number; world: Lane; now: number }) {
    const text = useText();
    const rate = tps(lane, now);
    const behind = world.count - lane.count;
    const progress = ((lane.count % FURNACE_TICKS) / FURNACE_TICKS) * 100;
    const color = `var(--color-region-${index})`;
    return (
        <div className="grid grid-cols-[4rem_4.5rem_1fr_7rem] items-center gap-4 px-5 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-cream-50">
                <span className="size-2.5 rounded-xs" style={{ background: color }} />
                {lane.label}
            </span>
            <span className={cn("font-mono text-xs tabular", rate < 20 ? "text-ember-400" : "text-cream-500")}>{rate.toFixed(0)} TPS</span>
            <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full overflow-hidden rounded-xs bg-bark-800">
                    <div className="h-full transition-[width] duration-100 ease-linear" style={{ width: `${progress}%`, background: rate < 20 ? "var(--color-ember-400)" : color }} />
                </div>
                <span className="text-[11px] text-cream-500">{text.clocks.furnace}</span>
            </div>
            <span className={cn("text-right font-mono text-xs tabular", behind > 0 ? "text-ember-400" : "text-cream-500")}>
                {behind > 0 ? `-${behind}` : "0"} {text.clocks.ticks}
            </span>
        </div>
    );
}

export default function ThreadClocks({ className }: { className?: string }) {
    const text = useText();
    const [state, setState] = useState(() => ({ now: 0, lanes: initialLanes() }));

    useTicker(true, STEP, () => setState((current) => ({ now: current.now + STEP, lanes: current.lanes.map((lane) => advance(lane, current.now + STEP)) })));

    const [world, ...regions] = state.lanes;

    return (
        <DemoFrame className={className}>
            <div className="grid md:grid-cols-[13rem_1fr]">
                <WorldClock lane={world} />
                <div className="flex flex-col divide-y divide-line">
                    {regions.map((lane, index) => (
                        <RegionRow key={lane.id} lane={lane} index={index + 1} world={world} now={state.now} />
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4 border-t border-line px-3 py-2">
                <DemoStat value={FURNACE_TICKS} unit={text.clocks.ticks} />
                <span className="text-xs text-cream-500">{text.clocks.legend}</span>
            </div>
        </DemoFrame>
    );
}
