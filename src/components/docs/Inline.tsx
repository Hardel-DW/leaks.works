import type { ReactNode } from "react";
import { Link } from "@/lib/router";

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function render(token: string, index: number): ReactNode {
    if (token.startsWith("`")) return <code key={index}>{token.slice(1, -1)}</code>;
    if (token.startsWith("**")) return <strong key={index}>{token.slice(2, -2)}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
    if (!link) return token;
    const [, label, href] = link;
    if (href.startsWith("/")) {
        return (
            <Link key={index} to={href}>
                {label}
            </Link>
        );
    }
    return (
        <a key={index} href={href} target="_blank" rel="noreferrer">
            {label}
        </a>
    );
}

export default function Inline({ text }: { text: string }) {
    return <>{text.split(TOKEN).map((part, index) => (index % 2 === 1 ? render(part, index) : part))}</>;
}
