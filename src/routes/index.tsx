import type { CSSProperties } from "react";
import RegionGrid from "@/components/demo/RegionGrid";
import ThreadTimeline from "@/components/demo/ThreadTimeline";
import WorkerPool from "@/components/demo/WorkerPool";
import HeroMark from "@/components/home/HeroMark";
import WindLeaves from "@/components/home/WindLeaves";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useText } from "@/lib/i18n";
import { LINKS } from "@/lib/links";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Home() {
    const text = useText();
    return (
        <div className="relative">
            <WindLeaves />
            <div className="frame">
                <section className="row grid gap-10 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:items-center md:py-28 lg:px-12">
                    <div className="flex flex-col items-start gap-6">
                        <p className="label rise" style={delay(0)}>
                            {text.hero.eyebrow}
                        </p>
                        <h1 className="rise text-balance text-5xl font-bold leading-[1.02] tracking-display text-cream-50 sm:text-6xl lg:text-7xl" style={delay(80)}>
                            {text.hero.title}
                        </h1>
                        <p className="rise max-w-md text-pretty text-lg leading-relaxed text-cream-400" style={delay(160)}>
                            {text.hero.subtitle}
                        </p>
                        <div className="rise flex flex-wrap gap-3 pt-2" style={delay(240)}>
                            <Button variant="primary" href={LINKS.modrinth}>
                                <Icon name="modrinth" className="size-4" />
                                {text.hero.primary}
                            </Button>
                            <Button to="/docs">
                                {text.hero.secondary}
                                <Icon name="arrowRight" className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rise flex justify-center md:justify-end" style={delay(200)}>
                        <HeroMark />
                    </div>
                </section>

                <section className="row px-6 py-16 lg:px-12">
                    <Heading title={text.regions.title} text={text.regions.text} />
                    <RegionGrid className="reveal mt-10" />
                </section>

                <section className="row cells md:grid-cols-[1fr_1.4fr]">
                    <div className="flex flex-col justify-center px-6 py-14 lg:px-12">
                        <Heading title={text.clocks.title} text={text.clocks.text} />
                    </div>
                    <div className="px-6 py-10 lg:px-10">
                        <ThreadTimeline className="reveal" />
                    </div>
                </section>

                <section className="row cells md:grid-cols-[1.4fr_1fr]">
                    <div className="px-6 py-10 lg:px-10">
                        <WorkerPool className="reveal" />
                    </div>
                    <div className="flex flex-col justify-center px-6 py-14 lg:px-12">
                        <Heading title={text.pool.title} text={text.pool.text} />
                    </div>
                </section>

                <section className="row cells md:grid-cols-3">
                    {text.pillars.map((pillar) => (
                        <div key={pillar.title} className="flex flex-col gap-3 px-6 py-12 lg:px-10">
                            <h3 className="text-lg font-semibold tracking-tight text-cream-50">{pillar.title}</h3>
                            <p className="text-pretty text-cream-400">{pillar.text}</p>
                        </div>
                    ))}
                </section>

                <section className="row flex flex-col items-start gap-5 px-6 py-20 lg:px-12">
                    <Heading title={text.cta.title} text={text.cta.text} />
                    <Button variant="primary" to="/docs">
                        {text.cta.button}
                        <Icon name="arrowRight" className="size-4" />
                    </Button>
                </section>
            </div>
        </div>
    );
}

function Heading({ title, text }: { title: string; text: string }) {
    return (
        <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-balance text-3xl font-bold tracking-display text-cream-50 sm:text-4xl">{title}</h2>
            <p className="text-pretty text-lg leading-relaxed text-cream-400">{text}</p>
        </div>
    );
}
