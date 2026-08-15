import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { gridCells } from "@/lib/sim/grid";
import { mix } from "@/lib/sim/palette";

const CHUNKS = 40;
const CELLS = gridCells({ width: CHUNKS, height: 13 });

export default function ReachDiagram() {
    const [showReach, setShowReach] = useState(true);

    return (
        <div className="flex flex-col gap-4">
            <Switch label="Montrer la portée d'un tick, 8 chunks au delà du bord" isChecked={showReach} setIsChecked={setShowReach} />

            <svg viewBox={`0 0 ${CHUNKS} 13`} className="w-full rounded-lg border border-zinc-800 bg-zinc-950">
                <title>Deux régions séparées par une section vide</title>
                {CELLS.map((cell) => (
                    <rect key={cell.id} x={cell.x} y={cell.z} width={1} height={1} fill="none" stroke="#161618" strokeWidth={0.04} />
                ))}

                <rect x={0} y={2} width={12} height={9} fill={mix("#38bdf8", 0.24)} stroke={mix("#38bdf8", 0.65)} strokeWidth={0.12} />
                <rect x={28} y={2} width={12} height={9} fill={mix("#8b5cf6", 0.24)} stroke={mix("#8b5cf6", 0.65)} strokeWidth={0.12} />
                <rect x={12} y={2} width={16} height={9} fill={mix("#ffffff", 0.04)} stroke="#3f3f46" strokeWidth={0.08} strokeDasharray="0.5 0.4" />

                {showReach && (
                    <>
                        <rect x={12} y={2} width={8} height={9} fill={mix("#38bdf8", 0.1)} stroke={mix("#38bdf8", 0.4)} strokeWidth={0.08} strokeDasharray="0.4 0.3" />
                        <rect x={20} y={2} width={8} height={9} fill={mix("#8b5cf6", 0.1)} stroke={mix("#8b5cf6", 0.4)} strokeWidth={0.08} strokeDasharray="0.4 0.3" />
                    </>
                )}

                <text x={6} y={7} textAnchor="middle" fill="#e4e4e7" fontSize={1} fontWeight={600}>
                    Région A
                </text>
                <text x={34} y={7} textAnchor="middle" fill="#e4e4e7" fontSize={1} fontWeight={600}>
                    Région B
                </text>
                <text x={20} y={1.4} textAnchor="middle" fill="#a1a1aa" fontSize={0.85}>
                    1 section vide = 16 chunks
                </text>
                {showReach && (
                    <text x={20} y={12.2} textAnchor="middle" fill="#71717a" fontSize={0.8}>
                        8 + 8 chunks de portée, il reste toujours de la marge
                    </text>
                )}
            </svg>
        </div>
    );
}
