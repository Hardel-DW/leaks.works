import Leaf from "@/components/ui/Leaf";
import { useText } from "@/lib/i18n";
import { DEPENDENCIES, LINKS } from "@/lib/links";
import { Link } from "@/lib/router";

export default function Footer() {
    const text = useText();
    return (
        <footer className="border-t border-line">
            <div className="frame flex flex-col gap-4 px-4 py-8 text-sm text-cream-500 sm:flex-row sm:items-center sm:px-6">
                <div className="flex items-center gap-2">
                    <Leaf className="size-4 text-leaf-500" />
                    <span>{text.footer.made}</span>
                </div>
                <span className="hidden text-cream-700 sm:block">·</span>
                <span>
                    {text.footer.requires} <Dependencies />
                </span>
                <nav className="flex gap-4 sm:ml-auto">
                    <Link to="/docs" className="transition-colors hover:text-cream-50">
                        {text.nav.docs}
                    </Link>
                    <Link to="/patchnote" className="transition-colors hover:text-cream-50">
                        {text.nav.patchnote}
                    </Link>
                    <a href={LINKS.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream-50">
                        GitHub
                    </a>
                    <a href={LINKS.modrinth} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream-50">
                        Modrinth
                    </a>
                </nav>
            </div>
        </footer>
    );
}

function Dependencies() {
    const text = useText();
    const links = DEPENDENCIES.map((mod) => (
        <a key={mod.name} href={mod.url} target="_blank" rel="noreferrer" className="transition-colors text-ember-400 hover:text-honey-300">
            {mod.name}
        </a>
    ));
    return links.flatMap((link, index) => (index === 0 ? [link] : [index === links.length - 1 ? ` ${text.footer.and} ` : ", ", link]));
}
