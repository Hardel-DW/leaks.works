import { useState } from "react";
import Stepper from "@/components/ui/Stepper";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { useTicker } from "@/lib/hook/useTicker";
import { mix, REGION_TINTS } from "@/lib/sim/palette";

const COSTS = [9, 14, 7, 12, 6, 11];
const BUDGET_MS = 50;
const WORKERS = 4;
const FRAMES = 70;

interface Lane {
    label: string;
    blocks: { zone: number; cost: number; start: number }[];
    load: number;
}

function serialLanes(zones: number): Lane[] {
    let start = 0;
    const blocks = COSTS.slice(0, zones).map((cost, zone) => {
        const block = { zone, cost, start };
        start += cost;
        return block;
    });
    return [{ label: "Thread serveur", blocks, load: start }];
}

function parallelLanes(zones: number): Lane[] {
    const lanes: Lane[] = Array.from({ length: Math.min(WORKERS, zones) }, (_, index) => ({ label: `Worker ${index + 1}`, blocks: [], load: 0 }));
    for (const [zone, cost] of COSTS.slice(0, zones).entries()) {
        const lightest = lanes.reduce((best, lane) => (lane.load < best.load ? lane : best));
        lightest.blocks.push({ zone, cost, start: lightest.load });
        lightest.load += cost;
    }
    return lanes;
}

export default function SerialVsParallel() {
    const [mode, setMode] = useState("vanilla");
    const [zones, setZones] = useState(4);
    const [frame, setFrame] = useState(0);

    useTicker(true, 40, () => setFrame((value) => (value + 1) % FRAMES));

    const lanes = mode === "vanilla" ? serialLanes(zones) : parallelLanes(zones);
    const duration = Math.max(...lanes.map((lane) => lane.load));
    const scale = Math.max(duration, BUDGET_MS) * 1.08;
    const playhead = (frame / FRAMES) * scale;
    const tps = Math.min(20, Math.round(1000 / Math.max(duration, BUDGET_MS)));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <ToggleGroup value={mode} onChange={setMode} className="w-64">
                    <ToggleGroupOption value="vanilla">Vanilla</ToggleGroupOption>
                    <ToggleGroupOption value="leafs">Leafs</ToggleGroupOption>
                </ToggleGroup>
                <span className="flex items-center gap-2.5 text-[12px] text-zinc-400">
                    Zones actives
                    <Stepper value={zones} min={1} max={COSTS.length} onChange={setZones} />
                </span>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                {lanes.map((lane) => (
                    <div key={lane.label} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-[11px] text-zinc-500">{lane.label}</span>
                        <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-zinc-900">
                            {lane.blocks.map((block) => (
                                <div
                                    key={block.zone}
                                    className="absolute inset-y-0 flex items-center justify-center rounded-[4px] text-[10px] font-bold"
                                    style={{
                                        left: `${(block.start / scale) * 100}%`,
                                        width: `${(block.cost / scale) * 100}%`,
                                        backgroundColor: mix(REGION_TINTS[block.zone % REGION_TINTS.length], playhead >= block.start ? 1 : 0.28, "#18181b"),
                                        color: playhead >= block.start ? "#18181b" : "#71717a"
                                    }}>
                                    Z{block.zone + 1}
                                </div>
                            ))}
                            <div className="absolute inset-y-0 w-px bg-zinc-300" style={{ left: `${(playhead / scale) * 100}%` }} />
                            <div className="absolute inset-y-0 border-l border-dashed border-run-err" style={{ left: `${(BUDGET_MS / scale) * 100}%` }} />
                        </div>
                    </div>
                ))}
                <div className="flex items-center gap-3">
                    <span className="w-24 shrink-0" />
                    <div className="relative h-3 flex-1">
                        <span className="absolute -translate-x-1/2 text-[10px] whitespace-nowrap text-run-err" style={{ left: `${(BUDGET_MS / scale) * 100}%` }}>
                            budget 50 ms
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
                <Readout label="Durée du tick" value={`${duration} ms`} bad={duration > BUDGET_MS} />
                <Readout label="TPS tenus" value={`${tps}`} bad={tps < 20} />
                <Readout label="Cœurs utilisés" value={`${lanes.length}`} />
            </div>
        </div>
    );
}

function Readout({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">{label}</span>
            <span className={`font-minecraft text-xl ${bad ? "text-run-err" : "text-zinc-100"}`}>{value}</span>
        </div>
    );
}
