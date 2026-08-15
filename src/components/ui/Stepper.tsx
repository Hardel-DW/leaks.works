import { cn } from "@/lib/utils";

interface StepperProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    className?: string;
}

/** Compact +/- stepper, aligned on Compose's Stepper (8px radius button pair). */
export default function Stepper({ value, min = 0, max = 999, step = 1, disabled, onChange, className }: StepperProps) {
    const clamp = (next: number) => Math.min(max, Math.max(min, next));
    const update = (next: number) => !disabled && onChange?.(clamp(next));
    const atMin = value <= min;
    const atMax = value >= max;

    return (
        <div className={cn("inline-flex items-center overflow-hidden rounded-lg border border-zinc-800/40 bg-zinc-900/40", disabled && "opacity-50", className)}>
            <button
                type="button"
                aria-label="Decrease"
                disabled={disabled || atMin}
                onClick={() => update(value - step)}
                className={cn("select-none px-2.5 py-1 text-sm leading-none disabled:pointer-events-none", atMin ? "text-zinc-700" : "text-zinc-300")}>
                -
            </button>
            <span className="select-none px-3 text-center text-sm font-medium tabular-nums text-zinc-100">{value}</span>
            <button
                type="button"
                aria-label="Increase"
                disabled={disabled || atMax}
                onClick={() => update(value + step)}
                className={cn("select-none px-2.5 py-1 text-sm leading-none disabled:pointer-events-none", atMax ? "text-zinc-700" : "text-zinc-300")}>
                +
            </button>
        </div>
    );
}
