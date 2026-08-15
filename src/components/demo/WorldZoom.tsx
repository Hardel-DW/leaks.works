import { useState } from "react";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { gridCells } from "@/lib/sim/grid";
import { mix, SURFACE } from "@/lib/sim/palette";

const LEVELS = {
    bloc: {
        label: "Bloc",
        cells: 1,
        headline: "1 bloc",
        detail: "L'unité de base. Un mètre cube de terre, de pierre ou d'air."
    },
    chunk: {
        label: "Chunk",
        cells: 16,
        headline: "16 x 16 blocs",
        detail: "Minecraft ne charge jamais un bloc seul. Il charge un chunk entier, du bedrock jusqu'au ciel. C'est l'unité de sauvegarde, de génération et d'envoi au client."
    },
    section: {
        label: "Section",
        cells: 16,
        headline: "16 x 16 chunks",
        detail: "Le quadrillage que Leafs pose par dessus. Une section regroupe 256 chunks. C'est la maille avec laquelle le mod raisonne, jamais le chunk seul."
    },
    region: {
        label: "Région",
        cells: 5,
        headline: "les sections voisines, groupées",
        detail: "Les sections où il se passe quelque chose se regroupent en région, avec une marge de sections vides autour. Une région, c'est une tâche que le serveur peut tiquer sur son propre thread."
    }
} as const;

type LevelKey = keyof typeof LEVELS;

export default function WorldZoom() {
    const [level, setLevel] = useState<LevelKey>("chunk");
    const current = LEVELS[level];

    return (
        <div className="flex flex-col gap-4">
            <ToggleGroup value={level} onChange={(value) => setLevel(value as LevelKey)}>
                {Object.entries(LEVELS).map(([value, entry]) => (
                    <ToggleGroupOption key={value} value={value}>
                        {entry.label}
                    </ToggleGroupOption>
                ))}
            </ToggleGroup>

            <div className="flex flex-col items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <svg viewBox="0 0 100 100" className="w-full max-w-[260px]">
                    <title>{current.headline}</title>
                    {level === "region" ? <RegionShape /> : <Tiles count={current.cells} />}
                </svg>
                <span className="font-minecraft text-lg text-white">{current.headline}</span>
            </div>

            <p className="text-[13px] leading-relaxed text-zinc-400">{current.detail}</p>
        </div>
    );
}

function Tiles({ count }: { count: number }) {
    const size = 100 / count;
    return (
        <g>
            {gridCells({ width: count, height: count }).map((cell) => (
                <rect
                    key={cell.id}
                    x={cell.x * size}
                    y={cell.z * size}
                    width={size}
                    height={size}
                    fill={mix("#38bdf8", (cell.x * 7 + cell.z * 3) % 5 === 0 ? 0.3 : 0.13)}
                    stroke={mix("#38bdf8", 0.4)}
                    strokeWidth={count > 8 ? 0.3 : 0.8}
                />
            ))}
        </g>
    );
}

const REGION_ACTIVE = new Set(["1:1", "2:1", "2:2", "3:2"]);
const REGION_CELLS = gridCells({ width: 5, height: 5 });

function RegionShape() {
    return (
        <g>
            {REGION_CELLS.map((cell) => {
                const isActive = REGION_ACTIVE.has(cell.id);
                const owned = [...REGION_ACTIVE].some((entry) => {
                    const [ax, az] = entry.split(":").map(Number);
                    return Math.abs(ax - cell.x) <= 1 && Math.abs(az - cell.z) <= 1;
                });
                return (
                    <rect
                        key={cell.id}
                        x={cell.x * 20 + 0.6}
                        y={cell.z * 20 + 0.6}
                        width={18.8}
                        height={18.8}
                        rx={1.5}
                        fill={owned ? mix("#38bdf8", isActive ? 0.32 : 0.1) : SURFACE}
                        stroke={owned ? mix("#38bdf8", isActive ? 0.75 : 0.34) : "#1c1c1f"}
                        strokeWidth={0.6}
                        strokeDasharray={owned && !isActive ? "2 1.6" : undefined}
                    />
                );
            })}
        </g>
    );
}
