import { redirect } from "next/navigation";
import { requireClient } from "@/lib/portal-auth";
import { getClientProjects } from "@/lib/projects";
import { ProjectListClient } from "./ProjectListClient";

// No `export const dynamic` — this app has cacheComponents:true (force-dynamic is
// disallowed). requireClient()/requireUser() read auth cookies, making the route
// dynamic (fresh per request) automatically.

export default async function PortalHomePage() {
    const { userId } = await requireClient();
    const projects = await getClientProjects(userId);

    if (projects.length === 1) redirect(`/portal/${projects[0].slug}`);

    return <ProjectListClient projects={projects} />;
}
