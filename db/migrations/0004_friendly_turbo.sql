CREATE TABLE "portfolio_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"vercel_project_id" text,
	"vercel_project_name" text,
	"title" text NOT NULL,
	"category" text DEFAULT 'Landing Page' NOT NULL,
	"description_id" text,
	"description_en" text,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"visible" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_items_slug_unique" UNIQUE("slug"),
	CONSTRAINT "portfolio_items_vercel_project_id_unique" UNIQUE("vercel_project_id")
);
