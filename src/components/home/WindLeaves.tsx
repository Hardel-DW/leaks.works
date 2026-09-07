import type { CSSProperties } from "react";
import Leaf from "@/components/ui/Leaf";

const LEAVES = [
    { top: 12, dur: 11, delay: 0.2, amp: 70, size: 22, spin: 5, peak: 0.55 },
    { top: 28, dur: 9, delay: 1.4, amp: 40, size: 14, spin: 3.4, peak: 0.4 },
    { top: 44, dur: 12.5, delay: 0.8, amp: 90, size: 28, spin: 6, peak: 0.6 },
    { top: 62, dur: 10, delay: 2.6, amp: 55, size: 18, spin: 4.2, peak: 0.45 },
    { top: 20, dur: 13, delay: 3.8, amp: 65, size: 12, spin: 3, peak: 0.35 },
    { top: 74, dur: 9.5, delay: 4.6, amp: 45, size: 20, spin: 4.8, peak: 0.5 },
    { top: 36, dur: 11.5, delay: 5.5, amp: 80, size: 16, spin: 3.8, peak: 0.42 }
];

const CRUMBS = [
    { dx: -18, dy: 10, delay: 0.3, amp: 0.7 },
    { dx: -34, dy: -6, delay: 0.7, amp: 1.3 }
];

export default function WindLeaves() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {LEAVES.map((leaf) => (
                <div
                    key={leaf.top}
                    className="animate-drift absolute right-0 will-change-transform"
                    style={{ top: `${leaf.top}%`, "--dur": `${leaf.dur}s`, "--delay": `${leaf.delay}s`, "--amp": `${leaf.amp}px`, "--peak": leaf.peak } as CSSProperties}>
                    <Leaf className="animate-tumble text-leaf-400" strokeWidth={1.8} style={{ width: leaf.size, height: leaf.size, "--spin": `${leaf.spin}s` } as CSSProperties} />
                    {CRUMBS.map((crumb) => (
                        <span
                            key={crumb.dx}
                            className="animate-drift absolute size-0.5 rounded-[1px] bg-leaf-300"
                            style={
                                {
                                    left: crumb.dx,
                                    top: crumb.dy,
                                    "--dur": `${leaf.dur * 1.05}s`,
                                    "--delay": `${leaf.delay + crumb.delay}s`,
                                    "--amp": `${leaf.amp * crumb.amp}px`,
                                    "--peak": leaf.peak * 0.7
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
