import Inline from "@/components/docs/Inline";
import { PATCHNOTES } from "@/content/patchnotes";
import { useText } from "@/lib/i18n";
import { useLocale } from "@/lib/store/locale";

export default function Patchnote() {
    const text = useText();
    const locale = useLocale();
    return (
        <div className="frame">
            <section className="row px-6 py-16 lg:px-12">
                <h1 className="text-balance text-4xl font-bold tracking-display text-cream-50 sm:text-5xl">{text.patchnote.title}</h1>
                <p className="mt-4 text-lg text-cream-400">{text.patchnote.subtitle}</p>
            </section>
            {PATCHNOTES.map((release) => (
                <section key={release.version} className="row grid gap-6 px-6 py-12 md:grid-cols-[12rem_1fr] lg:px-12">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-2xl font-semibold tabular text-cream-50">{release.version}</span>
                        <span className="font-mono text-xs text-cream-500">{release.date}</span>
                        <span className="label mt-2">{release.minecraft}</span>
                    </div>
                    <div className="prose">
                        <p>
                            <Inline text={release.summary[locale]} />
                        </p>
                        <ul>
                            {release.changes[locale].map((change) => (
                                <li key={change}>
                                    <Inline text={change} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            ))}
        </div>
    );
}
