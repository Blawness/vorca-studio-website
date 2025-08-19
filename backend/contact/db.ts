import { SQLDatabase } from "encore.dev/storage/sqldb";

export const contactDB = new SQLDatabase("contact", {
  migrations: "./migrations",
});
