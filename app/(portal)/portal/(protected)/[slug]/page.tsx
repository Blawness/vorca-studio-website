import { notFound } from "next/navigation";
import { requireClient } from "@/lib/portal-auth";
import { getClientProject } from "@/lib/projects";
import { buildArticleHtml } from "@/lib/article-html";
import { ProjectDashboardChrome } from "./ProjectDashboardChrome";

// No `export const dynamic` — this app has cacheComponents:true (force-dynamic is
// disallowed). requireClient()/requireUser() read auth cookies, making the route
// dynamic (fresh per request) automatically.

export default async function PortalProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { userId } = await requireClient();
    const project = await getClientProject(userId, slug);
    if (!project) notFound();

    const prdHtml = project.prd ? buildArticleHtml(project.prd) : null;

    return <ProjectDashboardChrome project={project} prdHtml={prdHtml} slug={slug} />;
}
