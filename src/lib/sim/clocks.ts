export const PERIOD = 50;
const WINDOW = 3000;
export const FURNACE_TICKS = 200;
export const DAY_TICKS = 24000;

export type Tick = { start: number; duration: number };
export type LaneKind = "server" | "region";
export type Lane = { id: string; kind: LaneKind; label: string; base: number; spread: number; spike: number; nextStart: number; ticks: Tick[]; count: number };

const lane = (id: string, kind: LaneKind, label: string, base: number, spread: number, spike = 0): Lane => ({ id, kind, label, base, spread, spike, nextStart: 0, ticks: [], count: 0 });

export const initialLanes = (): Lane[] => [
    lane("server", "server", "server", 0.6, 0.3),
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
    let count = current.count;
    while (nextStart <= now) {
        const duration = sample(current);
        ticks.push({ start: nextStart, duration });
        nextStart = Math.max(nextStart + PERIOD, nextStart + duration);
        count++;
    }
    return { ...current, ticks, nextStart, count };
}

export function tps(current: Lane, now: number): number {
    const recent = current.ticks.filter((tick) => tick.start > now - 1000).length;
    return Math.min(20, recent);
}

export function dayTime(ticks: number): string {
    const minutes = Math.floor((((ticks % DAY_TICKS) / DAY_TICKS) * 24 + 6) * 60) % (24 * 60);
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
