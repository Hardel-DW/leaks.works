import { useState } from "react";
import { MIXINS, type MixinModule, MODULE_LABELS } from "@/lib/data/mixins";
import { cn } from "@/lib/utils";

const MODULES = Object.keys(MODULE_LABELS) as MixinModule[];

export default function MixinExplorer() {
    const [module, setModule] = useState<MixinModule | null>(null);
    const [query, setQuery] = useState("");

    const needle = query.trim().toLowerCase();
    const results = MIXINS.filter((entry) => {
        if (module && !entry.modules.includes(module)) return false;
        return needle.length === 0 || entry.vanilla.toLowerCase().includes(needle) || entry.why.toLowerCase().includes(needle);
    });

    return (
        <div className="flex flex-col gap-3">
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Chercher une classe de Minecraft..."
                className="h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-[13px] text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-700"
            />

            <div className="flex flex-wrap gap-1.5">
                <Chip label="tout" active={module === null} onClick={() => setModule(null)} />
                {MODULES.map((entry) => (
                    <Chip key={entry} label={MODULE_LABELS[entry]} active={module === entry} onClick={() => setModule(entry)} />
                ))}
            </div>

            <div className="flex flex-col divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                {results.map((entry) => (
                    <div key={entry.vanilla} className="flex flex-col gap-1.5 px-3 py-3">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <code className="font-mono text-[12.5px] text-zinc-200">{entry.vanilla}</code>
                            {entry.modules.map((name) => (
                                <span key={name} className="rounded border border-zinc-800 px-1.5 py-px text-[10px] text-zinc-500">
                                    {name}
                                </span>
                            ))}
                        </div>
                        <p className="text-[12.5px] leading-relaxed text-zinc-500">{entry.why}</p>
                    </div>
                ))}
                {results.length === 0 && <p className="px-3 py-6 text-center text-[12.5px] text-zinc-600">Aucune classe ne correspond.</p>}
            </div>

            <span className="text-[11px] text-zinc-600">
                {results.length} classe{results.length > 1 ? "s" : ""} de Minecraft sur {MIXINS.length}
            </span>
        </div>
    );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "cursor-pointer rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ease-standard",
                active ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "border-zinc-800 bg-zinc-925 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            )}>
            {label}
        </button>
    );
}
