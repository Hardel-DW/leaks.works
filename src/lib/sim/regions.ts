export const GRID = { width: 52, height: 26 } as const;
export const SECTION = 2;
export const SIMULATION_DISTANCE = 3;
export const VIEW_DISTANCE = 5;
export const MERGE_DISTANCE = 2;
export const CHUNKS_PER_TICK = 3;
export const UNLOAD_DELAY_TICKS = 25;

const OFFSET = 128;
const STRIDE = 1024;

export type Player = { id: number; x: number; z: number };
export type Cell = { x: number; z: number };
export type Loaded = Map<number, number>;
export type Regions = { active: Map<number, number>; crown: Set<number> };
export type Edge = { x1: number; z1: number; x2: number; z2: number };

export const key = (x: number, z: number) => (x + OFFSET) * STRIDE + z + OFFSET;
export const fromKey = (packed: number): Cell => ({ x: Math.floor(packed / STRIDE) - OFFSET, z: (packed % STRIDE) - OFFSET });
export const sectionOf = (value: number) => Math.floor(value / SECTION);

const chebyshev = (a: Cell, b: Cell) => Math.max(Math.abs(a.x - b.x), Math.abs(a.z - b.z));

export const playerChunk = (player: Player): Cell => ({ x: Math.floor(player.x), z: Math.floor(player.z) });

const inWorld = (cell: Cell) => cell.x >= 0 && cell.z >= 0 && cell.x < GRID.width && cell.z < GRID.height;

function distanceToPlayers(players: Player[], cell: Cell): number {
    let best = Number.POSITIVE_INFINITY;
    for (const player of players) best = Math.min(best, chebyshev(playerChunk(player), cell));
    return best;
}

function candidates(player: Player, loaded: Loaded): Cell[] {
    const center = playerChunk(player);
    const found: Cell[] = [];
    for (let x = center.x - VIEW_DISTANCE; x <= center.x + VIEW_DISTANCE; x++) {
        for (let z = center.z - VIEW_DISTANCE; z <= center.z + VIEW_DISTANCE; z++) {
            const cell = { x, z };
            if (inWorld(cell) && !loaded.has(key(x, z))) found.push(cell);
        }
    }
    return found;
}

function pickNearest(player: Player, options: Cell[], count: number): Cell[] {
    const center = playerChunk(player);
    const scored = options.map((cell) => ({ cell, score: chebyshev(center, cell) + Math.random() * 1.6 }));
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, count).map((entry) => entry.cell);
}

export function advanceLoading(loaded: Loaded, players: Player[], tick: number): Loaded {
    const next = new Map(loaded);
    for (const player of players) {
        for (const cell of pickNearest(player, candidates(player, next), CHUNKS_PER_TICK)) next.set(key(cell.x, cell.z), tick);
    }
    for (const [packed, since] of next) {
        const inView = distanceToPlayers(players, fromKey(packed)) <= VIEW_DISTANCE;
        if (inView) next.set(packed, Math.max(since, tick - UNLOAD_DELAY_TICKS + 1));
        else if (tick - since > UNLOAD_DELAY_TICKS) next.delete(packed);
    }
    return next;
}

export function simulatedChunks(loaded: Loaded, players: Player[]): Set<number> {
    const simulated = new Set<number>();
    for (const packed of loaded.keys()) {
        if (distanceToPlayers(players, fromKey(packed)) <= SIMULATION_DISTANCE) simulated.add(packed);
    }
    return simulated;
}

function activeSections(simulated: Set<number>): Set<number> {
    const active = new Set<number>();
    for (const packed of simulated) {
        const chunk = fromKey(packed);
        active.add(key(sectionOf(chunk.x), sectionOf(chunk.z)));
    }
    return active;
}

function neighbours(packed: number, radius: number): number[] {
    const found: number[] = [];
    const { x, z } = fromKey(packed);
    for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
            if (dx !== 0 || dz !== 0) found.push(key(x + dx, z + dz));
        }
    }
    return found;
}

function flood(active: Set<number>, start: number, region: number, assigned: Map<number, number>) {
    const queue = [start];
    assigned.set(start, region);
    for (let index = 0; index < queue.length; index++) {
        for (const near of neighbours(queue[index], MERGE_DISTANCE)) {
            if (active.has(near) && !assigned.has(near)) {
                assigned.set(near, region);
                queue.push(near);
            }
        }
    }
}

const sectionOfPlayer = (player: Player) => {
    const center = playerChunk(player);
    return key(sectionOf(center.x), sectionOf(center.z));
};

const SECTION_REACH = Math.ceil(SIMULATION_DISTANCE / SECTION);

const sectionDistance = (a: number, b: number) => chebyshev(fromKey(a), fromKey(b));

function nearestSection(sections: Iterable<number>, from: number): number | null {
    let best: number | null = null;
    for (const packed of sections) if (best === null || sectionDistance(packed, from) < sectionDistance(best, from)) best = packed;
    return best;
}

function seedOf(sections: Iterable<number>, player: Player): number | null {
    const own = sectionOfPlayer(player);
    const nearest = nearestSection(sections, own);
    return nearest !== null && sectionDistance(nearest, own) <= SECTION_REACH ? nearest : null;
}

function nearestPlayer(players: Player[], section: number): Player {
    let best = players[0];
    for (const player of players) if (sectionDistance(sectionOfPlayer(player), section) < sectionDistance(sectionOfPlayer(best), section)) best = player;
    return best;
}

export function computeRegions(simulated: Set<number>, players: Player[]): Regions {
    const active = activeSections(simulated);
    const assigned = new Map<number, number>();
    for (const player of players) {
        const seed = seedOf(active, player);
        if (seed !== null && !assigned.has(seed)) flood(active, seed, player.id, assigned);
    }
    for (const packed of active) if (!assigned.has(packed)) flood(active, packed, nearestPlayer(players, packed).id, assigned);
    const crown = new Set<number>();
    for (const packed of active) for (const near of neighbours(packed, 1)) if (!active.has(near)) crown.add(near);
    return { active: assigned, crown };
}

export function regionOfPlayer(regions: Regions, player: Player): number {
    const seed = seedOf(regions.active.keys(), player);
    return seed === null ? player.id : (regions.active.get(seed) ?? player.id);
}

export function outline(cells: Set<number>, unit: number): Edge[] {
    const edges: Edge[] = [];
    for (const packed of cells) {
        const { x, z } = fromKey(packed);
        if (!cells.has(key(x, z - 1))) edges.push({ x1: x * unit, z1: z * unit, x2: (x + 1) * unit, z2: z * unit });
        if (!cells.has(key(x, z + 1))) edges.push({ x1: x * unit, z1: (z + 1) * unit, x2: (x + 1) * unit, z2: (z + 1) * unit });
        if (!cells.has(key(x - 1, z))) edges.push({ x1: x * unit, z1: z * unit, x2: x * unit, z2: (z + 1) * unit });
        if (!cells.has(key(x + 1, z))) edges.push({ x1: (x + 1) * unit, z1: z * unit, x2: (x + 1) * unit, z2: (z + 1) * unit });
    }
    return edges;
}

export function spawnPlayer(players: Player[]): Player {
    const id = players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
    let best: Player = { id, x: GRID.width / 2, z: GRID.height / 2 };
    let bestDistance = -1;
    for (let attempt = 0; attempt < 24; attempt++) {
        const candidate: Player = { id, x: 4 + Math.random() * (GRID.width - 8), z: 3 + Math.random() * (GRID.height - 6) };
        const distance = distanceToPlayers(players, playerChunk(candidate));
        if (distance > bestDistance) {
            best = candidate;
            bestDistance = distance;
        }
    }
    return best;
}

export function ownedChunks(regions: Regions): Map<number, number> {
    const owned = new Map<number, number>();
    for (const [section, region] of regions.active) {
        const { x, z } = fromKey(section);
        for (let dx = 0; dx < SECTION; dx++) for (let dz = 0; dz < SECTION; dz++) owned.set(key(x * SECTION + dx, z * SECTION + dz), region);
    }
    return owned;
}
