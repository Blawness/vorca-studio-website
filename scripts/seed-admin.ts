import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const [{ db }, { users }] = await Promise.all([
    import("../db"),
    import("../db/schema"),
]);

const EMAIL = process.env.ADMIN_EMAIL ?? "admin@vorcastudio.com";
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!PASSWORD) {
    console.error("Usage: ADMIN_PASSWORD=<secret> pnpm seed:admin");
    process.exit(1);
}

const passwordHash = await bcrypt.hash(PASSWORD, 12);

const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, EMAIL))
    .limit(1);

if (existing.length > 0) {
    await db
        .update(users)
        .set({ passwordHash, role: "admin" })
        .where(eq(users.email, EMAIL));
    console.log(`Updated existing user: ${EMAIL}`);
} else {
    await db.insert(users).values({
        email: EMAIL,
        name: "Vorca Admin",
        passwordHash,
        role: "admin",
    });
    console.log(`Created admin user: ${EMAIL}`);
}

process.exit(0);
