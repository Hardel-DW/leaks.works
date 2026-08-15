import { useState } from "react";
import { useTicker } from "@/lib/hook/useTicker";
import { mix, REGION_TINTS, SERIAL_TINT } from "@/lib/sim/palette";
import { cn } from "@/lib/utils";

const CYCLE = 20;
const SERIAL_FROM = 14;

const REGIONS = [
    { label: "Région 1", from: 0, to: 11 },
    { label: "Région 2", from: 1, to: 13 },
    { label: "Région 3", from: 3, to: 12 }
];

export default function LevelLockTimeline() {
    const [frame, setFrame] = useState(0);
    useTicker(true, 190, () => setFrame((value) => (value + 1) % CYCLE));

    const serial = frame >= SERIAL_FROM;

    return (
        <div className="flex flex-col gap-4">
            <div className="relative flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                {REGIONS.map((region, index) => (
                    <Lane key={region.label} label={region.label} tint={REGION_TINTS[index]} from={region.from} to={region.to} frame={frame} />
                ))}
                <Lane label="Phase sérielle" tint={SERIAL_TINT} from={SERIAL_FROM} to={CYCLE - 1} frame={frame} />
            </div>

            <div
                className={cn(
                    "rounded-lg border px-3 py-2.5 text-[12.5px] leading-relaxed transition-colors duration-200",
                    serial ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-800 bg-zinc-900 text-zinc-400"
                )}>
                {serial ? (
                    <>
                        <span className="font-semibold text-zinc-100">Verrou en écriture, exclusif.</span> La phase sérielle du niveau tourne. Aucune région ne tique. C'est ici que passent la météo,
                        le temps, les raids, l'expiration des tickets.
                    </>
                ) : (
                    <>
                        <span className="font-semibold text-zinc-100">Verrou en lecture, partagé.</span> Les régions de la dimension tiquent en même temps. Chacune tient le verrou en lecture, elles ne
                        se gênent pas entre elles.
                    </>
                )}
            </div>
        </div>
    );
}

function Lane({ label, tint, from, to, frame }: { label: string; tint: string; from: number; to: number; frame: number }) {
    const active = frame >= from && frame <= to;

    return (
        <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] text-zinc-500">{label}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-zinc-900">
                <div
                    className="absolute inset-y-0 rounded-[4px] transition-colors duration-200"
                    style={{ left: `${(from / CYCLE) * 100}%`, width: `${((to - from + 1) / CYCLE) * 100}%`, backgroundColor: mix(tint, active ? 0.9 : 0.3, "#18181b") }}
                />
                <div className="absolute inset-y-0 w-px bg-zinc-300" style={{ left: `${(frame / CYCLE) * 100}%` }} />
            </div>
        </div>
    );
}
