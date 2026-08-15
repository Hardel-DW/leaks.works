import type { ReactNode } from "react";
import Collapsible from "@/components/ui/Collapsible";

export default function DeepDive({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Collapsible title="Sous le capot" subtitle={title} className="bg-zinc-925">
            <div className="flex flex-col gap-3 leading-relaxed">{children}</div>
        </Collapsible>
    );
}

export function ClassList({ items }: { items: { name: string; role: string }[] }) {
    return (
        <div className="flex flex-col divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800">
            {items.map((item) => (
                <div key={item.name} className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:gap-4">
                    <code className="shrink-0 font-mono text-[12px] text-zinc-300 sm:w-56">{item.name}</code>
                    <span className="min-w-0 text-[12.5px] leading-relaxed text-zinc-500">{item.role}</span>
                </div>
            ))}
        </div>
    );
}
