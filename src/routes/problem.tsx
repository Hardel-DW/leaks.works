import SerialVsParallel from "@/components/demo/SerialVsParallel";
import VanillaTick from "@/components/demo/VanillaTick";
import Callout from "@/components/docs/Callout";
import DeepDive from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Un serveur Minecraft fait tout sur un seul thread. Un thread, c'est un fil d'exécution, une ligne droite qui traite une tâche, puis la suivante, puis la suivante. Jamais deux en même temps.
                Peu importe combien de cœurs a la machine, le serveur n'en utilise qu'un.
            </Lead>

            <H2>Ce qui se passe 20 fois par seconde</H2>

            <P>
                Le serveur répète un cycle appelé <Strong>tick</Strong>. À chaque tick, il passe en revue tout ce qui vit dans le monde.
            </P>

            <Figure title="Un tick vanilla" collapsible caption="Tout ça passe sur un seul thread, dans cet ordre, 20 fois par seconde.">
                <VanillaTick />
            </Figure>

            <P>
                Tout ça doit tenir en <Strong>50 millisecondes</Strong>. 20 ticks font une seconde, c'est la cadence normale du jeu, les fameux 20 TPS.
                Quand le travail d'un tick dépasse 50 ms, le tick suivant démarre en retard. Le jeu ralentit.
            </P>

            <P>
                Et il ralentit <Strong>pour tout le monde</Strong>. Une ferme à fer surchargée à un bout de la carte fait laguer un joueur à 30 000 blocs de là.
                Les deux n'ont rien à voir entre eux, mais ils attendent le même thread.
            </P>

            <Figure
                title="Le meme travail, sur un thread puis sur plusieurs"
                hint="ajoute des zones actives et compare"
                caption="En vanilla les zones s'enchainent sur un seul thread et leurs durées s'additionnent. Avec Leafs elles se répartissent sur les workers. C'est la plus lente qui dicte la durée du tick.">
                <SerialVsParallel />
            </Figure>

            <H2>Pourquoi pas juste ajouter des threads</H2>

            <P>
                Minecraft n'a pas été conçu pour. Si deux threads modifient le même coffre au même instant, tu dupliques des items ou tu corromps la sauvegarde.
                La solution classique c'est le <Strong>verrou</Strong> : avant de toucher un coffre, un thread pose un cadenas dessus. Si un autre thread veut le même coffre, il attend que le cadenas soit retiré.
            </P>

            <P>
                Le problème, c'est que presque tout se touche dans Minecraft. Un piston pousse un bloc dans le chunk d'à côté. Un mob cherche son chemin sur plusieurs chunks. Une explosion souffle en cercle.
                Mettre des verrous sur tout ça, c'est passer plus de temps à attendre des cadenas qu'à faire du travail utile.
            </P>

            <H2>La loi d'Amdahl</H2>

            <P>
                Ce problème a un nom. La <Strong>loi d'Amdahl</Strong> dit que le gain qu'on peut tirer du parallélisme est limité par la part du travail qui reste séquentielle.
            </P>

            <P>
                Un exemple concret. Un tick prend 50 ms. Si 15 ms de ce tick ne peuvent pas se paralléliser, parce qu'elles touchent des données globales comme la météo ou le scoreboard, alors même avec une infinité de cœurs, le tick ne descendra jamais en dessous de 15 ms.
                Les 35 ms restantes se répartissent entre les cœurs. Avec 4 cœurs, elles passent à 9 ms. Le tick total fait 24 ms au lieu de 50. C'est 2× plus rapide, pas 4×.
            </P>

            <Callout tone="info" title="Amdahl est pessimiste, Gustafson corrige le tir">
                Amdahl suppose que le travail total est fixe. Mais un serveur Minecraft n'a pas un travail fixe. Il grossit avec les joueurs. 10 joueurs éparpillés sur la carte créent 10 zones indépendantes.
                La <Strong>loi de Gustafson</Strong> dit que quand le travail grandit avec les ressources, la part séquentielle pèse de moins en moins. Le gain n'est plus plafonné, il monte avec la taille du monde. C'est exactement le scénario que Leafs exploite.
            </Callout>

            <P>
                L'enjeu n'est pas d'ajouter des threads. C'est de <Strong>réduire la part séquentielle au strict minimum</Strong>. Leafs y arrive en rendant presque tout local à une zone du monde. La météo, le scoreboard, les commandes restent séquentiels. Tout le reste se parallélise.
            </P>

            <H2>Découper par la géométrie</H2>

            <P>
                Folia, un fork de Paper, a trouvé une solution. Au lieu de mettre des verrous partout, on découpe le monde en morceaux qui ne peuvent géométriquement pas se toucher.
                Le tick d'un piston atteint au maximum 8 chunks de distance. Si deux morceaux sont séparés par 16 chunks, rien de ce qui se passe dans l'un ne peut atteindre l'autre. Pas de verrou, pas d'attente.
            </P>

            <P>
                Ces morceaux s'appellent des <Strong>régions</Strong>. Chaque région a ses blocs, ses entités, ses joueurs. Elle tourne sur son propre thread, sans coordination avec les autres.
            </P>

            <H2>Folia coupe, Leafs garde</H2>

            <P>
                Folia et Leafs partent du même principe, mais pas du même point de départ.
            </P>

            <Bullets>
                <Bullet>Folia est un fork. Tu remplaces ton serveur par le leur. Leafs est un mod Fabric, tu le poses dans <Code>mods/</Code>.</Bullet>
                <Bullet>Folia désactive les command blocks, les fonctions de datapacks et une vingtaine de commandes. Leafs garde tout le contenu vanilla.</Bullet>
                <Bullet>Leafs n'ajoute que le multithreading. Pas de feature, pas de changement de gameplay.</Bullet>
            </Bullets>

            <H2>Deux types de threads</H2>

            <P>
                Leafs sépare le travail en deux parties. La première est le <Strong>thread global</Strong>. Il fait ce qui concerne le monde entier : l'heure, la météo, les commandes, la sauvegarde.
                Il tourne une fois par tick, toujours dans le même ordre. Son exécution est <Strong>déterministe</Strong> : relance le même tick avec les mêmes données, tu obtiens le même résultat.
            </P>

            <P>
                La deuxième partie, ce sont les <Strong>workers de régions</Strong>. Ils tiquent les régions en parallèle. L'ordre dans lequel les régions passent dépend de qui finit en premier.
                C'est <Strong>indéterministe</Strong> : relance le même tick, les régions ne passent pas dans le même ordre. Mais le résultat de chaque région est le même, parce qu'elles ne se touchent pas.
            </P>

            <Callout tone="ok" title="10 écarts avec vanilla, documentés">
                Quand le comportement vanilla ne peut pas être conservé à l'identique, l'écart est listé avec sa raison. Ils sont 10 aujourd'hui. Le chapitre sur les compromis les détaille.
            </Callout>

            <DeepDive title="comment le mod s'accroche a Minecraft">
                <p>
                    Leafs utilise les mixins de Fabric, une soixantaine de points d'injection dans le code de Minecraft. Chaque mixin est un point d'accroche, pas un lieu de logique.
                    Le corps tient en un appel vers le module du mod qui fait le travail. Pas de jar patché, pas de launcher spécial.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
