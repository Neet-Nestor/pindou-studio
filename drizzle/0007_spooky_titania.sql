CREATE TABLE "brand_catalog" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"sizes" text NOT NULL,
	"description" text,
	"website" text,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "color_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hex_color" text NOT NULL,
	"brand" text NOT NULL,
	"code" text NOT NULL,
	"category" text
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"primary_brand" text DEFAULT 'MARD' NOT NULL,
	"multi_brand_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_inventory" ADD COLUMN "hex_color" text;--> statement-breakpoint
ALTER TABLE "user_inventory" ADD COLUMN "brand" text NOT NULL;--> statement-breakpoint
ALTER TABLE "color_catalog" ADD CONSTRAINT "color_catalog_brand_brand_catalog_id_fk" FOREIGN KEY ("brand") REFERENCES "public"."brand_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;