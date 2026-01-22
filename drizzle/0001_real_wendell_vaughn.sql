ALTER TABLE "color_sets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "color_sets" CASCADE;--> statement-breakpoint
ALTER TABLE "colors" DROP CONSTRAINT "colors_color_set_id_color_sets_id_fk";
--> statement-breakpoint
ALTER TABLE "colors" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "colors" DROP COLUMN "name_en";--> statement-breakpoint
ALTER TABLE "colors" DROP COLUMN "name_zh";--> statement-breakpoint
ALTER TABLE "colors" DROP COLUMN "color_set_id";--> statement-breakpoint
ALTER TABLE "user_color_customizations" DROP COLUMN "custom_name";--> statement-breakpoint
ALTER TABLE "user_color_customizations" DROP COLUMN "custom_name_en";--> statement-breakpoint
ALTER TABLE "user_color_customizations" DROP COLUMN "custom_name_zh";--> statement-breakpoint
ALTER TABLE "colors" ADD CONSTRAINT "colors_code_unique" UNIQUE("code");