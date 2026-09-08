import RegionBackdrop from "@/components/home/RegionBackdrop";
import Leaf from "@/components/ui/Leaf";
import { HEADS } from "@/content/heads";
import type { RouteConfig } from "@/lib/router";

export default { head: () => HEADS.home, component: Og } satisfies RouteConfig;

function Og() {
    return (
        <div className="fixed inset-0 z-[100] grid grid-cols-[96px_1fr_96px] grid-rows-[96px_1fr_96px] bg-bark-950">
            <div className="border-b border-line" />
            <div className="row hatched border-x border-line" />
            <div className="border-b border-line" />
            <div className="hatched border-b border-line" />
            <div className="row relative flex items-center justify-center overflow-hidden border-x border-line">
                <RegionBackdrop />
                <div className="hatched relative flex size-80 items-center justify-center rounded-full border border-line bg-bark-950">
                    <Leaf className="size-40 text-leaf-400" />
                </div>
            </div>
            <div className="hatched border-b border-line" />
            <div />
            <div className="hatched border-x border-line" />
            <div />
        </div>
    );
}
