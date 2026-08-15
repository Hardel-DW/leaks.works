import TeleportRouting from "@/components/demo/TeleportRouting";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Une téléportation, c'est une entité qui quitte le morceau de monde qui la possède. C'est exactement le cas que le modèle interdit, donc il faut le traiter à part. La règle est simple.
                Tout mouvement qui sort du périmètre d'une région est routé au lieu d'être exécuté sur place.
            </Lead>

            <Figure
                title="Cinq trajets, cinq chemins différents"
                hint="choisis un cas"
                caption="Plus la destination est loin du périmètre de la région, plus le trajet passe par des mécanismes lourds.">
                <TeleportRouting />
            </Figure>

            <H2>Pourquoi les portails sont un cas à part</H2>

            <P>
                Chercher la destination d'un portail n'est pas une lecture. C'est une opération qui peut <Strong>créer des blocs</Strong> dans une dimension qu'on ne connaît qu'après l'avoir
                interrogée. La plateforme d'obsidienne de l'End en est l'exemple parfait. Il faut donc le monde entier, donc la fenêtre barrière.
            </P>

            <P>
                Mais la fenêtre ne génère jamais de terrain, sinon elle bloquerait tout le serveur le temps d'une génération. La recherche tourne en lecture dégradée. Un chunk absent fait déposer un
                ticket de demande et la tentative se rejoue à une fenêtre suivante, pendant que le pool génère la destination entre deux fenêtres. Au-delà d'un budget de tentatives, une dernière
                tentative charge en synchrone, en filet.
            </P>

            <Callout tone="ok" title="N'importe quel portail moddé profite du même traitement">
                Le code n'accroche pas le portail du Nether ni celui de l'End en particulier. Il accroche l'interface <Code>Portal</Code> de vanilla. Un portail d'Aether, de Twilight Forest ou de
                n'importe quel mod qui implémente cette interface est routé pareil, sans une ligne de code spécifique.
            </Callout>

            <H2>Le changement de dimension</H2>

            <P>
                Une entité qui change de dimension n'est pas déplacée, elle est recopiée. L'arbre monture et passagers est détaché du côté du départ, recopié entier, puis replacé du côté de l'arrivée
                comme une tâche de la région de destination. Un joueur sur un cheval avec un chat sur les genoux arrive avec son cheval et son chat.
            </P>

            <P>À l'extinction du serveur, tout ce qui est en vol est posé avant la sauvegarde. Aucune entité ne se perd entre deux dimensions.</P>

            <Callout tone="warn" title="Un tick de retard, au maximum">
                Les actions qui traversent les régions ou les dimensions arrivent avec au plus un tick de retard, soit 50 millisecondes. Folia paie le même tick par ses files. En pratique, ce délai
                est invisible.
            </Callout>

            <DeepDive title="les téléportations dans le code">
                <ClassList
                    items={[
                        { name: "entity/EntityTeleports", role: "Le routeur. Il décide si un mouvement s'exécute sur place, part en file, ou passe par la fenêtre." },
                        { name: "entity/PendingTeleports", role: "Les mouvements en attente d'exécution chez leur destinataire." },
                        { name: "entity/PassengerTree", role: "Le détachement et la recopie de l'arbre monture et passagers." },
                        { name: "entity/TeleportOps", role: "Les opérations élémentaires, celles que la région d'arrivée exécute pendant son tick." },
                        { name: "mixin/entity/EntityMixin", role: "L'interception de teleport depuis un worker de région, et le report de la recherche de portail dans la fenêtre." },
                        { name: "mixin/entity/ServerPlayerMixin", role: "Le même détournement pour un joueur, plus le set concurrent de perles d'ender." }
                    ]}
                />
                <p>
                    Le set des perles d'ender d'un joueur devient concurrent, parce qu'une perle lancée depuis une autre région s'y inscrit depuis un autre thread. C'est typiquement le genre de détail
                    qui ne se voit qu'en jeu, et qui corrompt en silence si on l'oublie.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
