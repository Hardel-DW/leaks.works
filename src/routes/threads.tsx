import LevelLockTimeline from "@/components/demo/LevelLockTimeline";
import WorkerPool from "@/components/demo/WorkerPool";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, H3, Lead, P, Strong } from "@/components/docs/Prose";
import Steps from "@/components/docs/Steps";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Leafs ne remplace pas le thread serveur, il l'entoure. Quatre familles de threads coexistent, chacune avec un domaine bien délimité. Aucune ne marche sur les plates-bandes d'une autre.
            </Lead>

            <Steps
                items={[
                    {
                        title: "Le thread global",
                        body: "C'est le thread serveur de vanilla, conservé tel quel. Une fois par tick, il fait ce qui est global par nature. Les horloges du monde, la météo, les fonctions de datapacks, la liste des joueurs, l'autosave, le transport réseau."
                    },
                    {
                        title: "Les workers de régions",
                        body: "Des threads dont le seul travail est d'exécuter des ticks de régions. Leur nombre est fixe, réglé par max_threads. Par défaut, tous les cœurs de la machine."
                    },
                    {
                        title: "Les workers de chunks",
                        body: "Un pool séparé, réglé par chunk_threads, qui exécute la génération de terrain et les lectures disque. Plusieurs chunks avancent en même temps dans une même dimension."
                    },
                    {
                        title: "Les pools que vanilla garde",
                        body: "La lumière garde sa voie mono thread, le bruit de terrain et les entrées sorties gardent leurs pools d'origine. Leafs ne les touche pas."
                    }
                ]}
            />

            <H2>Une région est une tâche, pas un thread</H2>

            <P>
                C'est la distinction qui fait tout tenir. Si chaque région avait son thread, mille régions voudraient dire mille threads, et la machine s'écroulerait. Ici, les régions sont des tâches
                dans une file commune. Un worker libre prend la prochaine région dont le tick est dû, la fait avancer, la relâche, et recommence.
            </P>

            <Figure
                title="La file et les workers"
                hint="change le nombre de workers et de régions"
                caption="La charge s'équilibre toute seule. Une région calme finit vite et libère son worker, une région lourde le garde plus longtemps sans bloquer les autres.">
                <WorkerPool />
            </Figure>

            <H2>Le verrou par dimension</H2>

            <P>Chaque dimension a un verrou en lecture écriture. C'est le seul verrou du modèle qui concerne le tick lui-même. Il sépare deux choses qui ne doivent jamais tourner en même temps.</P>

            <P>
                Quand une région tique, elle prend le verrou <Strong>en lecture</Strong>. Toutes les régions de la dimension le partagent, donc elles avancent ensemble. Quand la partie encore sérielle
                du tick de la dimension tourne, la météo par exemple, elle prend le verrou <Strong>en écriture</Strong>, qui est exclusif. À ce moment, aucune région ne tique.
            </P>

            <Figure title="Un tick de dimension, du début à la fin" caption="Les régions avancent en parallèle, puis la phase sérielle prend la main seule. Les deux ne se croisent jamais.">
                <LevelLockTimeline />
            </Figure>

            <Callout tone="ok" title="Un worker n'attend jamais">
                Si une région n'arrive pas à prendre le verrou en lecture, elle ne bloque pas. Elle saute son tour et réessaie au tick suivant. Un worker qui attend est un worker perdu, donc Leafs
                préfère un tick manqué à un thread gelé.
            </Callout>

            <H2>Le système de chunks est à part</H2>

            <P>
                Le chargement et la génération des chunks ne passent plus par ce verrou. Leur coordination est découpée par zones, sous ses propres verrous de surface, et elle avance pendant que les
                régions tiquent. C'est ce qui permet de générer du terrain sans figer le jeu, et le chapitre sur la génération parallèle entre dans le détail.
            </P>

            <DeepDive title="l'orchestration dans le code">
                <H3>Les classes</H3>
                <ClassList
                    items={[
                        { name: "ticking/TickingManager", role: "Le chef d'orchestre. Il porte les unités de tick de chaque niveau et les pools de workers." },
                        { name: "ticking/RegionTickScheduler", role: "La file des régions dont le tick est dû, et les workers qui la consomment." },
                        { name: "ticking/LevelOwnership", role: "Le verrou en lecture écriture d'une dimension. Lecture pour les régions, écriture pour la phase sérielle." },
                        { name: "ticking/LevelTickUnit", role: "La phase sérielle d'un niveau, ce qui reste global à la dimension." },
                        { name: "ownership/Ownership", role: "Les assertions de propriété. En dev, un thread qui touche ce qui ne lui revient pas fait crasher le serveur." },
                        { name: "ownership/RegionContext", role: "Le contexte du thread courant. Il répond à la question, quelle région suis-je en train de tiquer." }
                    ]}
                />
                <H3>La vérification en dev</H3>
                <p>
                    Les runs de dev lancent Java avec <Code>-ea</Code>, qui active les assertions. Si un thread modifie une donnée qui ne lui revient pas, le serveur crash immédiatement. Un crash
                    franc en dev vaut mieux qu'une sauvegarde corrompue en silence. En production les vérifications sont désactivées et ne coûtent rien.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
