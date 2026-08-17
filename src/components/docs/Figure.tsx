import { type ReactNode, useState } from "react";
import GridBackground from "@/components/ui/background/GridBackground";
import CollapseRegion from "@/components/ui/CollapseRegion";
import Island, { IslandGlow } from "@/components/ui/Island";
import { cn } from "@/lib/utils";

interface FigureProps {
    title: string;
    hint?: string;
    caption?: ReactNode;
    collapsible?: boolean;
    children: ReactNode;
}

export default function Figure({ title, hint, caption, collapsible = false, children }: FigureProps) {
    const [open, setOpen] = useState(true);
    const body = <div className="p-4">{children}</div>;

    return (
        <figure className="flex flex-col gap-2">
            <Island className="isolate overflow-hidden">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <GridBackground animate={false} opacity={0.2} />
                </div>
                <IslandGlow side="top" />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-zinc-800 px-4 py-3">
                    <span className="text-[13px] font-semibold text-zinc-100">{title}</span>
                    {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
                    {collapsible && (
                        <button
                            type="button"
                            onClick={() => setOpen((prev) => !prev)}
                            aria-label={open ? "Replier la figure" : "Déplier la figure"}
                            className="ml-auto cursor-pointer self-center rounded-md p-1 transition-colors duration-150 hover:bg-zinc-800">
                            <img src="/icons/chevron-down.svg" alt="" className={cn("size-3.5 invert opacity-60 transition-transform duration-150", open && "rotate-180")} />
                        </button>
                    )}
                </div>
                {collapsible ? <CollapseRegion open={open}>{body}</CollapseRegion> : body}
            </Island>
            {caption && <figcaption className="px-1 text-[12px] leading-relaxed text-zinc-500">{caption}</figcaption>}
        </figure>
    );
}

export function Legend({ items }: { items: { color: string; label: string }[] }) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {items.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: item.color }} />
                    {item.label}
                </span>
            ))}
        </div>
    );
}
