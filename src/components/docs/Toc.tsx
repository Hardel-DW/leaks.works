import { useText } from "@/lib/i18n";
import { lit, reading, type Span, type Step, steps, trail } from "@/lib/toc";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string; level: 2 | 3 };

const LINE = 96;
const INDENT = 12;

const span = (anchor: HTMLAnchorElement): Span => ({ x: 1 + Number(anchor.dataset.depth) * INDENT, top: anchor.offsetTop, bottom: anchor.offsetTop + anchor.offsetHeight });

class Trail {
    private readonly anchors: HTMLAnchorElement[];
    private readonly headings: HTMLElement[];
    private readonly paths: SVGPathElement[];
    private readonly resizer: ResizeObserver;
    private parts: Step[] = [];
    private readonly follow = () => this.update();

    constructor(nav: HTMLElement) {
        this.anchors = Array.from(nav.querySelectorAll("a"));
        this.headings = this.anchors.map((anchor) => document.getElementById(anchor.hash.slice(1))).filter((heading) => heading !== null);
        this.paths = Array.from(nav.querySelectorAll("path"));
        this.resizer = new ResizeObserver(() => this.measure());
        this.resizer.observe(nav);
        window.addEventListener("scroll", this.follow, { passive: true });
    }

    dispose() {
        this.resizer.disconnect();
        window.removeEventListener("scroll", this.follow);
    }

    private measure() {
        const spans = this.anchors.map(span);
        this.parts = steps(spans);
        const d = trail(spans);
        this.paths.map((path) => path.setAttribute("d", d));
        this.update();
    }

    private update() {
        const { scrollHeight } = document.documentElement;
        const progress = Math.min(1, window.scrollY / Math.max(1, scrollHeight - window.innerHeight));
        const line = LINE + progress * (window.innerHeight - LINE);
        const current = reading(
            this.headings.map((heading) => heading.getBoundingClientRect().top),
            scrollHeight - window.scrollY,
            line
        );
        this.paths[1].setAttribute("stroke-dasharray", `${lit(this.parts, current)} ${lit(this.parts, { index: this.parts.length - 1, fraction: 1 })}`);
        this.anchors.map((anchor, i) => (i === current.index ? anchor.setAttribute("aria-current", "location") : anchor.removeAttribute("aria-current")));
    }
}

function mount(nav: HTMLElement | null) {
    if (!nav) return;
    const followed = new Trail(nav);
    return () => followed.dispose();
}

export default function Toc({ items }: { items: TocItem[] }) {
    const text = useText();
    if (items.length === 0) return null;
    return (
        <nav ref={mount} className="relative flex flex-col gap-2">
            <span className="label mb-1">{text.docs.onThisPage}</span>
            <svg className="pointer-events-none absolute inset-y-0 left-0 w-4 overflow-visible" aria-hidden>
                <path className="fill-none stroke-line stroke-2" />
                <path className="fill-none stroke-leaf-400 stroke-2" />
            </svg>
            {items.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    data-depth={item.level - 2}
                    className={cn(
                        "py-0.5 text-[13px] leading-snug text-cream-500 transition-colors duration-150 ease-soft hover:text-cream-200 aria-[current]:text-cream-50",
                        item.level === 3 ? "pl-7" : "pl-4"
                    )}>
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
