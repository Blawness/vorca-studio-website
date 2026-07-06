import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm, type ProjectFormValues } from "../_components/ProjectForm";
import { createProjectAction } from "../actions";

// No `export const dynamic` — this app has cacheComponents:true (force-dynamic is
// disallowed). requireClient()/requireUser() read auth cookies, making the route
// dynamic (fresh per request) automatically.

const empty: ProjectFormValues = {
    name: "", description: "", prd: "", clientUserId: "", stage: "planning",
    progress: 0, liveUrl: "", startDate: "", targetDate: "",
};

export default async function NewProjectPage() {
    const clients = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.role, "client"));

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">New project</h1>
            <ProjectForm initial={empty} clients={clients} action={createProjectAction} />
        </div>
    );
}
