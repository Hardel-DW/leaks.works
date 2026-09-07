import DocsShell from "@/components/docs/DocsShell";
import NotFound from "@/components/layout/NotFound";
import { isSlug } from "@/content/docs/nav";
import { useParams } from "@/lib/router";

export default function DocPage() {
    const { slug } = useParams();
    if (!isSlug(slug)) return <NotFound />;
    return <DocsShell slug={slug} />;
}
