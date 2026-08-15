import { twMerge } from "tailwind-merge";

type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];
type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;

function toVal(mix: ClassValue): string {
    if (typeof mix === "string" || typeof mix === "number") {
        return String(mix);
    }

    if (Array.isArray(mix)) {
        return mix
            .map((item: ClassValue) => toVal(item))
            .filter(Boolean)
            .join(" ");
    }

    if (typeof mix === "object" && mix !== null) {
        return Object.keys(mix)
            .filter((key) => mix[key])
            .join(" ");
    }

    return "";
}

export const clsx = (...args: ClassValue[]) =>
    args
        .map((arg) => toVal(arg))
        .filter(Boolean)
        .join(" ");
export const cn = (...args: ClassValue[]) => twMerge(clsx(args));

export const toArray = <T>(value: T | T[] | undefined): T[] => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

/** Case-insensitive "does any field contain the query" search, empty query matching everything. */
export function matches(query: string, ...fields: string[]): boolean {
    const needle = query.trim().toLowerCase();
    return needle.length === 0 || fields.some((field) => field.toLowerCase().includes(needle));
}
