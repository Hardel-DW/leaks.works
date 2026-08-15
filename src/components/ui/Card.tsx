import type { HTMLAttributes, PropsWithChildren } from "react";
import GridBackground from "@/components/ui/background/GridBackground";
import ShineBackground from "@/components/ui/background/ShineBackground";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<
    HTMLAttributes<HTMLDivElement> & {
        interactive?: boolean;
        contentClassName?: string;
        ref?: React.Ref<HTMLDivElement>;
    }
>;

export default function Card({ interactive, className, contentClassName, ref, children, ...props }: CardProps) {
    return (
        <div
            ref={ref}
            className={cn(
                "relative isolate overflow-hidden rounded-xl border",
                interactive
                    ? "cursor-pointer border-zinc-800 bg-zinc-925 transition-transform duration-150 ease-standard hover:-translate-y-1"
                    : "border-zinc-900 bg-zinc-925 shadow-xl shadow-black/40",
                className
            )}
            {...props}>
            <GridBackground animate={false} opacity={interactive ? 0.6 : undefined} />
            <ShineBackground double={!interactive} />
            <div className={cn("relative flex min-h-0 flex-col", contentClassName)}>{children}</div>
        </div>
    );
}
