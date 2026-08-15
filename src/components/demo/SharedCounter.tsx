import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { useTicker } from "@/lib/hook/useTicker";
import { mix, REGION_TINTS } from "@/lib/sim/palette";
import { cn } from "@/lib/utils";

interface Counter {
    expected: number;
    actual: number;
    lost: number;
    pulse: number;
}

const START: Counter = { expected: 0, actual: 0, lost: 0, pulse: 0 };

function advance(counter: Counter, guarded: boolean): Counter {
    const collides = !guarded && Math.random() < 0.35;
    return {
        expected: counter.expected + 2,
        actual: counter.actual + (collides ? 1 : 2),
        lost: counter.lost + (collides ? 1 : 0),
        pulse: counter.pulse + 1
    };
}

export default function SharedCounter() {
    const [guarded, setGuarded] = useState(false);
    const [counter, setCounter] = useState(START);

    useTicker(true, 420, () => setCounter((value) => advance(value, guarded)));

    const toggle = (value: boolean) => {
        setGuarded(value);
        setCounter(START);
    };

    return (
        <div className="flex flex-col gap-4">
            <Switch label="Le scoreboard passe sous le moniteur partagé" isChecked={guarded} setIsChecked={toggle} />

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <RegionCard tint={REGION_TINTS[0]} label="Région 1" active={counter.pulse % 2 === 0} />
                <div className="flex flex-col items-center gap-1 px-2">
                    <span className={cn("rounded-md border px-2 py-1 text-[10px] font-bold uppercase", guarded ? "border-run-ok text-run-ok" : "border-run-err text-run-err")}>
                        {guarded ? "moniteur" : "accès libre"}
                    </span>
                </div>
                <RegionCard tint={REGION_TINTS[1]} label="Région 2" active={counter.pulse % 2 === 1} />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
                <Readout label="Incréments demandés" value={counter.expected} />
                <Readout label="Score réel" value={counter.actual} bad={counter.lost > 0} />
                <Readout label="Perdus" value={counter.lost} bad={counter.lost > 0} />
            </div>

            <p className="text-[12px] leading-relaxed text-zinc-500">
                {guarded
                    ? "Avec le moniteur, les deux régions se mettent en file pour toucher le scoreboard. Le score est exact, et le coût est celui d'une attente très courte, sur une structure qu'on touche rarement."
                    : "Sans protection, deux régions qui lisent la même valeur au même moment écrivent le même résultat. Un des deux incréments disparaît, sans erreur, sans log. C'est ce genre de bug qui rend le multithreading naïf inutilisable."}
            </p>
        </div>
    );
}

function RegionCard({ tint, label, active }: { tint: string; label: string; active: boolean }) {
    return (
        <div className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">
            <span className="size-2.5 rounded-[3px] transition-colors duration-200" style={{ backgroundColor: mix(tint, active ? 1 : 0.32) }} />
            <span className="text-[12px] text-zinc-300">{label}</span>
            <span className="ml-auto text-[11px] text-zinc-600">{active ? "écrit un score" : "attend"}</span>
        </div>
    );
}

function Readout({ label, value, bad }: { label: string; value: number; bad?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">{label}</span>
            <span className={cn("font-minecraft text-xl tabular-nums", bad ? "text-run-err" : "text-zinc-100")}>{value}</span>
        </div>
    );
}
