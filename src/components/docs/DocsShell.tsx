import { type BlockToken, plainText } from "@voxelio/markdown";
import type React from "react";
import Prose from "@/components/docs/Prose";
import Toc, { type TocItem } from "@/components/docs/Toc";
import Icon from "@/components/ui/Icon";
import { type DocSlug, NAV, SLUGS } from "@/content/content";
import { docsFor } from "@/lib/content/load";
import { useText } from "@/lib/i18n";
import { Link } from "@/lib/router";
import { useLocale } from "@/lib/store/locale";
import { cn, slugify } from "@/lib/utils";

function headings(blocks: BlockToken[]): TocItem[] {
    const items: TocItem[] = [];
    for (const block of blocks) {
        if (block.type !== "heading" || (block.level !== 2 && block.level !== 3)) continue;
        const label = plainText(block.children);
        items.push({ id: slugify(label), label, level: block.level });
    }
    return items;
}

function Sidebar({ current }: { current: DocSlug }) {
    const text = useText();
    const docs = docsFor(useLocale());
    return (
        <nav className="flex flex-col gap-7">
            {NAV.map((group) => (
                <div key={group.group} className="flex flex-col gap-1">
                    <span className="label mb-1 px-3">{text.docs.groups[group.group]}</span>
                    {group.slugs.map((slug) => (
                        <Link
                            key={slug}
                            to={`/docs/${slug}`}
                            className={cn(
                                "rounded-xs border-l px-3 py-1.5 text-[13.5px] transition-colors duration-150 ease-soft",
                                slug === current ? "border-leaf-400 bg-leaf-500/8 text-cream-50" : "border-transparent text-cream-400 hover:text-cream-50"
                            )}>
                            {docs[slug].data.title}
                        </Link>
                    ))}
                </div>
            ))}
        </nav>
    );
}

function Pager({ current }: { current: DocSlug }) {
    const text = useText();
    const docs = docsFor(useLocale());
    const index = SLUGS.indexOf(current);
    const previous = SLUGS[index - 1];
    const next = SLUGS[index + 1];
    return (
        <div className="mt-16 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {previous && (
                <Link to={`/docs/${previous}`} className="island group flex flex-col gap-1 px-5 py-4 transition-colors hover:border-bark-600">
                    <span className="label flex items-center gap-1.5">
                        <Icon name="arrowLeft" className="size-3" />
                        {text.docs.previous}
                    </span>
                    <span className="font-semibold text-cream-50">{docs[previous].data.title}</span>
                </Link>
            )}
            {next && (
                <Link to={`/docs/${next}`} className="island group flex flex-col gap-1 px-5 py-4 text-right transition-colors hover:border-bark-600 sm:col-start-2">
                    <span className="label flex items-center justify-end gap-1.5">
                        {text.docs.next}
                        <Icon name="arrowRight" className="size-3" />
                    </span>
                    <span className="font-semibold text-cream-50">{docs[next].data.title}</span>
                </Link>
            )}
        </div>
    );
}

const closeOnLink = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) event.currentTarget.hidePopover();
};

export default function DocsShell({ slug }: { slug: DocSlug }) {
    const text = useText();
    const page = docsFor(useLocale())[slug];
    return (
        <div className="hatched">
            <div className="frame grid bg-bark-950 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
                <aside className="hidden border-r border-line lg:block">
                    <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto px-4 py-10">
                        <Sidebar current={slug} />
                    </div>
                </aside>
                <button
                    type="button"
                    popoverTarget="docs-nav"
                    aria-label={text.nav.docs}
                    className="fixed right-5 bottom-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full border border-line bg-bark-900 text-cream-400 transition-colors duration-150 ease-soft hover:bg-bark-800 hover:text-cream-50 lg:hidden">
                    <Icon name="menu" />
                </button>
                <nav
                    id="docs-nav"
                    popover="auto"
                    onClick={closeOnLink}
                    className="fixed inset-y-0 left-0 m-0 h-dvh w-72 max-w-[85vw] -translate-x-full overflow-y-auto border-r border-line bg-bark-950 px-4 py-8 transition-[translate,display,overlay] transition-discrete duration-200 ease-soft open:translate-x-0 starting:open:-translate-x-full backdrop:bg-bark-950/60 backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-200 backdrop:ease-soft starting:open:backdrop:bg-transparent lg:hidden">
                    <Sidebar current={slug} />
                </nav>
                <article key={slug} className="min-w-0 px-6 py-12 sm:px-10 lg:px-14">
                    <div className="mx-auto max-w-[44rem]">
                        <h1 className="text-balance text-4xl font-bold tracking-display text-cream-50 sm:text-[2.75rem] sm:leading-[1.1]">{page.data.title}</h1>
                        <p className="mt-4 text-pretty text-lg leading-relaxed text-cream-400">{page.data.lead}</p>
                        <div className="mt-10">
                            <Prose blocks={page.blocks} />
                        </div>
                        <Pager current={slug} />
                    </div>
                </article>
                <aside className="hidden border-l border-line xl:block">
                    <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto px-5 py-10">
                        <Toc items={headings(page.blocks)} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
