import { cn } from "@/lib/utils";

export default function SkewedGrid({ className }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 scale-110", className)}>
            <svg className="size-full stroke-white/10 stroke-2 [stroke-dasharray:5_6] [stroke-dashoffset:10]" style={{ transform: "skewY(-12deg)" }}>
                <defs>
                    <pattern id="skewed-grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M64 0H0V64" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#skewed-grid)" />
            </svg>
        </div>
    );
}
