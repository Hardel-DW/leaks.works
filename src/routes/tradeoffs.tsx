import Callout from "@/components/docs/Callout";
import { Code, H2, Lead, P } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

const TRADEOFFS = [
    {
        title: "Chaque région a son propre générateur aléatoire",
        why: "Inévitable dès qu'on paie plusieurs threads. Deux régions ne peuvent pas partager une suite de tirages sans se sérialiser.",
        effect: "La suite exacte des tirages diffère d'un serveur vanilla. Aucun effet visible en jeu."
    },
    {
        title: "Les plafonds de spawn sont comptés par région",
        why: "Compter par dimension demanderait de synchroniser toutes les régions à chaque passe de spawn. C'est le même choix que Folia.",
        effect: "Une dimension très peuplée répartit ses mobs un peu différemment."
    },
    {
        title: "Aux frontières, Leafs laisse tomber plutôt que de crasher",
        why: "Une mise à jour qui sort de la zone atteignable n'a nulle part où s'exécuter en sécurité.",
        effect: "Une mise à jour redstone hors zone est ignorée, un projectile gèle à la frontière. Ces situations se résolvent seules quand les régions fusionnent."
    },
    {
        title: "Les actions inter régions arrivent avec un tick de retard",
        why: "Elles sont mises en file chez le destinataire, qui les exécute pendant son propre tick.",
        effect: "Au plus 50 millisecondes sur une téléportation hors région, une traversée de portail ou un respawn. Folia paie le même tick. En pratique, invisible."
    },
    {
        title: "Une région ne charge jamais un chunk de force",
        why: "Charger en synchrone depuis un worker bloquerait le thread et pourrait interbloquer avec le pool de chunks.",
        effect: "Le code qui tombe sur un chunk absent saute son passage, un ticket court fait charger le chunk, et le réessai suivant le trouve."
    },
    {
        title: "Un tick de joueur peut compter double lors d'un relais",
        why: "Maintenir une liste d'appartenance coûterait plus cher que l'écart lui-même.",
        effect: "Une fenêtre rare de 50 millisecondes peut faire dériver d'un tick un compteur comme la faim."
    },
    {
        title: "Un livre ou une pancarte en cours d'écriture est abandonné à la déconnexion",
        why: "Le texte et son exécution sont dans la file du joueur, qui disparaît avec lui.",
        effect: "Le texte n'est pas enregistré. Même forme que Folia."
    },
    {
        title: "Les commandes du chat s'exécutent sur la phase globale",
        why: "La phase globale est le seul endroit où une commande peut charger des chunks arbitraires.",
        effect: "La commande ne tourne pas sur le thread du joueur, mais son résultat est identique."
    },
    {
        title: "Le tick d'une entité nouvellement créée finit sur la phase sérielle",
        why: "L'entité n'appartient encore à aucune liste de région au moment de sa création.",
        effect: "Sous forte charge, un item droppé apparaît au tick sériel suivant."
    },
    {
        title: "Un arrêt brutal peut perdre les dernières écritures de fichiers joueurs",
        why: "Les écritures partent sur un thread dédié pour que la pause des régions ne couvre que du travail en mémoire.",
        effect: "Un kill ou une coupure de courant peut perdre ce que vanilla aurait déjà posé sur le disque. Un arrêt normal attend toutes les écritures."
    }
];

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Un projet honnête liste ce qu'il casse. Voici les dix écarts volontaires avec le comportement de vanilla, avec leur raison et leur effet visible. Rien ne dévie en dehors de cette
                liste.
            </Lead>

            <P>
                Un compromis se retire quand un chantier le rend inutile. Il ne s'aggrave jamais en silence. Chaque écart nouveau ou supprimé se reflète dans <Code>docs/Compromis.md</Code> dans le
                même commit que le changement.
            </P>

            <H2>La liste</H2>

            <div className="flex flex-col gap-2.5">
                {TRADEOFFS.map((item, index) => (
                    <div key={item.title} className="flex gap-3.5 rounded-xl border border-zinc-900 bg-zinc-925 px-4 py-3.5">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-[11px] font-bold text-zinc-500">{index + 1}</span>
                        <div className="flex min-w-0 flex-col gap-2">
                            <span className="text-[14px] font-semibold text-zinc-100">{item.title}</span>
                            <div className="flex flex-col gap-1">
                                <span className="text-[12.5px] leading-relaxed text-zinc-500">
                                    <span className="font-semibold text-zinc-400">Pourquoi. </span>
                                    {item.why}
                                </span>
                                <span className="text-[12.5px] leading-relaxed text-zinc-500">
                                    <span className="font-semibold text-zinc-400">Effet. </span>
                                    {item.effect}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Callout tone="ok" title="Ce qui n'est pas dans la liste ne dévie pas">
                Les command blocks fonctionnent, les fonctions de datapacks fonctionnent, toutes les commandes fonctionnent, les portails moddés fonctionnent. La liste des incompatibilités définitives
                déclarées dans le manifest du mod est vide.
            </Callout>
        </ChapterPage>
    );
}
