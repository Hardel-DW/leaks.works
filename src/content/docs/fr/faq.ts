import type { DocPage } from "@/content/docs/types";

export default {
    title: "Questions fréquentes",
    lead: "Les questions que les joueurs et les admins posent le plus souvent.",
    blocks: [
        { h2: "Les machines en redstone marchent-elles près des bords d'une région ?" },
        {
            p: "Si une machine dépasse de la zone simulée, elle se fige comme en vanilla. Rien de nouveau. Chaque région a aussi une couronne qui ne tick pas, une zone autour de la région qui absorbe les débordements : pistons, projectiles et le reste."
        },
        { h2: "Les canons orbitaux et les entités très rapides ?" },
        {
            p: "Le code ne fait rien de spécial pour une entité rapide, et n'en a pas besoin. Aucune entité n'est envoyée entre les threads. Une région ne possède pas ses entités : au début de chaque tick elle prend une photo des entités de ses chunks et tick celles-là. Une TNT qui traverse la frontière change simplement de section de chunk, comme en vanilla, et au tick suivant l'autre région la voit dans sa photo. Cent ou mille TNT coûtent la même chose qu'en vanilla."
        },
        { h2: "Comment sont gérées les entités qui traversent des régions ?" },
        {
            ul: [
                "Pour les téléportations et les portails, la région d'origine fait le travail, puis envoie un courrier à la région cible qui place l'entité.",
                "Pour les entités qui sortent d'une région, la réponse est la même que pour les canons : la région suivante la voit dans sa photo au tick d'après.",
                "Une entité qui sort de toute zone simulée gèle, comme dans le jeu d'origine. L'ender pearl est l'exception du jeu d'origine, elle agrandit la région ou en crée une, comme un joueur."
            ]
        },
        {
            note: "Les régions sont toujours séparées par une section non simulée au-delà de la couronne. Une entité qui sort d'une région gèle dans cette zone, comme au-delà de la simulation distance en vanilla. Si les joueurs sont assez proches, leurs régions fusionnent."
        },
        { h2: "Les chunk loaders et le forceload fonctionnent-ils ?" },
        {
            p: "Oui, et c'est le point le plus propre du modèle. `forceload` et les chunk loaders font simuler des zones. Le modèle est basé sur les zones simulées, donc cela crée une région ou étend celle qui existe."
        },
        { h2: "Les datapacks et les commandes fonctionnent-ils ?" },
        {
            p: "Toutes les commandes tournent sur le thread serveur, peu importe qui les lance. Il emprunte une région au moment où la commande touche un de ses chunks ou une de ses entités, la garde jusqu'à la fin, puis la rend. Une commande coûte exactement son coût vanilla. Un datapack lourd dans `tick.json` reste sur un seul thread : il ralentit le thread serveur et les régions qu'il emprunte, pas les autres."
        },
        { h2: "Un tricheur peut-il détecter les régions ?" },
        {
            p: "Par nature oui. Si vous passez d'une zone à 20 TPS à une zone à 15 TPS, vous n'avez pas besoin d'un mod pour savoir que quelque chose est chargé ici : un joueur, une ender pearl, un forceload, un chunk loader."
        },
        {
            p: "Le mob cap est par dimension par défaut, ou par région selon la config. Deux usines dans deux régions proches tournent alors avec un mob cap complet chacune. En revanche, certaines techniques obscures basées sur l'analyse de l'aléatoire deviennent plus difficiles, puisque chaque région a sa propre graine."
        },
        { h2: "Des recommandations pour un gros serveur ?" },
        { p: "La locator bar devient illisible avec beaucoup de joueurs. Désactivez-la avec `/gamerule locator_bar false`. Leafs coupe alors proprement tous ses calculs." }
    ]
} satisfies DocPage;
