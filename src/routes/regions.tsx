import ReachDiagram from "@/components/demo/ReachDiagram";
import RegionPlayground from "@/components/demo/RegionPlayground";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, H3, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Une région, c'est un bout de monde qui tourne tout seul. Ses chunks, ses entités, ses joueurs, ses coffres, sa redstone. Pendant son tick, rien d'autre n'a le droit d'y toucher.
            </Lead>

            <P>
                Elles ne sont pas dessinées à l'avance. Elles se forment autour de ce qui est chargé et bougent en permanence. Un joueur qui marche fait grossir sa région d'un côté et maigrir de
                l'autre.
            </P>

            <H2>Essaie</H2>

            <Figure
                title="Le découpage en direct"
                hint="attrape un joueur et déplace le"
                caption="Chaque case est une section de 16 par 16 chunks. Les cases pleines sont actives, les cases hachurées sont la marge tampon. Rapproche deux joueurs pour voir la fusion, éloigne les pour voir la scission.">
                <RegionPlayground />
            </Figure>

            <P>Le compteur en bas donne le nombre de régions vivantes, et donc le nombre de cœurs que le serveur peut occuper en même temps.</P>

            <Callout tone="info" title="Plus les joueurs sont éparpillés, plus le serveur va vite">
                C'est la propriété centrale de Leafs, et elle est contre-intuitive. Cent joueurs répartis sur une immense carte se parallélisent très bien. Cent joueurs entassés sur le même spawn
                forment une seule région et ne gagnent rien.
            </Callout>

            <H2>La marge vide</H2>

            <P>
                Autour de chaque section active, la région possède une couronne de sections vides. Cette marge garantit que deux régions restent séparées par au moins 16 chunks.
            </P>

            <Figure title="Pourquoi 16 chunks de séparation suffisent" hint="active la portée">
                <ReachDiagram />
            </Figure>

            <P>
                Un tick vanilla peut lire et écrire jusqu'à <Strong>8 chunks au delà de sa bordure</Strong>. Piston, explosion, pathfinding. Deux régions à plus de 16 chunks l'une de l'autre ne
                peuvent jamais se croiser.
            </P>

            <H2>Cycle de vie</H2>

            <Bullets>
                <Bullet>
                    <Strong>Naître.</Strong> Un chunk se charge dans une section vide, aucune région n'est assez proche, une nouvelle se crée.
                </Bullet>
                <Bullet>
                    <Strong>Fusionner.</Strong> Deux régions se rapprochent au point que leurs marges se touchent. Elles deviennent une seule.
                </Bullet>
                <Bullet>
                    <Strong>Se scinder.</Strong> Les sections actives d'une région ne se touchent plus. Elle se coupe en morceaux indépendants.
                </Bullet>
                <Bullet>
                    <Strong>Mourir.</Strong> Plus aucune section active. La région disparaît.
                </Bullet>
            </Bullets>

            <Callout tone="warn" title="Jamais pendant un tick">
                Toutes ces opérations se font entre deux ticks de région. Une région en train de tiquer est verrouillée. Une fusion qui la concerne attend qu'elle ait fini.
            </Callout>

            <H2>Ce qu'une région possède</H2>

            <P>
                Ses chunks, ses entités, ses joueurs, ses block entities, les files de paquets de ses joueurs, ses évènements de blocs, son générateur aléatoire et sa propre horloge.
            </P>

            <DeepDive title="le regroupement dans le code">
                <H3>Les deux rayons</H3>
                <p>
                    <Code>region_buffer_distance</Code> est l'épaisseur de la marge, en sections. <Code>region_merge_distance</Code> est la distance sous laquelle deux régions fusionnent. Les deux
                    valent 1 par défaut.
                </p>
                <ClassList
                    items={[
                        {
                            name: "region/Regionizer",
                            role: "Le coeur du découpage. Ajout, retrait, fusion, scission. Pur Java, aucune dépendance Minecraft."
                        },
                        { name: "region/Region", role: "Une région et son état, plus les fusions en attente." },
                        { name: "region/RegionState", role: "READY, TICKING, TRANSIENT ou DEAD. Interdit de toucher une région pendant son tour." },
                        { name: "region/RegionCallbacks", role: "L'interface qui notifie le reste du mod quand une région naît, fusionne, se scinde ou meurt." },
                        { name: "ticking/LevelRegions", role: "Le Regionizer d'une dimension, plus son verrou." }
                    ]}
                />
                <p>
                    Une fusion qui tombe sur une région en train de tiquer est reportée dans <Code>mergeIntoLater</Code>. Elle s'exécute dès que la région relâche son tour.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
