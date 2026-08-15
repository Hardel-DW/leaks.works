import SharedCounter from "@/components/demo/SharedCounter";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                La géométrie règle le cas des blocs et des entités. Elle ne règle pas le cas du scoreboard. Un score n'a pas de position, il n'appartient à aucun chunk, et deux joueurs de deux régions
                différentes peuvent le modifier au même instant.
            </Lead>

            <H2>Ce qui casse quand on ne fait rien</H2>

            <Figure
                title="Deux régions incrémentent le même score"
                hint="active le moniteur"
                caption="Sans protection, deux régions lisent la même valeur au même moment et écrivent le même résultat. Un incrément disparaît, sans erreur, sans log.">
                <SharedCounter />
            </Figure>

            <P>
                Ce bug est le pire de tous parce qu'il est silencieux. Rien ne crashe, rien ne s'affiche dans les logs, le serveur continue comme si de rien n'était. Tu découvres le problème des
                semaines plus tard, quand un joueur signale que ses statistiques sont fausses.
            </P>

            <H2>Trois réponses selon la structure</H2>

            <Bullets>
                <Bullet>
                    <Strong>La structure concurrente</Strong>. Quand la donnée s'y prête, elle est remplacée par une version faite pour plusieurs threads. Les index d'entités et de points d'intérêt
                    sont dans ce cas, y compris un index ordonné de longs fait sur mesure pour le chemin de requête le plus chaud du jeu.
                </Bullet>
                <Bullet>
                    <Strong>Le moniteur partagé</Strong>. Quand la structure est trop entrelacée pour être rendue concurrente, tous ses accès passent par un verrou commun. Le scoreboard, les données
                    sauvegardées, les cartes et les séquences aléatoires sont dans ce cas.
                </Bullet>
                <Bullet>
                    <Strong>Le verrou dédié</Strong>. Un cas unique, le graphe de distance des villages, qui ne peut pas devenir concurrent par une simple façade. Il est sérialisé par son propre petit
                    verrou.
                </Bullet>
            </Bullets>

            <Callout tone="info" title="Un moniteur n'est pas un aveu d'échec">
                Un verrou coûte cher quand on le prend des milliers de fois par tick. Sur une structure qu'on touche quelques fois par seconde, comme le scoreboard, le coût est indétectable. Le bon
                réflexe n'est pas d'éviter les verrous, c'est de les mettre là où ils ne gênent personne.
            </Callout>

            <H2>Les cas particuliers qui valent le détour</H2>

            <P>
                Les <Strong>cartes</Strong> ont chacune leur propre moniteur, pas un moniteur global. Deux joueurs de régions différentes qui portent la même carte sérialisent leurs ticks entre eux,
                mais deux cartes différentes ne se gênent pas.
            </P>

            <P>
                Les <Strong>identifiants de carte</Strong> sont sérialisés à part, pour que deux régions ne produisent jamais le même numéro. C'est le genre de collision qui duplique un objet en jeu.
            </P>

            <P>
                Les <Strong>séquences aléatoires</Strong> passent sous le moniteur et chaque source renvoyée est enveloppée. Les rolls de loot de n'importe quelle région partagent les mêmes sources,
                et le moniteur ordonne les tirages avec la sauvegarde.
            </P>

            <DeepDive title="les structures partagées dans le code">
                <ClassList
                    items={[
                        { name: "global/SharedStateMonitor", role: "Le moniteur commun du scoreboard, des données sauvegardées, des cartes et des séquences aléatoires." },
                        { name: "global/LockedRandomSource", role: "L'enveloppe d'une source aléatoire partagée." },
                        { name: "chunk/PoiVillageLock", role: "Le verrou dédié du graphe de distance des villages." },
                        { name: "entity/ConcurrentLong2ObjectMap", role: "Une map concurrente maison, pour les index par position." },
                        { name: "entity/ConcurrentOrderedLongSet", role: "L'index ordonné de longs, taillé pour le chemin de requête le plus chaud du jeu." },
                        { name: "entity/LevelEntityLists", role: "Les listes de tick d'entités, découpées par région." }
                    ]}
                />
                <p>
                    Les primitives de concurrence vivent dans les classes du mod, jamais dans un corps de mixin. Un mixin est un point d'accroche, pas un lieu de logique, et cette discipline est ce
                    qui garde la surface de contact avec vanilla petite et lisible.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
