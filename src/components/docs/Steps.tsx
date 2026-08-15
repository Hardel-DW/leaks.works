import type { ReactNode } from "react";

export default function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
    return (
        <ol className="flex flex-col gap-4">
            {items.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-[11px] font-bold text-zinc-400">{index + 1}</span>
                    <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-[14px] font-semibold text-zinc-200">{item.title}</span>
                        <div className="text-[14px] leading-relaxed text-zinc-400">{item.body}</div>
                    </div>
                </li>
            ))}
        </ol>
    );
}
