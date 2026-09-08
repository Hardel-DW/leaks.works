export type Span = { x: number; top: number; bottom: number };
export type Step = { height: number; link: number };
export type Reading = { index: number; fraction: number };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const trail = (spans: Span[]): string => spans.map((span, i) => `${i === 0 ? "M" : "L"}${span.x} ${span.top} L${span.x} ${span.bottom}`).join(" ");

export const steps = (spans: Span[]): Step[] => spans.map((span, i) => {
    const next = spans[i + 1];
    return { height: span.bottom - span.top, link: next ? Math.hypot(next.x - span.x, next.top - span.bottom) : 0 };
});

export const lit = (parts: Step[], reading: Reading): number =>
    parts.slice(0, reading.index + 1).reduce((sum, step, i) => sum + (step.height + step.link) * (i === reading.index ? reading.fraction : 1), 0);

export function reading(tops: number[], end: number, line: number): Reading {
    const index = Math.max(0, tops.filter((top) => top <= line).length - 1);
    const next = tops[index + 1] ?? end;
    return { index, fraction: clamp((line - tops[index]) / (next - tops[index])) };
}
