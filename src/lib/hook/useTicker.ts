import { useEffect, useRef } from "react";

export function useTicker(active: boolean, intervalMs: number, onTick: () => void) {
    const callback = useRef(onTick);
    callback.current = onTick;

    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => callback.current(), intervalMs);
        return () => clearInterval(id);
    }, [active, intervalMs]);
}
