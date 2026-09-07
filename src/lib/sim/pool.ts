export const BUDGET = 50;
export const RANGE = 120;
export const MAX_WORKERS = 24;
export const MAX_REGIONS = 40;

export type Placement = { id: number; worker: number; start: number; cost: number };

const hash = (id: number) => ((id * 2654435761) >>> 0) / 4294967296;

export const baseCost = (id: number) => (id % 7 === 6 ? 56 + hash(id) * 10 : 6 + hash(id) * 38);

export const jitter = (base: number) => base * (0.88 + Math.random() * 0.24);

export function schedule(costs: number[], workers: number): Placement[] {
    const busy = new Array<number>(workers).fill(0);
    const placements: Placement[] = [];
    for (const [id, cost] of costs.entries()) {
        let worker = 0;
        for (let index = 1; index < workers; index++) if (busy[index] < busy[worker]) worker = index;
        placements.push({ id, worker, start: busy[worker], cost });
        busy[worker] += cost;
    }
    return placements;
}
