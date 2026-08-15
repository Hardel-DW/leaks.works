import type { PropsWithChildren } from "react";
import DocsSidebar from "@/components/layout/DocsSidebar";
import MobileNav from "@/components/layout/MobileNav";
import GridBackground from "@/components/ui/background/GridBackground";

export default function DocsShell({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-dvh bg-zinc-925">
            <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
                <GridBackground animate />
            </div>

            <DocsSidebar />

            <div className="relative z-10 flex min-w-0 flex-1 flex-col lg:border-l lg:border-zinc-900">
                <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 z-10 h-64 w-3/4 -translate-x-1/2 rounded-[100%] bg-amber-700/10 blur-[85px]" />
                <MobileNav />
                <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-10 lg:py-16">{children}</main>
            </div>
        </div>
    );
}
