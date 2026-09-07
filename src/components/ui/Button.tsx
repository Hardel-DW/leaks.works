import type React from "react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

const VARIANTS = {
    primary: "glow-border bg-leaf-400 text-bark-950 hover:bg-leaf-300",
    secondary: "border border-line bg-bark-900 text-cream-50 hover:border-bark-600 hover:bg-bark-800",
    ghost: "text-cream-400 hover:bg-bark-800 hover:text-cream-50",
    icon: "size-9 px-0 text-cream-500 hover:bg-bark-800 hover:text-cream-50"
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof VARIANTS;
    href?: string;
    to?: string;
}

export default function Button({ variant = "secondary", className, href, to, children, ...rest }: ButtonProps) {
    const classes = cn(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xs px-4 text-sm font-semibold transition-colors duration-150 ease-soft disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        className
    );
    if (to) {
        return (
            <Link to={to} className={classes}>
                {children}
            </Link>
        );
    }
    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={classes}>
                {children}
            </a>
        );
    }
    return (
        <button type="button" className={classes} {...rest}>
            {children}
        </button>
    );
}
