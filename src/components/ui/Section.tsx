import type React from "react";
import { cn } from "@/lib/utils";

export default function Section({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("flex w-full flex-col", className)}>{children}</div>;
}

export function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
    return (
        <div className={cn("flex items-center gap-4 p-2", children ? "w-full" : "w-fit")}>
            <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-2xl font-semibold text-zinc-100">{title}</h2>
                <div className="h-px w-full opacity-25 bg-linear-to-r from-transparent via-white to-transparent" />
            </div>
            {children}
        </div>
    );
}

export function SectionBody({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("flex flex-col gap-4 pt-4", className)}>{children}</div>;
}
