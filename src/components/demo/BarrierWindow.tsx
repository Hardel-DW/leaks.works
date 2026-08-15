import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { useTicker } from "@/lib/hook/useTicker";
import { mix, REGION_TINTS } from "@/lib/sim/palette";
import { cn } from "@/lib/utils";

const TICKS = 6;
const SLOTS = Array.from({ length: TICKS }, (_, index) => ({ id: `tick-${index + 1}`, index }));

export default function BarrierWindow() {
    const [repeating, setRepeating] = useState(false);
    const [functions, setFunctions] = useState(false);
    const [tick, setTick] = useState(0);

    useTicker(true, 620, () => setTick((value) => (value + 1) % TICKS));

    const opens = repeating || functions;
    const paused = opens;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
                <Switch label="Un command block en repeat tourne quelque part sur la carte" isChecked={repeating} setIsChecked={setRepeating} />
                <Switch label="Un datapack a une fonction dans #minecraft:tick" isChecked={functions} setIsChecked={setFunctions} />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex gap-1.5">
                    {SLOTS.map((slot) => (
                        <div key={slot.id} className="flex flex-1 flex-col gap-1">
                            <span className={cn("text-center text-[10px] font-bold", tick === slot.index ? "text-zinc-200" : "text-zinc-700")}>tick {slot.index + 1}</span>
                            <div className="flex flex-col gap-0.5">
                                {REGION_TINTS.slice(0, 3).map((tint) => (
                                    <div key={tint} className="h-4 overflow-hidden rounded-[3px] bg-zinc-900">
                                        <div
                                            className="h-full transition-all duration-200"
                                            style={{ width: paused ? "70%" : "100%", backgroundColor: mix(tint, tick === slot.index ? 0.95 : 0.38, "#18181b") }}
                                        />
                                    </div>
                                ))}
                                <div className="h-4 overflow-hidden rounded-[3px] bg-zinc-900">
                                    <div className={cn("ml-auto h-full transition-all duration-200", tick === slot.index ? "bg-zinc-200" : "bg-zinc-600")} style={{ width: opens ? "30%" : "12%" }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span className="size-2.5 rounded-[3px] bg-sky-400" /> régions qui tiquent
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span className="size-2.5 rounded-[3px] bg-zinc-200" /> thread global
                    </span>
                </div>
            </div>

            <div
                className={cn(
                    "rounded-lg border px-3 py-2.5 text-[12.5px] leading-relaxed transition-colors duration-200",
                    opens ? "border-run-err bg-zinc-900 text-zinc-300" : "border-run-ok bg-zinc-900 text-zinc-300"
                )}>
                {opens ? (
                    <>
                        <span className="font-semibold text-zinc-100">La fenêtre s'ouvre à chaque tick.</span> Toutes les régions doivent finir leur tour et attendre. Le serveur repasse par un moment
                        sériel chaque tick, dont la durée dépend de la région la plus lente à terminer.
                    </>
                ) : (
                    <>
                        <span className="font-semibold text-zinc-100">La fenêtre ne s'ouvre jamais.</span> Personne ne demande le monde entier, donc les régions ne s'arrêtent pas. Un serveur sans
                        contenu global ne paie rien pour ce mécanisme.
                    </>
                )}
            </div>
        </div>
    );
}
