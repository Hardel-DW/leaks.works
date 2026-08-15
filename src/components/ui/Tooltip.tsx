import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";

const SIDE_CLASSES: Record<TooltipSide, string> = {
    top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
    left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
    right: "left-full top-1/2 ml-1.5 -translate-y-1/2"
};

export default function Tooltip({ label, side = "bottom", children }: { label: string; side?: TooltipSide; children: ReactNode }) {
    return (
        <span className="group/tt relative inline-flex">
            {children}
            <span
                role="tooltip"
                className={cn(
                    "pointer-events-none absolute z-9999 whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-925/92 px-2 py-1 text-[11px] font-medium text-zinc-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover/tt:opacity-100",
                    SIDE_CLASSES[side]
                )}>
                {label}
            </span>
        </span>
    );
}
