import DocsShell from "@/components/docs/DocsShell";
import { FIRST_SLUG } from "@/content/docs/nav";

export default function DocsIndex() {
    return <DocsShell slug={FIRST_SLUG} />;
}
