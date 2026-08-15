import Callout from "@/components/docs/Callout";
import Figure from "@/components/docs/Figure";
import { Bullet, Bullets, Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

const SETTINGS = [
    { key: "max_threads", value: "-1", role: "Le nombre de workers qui tiquent les régions. -1 prend tous les cœurs de la machine." },
    { key: "chunk_threads", value: "-1", role: "Le nombre de workers du pool de chunks, génération et lectures disque. -1 prend la moitié des cœurs, avec un plancher de deux." },
    { key: "section_size", value: "16", role: "Le côté des sections, en chunks. Doit être une puissance de deux." },
    { key: "region_merge_distance", value: "1", role: "La distance, en sections, sous laquelle deux régions voisines fusionnent." },
    { key: "region_buffer_distance", value: "1", role: "L'épaisseur de sections vides qu'une région possède autour de ses chunks actifs." }
];

const DEBUG = [
    { key: "watchdog_warn_seconds", value: "15", role: "Tout tick bloqué plus longtemps que ce seuil se logge avec la pile de son thread." },
    { key: "watchdog_kill_seconds", value: "60", role: "Au delà de ce seuil, un crash report est écrit puis la JVM est tuée. 0 désactive la mise à mort, pratique pour poser des breakpoints." },
    { key: "metrics_log_seconds", value: "0", role: "La période d'écriture des métriques par région dans un CSV. 0 n'écrit rien." },
    { key: "per_region_logs", value: "false", role: "Sépare les journaux par région dans des fichiers distincts." }
];

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Leafs crée <Code>config/leafs.json</Code> au premier lancement, avec les valeurs par défaut. Le chargement est strict. Une clef inconnue ou une valeur invalide arrête le serveur au
                démarrage, et l'erreur nomme la clef fautive.
            </Lead>

            <Callout tone="info" title="Un échec au démarrage vaut mieux qu'un réglage ignoré">
                Un serveur qui démarre en ignorant silencieusement une faute de frappe dans sa config est un serveur qui ne fait pas ce que tu crois. Leafs préfère refuser de démarrer.
            </Callout>

            <H2>Les réglages</H2>

            <Figure title="config/leafs.json" hint="valeurs par défaut">
                <div className="flex flex-col divide-y divide-zinc-800">
                    {SETTINGS.map((setting) => (
                        <div key={setting.key} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
                            <div className="flex items-baseline gap-2.5">
                                <code className="font-mono text-[12.5px] text-zinc-200">{setting.key}</code>
                                <code className="font-mono text-[11px] text-zinc-500">{setting.value}</code>
                            </div>
                            <span className="text-[12.5px] leading-relaxed text-zinc-500">{setting.role}</span>
                        </div>
                    ))}
                </div>
            </Figure>

            <P>
                Le seul vrai arbitrage est entre <Code>max_threads</Code> et <Code>chunk_threads</Code>. Les deux pools se partagent la même machine. Donner beaucoup de threads à la génération
                accélère l'exploration mais laisse moins de cœurs pour tiquer les régions, et inversement.
            </P>

            <H2>Le groupe debug</H2>

            <Figure title="Le groupe debug de leafs.json" hint="valeurs par défaut">
                <div className="flex flex-col divide-y divide-zinc-800">
                    {DEBUG.map((setting) => (
                        <div key={setting.key} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
                            <div className="flex items-baseline gap-2.5">
                                <code className="font-mono text-[12.5px] text-zinc-200">{setting.key}</code>
                                <code className="font-mono text-[11px] text-zinc-500">{setting.value}</code>
                            </div>
                            <span className="text-[12.5px] leading-relaxed text-zinc-500">{setting.role}</span>
                        </div>
                    ))}
                </div>
            </Figure>

            <H2>Les deux commandes</H2>

            <Bullets>
                <Bullet>
                    <Code>/leafs regions</Code> liste les régions vivantes par dimension. Id, état, TPS, durée moyenne de tick, nombre de chunks et d'entités en tick, avec un marqueur sur ta propre
                    région. Chaque dimension affiche aussi le TPS de sa phase sérielle et le compte des chunks que les pipelines de vue retiennent. Un compte qui ne redescend jamais après une vague
                    nomme une fuite de tickets.
                </Bullet>
                <Bullet>
                    <Code>/leafs recommendation</Code> lit l'état du serveur et suggère des actions qui améliorent le parallélisme.
                </Bullet>
            </Bullets>

            <H2>Quand ça casse</H2>

            <P>
                Chaque ligne de log émise par un worker porte le préfixe de sa région, son id et sa dimension. Quand une région crashe, elle écrit un rapport dédié dans <Code>crash-reports/</Code>,
                avec son id, sa dimension, son tick, ses chunks et ses entités. On doit pouvoir comprendre un crash de région <Strong>sans fouiller un log global</Strong>.
            </P>

            <P>
                Le watchdog de Leafs remplace celui de vanilla, qui mesurait un unique thread de jeu qui n'existe plus. Il surveille chaque unité de tick, région ou phase sérielle. Il alerte, puis il
                tue, parce qu'un serveur bloqué ne sait plus s'arrêter proprement.
            </P>
        </ChapterPage>
    );
}
