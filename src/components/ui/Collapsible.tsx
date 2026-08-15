import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

/** Expandable section, aligned on Compose's CollapsibleSection (chevron-first header, 8px radius, animated chevron). */
export default function Collapsible({ title, subtitle, children, defaultOpen = false, className }: CollapsibleProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={cn("group overflow-hidden rounded-lg border transition-colors duration-150 ease-standard", open ? "border-zinc-800" : "border-zinc-900 hover:border-zinc-800", className)}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    "flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px] font-medium transition-colors duration-150 ease-standard",
                    open ? "text-zinc-100" : "text-zinc-300 group-hover:text-zinc-100"
                )}>
                <img src="/icons/chevron-down.svg" alt="" className={cn("size-3.5 shrink-0 invert opacity-60 transition-transform duration-150", open && "rotate-180")} />
                <span className="flex flex-1 flex-col pr-2">
                    {title}
                    {subtitle && <span className="text-[11px] font-normal text-zinc-500">{subtitle}</span>}
                </span>
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-emphasized-decelerate", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-3 px-4 pb-4 pt-1 text-sm text-zinc-400">{children}</div>
                </div>
            </div>
        </div>
    );
}
