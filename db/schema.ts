export * from "@blawness/admin-kit/schema";

import {
    pgTable,
    serial,
    integer,
    text,
    date,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "@blawness/admin-kit/schema";

export const projectStage = pgEnum("project_stage", [
    "planning",
    "design",
    "development",
    "review",
    "completed",
]);
export const taskStatus = pgEnum("task_status", ["todo", "in_progress", "done"]);
export const approvalStatus = pgEnum("approval_status", [
    "pending",
    "approved",
    "revision_requested",
]);
export const deliverableAction = pgEnum("deliverable_action", [
    "approved",
    "revision_requested",
]);

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    prd: text("prd"),
    clientUserId: integer("client_user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    stage: projectStage("stage").notNull().default("planning"),
    progress: integer("progress").notNull().default(0),
    liveUrl: text("live_url"),
    startDate: date("start_date"),
    targetDate: date("target_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectUpdates = pgTable("project_updates", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectTasks = pgTable("project_tasks", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    status: taskStatus("status").notNull().default("todo"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliverables = pgTable("deliverables", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fileUrl: text("file_url"),
    previewUrl: text("preview_url"),
    approvalStatus: approvalStatus("approval_status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliverableEvents = pgTable("deliverable_events", {
    id: serial("id").primaryKey(),
    deliverableId: integer("deliverable_id")
        .notNull()
        .references(() => deliverables.id, { onDelete: "cascade" }),
    action: deliverableAction("action").notNull(),
    note: text("note"),
    actorUserId: integer("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const signupRequestStatus = pgEnum("signup_request_status", [
    "pending",
    "approved",
    "rejected",
]);

export const clientSignupRequests = pgTable("client_signup_requests", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"),
    company: text("company"),
    phone: text("phone"),
    note: text("note"),
    locale: text("locale").notNull().default("id"),
    status: signupRequestStatus("status").notNull().default("pending"),
    reviewNote: text("review_note"),
    reviewedByUserId: integer("reviewed_by_user_id").references(() => users.id, {
        onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
