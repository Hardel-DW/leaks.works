import DocsShell from "@/components/docs/DocsShell";
import { FIRST_SLUG } from "@/content/content";
import { HEAD_LOCALE, HEADS } from "@/content/heads";
import { docsFor } from "@/lib/content/load";
import type { RouteConfig } from "@/lib/router";

export default { head: () => HEADS.doc(docsFor(HEAD_LOCALE)[FIRST_SLUG].data), component: DocsIndex } satisfies RouteConfig;

function DocsIndex() {
    return <DocsShell slug={FIRST_SLUG} />;
}
