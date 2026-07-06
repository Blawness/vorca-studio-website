import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects, projectUpdates, projectTasks, deliverables, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm, type ProjectFormValues } from "../_components/ProjectForm";
import { SubEntityManager } from "../_components/SubEntityManager";
import { updateProjectAction } from "../actions";

// No `export const dynamic` — this app has cacheComponents:true (force-dynamic is
// disallowed). requireClient()/requireUser() read auth cookies, making the route
// dynamic (fresh per request) automatically.

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projectId = Number(id);
    if (!Number.isInteger(projectId)) notFound();

    const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
    if (!project) notFound();

    const [clients, updates, tasks, dels] = await Promise.all([
        db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.role, "client")),
        db.select().from(projectUpdates).where(eq(projectUpdates.projectId, projectId)),
        db.select().from(projectTasks).where(eq(projectTasks.projectId, projectId)),
        db.select().from(deliverables).where(eq(deliverables.projectId, projectId)),
    ]);

    const initial: ProjectFormValues = {
        id: project.id,
        name: project.name,
        description: project.description ?? "",
        prd: project.prd ?? "",
        clientUserId: project.clientUserId,
        stage: project.stage,
        progress: project.progress,
        liveUrl: project.liveUrl ?? "",
        startDate: project.startDate ?? "",
        targetDate: project.targetDate ?? "",
    };

    const boundUpdate = updateProjectAction.bind(null, projectId);

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">Edit project</h1>
            <ProjectForm initial={initial} clients={clients} action={boundUpdate} />
            <SubEntityManager
                projectId={projectId}
                updates={updates}
                tasks={tasks}
                deliverables={dels}
            />
        </div>
    );
}
