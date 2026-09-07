import Button from "@/components/ui/Button";
import Leaf from "@/components/ui/Leaf";
import { useText } from "@/lib/i18n";

export default function NotFound() {
    const text = useText();
    return (
        <div className="frame flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 py-24 text-center">
            <Leaf className="size-12 text-cream-700" />
            <h1 className="text-3xl font-bold tracking-display text-cream-50">{text.notFound.title}</h1>
            <p className="max-w-md text-cream-500">{text.notFound.text}</p>
            <Button to="/">{text.notFound.back}</Button>
        </div>
    );
}
