import TicketRings from "@/components/demo/TicketRings";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, H3, Lead, P, Strong } from "@/components/docs/Prose";
import Steps from "@/components/docs/Steps";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Un chunk ne reste pas chargé par magie. Quelqu'un doit le réclamer. Ce quelqu'un pose un ticket, une petite note qui dit, je veux ce chunk, et à quel point je le veux. Quand le dernier
                ticket disparaît, le chunk s'en va.
            </Lead>

            <H2>Trois paliers, du plus faible au plus fort</H2>

            <P>
                Un ticket porte un niveau. Plus le nombre est <Strong>bas</Strong>, plus le chunk est vivant. Autour d'un joueur, Leafs pose trois anneaux, du plus large au plus serré.
            </P>

            <Bullets>
                <Bullet>
                    <Strong>Niveau 41, chargé</Strong>. Le chunk existe en mémoire, il est lisible, mais il ne tique pas. Il sert de contexte aux chunks voisins.
                </Bullet>
                <Bullet>
                    <Strong>Niveau 33, vue</Strong>. Le chunk est complètement généré et envoyé au client. C'est ce que le joueur voit.
                </Bullet>
                <Bullet>
                    <Strong>Niveau 31, simulation</Strong>. Le chunk tique. Les mobs bougent, les fours cuisent, la redstone tourne.
                </Bullet>
            </Bullets>

            <Figure
                title="Les anneaux autour de deux joueurs"
                hint="déplace les joueurs pour les faire se recouvrir"
                caption="Chaque case est un chunk. Quand les anneaux se recouvrent, les deux joueurs tiennent les mêmes chunks. Un compteur retient combien de joueurs réclament chaque chunk.">
                <TicketRings />
            </Figure>

            <Callout tone="ok" title="Le compteur évite le pire bug de la vue partagée">
                Sans compteur, un joueur qui s'éloigne retirerait le ticket d'un chunk encore tenu par son voisin, et le chunk se déchargerait sous les pieds de l'autre. Leafs compte les porteurs, et
                le ticket ne part qu'avec le dernier.
            </Callout>

            <H2>Le pipeline de chargement</H2>

            <Steps
                items={[
                    { title: "Les anneaux entrent du plus proche au plus lointain", body: "Le joueur reçoit d'abord ce qui est autour de lui, pas un coin aléatoire de sa distance de vue." },
                    { title: "Le chargement passe sous un débit par joueur", body: "Un joueur ne peut pas monopoliser le pool de chunks. Chacun avance à son rythme, borné." },
                    { title: "La génération suit dans la distance de vue", body: "Ce qui n'existe pas encore est fabriqué par le pool de chunks, en parallèle, sans bloquer le tick." },
                    { title: "La simulation s'active dans la distance de simulation", body: "Le dernier palier, le plus serré, celui qui coûte réellement du temps de tick." }
                ]}
            />

            <H2>Le départ, en deux temps</H2>

            <P>
                La phase sérielle décide qu'un chunk part, quand son niveau de ticket remonte. Mais elle ne le démonte pas elle-même. Le démontage, la sauvegarde, le retrait des block entities, part
                sur le thread de la région qui possédait le chunk, avec un budget par tick qui empêche les rafales de tout figer.
            </P>

            <P>
                Un retrait de joueur pose d'abord un ticket retardé qui expire tout seul. Sans ça, un joueur qui longe une frontière déchargerait et rechargerait les mêmes chunks à chaque tick, ce qui
                coûte beaucoup plus cher que de les garder un instant de plus.
            </P>

            <DeepDive title="les tickets dans le code">
                <H3>Le chargeur par joueur</H3>
                <p>
                    Leafs remplace la moitié par joueur de vanilla. Le guichet vanilla qui n'admettait que quelques chunks de vue en vol pour le serveur entier a disparu avec le tracker de tickets par
                    joueur de vanilla, remplacés par un pipeline par joueur.
                </p>
                <ClassList
                    items={[
                        { name: "chunk/loader/PlayerChunkLoader", role: "Le pipeline de vue d'un joueur. Il avance à chaque tick de la région qui le possède." },
                        { name: "chunk/loader/PlayerViewState", role: "L'état du pipeline, les anneaux atteints et ce qui reste à demander." },
                        { name: "chunk/loader/StageTickets", role: "Les tickets des trois paliers, refcomptés entre joueurs, avec le ticket retardé au retrait." },
                        { name: "chunk/propagator/LevelTicketPropagator", role: "La propagation des niveaux, par sections de 64 chunks, drainable depuis n'importe quel thread." },
                        { name: "chunk/propagator/AreaLock", role: "Le verrou de zone. Deux sections éloignées se drainent en parallèle." },
                        { name: "chunk/PendingUnloadClaims", role: "La revendication d'un déchargement, atomique, pour qu'un drain concurrent ne perde pas un chunk qu'il vient de sauver." }
                    ]}
                />
                <p>
                    Les effets qui touchent l'état vivant du jeu ne s'exécutent jamais sur le thread qui draine. Le pas FULL qui construit le <Code>LevelChunk</Code> et l'enregistre dans le monde part
                    sur la région qui possède la position.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
