export interface GridSize {
    width: number;
    height: number;
}

export interface GridCell {
    x: number;
    z: number;
    id: string;
}

export const cellId = (x: number, z: number) => `${x}:${z}`;

export const cellCoords = (id: string): [number, number] => {
    const [x, z] = id.split(":");
    return [Number(x), Number(z)];
};

export const inside = (grid: GridSize, x: number, z: number) => x >= 0 && z >= 0 && x < grid.width && z < grid.height;

export const gridCells = (grid: GridSize): GridCell[] =>
    Array.from({ length: grid.width * grid.height }, (_, index) => {
        const x = index % grid.width;
        const z = Math.floor(index / grid.width);
        return { x, z, id: cellId(x, z) };
    });
