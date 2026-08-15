import SerialVsParallel from "@/components/demo/SerialVsParallel";
import Callout from "@/components/docs/Callout";
import DeepDive from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Un serveur Minecraft avance par ticks. Vingt fois par seconde, il passe en revue tout ce qui vit dans le monde et fait avancer d'un cran. Chaque mob, chaque four, chaque piston, chaque
                joueur. Le problème tient en une phrase. Tout ça se passe sur un seul fil d'exécution.
            </Lead>

            <P>
                Un fil d'exécution, ou thread, c'est une file d'attente de travail. Un seul thread veut dire une seule tâche à la fois. Peu importe que ta machine ait seize cœurs, le serveur en occupe
                un et laisse les quinze autres dormir.
            </P>

            <H2>Vingt fois par seconde, pas une de moins</H2>

            <P>
                Un tick doit tenir en 50 millisecondes. Vingt ticks font une seconde, c'est la cadence normale du jeu, le fameux 20 TPS. Tant que le serveur finit son travail dans le budget, personne
                ne voit rien. Dès qu'il déborde, le tick suivant démarre en retard, puis celui d'après, et le jeu ralentit pour tout le monde.
            </P>

            <P>
                Le point important, c'est que ce ralentissement est <Strong>global</Strong>. Une ferme à fer surchargée dans un coin du monde fait laguer un joueur à trente mille blocs de là, qui
                creuse tranquillement dans sa mine. Les deux n'ont rien à voir, mais ils partagent la même file d'attente.
            </P>

            <Figure
                title="Le même travail, sur un thread puis sur plusieurs"
                hint="ajoute des zones actives et compare"
                caption="Chaque bloc coloré est une zone du monde qui demande du travail. En vanilla, les zones s'enchaînent et leurs durées s'additionnent. Avec Leafs, elles se répartissent sur les workers et c'est la plus lente qui donne la durée du tick.">
                <SerialVsParallel />
            </Figure>

            <Callout tone="info" title="Pourquoi personne n'a fait ça avant">
                Parce que c'est dangereux. Si deux threads modifient le même coffre en même temps, tu perds des objets, tu dupliques des items, ou tu corromps la sauvegarde. Le multithreading naïf sur
                Minecraft ne marche pas, et beaucoup s'y sont cassé les dents.
            </Callout>

            <H2>L'idée de Folia</H2>

            <P>
                Folia, un fork de Paper, a trouvé la sortie. Plutôt que de partager le monde entre threads et de mettre des verrous partout, on découpe le monde en morceaux qui ne peuvent
                géométriquement pas se toucher. Chaque morceau tourne seul, sur son thread, sans jamais avoir besoin de demander la permission.
            </P>

            <P>
                Leafs reprend cette idée et la reconstruit pour Minecraft 26.2 et Fabric. Ce n'est pas un portage des patchs de Folia. C'est le même concept, repensé pour une architecture de jeu qui a
                beaucoup changé depuis.
            </P>

            <Bullets>
                <Bullet>
                    Folia est un fork. Tu remplaces ton serveur par le leur. Leafs est un mod, tu le déposes dans <Code>mods/</Code> comme n'importe quel autre.
                </Bullet>
                <Bullet>Folia désactive les command blocks, les fonctions de datapacks et une vingtaine de commandes. Leafs garde tout le contenu vanilla fonctionnel.</Bullet>
                <Bullet>Leafs n'ajoute rien d'autre que le multithreading. Aucune feature de gameplay, aucun changement volontaire de comportement.</Bullet>
            </Bullets>

            <DeepDive title="ce que ça veut dire dans le code">
                <p>
                    Tout passe par des mixins, la mécanique de Fabric qui permet de réécrire des morceaux de méthodes de Minecraft au chargement. Pas de jar patché, pas de launcher spécial. Le mod
                    contient environ soixante points d'accroche, chacun avec une seule raison d'exister.
                </p>
                <p>
                    Quand le comportement vanilla ne peut pas être conservé à l'identique, l'écart est listé dans <Code>docs/Compromis.md</Code> avec sa raison. Ils sont dix aujourd'hui, et le
                    chapitre sur les compromis les détaille un par un.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
