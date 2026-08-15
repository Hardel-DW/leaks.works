import CommandRouting from "@/components/demo/CommandRouting";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                Une commande peut tout faire. Téléporter n'importe qui, poser un bloc à l'autre bout de la carte, invoquer une entité dans une autre dimension. Aucune région ne peut exécuter ça, donc
                les commandes ne s'exécutent jamais sur un thread de région.
            </Lead>

            <Figure
                title="D'où vient la commande, et où elle s'exécute"
                hint="joue avec les deux gamerules"
                caption="Toutes les sources ne coûtent pas la même chose. Seules celles qui bouclent à chaque tick posent un vrai problème de performance.">
                <CommandRouting />
            </Figure>

            <H2>Folia coupe, Leafs garde</H2>

            <P>
                C'est la différence la plus visible entre les deux projets. Folia désactive les command blocks, les fonctions de datapacks et une vingtaine de commandes, parce qu'il n'a pas de
                mécanisme pour leur donner le monde entier. Leafs a la fenêtre barrière, donc il les garde tous.
            </P>

            <P>
                Le prix est honnête et il faut le dire clairement. Un command block en repeat, ou une fonction de datapack dans <Code>#minecraft:tick</Code>, ouvre la fenêtre à chaque tick. Le serveur
                repasse par un moment sériel permanent, dont la durée dépend de la région la plus lente à finir son tick en cours.
            </P>

            <H2>Les deux gamerules</H2>

            <P>
                Leafs ajoute exactement deux gamerules, et rien d'autre. Les deux valent <Code>true</Code> par défaut, donc le comportement vanilla est intact tant que tu n'y touches pas.
            </P>

            <div className="flex flex-col gap-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-925 px-4 py-3">
                    <code className="font-mono text-[13px] text-zinc-200">leafs:tick_functions_work</code>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                        À <Code>false</Code>, la boucle du tag <Code>#minecraft:tick</Code> est coupée. La commande <Code>/function</Code> et le tag <Code>#minecraft:load</Code> continuent de
                        fonctionner, et un <Code>/reload</Code> joue encore sa fenêtre de rechargement, qui exécute <Code>#minecraft:load</Code> et une seule passe de <Code>#minecraft:tick</Code>.
                    </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-925 px-4 py-3">
                    <code className="font-mono text-[13px] text-zinc-200">leafs:repeating_command_blocks_work</code>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                        À <Code>false</Code>, l'exécution des command blocks en repeat est sautée <Strong>sans les désarmer</Strong>. Chaque bloc coupé se réarme à vide sur son propre thread de
                        région, sans ouvrir la fenêtre, et repart tout seul quand la règle revient à <Code>true</Code>. Les blocs en impulse et en chain continuent de fonctionner.
                    </p>
                </div>
            </div>

            <Callout tone="info" title="Comment savoir si ça te concerne">
                La commande <Code>/leafs recommendation</Code> lit l'état du serveur et te dit ce qui limite ton parallélisme. Si une fenêtre s'ouvre à chaque tick, elle te le dira, et elle te dira
                pourquoi.
            </Callout>

            <DeepDive title="les commandes dans le code">
                <ClassList
                    items={[
                        { name: "global/CommandBlockWindow", role: "Le report des command blocks vers la fenêtre, et le réarmement à vide quand la gamerule les coupe." },
                        { name: "global/LeafsGameRules", role: "Les deux gamerules et leur lecture." },
                        { name: "global/BarrierWindow", role: "La fenêtre elle-même, où toutes ces exécutions atterrissent." },
                        { name: "mixin/global/CommandBlockMixin", role: "L'accroche sur le bloc fixe." },
                        { name: "mixin/global/MinecartCommandBlockMixin", role: "L'accroche sur la version minecart." },
                        { name: "mixin/global/DedicatedServerMixin", role: "Les commandes tapées dans la console du serveur." },
                        { name: "mixin/global/ServerLevelMixin", role: "La TimerQueue, les fonctions programmées, déplacée dans la fenêtre." }
                    ]}
                />
            </DeepDive>
        </ChapterPage>
    );
}
