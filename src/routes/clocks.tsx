import TwoClocks from "@/components/demo/TwoClocks";
import Callout from "@/components/docs/Callout";
import DeepDive, { ClassList } from "@/components/docs/DeepDive";
import Figure from "@/components/docs/Figure";
import { Code, H2, Lead, P, Strong } from "@/components/docs/Prose";
import ChapterPage from "@/components/layout/ChapterPage";

export default function Page() {
    return (
        <ChapterPage>
            <Lead>
                En vanilla il n'y a qu'un temps, le temps du jeu. Un four qui commence à cuire note simplement, je serai fini au tick 12420. Avec des régions, ce raisonnement s'effondre, parce que
                deux régions n'ont pas vécu le même nombre de ticks.
            </Lead>

            <H2>Deux compteurs, deux usages</H2>

            <P>
                Le <Strong>temps du jeu</Strong> reste global. Il est avancé par le thread global, une fois par tick, exactement comme en vanilla. C'est lui qui décide s'il fait jour ou nuit, et c'est
                lui que tu lis avec les commandes de temps.
            </P>

            <P>
                Le <Strong>temps de région</Strong> est un simple compteur qui augmente de un à chaque tick de la région. Tout ce qui mesure une durée relative compte avec celui-là. Le temps de
                cuisson d'un four, le délai d'un tick programmé de redstone, la repousse d'une culture.
            </P>

            <Figure
                title="Une région en retard, et son four"
                hint="laisse tourner, puis fusionne"
                caption="La région B tique moins souvent que le temps du jeu n'avance. Son four suit son compteur à elle, donc il ne perd rien. À la fusion, l'échéance est recalée sur le compteur de la région qui reste.">
                <TwoClocks />
            </Figure>

            <Callout tone="warn" title="Sans ce doublon, tout casse">
                Si le four comptait en temps global, il sauterait des ticks de cuisson dès que sa région prend du retard, et il finirait instantanément à la première fusion avec une région en avance.
                Les deux comportements se voient en jeu.
            </Callout>

            <H2>Le recalage à la fusion</H2>

            <P>
                Quand deux régions fusionnent, leurs deux compteurs ne concordent pas. Toutes les échéances de la région absorbée sont donc décalées, de l'écart entre les deux compteurs, pour retomber
                sur celui de la région qui survit. Le four garde exactement le nombre de ticks qu'il lui restait.
            </P>

            <P>
                La même conversion se fait à la sauvegarde. Un chunk sauvegardé pendant que sa région est en retard réécrit ses ticks programmés par rapport à l'horloge de cette région, pas au temps
                global.
            </P>

            <DeepDive title="les horloges dans le code">
                <ClassList
                    items={[
                        { name: "world/RegionClock", role: "Le compteur de ticks d'une région, et la conversion vers le temps du jeu." },
                        { name: "world/RegionScheduledTicks", role: "Les ticks programmés d'une région, datés sur son horloge." },
                        { name: "world/RoutingScheduledTicks", role: "L'aiguillage. Un tick programmé posé depuis ailleurs part vers la région propriétaire de la position." },
                        { name: "mixin/world/SerializableChunkDataMixin", role: "La sauvegarde d'un chunk packe ses ticks par rapport à l'horloge de sa région, pas au game time." }
                    ]}
                />
                <p>
                    Le mixin de <Code>Level</Code> rend aussi le compteur de sub-tick et le générateur aléatoire dépendants de la région qui tique. Deux régions qui tirent au sort en même temps ne
                    partagent donc aucun état, ce qui est le premier compromis assumé du mod.
                </p>
            </DeepDive>
        </ChapterPage>
    );
}
