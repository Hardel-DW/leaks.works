import type { DocPage } from "@/content/docs/types";

export default {
    title: "Joueurs et entités",
    lead: "Un joueur tick sur sa région. Ses paquets suivent son entité. Une entité qui traverse une frontière change simplement de photo.",
    blocks: [
        { h2: "Connexion et déconnexion" },
        {
            p: "Le thread serveur gère l'arrivée et le départ d'un joueur. Il emprunte la région du joueur le temps de l'opération, moins d'une milliseconde. Les autres régions ne voient rien, aucun joueur ne ressent de différence, même sur une vague de cent connexions."
        },
        { p: "Le respawn part de la région du joueur vers la région de son point de réapparition, ou vers le thread serveur si aucune région ne couvre ce point." },
        { h2: "Les paquets" },
        {
            p: "La file de paquets d'un joueur suit son entité. Sa région les traite au début de son tick, puis fait le tick du joueur à la fin. Un joueur est tenu par un seul thread à la fois. Une région qui trouve un joueur tenu par un autre thread le saute et le reprend au tick suivant, elle n'attend jamais. Quand aucune région ne tick le joueur, mort ou sans ticket, le thread serveur lit sa file lui-même."
        },
        { h2: "Les entités qui traversent" },
        {
            p: "Aucune entité n'est envoyée entre les threads. Une région ne possède pas ses entités. Au début de chaque tick elle prend une photo des entités de ses chunks et tick celles-là. Une TNT qui traverse la frontière change simplement de section de chunk, comme en vanilla, et au tick suivant l'autre région la voit dans sa photo. Cent ou mille TNT coûtent la même chose qu'en vanilla."
        },
        {
            p: "Pour les téléportations et les portails, la région d'origine fait le travail, puis envoie un courrier à la région cible qui place l'entité. Une entité qui sort de toute zone simulée gèle, comme dans le jeu d'origine au-delà de la simulation distance. L'ender pearl est l'exception du jeu d'origine : elle agrandit la région ou en crée une, comme un joueur."
        },
        {
            note: "Les régions sont toujours séparées par au moins une section non simulée au-delà de la couronne. Une entité qui sort d'une région gèle dans cette zone. Si les joueurs sont assez proches, leurs régions fusionnent et il n'y a plus de zone gelée entre eux."
        },
        { h2: "Dans le code" },
        { h3: "Le réseau" },
        {
            p: "Netty décode un paquet, et `PacketRouting.routeToPlayer` le range dans la `PlayerPacketQueue` du joueur. Les autres listeners, handshake, login, configuration, gardent le chemin vanilla. La file a un drapeau `claimed` : un seul thread à la fois est le thread des paquets d'un joueur. `drain` rend faux si un autre thread tient le joueur, et le tick de région passe au suivant. Ces cas sont comptés dans `/leafs metrics`."
        },
        {
            p: "`RegionNetworkTick.drainOnRegion` vide la file au début du tick de région. `tickPlayerOnRegion` fait le tick complet du listener à la fin, l'envoi des chunks et le flush de la connexion. `tickListenerGlobally` est l'accroche de `Connection.tick` : un joueur couvert par une région vivante y est sauté, un joueur sans région y est tické par le thread serveur en tant qu'emprunteur."
        },
        { h3: "Les entités" },
        {
            p: "`RegionEntities` est la photo prise au début du tick depuis les sections d'entités des chunks de la région. Elle a deux listes : les entités qui tickent, et toutes les entités accessibles pour le recensement des mobs. `forEach` saute une entité qui a changé de dimension depuis la photo."
        },
        {
            p: "`EntityTeleports.route` regarde d'abord si le thread courant tient le chunk d'origine. Si oui, vanilla tourne tel quel. Sinon la téléportation entière devient un `DeferredWork` chez le propriétaire de l'origine, revalidé à l'arrivée. Le passage à la destination se fait par les primitives d'ajout et de retrait que la téléportation appelle elle-même."
        },
        {
            p: "`RegionEntityPersistence` fait tourner l'arrivée, le déchargement et la sauvegarde des entités chez le propriétaire du chunk. `RegionEntityTracking` restreint la passe de tracking aux joueurs à portée de la boîte englobante de la région, plus ceux qui voient déjà une de ses entités pour qu'un départ les déconnecte."
        }
    ]
} satisfies DocPage;
