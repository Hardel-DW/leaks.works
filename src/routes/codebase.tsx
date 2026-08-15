import Callout from "@/components/docs/Callout";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

const FOLDERS = [
    { name: "config/", role: "La configuration du mod. Parsing strict, clefs inconnues refusées." },
    { name: "ownership/", role: "Qui possède quoi. Le contexte de thread courant, les assertions de propriété, le garde de dégradation, le rapport de crash par région." },
    { name: "region/", role: "Le découpage du monde. Sections, régions, fusion, scission. Pur Java, aucune dépendance à Minecraft." },
    { name: "ticking/", role: "L'orchestration. Le scheduler des workers, les unités de tick par niveau, le verrou par niveau, la barrière, le watchdog, les timings." },
    { name: "world/", role: "Le corps du tick de région et les états de monde par région. Ticks programmés, évènements de blocs, horloge, aléatoire, block entities." },
    { name: "entity/", role: "Les entités. Listes de tick par région, index concurrents, téléportations, pipeline inter dimensions, primitives concurrentes maison." },
    { name: "chunk/", role: "Le système de chunks. Table concurrente des holders, ordonnancement shardé, pool de génération, chargeur par joueur, propagateur de niveaux, tickets, tracking." },
    { name: "network/", role: "Le réseau. Files de paquets par joueur, routage, tick réseau par région, filet global." },
    { name: "scheduler/", role: "Les schedulers publics. Par région, global, asynchrone, avec les tickets de rétention de chunks." },
    { name: "global/", role: "La phase globale. Fenêtre barrière, moniteur d'état partagé, command blocks, gamerules du mod, écritures différées, pause des évènements de la Fabric API." },
    { name: "debug/", role: "Les commandes de diagnostic et l'enregistreur de métriques CSV." },
    { name: "mixin/", role: "Les points d'accroche, un sous dossier par module servi, plus compat pour ceux qui ciblent la Fabric API. Aucune logique." }
];

export default function Page() {
    return (
        <ChapterPage>
            <Lead>Une règle tient toute l'organisation du dépôt. Un dossier égale une responsabilité. Si tu ne peux pas dire en une phrase ce qu'un dossier fait, c'est qu'il en fait deux.</Lead>

            <P>
                Le code vit dans <Code>src/main/java/fr/hardel/leafs/</Code>. Les tests vivent dans <Code>src/test/java</Code>, en miroir des modules.
            </P>

            <H2>Les douze dossiers</H2>

            <Figure title="src/main/java/fr/hardel/leafs">
                <div className="flex flex-col divide-y divide-zinc-800">
                    {FOLDERS.map((folder) => (
                        <div key={folder.name} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
                            <code className="shrink-0 font-mono text-[12.5px] text-zinc-200 sm:w-32">{folder.name}</code>
                            <span className="min-w-0 text-[12.5px] leading-relaxed text-zinc-500">{folder.role}</span>
                        </div>
                    ))}
                </div>
            </Figure>

            <H2>Les règles de dépendance</H2>

            <Bullets>
                <Bullet>
                    <Code>ownership/</Code> et <Code>config/</Code> sont importables par tout le monde.
                </Bullet>
                <Bullet>
                    <Code>region/</Code> ne dépend de rien d'autre. C'est ce qui le rend testable sans lancer Minecraft.
                </Bullet>
                <Bullet>
                    <Code>entity/</Code> n'importe jamais <Code>ticking/</Code>. Les surfaces passent par des interfaces construites au câblage.
                </Bullet>
                <Bullet>
                    Rien ne dépend de <Code>mixin/</Code> ni de <Code>debug/</Code>. Les flèches vont toujours vers le noyau, jamais vers les accroches.
                </Bullet>
            </Bullets>

            <Callout tone="info" title="Trois niveaux de test">
                Les tests unitaires tournent avec le vrai Minecraft bootstrappé quand il le faut. La validation en jeu suit une checklist courte, connexion, casser et poser, coffres, four, chat,
                commande, mort et respawn, portail aller retour. La charge se teste avec des bots en montée progressive et le CSV de métriques par région. Un chantier n'est terminé que vert aux trois
                niveaux.
            </Callout>

            <H2>La méthode de correction</H2>

            <P>
                Le cycle est toujours le même. On détecte, on reproduit dans un seul test unitaire qui doit être rouge, on corrige, le test passe au vert, on valide en jeu. Un fix sans reproduction
                d'abord est un fix qu'on ne comprend pas.
            </P>

            <P>
                Le test qui a reproduit un crash garde dans sa javadoc la date et le scénario, une ou deux phrases. C'est la mémoire des bugs du projet, et c'est ce qui évite de réintroduire deux ans
                plus tard un problème que <Strong>quelqu'un avait déjà résolu</Strong>.
            </P>
        </ChapterPage>
    );
}
