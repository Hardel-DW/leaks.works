import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTicker } from "@/lib/hook/useTicker";
import { REGION_TINTS } from "@/lib/sim/palette";

const SMELT_TICKS = 200;

interface World {
    gameTime: number;
    fast: number;
    slow: number;
    started: number;
    deadline: number;
    merged: boolean;
}

const START: World = { gameTime: 4820, fast: 0, slow: 0, started: 0, deadline: SMELT_TICKS, merged: false };

function advance(world: World): World {
    const gameTime = world.gameTime + 1;
    const fast = world.fast + 1;
    const slow = world.merged ? fast : world.slow + (gameTime % 3 === 0 ? 0 : 1);
    if (slow < world.deadline) {
        return { ...world, gameTime, fast, slow };
    }

    return { ...world, gameTime, fast, slow, started: slow, deadline: slow + SMELT_TICKS };
}

function rebase(world: World): World {
    const shift = world.fast - world.slow;
    return { ...world, merged: true, slow: world.fast, started: world.started + shift, deadline: world.deadline + shift };
}

export default function TwoClocks() {
    const [world, setWorld] = useState(START);
    useTicker(true, 90, () => setWorld(advance));

    const remaining = world.deadline - world.slow;
    const progress = (world.slow - world.started) / (world.deadline - world.started);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">
                <span className="text-[12px] text-zinc-400">Temps du jeu, avancé par le thread global</span>
                <span className="font-minecraft text-xl tabular-nums text-white">{world.gameTime}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <ClockCard tint={REGION_TINTS[0]} label="Région A, jamais en retard" ticks={world.fast} />
                <ClockCard tint={REGION_TINTS[1]} label={world.merged ? "Région B, absorbée par A" : "Région B, surchargée"} ticks={world.slow} />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex items-baseline justify-between">
                    <span className="text-[12px] text-zinc-400">Un four dans la région B, cuisson de 200 ticks</span>
                    <span className="text-[11px] tabular-nums text-zinc-500">{remaining} ticks restants</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-zinc-900">
                    <div className="h-full bg-run-ok transition-[width] duration-100 ease-linear" style={{ width: `${progress * 100}%` }} />
                </div>
                <p className="text-[12px] leading-relaxed text-zinc-500">
                    L'échéance du four est écrite en temps de région, pas en temps du jeu. La région B a vécu moins de ticks que le temps du jeu, et sa cuisson avance à son rythme, sans jamais sauter
                    ni perdre un tick.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost_border" size="sm" onClick={() => setWorld(rebase)} disabled={world.merged}>
                    Fusionner B dans A
                </Button>
                <Button variant="ghost_border" size="sm" onClick={() => setWorld(START)}>
                    Réinitialiser
                </Button>
                {world.merged && <span className="text-[12px] text-run-ok">Compteur de B recalé sur celui de A, et la cuisson repart au rythme de A avec le même reste.</span>}
            </div>
        </div>
    );
}

function ClockCard({ tint, label, ticks }: { tint: string; label: string; ticks: number }) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: tint }} />
                {label}
            </span>
            <span className="font-minecraft text-xl tabular-nums text-white">{ticks}</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">ticks vécus</span>
        </div>
    );
}
