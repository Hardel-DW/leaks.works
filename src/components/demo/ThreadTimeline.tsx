import { useState } from "react";
import DemoFrame, { DemoBar, DemoStat } from "@/components/demo/DemoFrame";
import { useTicker } from "@/lib/hook/useTicker";
import { useText } from "@/lib/i18n";
import { advance, initialLanes, type Lane, PERIOD, SCALE_MAX, tps, WINDOW } from "@/lib/sim/clocks";
import { cn } from "@/lib/utils";

const PLOT_X = 150;
const PLOT_WIDTH = 760;
const LANE_HEIGHT = 46;
const LANE_GAP = 22;
const DIMENSION_INDENT = 26;
const REGION_INDENT = 12;

const laneY = (index: number) => 16 + index * (LANE_HEIGHT + LANE_GAP);
const indent = (lane: Lane) => (lane.kind === "dimension" ? DIMENSION_INDENT : lane.kind === "region" ? REGION_INDENT : 0);
const laneColor = (lane: Lane, index: number) => (lane.kind === "region" ? `var(--color-region-${index - 1})` : "var(--color-cream-400)");

function Bars({ lane, now, y, color }: { lane: Lane; now: number; y: number; color: string }) {
    const scaleX = PLOT_WIDTH / WINDOW;
    return (
        <g>
            {lane.ticks.map((tick) => {
                const x = PLOT_X + (tick.start - (now - WINDOW)) * scaleX;
                const height = Math.max(2, (Math.min(tick.duration, SCALE_MAX) / SCALE_MAX) * LANE_HEIGHT);
                const late = tick.duration > PERIOD;
                return (
                    <rect
                        key={tick.start}
                        x={x}
                        y={y + LANE_HEIGHT - height}
                        width={Math.max(2, tick.duration * scaleX)}
                        height={height}
                        fill={late ? "var(--color-ember-400)" : color}
                        opacity={late ? 0.95 : 0.8}
                    />
                );
            })}
        </g>
    );
}

function SerialArrow({ from, to }: { from: number; to: number }) {
    const x0 = 22;
    const x1 = x0 + DIMENSION_INDENT;
    const y0 = from + LANE_HEIGHT + 4;
    const y1 = to + LANE_HEIGHT / 2;
    return (
        <g fill="none" stroke="var(--color-cream-700)" strokeWidth={1.2}>
            <path d={`M ${x0} ${y0} C ${x0} ${y0 + 20}, ${x1} ${y1 - 24}, ${x1} ${y1 - 6}`} strokeDasharray="3 3" />
            <path d={`M ${x1 - 3.5} ${y1 - 11} L ${x1} ${y1 - 5} L ${x1 + 3.5} ${y1 - 11}`} />
        </g>
    );
}

export default function ThreadTimeline({ className }: { className?: string }) {
    const text = useText();
    const [state, setState] = useState(() => ({ now: WINDOW, lanes: initialLanes() }));

    useTicker(true, 100, () => setState((current) => ({ now: current.now + PERIOD, lanes: current.lanes.map((lane) => advance(lane, current.now + PERIOD)) })));

    const height = laneY(state.lanes.length) - LANE_GAP + 8;
    const regionTop = laneY(2) - LANE_GAP / 2;
    const labels: Record<Lane["kind"], string> = { server: text.clocks.server, dimension: text.clocks.dimension, region: text.clocks.region };

    return (
        <DemoFrame className={className}>
            <DemoBar>
                <span className="label">{text.clocks.server}</span>
                <span className="text-xs text-cream-700">{text.clocks.arrow}</span>
                <span className="label ml-auto text-leaf-300">{text.clocks.parallel}</span>
            </DemoBar>
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${PLOT_X + PLOT_WIDTH + 16} ${height}`} className="min-w-140 w-full" role="img" aria-label={text.clocks.title}>
                    <rect x={PLOT_X - 4} y={regionTop} width={PLOT_WIDTH + 8} height={height - regionTop - 4} rx={2} className="fill-leaf-500/4" />
                    <SerialArrow from={laneY(0)} to={laneY(1)} />
                    {state.lanes.map((lane, index) => {
                        const y = laneY(index);
                        const budgetY = y + LANE_HEIGHT - (PERIOD / SCALE_MAX) * LANE_HEIGHT;
                        const color = laneColor(lane, index);
                        const rate = tps(lane, state.now);
                        return (
                            <g key={lane.id}>
                                <text x={22 + indent(lane)} y={y + 12} className="fill-cream-50 font-sans text-[11px] font-semibold">
                                    {lane.kind === "region" ? lane.label : labels[lane.kind]}
                                </text>
                                <text x={22 + indent(lane)} y={y + 28} className={cn("font-mono text-[10px] tabular", rate < 20 ? "fill-ember-400" : "fill-cream-500")}>
                                    {rate.toFixed(0)} TPS
                                </text>
                                <line x1={PLOT_X} y1={y + LANE_HEIGHT + 0.5} x2={PLOT_X + PLOT_WIDTH} y2={y + LANE_HEIGHT + 0.5} stroke="var(--color-line)" />
                                {lane.kind === "region" && <line x1={PLOT_X} y1={budgetY} x2={PLOT_X + PLOT_WIDTH} y2={budgetY} stroke="var(--color-cream-700)" strokeDasharray="2 4" />}
                                <Bars lane={lane} now={state.now} y={y} color={color} />
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div className="flex items-center gap-4 border-t border-line px-3 py-2">
                <DemoStat value={WINDOW / 1000} unit="s" />
                <span className="text-xs text-cream-500">{text.clocks.legend}</span>
            </div>
        </DemoFrame>
    );
}
