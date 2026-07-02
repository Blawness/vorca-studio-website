import "dotenv/config";
import { db } from "../db/index";
import { sql } from "drizzle-orm";

async function main() {
    await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;`);
    console.log("Done");
    process.exit(0);
}
main();
