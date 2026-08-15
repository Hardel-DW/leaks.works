import { cn } from "@/lib/utils";

interface IconProps {
    src: string;
    size?: number;
    className?: string;
}

/** Monochrome SVG icon tinted by `currentColor` via CSS mask - the web equivalent of Compose's `SvgIcon(tint = …)`. */
export default function Icon({ src, size, className }: IconProps) {
    return (
        <span
            aria-hidden="true"
            style={{ maskImage: `url(${src})`, width: size, height: size }}
            className={cn("inline-block shrink-0 bg-current mask-center mask-no-repeat mask-contain", className)}
        />
    );
}
