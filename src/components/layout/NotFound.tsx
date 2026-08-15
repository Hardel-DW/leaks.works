import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-start gap-6 py-16">
            <h1 className="font-minecraft text-4xl text-white">Page introuvable</h1>
            <p className="text-zinc-400">Ce chapitre n'existe pas. Reviens à l'accueil, la table des matières y est complète.</p>
            <Button to="/" variant="ghost_border" size="sm">
                Retour à l'accueil
            </Button>
        </div>
    );
}
