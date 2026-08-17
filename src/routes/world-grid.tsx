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
                Le monde de Minecraft est une grille. Leafs s'appuie sur cette grille pour garantir que deux threads ne touchent jamais le même bloc, sans poser un seul verrou.
            </Lead>

            <H2>Quatre échelles, emboîtées</H2>

            <Figure title="Zoom arrière, échelle par échelle" hint="clique sur les niveaux">
                <WorldZoom />
            </Figure>

            <Steps
                items={[
                    { title: "Le bloc", body: "L'unité que tu poses et que tu casses." },
                    { title: "Le chunk", body: "16×16 blocs, sur toute la hauteur. C'est ce qui se charge, se génère, se sauvegarde et s'envoie au client." },
                    { title: "La section", body: "16×16 chunks. Cette maille est propre à Leafs, elle n'existe pas en vanilla." },
                    { title: "La région", body: "Un groupe de sections actives, plus une marge de sections vides autour. C'est l'unité qu'un thread tique." }
                ]}
            />

            <H2>Pourquoi la section et pas le chunk</H2>

            <P>
                Un chunk est trop petit. Le tick déborde en permanence sur les voisins : un piston pousse un bloc de l'autre côté, une explosion souffle en cercle, un mob cherche son chemin sur
                plusieurs chunks. Le débordement maximum est de <Strong>8 chunks</Strong>. La section en fait 16. Tant que deux régions sont séparées par une section vide, leurs débordements ne se
                croisent jamais.
            </P>

            <Callout tone="ok" title="La sûreté vient de la distance">
                Aucun verrou ne protège les blocs. Deux régions ne peuvent pas toucher le même chunk parce qu'elles sont physiquement trop loin l'une de l'autre pour ça. C'est la seule garantie, et
                elle tient toute seule.
            </Callout>

            <DeepDive title="la grille dans le dépôt">
                <p>
                    La taille de section est le réglage <Code>section_size</Code> de <Code>config/leafs.json</Code>, puissance de deux, 16 par défaut. Le code décale les bits au lieu de diviser.
                </p>
                <ClassList
                    items={[
                        { name: "region/RegionSection", role: "Une case de la grille. Elle connaît ses chunks chargés et sa région." },
                        { name: "region/CoordinateKey", role: "Empaquette une coordonnée de section en un seul long, clef de map sans allocation." },
                        { name: "region/Regionizer", role: "Le regroupement des sections en régions. Pur Java, aucune dépendance Minecraft." }
                    ]}
                />
            </DeepDive>
        </ChapterPage>
    );
}
