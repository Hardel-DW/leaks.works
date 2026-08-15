import { cn } from "@/lib/utils";

/** Low-contrast light texture shared by the opaque enchantment islands. */
export default function ShineBackground({ double = false, className }: { double?: boolean; className?: string }) {
    return (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 opacity-[0.12]", className)}>
            <img src="/images/shine.avif" alt="" loading="lazy" className="h-1/2 w-full object-cover" />
            {double && <img src="/images/shine.avif" alt="" loading="lazy" className="absolute inset-x-0 bottom-0 h-1/2 w-full rotate-180 object-cover" />}
        </div>
    );
}
