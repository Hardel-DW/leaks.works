import type React from "react";
import { twMerge } from "tailwind-merge";

type ClassValue = ClassValue[] | Record<string, unknown> | string | number | null | boolean | undefined;

function toVal(value: ClassValue): string {
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(toVal).filter(Boolean).join(" ");
    if (typeof value === "object" && value !== null) {
        return Object.keys(value)
            .filter((key) => value[key])
            .join(" ");
    }
    return "";
}

export const slugify = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export const cn = (...args: ClassValue[]) => twMerge(args.map(toVal).filter(Boolean).join(" "));

// A popover menu closes itself once a link inside it is tapped.
export const closeOnLink = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) event.currentTarget.hidePopover();
};
