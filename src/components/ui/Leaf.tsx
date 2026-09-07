import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export default function Leaf({ className, style, strokeWidth = 2.2 }: { className?: string; style?: CSSProperties; strokeWidth?: number }) {
    return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={cn("size-6", className)} style={style} aria-hidden>
            <path d="M25.5 6.5C17 6.7 11.7 9.2 9.3 13.4c-1.8 3.2-1.6 6.9.3 9.8L6.5 26.2" />
            <path d="M25.5 6.5c-.2 8.3-2.4 13.7-6.5 16.2-3.2 2-6.6 1.9-9.4.5" />
            <path d="M9.6 23.2 21.5 10.8" strokeWidth={strokeWidth * 0.72} />
        </svg>
    );
}
