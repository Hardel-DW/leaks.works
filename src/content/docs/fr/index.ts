import codeMap from "@/content/docs/fr/code-map";
import commandsDatapacks from "@/content/docs/fr/commands-datapacks";
import faq from "@/content/docs/fr/faq";
import installConfig from "@/content/docs/fr/install-config";
import introduction from "@/content/docs/fr/introduction";
import leafsCommand from "@/content/docs/fr/leafs-command";
import mailBorrow from "@/content/docs/fr/mail-borrow";
import methodology from "@/content/docs/fr/methodology";
import modCompatibility from "@/content/docs/fr/mod-compatibility";
import playersEntities from "@/content/docs/fr/players-entities";
import readWrite from "@/content/docs/fr/read-write";
import regions from "@/content/docs/fr/regions";
import saving from "@/content/docs/fr/saving";
import threads from "@/content/docs/fr/threads";
import tradeOffs from "@/content/docs/fr/trade-offs";
import vanilla from "@/content/docs/fr/vanilla";
import type { DocSlug } from "@/content/docs/nav";
import type { DocPage } from "@/content/docs/types";

export const fr: Record<DocSlug, DocPage> = {
    introduction,
    vanilla,
    regions,
    threads,
    "read-write": readWrite,
    "mail-borrow": mailBorrow,
    "players-entities": playersEntities,
    saving,
    "install-config": installConfig,
    "leafs-command": leafsCommand,
    "commands-datapacks": commandsDatapacks,
    "mod-compatibility": modCompatibility,
    "trade-offs": tradeOffs,
    faq,
    methodology,
    "code-map": codeMap
};
