import Icon from "@/components/ui/Icon";
import Leaf from "@/components/ui/Leaf";
import { useText } from "@/lib/i18n";
import { LINKS } from "@/lib/links";
import { Link, useLocation } from "@/lib/router";
import { useLocaleStore } from "@/lib/store/locale";
import { closeOnLink, cn } from "@/lib/utils";

const SOCIALS = [
    { name: "discord", href: LINKS.discord },
    { name: "x", href: LINKS.x },
    { name: "github", href: LINKS.github },
    { name: "bluesky", href: LINKS.bluesky }
] as const;

function NavLink({ to, children }: { to: string; children: string }) {
    const { pathname } = useLocation();
    const active = pathname === to || pathname.startsWith(`${to}/`);
    return (
        <Link to={to} className={cn("rounded-xs px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-soft hover:text-cream-50", active ? "text-cream-50" : "text-cream-400")}>
            {children}
        </Link>
    );
}

function LocaleSwitch() {
    const { locale, setLocale } = useLocaleStore();
    return (
        <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="flex h-8 cursor-pointer items-center gap-1 rounded-xs px-2 font-mono text-xs font-medium text-cream-500 transition-colors duration-150 ease-soft hover:bg-bark-800 hover:text-cream-50">
            <span className={cn(locale === "en" && "text-cream-50")}>EN</span>
            <span className="text-cream-700">/</span>
            <span className={cn(locale === "fr" && "text-cream-50")}>FR</span>
        </button>
    );
}

export default function Header() {
    const text = useText();
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-bark-950/80 backdrop-blur-md">
            <div className="frame flex h-14 items-center gap-4 px-4 sm:px-6">
                <Link to="/" className="mr-2 flex items-center gap-2 text-cream-50">
                    <Leaf className="size-6 text-leaf-400" />
                    <span className="text-[17px] font-game-title">LEAFS</span>
                </Link>
                <nav className="hidden items-center sm:flex">
                    <NavLink to="/docs">{text.nav.docs}</NavLink>
                    <NavLink to="/patchnote">{text.nav.patchnote}</NavLink>
                </nav>
                <div className="ml-auto flex items-center gap-1">
                    <LocaleSwitch />
                    <span className="mx-1 hidden h-5 w-px bg-line md:block" />
                    <div className="hidden items-center md:flex">
                        {SOCIALS.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className="flex size-8 items-center justify-center rounded-xs text-cream-500 transition-colors duration-150 ease-soft hover:bg-bark-800 hover:text-cream-50">
                                <Icon name={social.name} />
                            </a>
                        ))}
                    </div>
                    <a
                        href={LINKS.modrinth}
                        target="_blank"
                        rel="noreferrer"
                        className="bevel ml-2 hidden h-8 items-center gap-2 bg-leaf-400 px-3 text-sm font-semibold text-cream-50 transition-colors duration-150 ease-soft hover:bg-leaf-500 sm:flex">
                        <Icon name="modrinth" className="size-3.5" />
                        {text.nav.download}
                    </a>
                    <button
                        type="button"
                        popoverTarget="mobile-nav"
                        aria-label={text.nav.menu}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-xs text-cream-400 hover:bg-bark-800 sm:hidden">
                        <Icon name="menu" />
                    </button>
                </div>
            </div>
            <nav id="mobile-nav" popover="auto" onClick={closeOnLink} className="island fixed inset-x-4 top-16 m-0 w-auto flex-col gap-1 p-2 text-sm [&:popover-open]:flex sm:hidden">
                <NavLink to="/docs">{text.nav.docs}</NavLink>
                <NavLink to="/patchnote">{text.nav.patchnote}</NavLink>
                <a href={LINKS.modrinth} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 font-medium text-leaf-300">
                    <Icon name="modrinth" className="size-3.5" />
                    {text.nav.download}
                </a>
                <div className="mt-1 flex gap-1 border-t border-line pt-2">
                    {SOCIALS.map((social) => (
                        <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="flex size-8 items-center justify-center rounded-xs text-cream-500 hover:text-cream-50">
                            <Icon name={social.name} />
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    );
}
