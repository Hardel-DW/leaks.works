import type { ReactNode } from "react";
import Leaf from "@/components/ui/Leaf";
import { cn } from "@/lib/utils";

function Node({ className, children }: { className: string; children: ReactNode }) {
    return (
        <div className={cn("absolute left-1/2 flex size-21 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-bark-950", className)}>
            <div className="orbit-reverse flex">{children}</div>
        </div>
    );
}

export default function Orbit() {
    return (
        <div className="orbit absolute inset-y-14.5 left-1/2 hidden aspect-square -translate-x-1/2 rounded-full border border-line lg:block" aria-hidden>
            <Node className="top-0 -translate-y-1/2">
                <Leaf className="size-9 text-leaf-400" />
            </Node>
            <Node className="bottom-0 translate-y-1/2">
                <img src="/Fabric.png" alt="" width={36} height={36} className="size-9 pixelated" />
            </Node>
            <div className="orbit-reverse absolute inset-0 flex items-center justify-center">
                <Leaf className="size-[55%] text-line opacity-60" strokeWidth={1.1} />
            </div>
        </div>
    );
}
