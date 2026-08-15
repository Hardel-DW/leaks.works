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
                Une région, c'est un bout de monde qui vit tout seul. Ses chunks, ses entités, ses joueurs, ses coffres, ses ticks de redstone. Pendant son tour, elle joue exactement le rôle que le
                thread serveur joue en vanilla, et rien d'autre ne touche à son contenu.
            </Lead>

            <P>
                Les régions ne sont pas dessinées à l'avance. Elles se forment autour de ce qui est chargé, et elles bougent en permanence. Un joueur qui marche fait grossir sa région d'un côté et
                maigrir de l'autre. Deux joueurs qui se rejoignent font fusionner deux régions en une. Un joueur qui part en scinde une en deux.
            </P>

            <H2>Essaie</H2>

            <Figure
                title="Le découpage en direct"
                hint="attrape un joueur et déplace le"
                caption="Chaque case est une section de 16 par 16 chunks. Les cases pleines sont les sections où un joueur charge des chunks, les cases hachurées sont la marge tampon que la région possède sans rien y faire. Rapproche deux joueurs pour voir leurs régions fusionner, éloigne les pour voir la scission.">
                <RegionPlayground />
            </Figure>

            <P>
                Le compteur en bas donne le nombre de régions vivantes. C'est aussi le nombre de threads que le serveur peut occuper en même temps sur cette dimension. Trois régions, trois cœurs qui
                travaillent. Une seule région, un seul cœur, exactement comme en vanilla.
            </P>

            <Callout tone="info" title="Plus les joueurs sont éparpillés, plus le serveur va vite">
                C'est la propriété centrale de Leafs, et elle est contre-intuitive. Un serveur survie avec cent joueurs répartis sur une immense carte se parallélise très bien. Cent joueurs entassés
                sur le même spawn forment une seule région et ne gagnent rien.
            </Callout>

            <H2>La marge vide, la pièce maîtresse</H2>

            <P>
                Autour de chaque section active, la région possède une couronne de sections vides. Cette marge ne sert à rien en jeu, elle ne contient aucun chunk chargé. Elle sert à garantir que deux
                régions restent séparées par au moins une section entière, soit 16 chunks.
            </P>

            <Figure title="Pourquoi 16 chunks de séparation suffisent" hint="active la portée">
                <ReachDiagram />
            </Figure>

            <P>
                Une région a le droit de lire et d'écrire jusqu'à <Strong>8 chunks au delà de sa bordure</Strong>. C'est la portée maximale de ce qu'un tick vanilla peut atteindre, un piston, une
                explosion, l'IA d'un mob qui cherche son chemin. Comme deux régions sont toujours à plus de 16 chunks l'une de l'autre, leurs portées ne se recouvrent jamais.
            </P>

            <H2>Naître, fusionner, se scinder, mourir</H2>

            <Bullets>
                <Bullet>
                    <Strong>Naître</Strong>. Un chunk se charge dans une section vide, la section devient active, et si aucune région n'est assez proche, une nouvelle région se crée avec sa marge.
                </Bullet>
                <Bullet>
                    <Strong>Fusionner</Strong>. Deux régions se rapprochent au point que leurs marges se touchent. Elles n'ont plus la garantie de séparation, donc elles n'ont plus le droit de tourner
                    séparément. Elles deviennent une seule région.
                </Bullet>
                <Bullet>
                    <Strong>Se scinder</Strong>. Une région dont les sections actives ne se touchent plus se coupe en morceaux indépendants, un par groupe connecté.
                </Bullet>
                <Bullet>
                    <Strong>Mourir</Strong>. Une région qui n'a plus aucune section active disparaît.
                </Bullet>
            </Bullets>

            <Callout tone="warn" title="Jamais pendant un tick">
                Toutes ces opérations se font entre deux ticks de région, jamais au milieu. Une région en train de tiquer est verrouillée dans son état. Une fusion qui la concerne attend qu'elle ait
                fini son tour.
            </Callout>

            <H2>Ce qu'une région possède</H2>

            <P>
                Ses chunks, ses entités, ses joueurs, ses block entities. Mais aussi les files de paquets de ses joueurs, ses évènements de blocs, son propre générateur aléatoire et sa propre horloge.
                Ces quatre derniers points ont chacun leur chapitre, parce qu'ils sont la vraie difficulté du modèle.
            </P>

            <DeepDive title="le regroupement dans le code">
                <H3>Les trois rayons</H3>
                <p>
                    <Code>region_buffer_distance</Code> est l'épaisseur de la marge, en sections. <Code>region_merge_distance</Code> est la distance sous laquelle deux régions fusionnent. Les deux
                    valent 1 par défaut. Le rayon de recherche des régions voisines est la somme des deux.
                </p>
                <ClassList
                    items={[
                        {
                            name: "region/Regionizer",
                            role: "Le coeur du découpage. Il ajoute et retire des chunks, crée les sections tampons, fusionne, scinde, détruit. Aucune dépendance Minecraft."
                        },
                        { name: "region/Region", role: "Une région et son état, plus les fusions qu'elle doit encore à ses voisines." },
                        { name: "region/RegionState", role: "READY, TICKING, TRANSIENT ou DEAD. C'est cet état qui interdit de toucher à une région pendant son tour." },
                        { name: "region/RegionCallbacks", role: "L'interface par laquelle le reste du mod apprend qu'une région naît, fusionne, se scinde ou meurt." },
                        { name: "ticking/LevelRegions", role: "Le Regionizer d'une dimension, plus son verrou. Le mixin de ServerLevel le crée avant le premier chunk." }
                    ]}
                />
                <p>
                    Une fusion qui tombe sur une région en train de tiquer n'est pas annulée, elle est mise en attente dans <Code>mergeIntoLater</Code>. Dès que la région relâche son tour, les fusions
                    en attente s'exécutent en chaîne. Sans ce mécanisme, deux régions pourraient se devoir mutuellement une fusion que la barrière de ticking bloquerait pour toujours.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
