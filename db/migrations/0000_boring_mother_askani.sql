CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"cover_image_url" text,
	"category" text NOT NULL,
	"author" text NOT NULL,
	"published_at" timestamp with time zone,
	"read_time" integer DEFAULT 0 NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"album" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text,
	"role" text DEFAULT 'editor',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
