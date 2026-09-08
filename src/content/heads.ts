import { en } from "../lib/i18n/en";
import { type DocData, type Locale, pageTitle, SITE_NAME } from "./content";

export type Head = { title: string; description: string };

// The head of every page is English, the one language crawlers and the tab get.
export const HEAD_LOCALE: Locale = "en";

export const HEADS = {
    home: {
        title: `${SITE_NAME} - Fabric Mods`,
        description:
            "Leafs is a Fabric server mod that cuts the Minecraft world into independent regions, each ticking in parallel on its own thread. Regions, threads and chunks explained with interactive visuals."
    },
    doc: (doc: DocData): Head => ({ title: pageTitle(doc.title), description: doc.lead }),
    patchnote: { title: pageTitle(en.patchnote.title), description: en.patchnote.subtitle },
    notFound: { title: pageTitle(en.notFound.title), description: en.notFound.text }
};
