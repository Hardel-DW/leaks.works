import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function Island({ className, children }: PropsWithChildren<{ className?: string }>) {
    return <div className={cn("relative rounded-lg border border-zinc-800 bg-zinc-925", className)}>{children}</div>;
}

export function IslandGlow({ side, align }: { side: "top" | "bottom"; align?: "left" | "right" }) {
    const top = side === "top";
    const right = (align ?? (top ? "left" : "right")) === "right";

    return (
        <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 -z-10 h-28 overflow-hidden", top ? "top-0" : "bottom-0")}>
            <div className={cn("absolute inset-0", top ? "bg-linear-to-b from-white/[0.022]" : "bg-linear-to-t from-white/[0.016]", "to-transparent")} />
            <div className={cn("absolute h-32 w-2/3 rounded-[100%] bg-amber-800/6 blur-[68px]", top ? "-top-24" : "-bottom-24", right ? "right-0" : "left-0")} />
        </div>
    );
}
