import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Height animation shared by every foldable block, without any border or background of its own. */
export default function CollapseRegion({ open, children }: { open: boolean; children: ReactNode }) {
    return (
        <div className={cn("grid transition-[grid-template-rows] duration-300 ease-emphasized-decelerate", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">{children}</div>
        </div>
    );
}
