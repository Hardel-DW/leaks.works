import type { ReactNode } from "react";
import GridBackground from "@/components/ui/background/GridBackground";
import Icon from "@/components/ui/Icon";
import { mix } from "@/lib/sim/palette";

type Tone = "info" | "warn" | "ok";

const TONES: Record<Tone, { icon: string; accent: string }> = {
    info: { icon: "/icons/lightbulb.svg", accent: "#38bdf8" },
    warn: { icon: "/icons/warning.svg", accent: "#e0776e" },
    ok: { icon: "/icons/check.svg", accent: "#79c894" }
};

export default function Callout({ tone = "info", title, children }: { tone?: Tone; title: string; children: ReactNode }) {
    const style = TONES[tone];

    return (
        <div className="relative isolate overflow-hidden rounded-xl border bg-zinc-925" style={{ borderColor: mix(style.accent, 0.3) }}>
            <GridBackground animate={false} accent={style.accent} lineColor={mix(style.accent, 0.12)} opacity={0.55} />
            <div className="relative flex gap-3 px-4 py-3.5">
                <span className="mt-0.5 flex" style={{ color: style.accent }}>
                    <Icon src={style.icon} className="size-4" />
                </span>
                <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-zinc-100">{title}</span>
                    <div className="text-[13px] leading-relaxed text-zinc-400">{children}</div>
                </div>
            </div>
        </div>
    );
}
