export const PERIOD = 50;
export const WINDOW = 3000;
export const SCALE_MAX = 70;

export type Tick = { start: number; duration: number };
export type LaneKind = "server" | "dimension" | "region";
export type Lane = { id: string; kind: LaneKind; label: string; base: number; spread: number; spike: number; nextStart: number; ticks: Tick[] };

const lane = (id: string, kind: LaneKind, label: string, base: number, spread: number, spike = 0): Lane => ({ id, kind, label, base, spread, spike, nextStart: 0, ticks: [] });

export const initialLanes = (): Lane[] => [
    lane("server", "server", "server", 0.6, 0.3),
    lane("dimension", "dimension", "dimension", 0.5, 0.2),
    lane("r1", "region", "R#1", 9, 5),
    lane("r2", "region", "R#2", 27, 9),
    lane("r3", "region", "R#3", 41, 14, 0.18),
    lane("r4", "region", "R#4", 17, 7)
];

const sample = (current: Lane) => {
    const spike = Math.random() < current.spike ? 18 + Math.random() * 14 : 0;
    return Math.max(0.2, current.base + (Math.random() - 0.5) * 2 * current.spread + spike);
};

export function advance(current: Lane, now: number): Lane {
    const ticks = current.ticks.filter((tick) => tick.start + tick.duration > now - WINDOW);
    let nextStart = current.nextStart;
    while (nextStart <= now) {
        const duration = sample(current);
        ticks.push({ start: nextStart, duration });
        nextStart = Math.max(nextStart + PERIOD, nextStart + duration);
    }
    return { ...current, ticks, nextStart };
}

export function tps(current: Lane, now: number): number {
    const recent = current.ticks.filter((tick) => tick.start > now - 1000).length;
    return Math.min(20, recent);
}
