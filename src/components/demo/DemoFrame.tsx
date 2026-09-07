import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export default function DemoFrame({ ref, className, children }: { ref?: Ref<HTMLDivElement>; className?: string; children: ReactNode }) {
    return (
        <div ref={ref} className={cn("island flex flex-col overflow-hidden", className)}>
            {children}
        </div>
    );
}

export function DemoBar({ children }: { children: ReactNode }) {
    return <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-3 py-2">{children}</div>;
}

export function DemoStat({ value, unit, className }: { value: string | number; unit?: string; className?: string }) {
    return (
        <span className={cn("font-mono text-xs tabular text-cream-400", className)}>
            {value}
            {unit && <span className="ml-1 text-cream-700">{unit}</span>}
        </span>
    );
}

export function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
    return (
        <div className="flex items-center gap-2">
            <span className="label">{label}</span>
            <div className="flex items-center overflow-hidden rounded-xs border border-line">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="flex size-7 cursor-pointer items-center justify-center text-cream-400 transition-colors hover:bg-bark-800 hover:text-cream-50 disabled:opacity-30">
                    <span className="block h-px w-2.5 bg-current" />
                </button>
                <span className="w-8 border-x border-line text-center font-mono text-xs tabular text-cream-50">{value}</span>
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="relative flex size-7 cursor-pointer items-center justify-center text-cream-400 transition-colors hover:bg-bark-800 hover:text-cream-50 disabled:opacity-30">
                    <span className="block h-px w-2.5 bg-current" />
                    <span className="absolute block h-2.5 w-px bg-current" />
                </button>
            </div>
        </div>
    );
}
