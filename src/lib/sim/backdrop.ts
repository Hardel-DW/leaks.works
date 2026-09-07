export const CHUNK = 24;
export const SECTION = 2;
export const SECTION_PX = CHUNK * SECTION;

const SPEED = { min: 0.2, max: 0.7 };
const RADIUS = { min: 2, max: 3.2 };
const EDGE_KEEP = 0.5;

export type Region = { x: number; y: number; vx: number; vy: number; radius: number; seed: number };
export type Cell = { sx: number; sy: number };
export type Shape = { active: Map<string, Cell>; crown: Map<string, Cell> };

const key = (sx: number, sy: number) => `${sx},${sy}`;
const hash = (seed: number, sx: number, sy: number) => {
    const value = Math.sin(seed + sx * 127.1 + sy * 311.7) * 43758.5453;
    return value - Math.floor(value);
};

function velocity(): { vx: number; vy: number } {
    const angle = Math.random() * Math.PI * 2;
    const speed = SPEED.min + Math.random() * (SPEED.max - SPEED.min);
    return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

const spawn = (x: number, y: number): Region => ({ x, y, ...velocity(), radius: RADIUS.min + Math.random() * (RADIUS.max - RADIUS.min), seed: Math.random() * 1000 });

export const seeds = (width: number, height: number): Region[] => [0.15, 0.5, 0.85].flatMap((column) => [0.22, 0.78].map((row) => spawn(width * column, height * row)));

function bounce(region: Region, width: number, height: number): Region {
    const inside = region.x > region.radius && region.x < width - region.radius && region.y > region.radius && region.y < height - region.radius;
    if (inside) return region;
    const x = Math.min(width - region.radius, Math.max(region.radius, region.x));
    const y = Math.min(height - region.radius, Math.max(region.radius, region.y));
    const turned = velocity();
    const vx = x !== region.x ? -Math.sign(region.vx) * Math.abs(turned.vx) : turned.vx;
    const vy = y !== region.y ? -Math.sign(region.vy) * Math.abs(turned.vy) : turned.vy;
    return { ...region, x, y, vx, vy };
}

export const step = (region: Region, dt: number, width: number, height: number): Region => bounce({ ...region, x: region.x + region.vx * dt, y: region.y + region.vy * dt }, width, height);

function isActive(region: Region, sx: number, sy: number): boolean {
    const distance = Math.hypot(sx + 0.5 - region.x, sy + 0.5 - region.y);
    if (distance > region.radius) return false;
    return distance < region.radius - 1 || hash(region.seed, sx, sy) > EDGE_KEEP;
}

export function shape(region: Region): Shape {
    const active = new Map<string, Cell>();
    const reach = Math.ceil(region.radius);
    for (let sx = Math.floor(region.x) - reach; sx <= Math.floor(region.x) + reach; sx++) {
        for (let sy = Math.floor(region.y) - reach; sy <= Math.floor(region.y) + reach; sy++) if (isActive(region, sx, sy)) active.set(key(sx, sy), { sx, sy });
    }
    return { active, crown: crownOf(active) };
}

function crownOf(active: Map<string, Cell>): Map<string, Cell> {
    const crown = new Map<string, Cell>();
    for (const { sx, sy } of active.values()) {
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (!active.has(key(sx + dx, sy + dy))) crown.set(key(sx + dx, sy + dy), { sx: sx + dx, sy: sy + dy });
    }
    return crown;
}
