export default function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex size-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center">
                    <img src={icon} className="size-10 invert opacity-20" alt="" />
                </div>
                <h3 className="text-xl font-medium text-zinc-300">{title}</h3>
                <p className="text-zinc-500 text-sm max-w-sm text-center">{description}</p>
            </div>
        </div>
    );
}
