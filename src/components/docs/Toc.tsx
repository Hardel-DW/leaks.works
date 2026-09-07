import { useState } from "react";
import { useText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string; level: 2 | 3 };

function observe(root: HTMLElement, ids: string[], onActive: (id: string) => void) {
    const targets = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) visible.add(entry.target.id);
                else visible.delete(entry.target.id);
            }
            const first = ids.find((id) => visible.has(id));
            if (first) onActive(first);
        },
        { rootMargin: "-64px 0px -70% 0px" }
    );
    for (const target of targets) observer.observe(target);
    root.dataset.observed = "true";
    return () => observer.disconnect();
}

export default function Toc({ items }: { items: TocItem[] }) {
    const text = useText();
    const [active, setActive] = useState(items[0]?.id);
    if (items.length === 0) return null;
    return (
        <nav
            ref={(root) =>
                root
                    ? observe(
                          root,
                          items.map((item) => item.id),
                          setActive
                      )
                    : undefined
            }
            className="flex flex-col gap-2">
            <span className="label mb-1">{text.docs.onThisPage}</span>
            {items.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                        "border-l py-0.5 text-[13px] leading-snug transition-colors duration-150 ease-soft",
                        item.level === 3 ? "pl-6" : "pl-3",
                        active === item.id ? "border-leaf-400 text-cream-50" : "border-line text-cream-500 hover:text-cream-200"
                    )}>
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
