CREATE TYPE "public"."signup_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "client_signup_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"company" text,
	"phone" text,
	"note" text,
	"locale" text DEFAULT 'id' NOT NULL,
	"status" "signup_request_status" DEFAULT 'pending' NOT NULL,
	"review_note" text,
	"reviewed_by_user_id" integer,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_signup_requests_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "client_signup_requests" ADD CONSTRAINT "client_signup_requests_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;