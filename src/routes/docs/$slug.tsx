import DocsShell from "@/components/docs/DocsShell";
import NotFound from "@/components/layout/NotFound";
import { isSlug } from "@/content/content";
import { HEAD_LOCALE, HEADS } from "@/content/heads";
import { docsFor } from "@/lib/content/load";
import { type RouteConfig, useParams } from "@/lib/router";

export default {
    head: ({ slug }) => (isSlug(slug) ? HEADS.doc(docsFor(HEAD_LOCALE)[slug].data) : HEADS.notFound),
    component: DocPage
} satisfies RouteConfig;

function DocPage() {
    const { slug } = useParams();
    if (!isSlug(slug)) return <NotFound />;
    return <DocsShell slug={slug} />;
}
