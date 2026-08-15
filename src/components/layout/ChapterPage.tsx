import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { type Chapter, chapterAt, neighbours, partAt } from "@/lib/chapters";
import { Link, useLocation } from "@/lib/router";

export default function ChapterPage({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();
    const chapter = chapterAt(pathname);
    const part = partAt(pathname);
    if (!chapter || !part) return null;
    const { previous, next } = neighbours(pathname);

    return (
        <article className="flex flex-col gap-6">
            <header className="relative isolate pb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{part.title}</span>
                <h1 className="mt-2 font-minecraft text-3xl text-white sm:text-4xl">{chapter.title}</h1>
                <div className="mt-2 h-px w-24 mask-[linear-gradient(90deg,black,transparent)]" style={{ backgroundColor: part.tint }} />
                <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">{chapter.summary}</p>
            </header>

            <div className="flex flex-col gap-6">{children}</div>

            <nav className="mt-8 grid gap-3 border-t border-zinc-900 pt-6 sm:grid-cols-2">
                {previous ? <NavCard chapter={previous} direction="previous" /> : <span />}
                {next && <NavCard chapter={next} direction="next" />}
            </nav>
        </article>
    );
}

function NavCard({ chapter, direction }: { chapter: Chapter; direction: "previous" | "next" }) {
    const next = direction === "next";

    return (
        <Link
            to={chapter.path}
            className={`group flex flex-col gap-1 rounded-xl border border-zinc-900 bg-zinc-925 px-4 py-3 transition-colors duration-150 ease-standard hover:border-zinc-800 ${next ? "sm:items-end sm:text-right" : ""}`}>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {!next && <Icon src="/icons/arrow-left.svg" className="size-3" />}
                {next ? "Chapitre suivant" : "Chapitre précédent"}
                {next && <Icon src="/icons/arrow-right.svg" className="size-3" />}
            </span>
            <span className="text-[14px] font-medium text-zinc-300 transition-colors group-hover:text-zinc-100">{chapter.title}</span>
        </Link>
    );
}
