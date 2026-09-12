import Icon from "@/components/ui/Icon";

type SearchInputProps = { value: string; onChange: (value: string) => void; placeholder: string };

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    return (
        <label className="relative block flex-1">
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cream-500" />
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-full border border-line bg-bark-900 pr-4 pl-10 text-sm text-cream-50 transition-colors duration-150 ease-soft placeholder:text-cream-500 focus:border-bark-600 focus:bg-bark-800 focus:outline-none"
            />
        </label>
    );
}
