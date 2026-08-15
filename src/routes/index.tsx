import Icon from "@/components/ui/Icon";
import { PARTS } from "@/lib/chapters";
import { Link } from "@/lib/router";

export default function HomePage() {
    return (
        <div className="flex flex-col gap-12">
            <header className="relative isolate flex flex-col gap-5 pb-4">
                <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[130%] -translate-x-1/2 rounded-[100%] bg-amber-700/12 blur-[95px]" />
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Mod Fabric, côté serveur, Minecraft 26.2</span>
                <h1 className="font-minecraft text-4xl leading-tight text-white sm:text-5xl">Comment marche Leafs</h1>
                <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
                    Un serveur Minecraft classique fait tout sur un seul fil d'exécution. Une seule tâche à la fois, un seul cœur du processeur qui travaille. Leafs découpe le monde en régions
                    indépendantes et donne à chacune son propre tick, sur son propre thread.
                </p>
                <p className="max-w-2xl leading-relaxed text-zinc-400">
                    Ce site explique le modèle pas à pas. Chaque chapitre commence par l'idée simple, avec un visuel que tu peux manipuler, puis descend jusqu'aux classes du dépôt. Aucune connaissance
                    de Java n'est nécessaire pour la première moitié.
                </p>
            </header>

            <div className="flex flex-col gap-10">
                {PARTS.map((part) => (
                    <section key={part.title} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="size-2 rounded-full" style={{ backgroundColor: part.tint }} />
                                <h2 className="text-xl font-semibold text-zinc-100">{part.title}</h2>
                            </div>
                            <p className="text-[13px] text-zinc-500">{part.intent}</p>
                        </div>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {part.chapters.map((chapter) => (
                                <Link
                                    key={chapter.path}
                                    to={chapter.path}
                                    className="group flex flex-col gap-2 rounded-xl border border-zinc-900 bg-zinc-925 px-4 py-3.5 transition-colors duration-150 ease-standard hover:border-zinc-800 hover:bg-zinc-925">
                                    <span className="flex items-center gap-2.5">
                                        <Icon src={chapter.icon} className="size-3.5 text-zinc-600 transition-colors group-hover:text-zinc-400" />
                                        <span className="text-[14px] font-medium text-zinc-200 transition-colors group-hover:text-white">{chapter.title}</span>
                                    </span>
                                    <span className="text-[12.5px] leading-relaxed text-zinc-500">{chapter.summary}</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
