import type { Mod, Status } from "@/content/compatibility";
import { useText } from "@/lib/i18n";
import { useLocale } from "@/lib/store/locale";
import { cn } from "@/lib/utils";

function StatusDot({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                "size-2 shrink-0 rounded-full",
                status === "works" && "bg-leaf-400",
                status === "partial" && "bg-honey-400",
                status === "broken" && "bg-ember-400",
                status === "untested" && "bg-bark-600"
            )}
        />
    );
}

function Tooltip({ children }: { children: string }) {
    return (
        <span
            role="tooltip"
            className="island pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-72 px-3 py-2 text-xs leading-relaxed text-cream-200 opacity-0 transition-opacity duration-150 ease-soft group-hover:opacity-100 group-focus-visible:opacity-100">
            {children}
        </span>
    );
}

function StatusCell({ mod }: { mod: Mod }) {
    const text = useText();
    const note = mod.note?.[useLocale()];
    return (
        <span tabIndex={note ? 0 : undefined} className="group relative inline-flex items-center gap-2 rounded-xs focus:outline-none">
            <StatusDot status={mod.status} />
            <span className={cn(note && "underline decoration-cream-700 decoration-dotted underline-offset-4")}>{text.compatibility.statuses[mod.status]}</span>
            {note && <Tooltip>{note}</Tooltip>}
        </span>
    );
}

function Row({ mod }: { mod: Mod }) {
    return (
        <tr className="border-b border-line last:border-0">
            <td className="px-5 py-3 font-medium text-cream-50">{mod.name}</td>
            <td className="w-40 px-5 py-3 text-cream-400">
                <StatusCell mod={mod} />
            </td>
        </tr>
    );
}

export default function ModTable({ mods }: { mods: Mod[] }) {
    const text = useText();
    if (mods.length === 0) return <p className="island px-5 py-10 text-center text-sm text-cream-500">{text.compatibility.empty}</p>;
    return (
        <div className="island">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-line text-left">
                        <th className="label px-5 py-3">{text.compatibility.columns.mod}</th>
                        <th className="label px-5 py-3">{text.compatibility.columns.status}</th>
                    </tr>
                </thead>
                <tbody>
                    {mods.map((mod) => (
                        <Row key={mod.name} mod={mod} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
