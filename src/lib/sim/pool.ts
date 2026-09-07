export const BUDGET = 50;
export const RANGE = 120;
export const MAX_WORKERS = 24;
export const MAX_REGIONS = 128;
export const TONES = 6;

export type Task = { cost: number; tone: number };
export type Placement = Task & { id: number; worker: number; start: number };

export const MAX_COST = 16;

const randomCost = () => 2 + Math.random() * (MAX_COST - 2);

export const randomTasks = (count: number): Task[] => Array.from({ length: count }, () => ({ cost: randomCost(), tone: 1 + Math.floor(Math.random() * TONES) }));

export function schedule(tasks: Task[], workers: number): Placement[] {
    const busy = new Array<number>(workers).fill(0);
    const placements: Placement[] = [];
    for (const [id, task] of tasks.entries()) {
        let worker = 0;
        for (let index = 1; index < workers; index++) if (busy[index] < busy[worker]) worker = index;
        placements.push({ ...task, id, worker, start: busy[worker] });
        busy[worker] += task.cost;
    }
    return placements;
}

export const isLate = (placement: Placement) => placement.start + placement.cost > BUDGET;
