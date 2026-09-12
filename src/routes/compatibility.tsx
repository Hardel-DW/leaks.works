import { useState } from "react";
import ModTable from "@/components/compatibility/ModTable";
import SearchInput from "@/components/ui/SearchInput";
import { searchMods } from "@/content/compatibility";
import { HEADS } from "@/content/heads";
import { useText } from "@/lib/i18n";
import type { RouteConfig } from "@/lib/router";

export default { head: () => HEADS.compatibility, component: Compatibility } satisfies RouteConfig;

function Compatibility() {
    const text = useText();
    const [query, setQuery] = useState("");
    const mods = searchMods(query);

    return (
        <div className="hatched">
            <div className="frame bg-bark-950">
                <section className="row px-6 py-16 lg:px-12">
                    <h1 className="text-balance text-4xl font-bold tracking-display text-cream-50 sm:text-5xl">{text.compatibility.title}</h1>
                    <p className="mt-4 max-w-2xl text-pretty text-lg text-cream-400">{text.compatibility.subtitle}</p>
                </section>
                <section className="row px-6 py-12 lg:px-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <SearchInput value={query} onChange={setQuery} placeholder={text.compatibility.search} />
                                <span className="label whitespace-nowrap tabular">
                                    {mods.length} {text.compatibility.count}
                                </span>
                            </div>
                            <p className="px-4 text-xs text-cream-500">{text.compatibility.hint}</p>
                        </div>
                        <ModTable mods={mods} />
                    </div>
                </section>
            </div>
        </div>
    );
}
