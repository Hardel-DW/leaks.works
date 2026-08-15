import MixinExplorer from "@/components/demo/MixinExplorer";
import Callout from "@/components/docs/Callout";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Leafs ne modifie pas le jar de Minecraft. Il utilise les mixins, la mécanique de Fabric qui réécrit des morceaux de méthodes au chargement du jeu. C'est ce qui permet de livrer tout ça
                comme un simple mod.
            </Lead>

            <H2>Une injection, pas une réécriture</H2>

            <P>
                Il y a deux façons d'accrocher du code dans une méthode de Minecraft. On peut la remplacer entièrement, ou on peut s'injecter à un endroit précis en laissant le reste intact. Leafs
                choisit toujours la deuxième.
            </P>

            <P>
                La raison est la compatibilité. Si deux mods remplacent la même méthode, l'un des deux perd, et le joueur récupère un crash ou un comportement fantôme. Une injection ciblée, elle, se
                compose avec les injections des autres mods sur la même méthode. Un <Code>@Overwrite</Code> détruit le corps que les autres visent.
            </P>

            <Callout tone="ok" title="Un mixin est un point d'accroche, jamais un lieu de logique">
                Le corps d'un mixin tient en un appel vers le module qui possède la logique. Les verrous, les atomiques et les pools vivent dans les classes du mod. Cette discipline est ce qui garde
                la surface de contact avec vanilla petite, nommée et justifiée.
            </Callout>

            <H2>Chercher un point d'accroche</H2>

            <Figure
                title="Toutes les classes de Minecraft que Leafs touche"
                hint="filtre par module ou cherche un nom"
                caption="Un module est un dossier du mod. Une classe vanilla touchée par plusieurs modules a un mixin par module, chacun avec sa raison propre.">
                <MixinExplorer />
            </Figure>

            <H2>Penser générique</H2>

            <P>
                Une règle de méthode qui se voit dans toute la liste. Quand un problème apparaît sur un système, la correction remonte le plus haut possible dans la pile plutôt que de traiter le cas
                particulier.
            </P>

            <Bullets>
                <Bullet>
                    Un souci sur les points d'intérêt ne se corrige pas sur le raid ou sur le dragon. Il se corrige sur <Strong>le système de points d'intérêt</Strong>, donc les mods qui en ajoutent
                    en profitent.
                </Bullet>
                <Bullet>
                    Un souci de portail ne se corrige pas sur le Nether et l'End. Il se corrige sur <Strong>l'interface Portal</Strong> de vanilla, donc Aether, Twilight Forest et n'importe quel
                    portail moddé en profitent.
                </Bullet>
                <Bullet>
                    Un mod qui suppose un seul thread ne doit jamais corrompre le monde. Au pire, il se dégrade. Il ne fait <Strong>jamais</Strong> crasher une autre région.
                </Bullet>
            </Bullets>

            <H2>Tout est côté serveur</H2>

            <P>
                Le mod n'embarque aucun code client. Un joueur se connecte avec un client vanilla, sans rien installer, et ne voit aucune différence. C'est une contrainte forte, et elle est tenue sur
                l'ensemble du projet.
            </P>
        </ChapterPage>
    );
}
