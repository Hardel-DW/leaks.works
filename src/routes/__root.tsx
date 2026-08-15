import DocsShell from "@/components/layout/DocsShell";
import { Outlet } from "@/lib/router";

export default function RootComponent() {
    return (
        <DocsShell>
            <Outlet />
        </DocsShell>
    );
}
