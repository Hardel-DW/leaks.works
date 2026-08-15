import WorldgenPipeline from "@/components/demo/WorldgenPipeline";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, H3, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Générer du terrain est le travail le plus lourd d'un serveur. En vanilla, un seul chunk avance à la fois par dimension. C'est ce qui fait qu'explorer une carte neuve fait chuter les
                TPS pour tout le monde.
            </Lead>

            <H2>Un chunk se construit par couches</H2>

            <P>
                Un chunk n'apparaît pas d'un coup. Il traverse une série d'étapes, chacune ajoutant une couche. Le bruit dessine les reliefs, la surface pose l'herbe et le sable, les grottes creusent,
                les features plantent les arbres et les minerais, la lumière se calcule, les mobs de départ apparaissent, et le chunk devient enfin vivant.
            </P>

            <P>
                Le problème est que certaines de ces étapes <Strong>débordent</Strong>. Un arbre planté au bord d'un chunk pousse des feuilles dans le chunk d'à côté. La lumière traverse les
                frontières. Deux chunks voisins ne peuvent donc pas faire ces étapes en même temps.
            </P>

            <Figure
                title="Plusieurs chunks en vol, avec exclusion spatiale"
                hint="change le nombre de workers"
                caption="Le halo pointillé montre la zone qu'un chunk réserve pendant une étape qui déborde. Les autres workers travaillent ailleurs pendant ce temps.">
                <WorldgenPipeline />
            </Figure>

            <H2>Qui s'exclut, et sur quel rayon</H2>

            <Bullets>
                <Bullet>
                    <Strong>Features</Strong>, rayon de deux chunks, parce que certaines features lisent à cette distance.
                </Bullet>
                <Bullet>
                    <Strong>Lumière</Strong>, même rayon de deux chunks, avec sa complétion attendue sous le verrou.
                </Bullet>
                <Bullet>
                    <Strong>Spawn et initialisation de lumière</Strong>, sur leur propre chunk uniquement.
                </Bullet>
                <Bullet>
                    <Strong>Le pas FULL</Strong>, rayon d'un chunk côté propriétaire, pour qu'une étape de features voisine n'écrive pas dans le chunk pendant qu'il est copié.
                </Bullet>
                <Bullet>Les autres étapes n'écrivent que leur propre chunk et tournent librement. Le protocole de couches de vanilla ordonne déjà leurs lecteurs.</Bullet>
            </Bullets>

            <Callout tone="info" title="La lecture disque aussi">
                Charger un chunk déjà généré veut dire lire un fichier et le décoder, ce qui n'est pas gratuit. Cette lecture tourne sur le même pool que la génération. La pompe du thread serveur
                n'est plus un entonnoir.
            </Callout>

            <H2>Une région ne charge jamais de force</H2>

            <P>
                C'est une règle stricte. Là où vanilla comblerait un trou en chargeant le chunk manquant sur le champ, une région refuse proprement. Le refus dépose un ticket court, réveille le
                propagateur, et le pool s'occupe du chargement. Le réessai du tick suivant trouve le chunk.
            </P>

            <P>
                Ces refus sont absorbés sans casse. L'entité concernée saute son tick, la passe de spawn s'arrête, la recherche de structure renvoie le résultat vanilla non trouvé. Rien ne crashe et
                rien ne bloque.
            </P>

            <DeepDive title="la génération dans le code">
                <H3>Le coeur concurrent</H3>
                <p>
                    Le double buffer vanilla qui séparait une carte de chunks en cours de mise à jour d'une carte visible a disparu. La table est concurrente et se lit sans verrou depuis n'importe
                    quel thread. La coordination passe par deux verrous de surface, toujours pris dans le même ordre, et seules des métadonnées passent dessous.
                </p>
                <ClassList
                    items={[
                        { name: "chunk/core/ConcurrentChunkTable", role: "La table des holders, lue sans verrou par tous les threads." },
                        { name: "chunk/core/ChunkScheduling", role: "Le verrou d'ordonnancement, shardé par zones. Les tâches se construisent dessous et démarrent après." },
                        { name: "chunk/core/ChunkWorkers", role: "Le pool de génération et de lecture disque, dimensionné par chunk_threads." },
                        { name: "chunk/core/ParallelChunkTaskDispatcher", role: "Le dispatcher vanilla sous-classé. Il pompe sa file en flux continu au lieu d'attendre le chunk en vol." },
                        { name: "chunk/core/GenerationExclusion", role: "L'exclusion spatiale, avec un rayon par étape." },
                        { name: "chunk/RegionChunkAccess", role: "L'accès en lecture des régions. Il refuse au lieu de charger en synchrone." },
                        { name: "chunk/DegradedChunkReads", role: "La portée de lecture dégradée, celle qui laisse un spawner refuser au lieu de bloquer." },
                        { name: "ownership/TickGuard", role: "L'absorption des refus. L'entité saute son tick au lieu de crasher." }
                    ]}
                />
                <p>
                    Le mixin de <Code>ThreadedLevelLightEngine</Code> mérite une mention. En vanilla, une tâche de lumière n'atteint le moteur que si la pompe du thread serveur la réveille. Sous Leafs
                    ce thread peut attendre les régions, donc un worker de chunks pourrait attendre indéfiniment en tenant une zone. Le mixin fait que la voie de lumière se pilote elle-même.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
