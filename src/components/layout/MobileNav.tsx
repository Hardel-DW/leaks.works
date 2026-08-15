import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { PARTS } from "@/lib/chapters";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    return (
        <div className="sticky top-0 z-50 flex flex-col border-b border-zinc-900 bg-zinc-925 lg:hidden">
            <div className="flex items-center gap-3 px-5 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/icon.svg" alt="" className="size-5 brightness-90" />
                    <span className="font-minecraft text-base text-white">Leafs</span>
                </Link>
                <button type="button" onClick={() => setOpen(!open)} className="ml-auto flex cursor-pointer items-center gap-2 text-[13px] text-zinc-400">
                    Chapitres
                    <Icon src="/icons/chevron-down.svg" className={cn("size-3.5 transition-transform duration-150", open && "rotate-180")} />
                </button>
            </div>
            {open && (
                <nav className="max-h-[60dvh] overflow-y-auto border-t border-zinc-900 px-5 py-4">
                    {PARTS.map((part) => (
                        <div key={part.title} className="mb-4 flex flex-col gap-1">
                            <span className="pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">{part.title}</span>
                            {part.chapters.map((chapter) => (
                                <Link
                                    key={chapter.path}
                                    to={chapter.path}
                                    onClick={() => setOpen(false)}
                                    className={cn("rounded-lg px-2 py-1.5 text-[13px]", pathname === chapter.path ? "bg-zinc-800 text-zinc-100" : "text-zinc-500")}>
                                    {chapter.title}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            )}
        </div>
    );
}
