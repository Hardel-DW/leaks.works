import BarrierWindow from "@/components/demo/BarrierWindow";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Certaines actions ont besoin du monde entier. Une commande peut téléporter n'importe qui n'importe où, un respawn replace un joueur dans une dimension qu'on ne connaît qu'après coup.
                Pour ces cas, Leafs met tout le monde en pause.
            </Lead>

            <P>
                Ça s'appelle la fenêtre barrière. Le thread global arrête toutes les régions, exécute les actions en attente une par une avec un accès complet au monde, puis relâche tout. Pendant la
                fenêtre, le serveur ressemble exactement à un serveur vanilla, un seul thread avec tous les droits.
            </P>

            <H2>Elle ne s'ouvre que si quelqu'un le demande</H2>

            <P>
                La fenêtre s'ouvre <Strong>au plus une fois par tick global</Strong>. Si aucune action n'attend, elle ne s'ouvre pas du tout et les régions ne s'arrêtent jamais. C'est le point
                important, un serveur qui n'a pas de contenu global ne paie rien pour ce mécanisme.
            </P>

            <Figure
                title="Le coût de la fenêtre, selon ce qui tourne sur ta carte"
                hint="active les deux interrupteurs"
                caption="Sans contenu global, les régions tiquent en continu. Avec un command block en repeat ou une fonction de datapack en boucle, la fenêtre s'ouvre à chaque tick et le serveur repasse par un moment sériel permanent.">
                <BarrierWindow />
            </Figure>

            <H2>Qui passe par la fenêtre</H2>

            <Bullets>
                <Bullet>Les command blocks, fixes ou sur minecart, parce qu'une commande peut toucher n'importe quel état du monde.</Bullet>
                <Bullet>Les commandes tapées dans la console du serveur.</Bullet>
                <Bullet>
                    Les fonctions de datapacks du tag <Code>#minecraft:tick</Code>, et les fonctions programmées de la file de timers.
                </Bullet>
                <Bullet>Le respawn d'un joueur, parce qu'il le replace dans une dimension potentiellement différente.</Bullet>
                <Bullet>La recherche de destination d'un portail, parce qu'elle peut créer des blocs, comme la plateforme d'obsidienne de l'End.</Bullet>
                <Bullet>La déconnexion d'un joueur, dont le retrait touche des structures partout.</Bullet>
            </Bullets>

            <Callout tone="warn" title="Le prix de l'ouverture">
                Ouvrir la fenêtre veut dire attendre que toutes les régions finissent leur tick en cours. La durée du moment sériel dépend donc de la région la plus lente. Un serveur avec une fonction
                de datapack en boucle et une grosse ferme dans un coin cumule les deux coûts.
            </Callout>

            <P>C'est pour ça que Leafs ajoute deux gamerules qui permettent de couper ce contenu quand un serveur n'en a pas besoin en continu. Le chapitre sur les commandes les décrit.</P>

            <H2>Le reste du travail du thread global</H2>

            <P>
                En dehors de la fenêtre, le thread global garde le transport réseau, le flush des files d'envoi, la détection des déconnexions, la liste des joueurs et l'autosave. Il sert aussi de
                filet pour les joueurs qu'aucune région ne tique depuis un quart de seconde.
            </P>

            <DeepDive title="la barrière dans le code">
                <ClassList
                    items={[
                        { name: "global/BarrierWindow", role: "La fenêtre elle-même. Elle collecte les actions en attente, met les régions en pause, exécute, relâche." },
                        { name: "ticking/TickBarrier", role: "La primitive de pause. Elle attend que chaque unité de tick ait atteint un point sûr." },
                        { name: "ticking/PauseBatch", role: "Le partage d'une pause entre plusieurs actions du même tick, par exemple une vague de déconnexions." },
                        { name: "global/WindowPressure", role: "La mesure de ce que la fenêtre coûte, pour que la commande de recommandation puisse le dire." },
                        { name: "global/CommandBlockWindow", role: "Le report des command blocks vers la fenêtre, et leur réarmement à vide quand la gamerule les coupe." },
                        { name: "global/GlobalScheduler", role: "La file de tâches globales, vidée à chaque tick avant l'ouverture de la fenêtre." }
                    ]}
                />
                <p>
                    Un appel à <Code>MinecraftServer.execute</Code> depuis un worker de région aboutit dans la phase globale au lieu de lever une exception comme chez Folia. C'est un choix de
                    compatibilité, un mod qui suppose un thread unique se dégrade au lieu de casser.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
