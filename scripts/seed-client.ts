import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const [{ db }, schema] = await Promise.all([
    import("../db"),
    import("../db/schema"),
]);
const { users, projects, projectUpdates, projectTasks, deliverables } = schema;

const EMAIL = process.env.CLIENT_EMAIL ?? "client@example.com";
const PASSWORD = process.env.CLIENT_PASSWORD ?? "client-password-123";

const passwordHash = await bcrypt.hash(PASSWORD, 12);

let [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, EMAIL)).limit(1);
if (user) {
    await db.update(users).set({ passwordHash, role: "client" }).where(eq(users.id, user.id));
} else {
    [user] = await db
        .insert(users)
        .values({ email: EMAIL, name: "Sample Client", passwordHash, role: "client" })
        .returning({ id: users.id });
}

const existing = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.clientUserId, user.id))
    .limit(1);

if (existing.length === 0) {
    const slug = "seed-project-001";
    const [project] = await db
        .insert(projects)
        .values({
            slug,
            name: "Sample Website Project",
            description: "A demo project for the client portal.",
            prd: "<h2>Scope</h2><p>Build a marketing site.</p>",
            clientUserId: user.id,
            stage: "development",
            progress: 45,
            liveUrl: "https://example.com",
        })
        .returning({ id: projects.id });

    await db.insert(projectUpdates).values({
        projectId: project.id,
        title: "Kickoff complete",
        body: "We started development this week.",
    });
    await db.insert(projectTasks).values([
        { projectId: project.id, title: "Design homepage", status: "done", sortOrder: 0 },
        { projectId: project.id, title: "Build homepage", status: "in_progress", sortOrder: 1 },
        { projectId: project.id, title: "Launch", status: "todo", sortOrder: 2 },
    ]);
    await db.insert(deliverables).values({
        projectId: project.id,
        title: "Homepage design",
        previewUrl: "https://example.com/preview",
        approvalStatus: "pending",
    });
    console.log(`Created client ${EMAIL} + project slug: ${slug}`);
} else {
    console.log(`Client ${EMAIL} already has project slug: ${existing[0].slug}`);
}

process.exit(0);
