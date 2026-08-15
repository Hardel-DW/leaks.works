import WorldZoom from "@/components/demo/WorldZoom";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import Steps from "@/components/docs/Steps";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Avant de parler de threads, il faut parler de géométrie. Tout le modèle de Leafs repose sur une grille, et cette grille est ce qui rend le parallélisme sûr sans le moindre verrou sur
                les blocs.
            </Lead>

            <H2>Quatre échelles, emboîtées</H2>

            <Figure title="Zoom arrière, échelle par échelle" hint="clique sur les niveaux">
                <WorldZoom />
            </Figure>

            <Steps
                items={[
                    { title: "Le bloc", body: "L'unité que tu poses et que tu casses. Le jeu n'en manipule presque jamais un seul isolément." },
                    {
                        title: "Le chunk",
                        body: "16 par 16 blocs, sur toute la hauteur du monde. C'est ce qui se charge, se génère, se sauvegarde et s'envoie au client. Quand on parle de distance de vue en chunks, c'est de ça qu'il s'agit."
                    },
                    {
                        title: "La section",
                        body: "16 par 16 chunks, soit 256 chunks. Cette maille est propre à Leafs, elle n'existe pas en vanilla. Le mod ne raisonne jamais chunk par chunk pour découper le monde, il raisonne section par section."
                    },
                    {
                        title: "La région",
                        body: "Un groupe de sections voisines où il se passe quelque chose, plus une marge de sections vides autour. C'est l'unité que le serveur tique sur un thread."
                    }
                ]}
            />

            <H2>Pourquoi la section et pas le chunk</H2>

            <P>
                Un chunk est trop petit pour servir d'unité de découpage. Le tick d'un chunk déborde en permanence sur ses voisins. Un piston pousse un bloc de l'autre côté de la frontière, une
                explosion souffle en cercle, un mob calcule un chemin sur plusieurs chunks. Si chaque chunk était une unité indépendante, tout se marcherait dessus.
            </P>

            <P>
                La section est calibrée pour absorber ça. <Strong>16 chunks de côté</Strong>, alors que le débordement maximum d'un tick vanilla est de 8 chunks. Tant que deux zones actives sont
                séparées par une section vide, leurs débordements ne peuvent pas se croiser. C'est une propriété de la géométrie, pas une promesse du code.
            </P>

            <Callout tone="ok" title="La sûreté vient de la distance">
                Aucun verrou ne protège les blocs. Deux régions ne peuvent pas toucher le même chunk parce qu'elles sont physiquement trop loin l'une de l'autre pour ça. C'est la seule garantie, et
                elle tient toute seule.
            </Callout>

            <DeepDive title="la grille dans le dépôt">
                <p>
                    La taille de section est le réglage <Code>section_size</Code> de <Code>config/leafs.json</Code>. Elle doit être une puissance de deux, et vaut 16 par défaut. Le code ne divise
                    jamais, il décale les bits, d'où la contrainte.
                </p>
                <ClassList
                    items={[
                        { name: "region/RegionSection", role: "Une case de la grille. Elle connaît les chunks chargés qu'elle contient et la région qui la possède." },
                        { name: "region/CoordinateKey", role: "Empaquette une coordonnée de section en un seul long, pour servir de clef de map sans allouer." },
                        { name: "region/Regionizer", role: "Le regroupement des sections en régions. Pur Java, aucune dépendance à Minecraft, donc testable seul." }
                    ]}
                />
            </DeepDive>
        </ChapterPage>
    );
}
