export const REGION_TINTS = ["#38bdf8", "#8b5cf6", "#79c894", "#e0776e", "#d8a13a", "#4fb3b5"] as const;

export const SURFACE = "#0c0c0e";
export const SERIAL_TINT = "#a1a1aa";

export const tintFor = (seed: string) => {
    let hash = 0;
    for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return REGION_TINTS[hash % REGION_TINTS.length];
};

const channels = (hex: string) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));

export function mix(hex: string, amount: number, over: string = SURFACE): string {
    const front = channels(hex);
    const back = channels(over);
    const blended = front.map((value, index) => Math.round(back[index] + (value - back[index]) * amount));
    return `#${blended.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}
