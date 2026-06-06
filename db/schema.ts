export { media, users } from "@blawness/admin-kit/schema";

import {
    integer,
    pgTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull().default(""),
    coverImageUrl: text("cover_image_url"),
    category: text("category").notNull(),
    author: text("author").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    readTime: integer("read_time").notNull().default(0),
    tags: text("tags").array().notNull().default([]),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
