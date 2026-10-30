CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"done" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
