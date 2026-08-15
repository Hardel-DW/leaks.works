import TickPhases from "@/components/demo/TickPhases";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Vingt fois par seconde, chaque région rejoue le même programme. Ce programme est la copie exacte du tick de vanilla, dans le même ordre, avec une seule différence. Chaque phase ne
                travaille que sur les chunks que la région possède.
            </Lead>

            <P>
                L'ordre compte énormément. Beaucoup de comportements du jeu dépendent du fait qu'une phase passe avant une autre. Si les entités tiquaient avant les ticks programmés, la redstone se
                comporterait différemment. Leafs ne réordonne rien.
            </P>

            <Figure title="Les treize phases d'un tick de région" hint="clique sur une phase" caption="Le point vert suit l'exécution. Cliquer sur une ligne montre ce que la phase fait vraiment.">
                <TickPhases />
            </Figure>

            <H2>Ce qui reste au tick sériel</H2>

            <P>
                Tout ce qui n'est ancré à aucun chunk. La bordure du monde n'appartient à personne, la météo couvre la dimension entière, le temps est unique. Ces choses tournent une fois par tick de
                dimension, sous le verrou exclusif, pendant qu'aucune région ne tique.
            </P>

            <P>
                La phase sérielle sert aussi de <Strong>filet</Strong>. Les diffs de vue, le chargement et l'envoi des chunks appartiennent normalement aux régions. Mais un joueur qu'aucune région ne
                tique, par exemple un joueur dans le générique de fin, retomberait dans un trou. La phase sérielle fait le travail pour lui.
            </P>

            <Callout tone="info" title="En solo, rien ne change">
                Sur un serveur intégré en pause, le serveur draine les paquets et ne tique rien d'autre, exactement comme en vanilla. Leafs ne rajoute pas de travail à un monde qui n'en demande pas.
            </Callout>

            <DeepDive title="le corps du tick dans le code">
                <p>
                    Le corps vit dans <Code>world/RegionTickBody</Code>. C'est une méthode longue, volontairement, parce qu'elle est la traduction d'une méthode longue de vanilla. La casser en
                    morceaux ferait perdre la correspondance ligne à ligne avec le tick d'origine, qui est ce qui permet de vérifier qu'on n'a rien oublié.
                </p>
                <ClassList
                    items={[
                        { name: "world/RegionTickBody", role: "Les treize phases, dans l'ordre vanilla, restreintes aux chunks de la région." },
                        { name: "world/RegionWorldData", role: "L'état de monde propre à une région. Ticks programmés, évènements de blocs, horloge, aléatoire." },
                        { name: "world/RegionScheduledTicks", role: "Les ticks programmés de la région, comptés sur son horloge à elle." },
                        { name: "world/RoutingNeighborUpdater", role: "Les mises à jour de voisinage. Elles partent vers la région propriétaire du bloc touché." },
                        { name: "world/RegionBlockEntityTickers", role: "Les block entities de la région. Un four s'enregistre chez le propriétaire de son chunk." },
                        { name: "ticking/LevelTickUnit", role: "La phase sérielle. Bordure, météo, sommeil, temps, raids, dragon, tickets, déchargements." }
                    ]}
                />
            </DeepDive>
        </ChapterPage>
    );
}
