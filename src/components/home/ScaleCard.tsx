import type { CSSProperties, PointerEvent } from "react";
import Leaf from "@/components/ui/Leaf";
import { useText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ROWS = [
    { key: "vanilla", value: 20, tone: "bg-cream-500" },
    { key: "paper", value: 80, tone: "bg-cream-400" },
    { key: "leafs", value: 621, tone: "bg-leaf-400" }
] as const;

const MAX = Math.max(...ROWS.map((row) => row.value));
const DURATION_MS = 15_000;
const START_MS = 300;
const STAGGER_MS = 180;
const JOIN_COUNT = 50;
const VISIBLE = 6;
const SETTLE_MS = 600;
const SWAP_MS = 800;
const HEAD = 16;
const ATLAS_COLUMNS = 10;
const TILT = 8;

const JOINS = Array.from({ length: JOIN_COUNT }, (_, index) => Math.round((MAX * (index + 1)) / JOIN_COUNT));

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
const count = (value: number) => ({ "--count": value }) as CSSProperties;
const head = (index: number) => ({ backgroundPosition: `${-(index % ATLAS_COLUMNS) * HEAD}px ${-Math.floor(index / ATLAS_COLUMNS) * HEAD}px` });
const joinDelay = (players: number) => START_MS + STAGGER_MS * (ROWS.length - 1) + (DURATION_MS * players) / MAX;
const finished = () => joinDelay(MAX) + SETTLE_MS;
const feed = () =>
    ({
        animation: `feed ${DURATION_MS}ms steps(${JOIN_COUNT}, end) ${joinDelay(0)}ms both`,
        "--feed-from": `${VISIBLE}lh`,
        "--feed-to": `${VISIBLE - JOIN_COUNT}lh`
    }) as CSSProperties;

function track(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const style = event.currentTarget.style;
    style.setProperty("--mx", `${x * 100}%`);
    style.setProperty("--my", `${y * 100}%`);
    style.setProperty("--rx", `${(x - 0.5) * TILT}deg`);
    style.setProperty("--ry", `${(0.5 - y) * TILT}deg`);
}

function release(event: PointerEvent<HTMLDivElement>) {
    for (const name of ["--mx", "--my", "--rx", "--ry"]) event.currentTarget.style.removeProperty(name);
}

function Bar({ label, value, tone, index }: { label: string; value: number; tone: string; index: number }) {
    return (
        <div className="flex flex-col gap-2" style={delay(START_MS + index * STAGGER_MS)}>
            <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-cream-200">{label}</span>
                <span className="animate-count counter font-mono text-sm tabular text-cream-50" style={count(value)} />
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-bark-800 shadow-[0_3px_12px_-1px_oklch(0.08_0.015_55/0.35)]">
                <div className={cn("animate-grow h-full rounded-full", tone)} style={{ width: `${(value / MAX) * 100}%` }} />
            </div>
        </div>
    );
}

function Joins() {
    const text = useText();
    return (
        <div className="animate-fade-out game-text overflow-hidden px-3 pb-1 text-xs leading-normal" style={{ height: `${VISIBLE}lh`, ...delay(finished()) }}>
            <div style={feed()}>
                {JOINS.map((players, index) => (
                    <p key={players} className="flex h-[1lh] items-center gap-2 whitespace-nowrap">
                        <span className="size-4 shrink-0 bg-[url(/heads.png)] bg-size-[160px_80px] pixelated" style={head(index)} />
                        Player{players} {text.scale.joined}
                    </p>
                ))}
            </div>
        </div>
    );
}

function Card() {
    const text = useText();
    return (
        <div className="island w-full p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
                <span className="label">{text.scale.context}</span>
                <span className="label">{text.scale.unit}</span>
            </div>
            <div className="mt-8 flex flex-col gap-6">
                {ROWS.map((row, index) => (
                    <Bar key={row.key} label={text.scale.rows[row.key]} value={row.value} tone={row.tone} index={index} />
                ))}
            </div>
            <p className="mt-8 font-mono text-xs text-cream-500">{text.scale.note}</p>
        </div>
    );
}

function Signature() {
    return (
        <div className="animate-fade-in absolute inset-0 flex items-center gap-4 px-4" style={delay(finished() + SWAP_MS)}>
            <span className="h-px flex-1 bg-line" />
            <span className="flex items-center gap-2 text-cream-50">
                <Leaf className="size-5 text-leaf-400" />
                <span className="text-[17px] -translate-y-0.5 font-game-title">LEAFS</span>
            </span>
            <span className="h-px flex-1 bg-line" />
        </div>
    );
}

export default function ScaleCard() {
    return (
        <div className="tilt-card flex w-full max-w-xl flex-col gap-4 rounded-xs border border-line bg-bark-950 p-2" onPointerMove={track} onPointerLeave={release}>
            <Card />
            <div className="relative">
                <Joins />
                <Signature />
            </div>
        </div>
    );
}
