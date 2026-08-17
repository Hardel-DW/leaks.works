import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Lead({ children }: { children: ReactNode }) {
    return <p className="text-lg leading-relaxed text-zinc-300">{children}</p>;
}

export function P({ children }: { children: ReactNode }) {
    return <p className="leading-relaxed text-zinc-400">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col pt-6">
            <h2 className="text-2xl font-semibold text-zinc-100">{children}</h2>
            <div className="mt-1 h-px w-24 bg-linear-to-r from-white/40 to-transparent" />
        </div>
    );
}

export function H3({ children }: { children: ReactNode }) {
    return <h3 className="pt-2 text-[15px] font-semibold text-zinc-200">{children}</h3>;
}

export function Bullets({ children }: { children: ReactNode }) {
    return <ul className="flex flex-col gap-2 pl-1">{children}</ul>;
}

export function Bullet({ children }: { children: ReactNode }) {
    return (
        <li className="flex gap-3 leading-relaxed text-zinc-400">
            <span className="mt-2.25 size-1 shrink-0 rounded-full bg-zinc-600" />
            <span className="min-w-0">{children}</span>
        </li>
    );
}

export function Code({ children, className }: { children: ReactNode; className?: string }) {
    return <code className={cn("rounded-[5px] border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.82em] text-zinc-300", className)}>{children}</code>;
}

export function Strong({ children }: { children: ReactNode }) {
    return <strong className="font-semibold text-zinc-200">{children}</strong>;
}
