import codeMap from "@/content/docs/en/code-map";
import commandsDatapacks from "@/content/docs/en/commands-datapacks";
import faq from "@/content/docs/en/faq";
import installConfig from "@/content/docs/en/install-config";
import introduction from "@/content/docs/en/introduction";
import leafsCommand from "@/content/docs/en/leafs-command";
import mailBorrow from "@/content/docs/en/mail-borrow";
import methodology from "@/content/docs/en/methodology";
import modCompatibility from "@/content/docs/en/mod-compatibility";
import playersEntities from "@/content/docs/en/players-entities";
import readWrite from "@/content/docs/en/read-write";
import regions from "@/content/docs/en/regions";
import saving from "@/content/docs/en/saving";
import threads from "@/content/docs/en/threads";
import tradeOffs from "@/content/docs/en/trade-offs";
import vanilla from "@/content/docs/en/vanilla";
import type { DocSlug } from "@/content/docs/nav";
import type { DocPage } from "@/content/docs/types";

export const en: Record<DocSlug, DocPage> = {
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
