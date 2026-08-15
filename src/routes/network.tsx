import PacketFlow from "@/components/demo/PacketFlow";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, H3, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Le but de tout le chapitre tient en une phrase. Rendre au joueur le contrat de vanilla, un seul thread traite tout ce qui le concerne, dans l'ordre. Sans ça, la moitié des mods
                casseraient.
            </Lead>

            <H2>Une file par joueur</H2>

            <P>
                Quand un joueur bouge, clique ou écrit, son jeu envoie un paquet. Leafs range ce paquet dans la file de ce joueur, et nulle part ailleurs. La région qui possède le joueur vide sa file
                au début de son tick, puis exécute son tick de listener en fin de tick, ce qui couvre la physique du joueur, ses menus, sa nourriture et le keepalive.
            </P>

            <Figure
                title="Les paquets arrivent, les régions drainent"
                caption="Alix et Bo partagent une région, donc le même thread. Cam est ailleurs. Chaque file est vidée à la cadence de sa région propriétaire, pas à celle du serveur.">
                <PacketFlow />
            </Figure>

            <Callout tone="info" title="Le drain revérifie la propriété entre chaque paquet">
                Un handler peut téléporter le joueur au milieu du drain. Si le joueur n'appartient plus à la région, elle arrête, et la suite de la file est traitée par sa nouvelle région.
            </Callout>

            <H2>L'envoi des chunks appartient à la région</H2>

            <P>
                À chaque tick, la région calcule ce que ses joueurs doivent recevoir, sérialise les chunks, les met en file sur le canal, puis vide le canal en fin de tick. Une région ne sérialise
                <Strong> que les chunks qu'elle possède</Strong>, ce qui garantit qu'aucun chunk n'est lu pendant qu'un autre thread l'écrit.
            </P>

            <P>Un chunk en attente qui appartient à une autre région reste en attente. Il part quand la propriété converge, ce qui arrive au tick suivant dans le pire des cas.</P>

            <H2>La connexion et la déconnexion</H2>

            <P>
                Le placement d'un nouveau joueur s'exécute sur la région qui possède son chunk de spawn. Soixante connexions simultanées se placent donc sur soixante régions au lieu de se sérialiser
                sur le thread serveur.
            </P>

            <P>
                La phase de configuration de vanilla, l'écran que tu vois pendant la connexion, sert de salle d'attente. Leafs y lit d'avance le playerdata, les stats et les advancements, sur le pool
                d'entrées sorties. Au moment de basculer en jeu, il n'y a plus rien à lire sur le disque et plus rien à attendre.
            </P>

            <P>
                La déconnexion, elle, exécute le corps vanilla entier sous la pause de toutes les régions. C'est ce qui rend sûr tout ce que le retrait touche, y compris les perles d'ender en vol. Une
                vague de déconnexions dans le même tick partage une seule pause au lieu d'en payer une par joueur.
            </P>

            <Callout tone="warn" title="Les commandes restent sur la phase globale">
                Une commande tapée dans le chat ne s'exécute pas dans la file du joueur. Elle part sur la phase globale, parce qu'une commande comme /locate doit pouvoir charger des chunks
                arbitraires, ce que seule cette phase sait faire.
            </Callout>

            <DeepDive title="le réseau dans le code">
                <H3>Les classes</H3>
                <ClassList
                    items={[
                        { name: "network/PlayerPacketQueue", role: "La file d'un joueur. Le thread qui la vide est reconnu comme un thread de paquets valide." },
                        { name: "network/PacketRouting", role: "L'aiguillage des paquets entrants vers la bonne file." },
                        { name: "network/RegionNetworkTick", role: "Le tick réseau d'une région, drain en début de tick et listener en fin." },
                        { name: "network/JoinPreload", role: "La lecture anticipée du playerdata, des stats et des advancements pendant la configuration." },
                        { name: "network/SpawnEntityWait", role: "L'attente des entités du spawn, déplacée dans la salle d'attente au lieu du basculement en jeu." },
                        { name: "network/PlayerTeardown", role: "Le retrait complet d'un joueur, sous la pause de toutes les régions." },
                        { name: "network/ContainerClickGuard", role: "Le garde des clics de conteneur, qui rétablit la synchronisation du menu quand un handler lève." },
                        { name: "global/DeferredFileWrites", role: "Le thread d'écriture unique. La sérialisation se fait sous la pause, l'écriture disque part après." }
                    ]}
                />
                <p>
                    Le thread global garde le transport, le flush des files d'envoi et la détection des déconnexions. Il sert aussi de filet, une connexion dont aucune région ne s'occupe depuis un
                    quart de seconde retombe sur le tick global vanilla complet, sous le verrou exclusif. Ce filet n'a aucune liste à maintenir, chaque région estampille les joueurs qu'elle traite et
                    le global observe la fraîcheur de la marque.
                </p>
                <p>
                    Le mixin de <Code>PacketUtils</Code> remplace la vérification de thread de vanilla. Le thread autorisé à traiter un paquet est celui qui vide la file du joueur, pas nécessairement
                    le thread serveur.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
