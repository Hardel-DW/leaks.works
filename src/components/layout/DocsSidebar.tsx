import Icon from "@/components/ui/Icon";
import { PARTS } from "@/lib/chapters";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";

export default function DocsSidebar() {
    const { pathname } = useLocation();

    return (
        <aside className="sticky top-0 z-10 hidden h-dvh w-72 shrink-0 flex-col overflow-y-auto bg-zinc-925 px-4 py-6 lg:flex">
            <Brand />
            <nav className="mt-8 flex flex-col gap-7">
                {PARTS.map((part) => (
                    <div key={part.title} className="flex flex-col gap-1">
                        <span className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">{part.title}</span>
                        {part.chapters.map((chapter) => (
                            <SidebarLink key={chapter.path} to={chapter.path} icon={chapter.icon} label={chapter.title} active={pathname === chapter.path} />
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
}

function Brand() {
    return (
        <Link to="/" className="flex items-center gap-2.5 px-3 transition-opacity hover:opacity-80">
            <img src="/icon.svg" alt="" className="size-6 brightness-90" />
            <span className="flex flex-col leading-none">
                <span className="font-minecraft text-lg text-white">Leafs</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Comment ça marche</span>
            </span>
        </Link>
    );
}

function SidebarLink({ to, icon, label, active }: { to: string; icon: string; label: string; active: boolean }) {
    return (
        <Link
            to={to}
            className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors duration-150 ease-standard",
                active ? "bg-zinc-800 font-medium text-zinc-100" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            )}>
            <Icon src={icon} className={cn("size-3.5", active ? "text-zinc-200" : "text-zinc-600 group-hover:text-zinc-400")} />
            {label}
        </Link>
    );
}
