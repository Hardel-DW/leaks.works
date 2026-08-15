import { cellCoords, cellId, type GridSize, inside } from "@/lib/sim/grid";
import { tintFor } from "@/lib/sim/palette";

export const SECTION_SIZE = 16;
export const BUFFER_RADIUS = 1;

export interface Player {
    id: string;
    name: string;
    x: number;
    z: number;
}

export interface RegionShape {
    id: string;
    tint: string;
    active: string[];
    buffer: string[];
    players: string[];
}

export function activeSectionsOf(player: Player, viewChunks: number, grid: GridSize): string[] {
    const radius = viewChunks / SECTION_SIZE;
    const sections: string[] = [];
    for (let x = Math.floor(player.x - radius); x <= Math.floor(player.x + radius); x++) {
        for (let z = Math.floor(player.z - radius); z <= Math.floor(player.z + radius); z++) {
            if (inside(grid, x, z)) sections.push(cellId(x, z));
        }
    }
    return sections;
}

function ownedSections(active: Set<string>, grid: GridSize): Set<string> {
    const owned = new Set(active);
    for (const id of active) {
        const [x, z] = cellCoords(id);
        for (let dx = -BUFFER_RADIUS; dx <= BUFFER_RADIUS; dx++) {
            for (let dz = -BUFFER_RADIUS; dz <= BUFFER_RADIUS; dz++) {
                if (inside(grid, x + dx, z + dz)) owned.add(cellId(x + dx, z + dz));
            }
        }
    }
    return owned;
}

function componentFrom(seed: string, remaining: Set<string>): string[] {
    const component = [seed];
    const queue = [seed];
    remaining.delete(seed);
    while (queue.length > 0) {
        const [x, z] = cellCoords(queue.pop() as string);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const neighbour = cellId(x + dx, z + dz);
                if (remaining.delete(neighbour)) {
                    component.push(neighbour);
                    queue.push(neighbour);
                }
            }
        }
    }
    return component;
}

export function computeRegions(players: Player[], viewChunks: number, grid: GridSize): RegionShape[] {
    const activeByPlayer = new Map(players.map((player) => [player.id, activeSectionsOf(player, viewChunks, grid)]));
    const active = new Set([...activeByPlayer.values()].flat());
    const remaining = ownedSections(active, grid);
    const regions: RegionShape[] = [];

    while (remaining.size > 0) {
        const seed = [...remaining].sort()[0];
        const component = componentFrom(seed, remaining).sort();
        const owned = new Set(component);
        const members = players.filter((player) => (activeByPlayer.get(player.id) ?? []).some((section) => owned.has(section))).map((player) => player.id);
        const survivor = members[0] ?? component[0];
        regions.push({
            id: survivor,
            tint: tintFor(survivor),
            active: component.filter((section) => active.has(section)),
            buffer: component.filter((section) => !active.has(section)),
            players: members
        });
    }

    return regions.sort((left, right) => players.findIndex((player) => player.id === left.id) - players.findIndex((player) => player.id === right.id));
}
