import type React from "react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

const variants = {
    variant: {
        default: "bg-zinc-200 text-zinc-800 border-2 border-zinc-500 hover:bg-zinc-300",
        black: "bg-black text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-900",
        ghost_border: "rounded-lg bg-zinc-900 text-zinc-300 outline outline-zinc-700 hover:text-zinc-100 hover:bg-zinc-800",
        link: "bg-transparent hover:text-white text-zinc-400",
        shimmer: "shimmer-white text-zinc-900 font-medium border-t border-l border-zinc-900 hover:opacity-75 transition",
        patreon: "shimmer-orange-700 text-white hover:scale-95 transition place-self-end rounded-xl"
    },
    size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-10 px-8"
    }
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants.variant;
    size?: keyof typeof variants.size;
    href?: string;
    to?: string;
    target?: string;
}

export function Button({ variant = "default", size = "default", className, href, to, target, children, ...rest }: ButtonProps) {
    const baseClassName = cn([
        "rounded-xl inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer truncate text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants.variant[variant],
        variants.size[size],
        className
    ]);

    if (to) {
        return (
            <Link to={to} className={baseClassName}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} target={target} className={baseClassName} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={baseClassName} {...rest}>
            {children}
        </button>
    );
}
