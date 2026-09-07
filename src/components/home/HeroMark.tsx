import Leaf from "@/components/ui/Leaf";

const CELLS = [
    { x: 2, y: 1, tone: "bg-region-1/25", delay: "0s" },
    { x: 3, y: 1, tone: "bg-region-1/15", delay: "0.6s" },
    { x: 1, y: 2, tone: "bg-region-1/15", delay: "1.2s" },
    { x: 6, y: 4, tone: "bg-region-2/25", delay: "0.4s" },
    { x: 7, y: 5, tone: "bg-region-2/15", delay: "1.7s" },
    { x: 6, y: 5, tone: "bg-region-2/15", delay: "2.3s" },
    { x: 3, y: 6, tone: "bg-region-4/20", delay: "0.9s" },
    { x: 2, y: 6, tone: "bg-region-4/12", delay: "2.8s" }
];

export default function HeroMark() {
    return (
        <div className="chunkgrid relative aspect-square w-full max-w-88 [--cell:12.5%]">
            {CELLS.map((cell) => (
                <span
                    key={`${cell.x}-${cell.y}`}
                    className={`animate-breathe absolute size-[12.5%] ${cell.tone}`}
                    style={{ left: `${cell.x * 12.5}%`, top: `${cell.y * 12.5}%`, animationDelay: cell.delay }}
                />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-breathe absolute size-1/2 rounded-full bg-leaf-500/15 blur-3xl" />
                <Leaf className="animate-sway relative size-[58%] origin-[22%_82%] text-leaf-400 drop-shadow-[0_0_24px_var(--color-leaf-900)]" strokeWidth={1.6} />
            </div>
        </div>
    );
}
