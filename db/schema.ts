export * from "@blawness/admin-kit/schema";

import {
    pgTable,
    serial,
    integer,
    bigint,
    boolean,
    text,
    date,
    timestamp,
    jsonb,
    index,
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

/* ------------------------------------------------------------------ *
 * Payments (Duitku)
 * ------------------------------------------------------------------ */

export const paymentStatus = pgEnum("payment_status", [
    "pending",
    "paid",
    "failed",
    "expired",
]);

export const payments = pgTable(
    "payments",
    {
        id: serial("id").primaryKey(),
        /** merchantOrderId yang kita kirim ke Duitku — unik, jadi kunci idempotency. */
        merchantOrderId: text("merchant_order_id").notNull().unique(),
        /** Rupiah penuh, tanpa desimal (sesuai paymentAmount Duitku). */
        amount: bigint("amount", { mode: "number" }).notNull(),
        status: paymentStatus("status").notNull().default("pending"),
        /** Kode metode pembayaran Duitku, mis. "BC", "SP", "VC". */
        paymentMethod: text("payment_method"),
        productDetails: text("product_details"),
        customerEmail: text("customer_email"),
        /** Referensi dari Duitku (diisi setelah inquiry / callback). */
        reference: text("reference"),
        publisherOrderId: text("publisher_order_id"),
        paymentUrl: text("payment_url"),
        vaNumber: text("va_number"),
        /** Opsional: kaitkan pembayaran ke project / user portal. */
        projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
        userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
        paidAt: timestamp("paid_at", { withTimezone: true }),
        expiresAt: timestamp("expires_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [
        index("payments_status_idx").on(t.status),
        index("payments_created_at_idx").on(t.createdAt),
    ]
);

/** Audit trail: satu baris per callback/cek status yang masuk. */
export const paymentEvents = pgTable(
    "payment_events",
    {
        id: serial("id").primaryKey(),
        paymentId: integer("payment_id").references(() => payments.id, { onDelete: "cascade" }),
        /** Disimpan mentah supaya callback untuk order tak dikenal tetap terekam. */
        merchantOrderId: text("merchant_order_id").notNull(),
        /** "callback" | "status_check" | "inquiry" */
        source: text("source").notNull(),
        resultCode: text("result_code"),
        signatureValid: boolean("signature_valid").notNull().default(true),
        payload: jsonb("payload").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [index("payment_events_order_idx").on(t.merchantOrderId)]
);

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

export const portfolioItems = pgTable("portfolio_items", {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    // Null for hand-added entries that don't map to a Vercel project.
    vercelProjectId: text("vercel_project_id").unique(),
    vercelProjectName: text("vercel_project_name"),
    title: text("title").notNull(),
    category: text("category").notNull().default("Landing Page"),
    descriptionId: text("description_id"),
    descriptionEn: text("description_en"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    visible: boolean("visible").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
