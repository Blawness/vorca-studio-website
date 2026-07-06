import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const [{ db }, schema] = await Promise.all([
    import("../db"),
    import("../db/schema"),
]);
const { users, projects, projectUpdates, projectTasks, deliverables, deliverableEvents } = schema;

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

let firstProjectId: number;

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
    firstProjectId = project.id;
    console.log(`Created client ${EMAIL} + project slug: ${slug}`);
} else {
    firstProjectId = (
        await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, existing[0].slug)).limit(1)
    )[0].id;
    console.log(`Client ${EMAIL} already has project slug: ${existing[0].slug}`);
}

// Idempotency: e2e mutates the seeded deliverable's approval_status (approve
// test) and inserts a deliverableEvents row. Reset both back to a clean
// pending state on every run so the suite is repeatable without a DB wipe.
// Scoped to this seed's own project/deliverables only.
const seededDeliverables = await db
    .select({ id: deliverables.id })
    .from(deliverables)
    .where(eq(deliverables.projectId, firstProjectId));

for (const d of seededDeliverables) {
    await db.delete(deliverableEvents).where(eq(deliverableEvents.deliverableId, d.id));
    await db.update(deliverables).set({ approvalStatus: "pending" }).where(eq(deliverables.id, d.id));
}
console.log(`Reset ${seededDeliverables.length} deliverable(s) for seed-project-001 to pending`);

// --- Second client, for cross-client ownership isolation e2e ---
const OTHER_EMAIL = "client2@example.com";
const otherHash = await bcrypt.hash("client-password-456", 12);
let [other] = await db.select({ id: users.id }).from(users).where(eq(users.email, OTHER_EMAIL)).limit(1);
if (other) {
    await db.update(users).set({ passwordHash: otherHash, role: "client" }).where(eq(users.id, other.id));
} else {
    [other] = await db
        .insert(users)
        .values({ email: OTHER_EMAIL, name: "Second Client", passwordHash: otherHash, role: "client" })
        .returning({ id: users.id });
}
const otherHas = await db.select({ id: projects.id }).from(projects).where(eq(projects.clientUserId, other.id)).limit(1);
if (otherHas.length === 0) {
    await db.insert(projects).values({
        slug: "seed-project-002",
        name: "Second Client Project",
        clientUserId: other.id,
        stage: "planning",
        progress: 5,
    });
}
console.log(`Second client ${OTHER_EMAIL} + slug: seed-project-002 ready`);

process.exit(0);
