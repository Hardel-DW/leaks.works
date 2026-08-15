import { cn } from "@/lib/utils";

type ModeTabsProps<T extends string> = {
    tabs: { id: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
};

export default function Tabs<T extends string>({ tabs, value, onChange }: ModeTabsProps<T>) {
    return (
        <div className="flex shrink-0 items-stretch">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "relative flex w-33 cursor-pointer items-center justify-center py-2.5 text-[11px] font-medium transition-colors duration-150 ease-standard",
                        value === tab.id ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                    )}>
                    {tab.label}
                    {value === tab.id && <span className="absolute inset-x-6 -top-px h-px bg-white/55" />}
                </button>
            ))}
        </div>
    );
}
