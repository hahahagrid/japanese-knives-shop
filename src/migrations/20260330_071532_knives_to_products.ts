import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Create the new enum for product type
    CREATE TYPE "public"."enum_products_type" AS ENUM('knife', 'accessory');

    -- 2. Rename existing enum
    ALTER TYPE "public"."enum_knives_status" RENAME TO "enum_products_status";

    -- 3. Rename tables
    ALTER TABLE "knives" RENAME TO "products";
    ALTER TABLE "knives_rels" RENAME TO "products_rels";

    -- 4. Add the 'type' column to products
    ALTER TABLE "products" ADD COLUMN "type" "enum_products_type" DEFAULT 'knife' NOT NULL;

    -- 5. Rename columns in relationship tables
    ALTER TABLE "orders_items" RENAME COLUMN "knife_id" TO "product_id";
    ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "knives_id" TO "products_id";

    -- 6. Update constraints to match the new naming convention (Payload expects specific names)
    -- Drop old constraints
    ALTER TABLE "products" DROP CONSTRAINT "knives_category_id_categories_id_fk";
    ALTER TABLE "products_rels" DROP CONSTRAINT "knives_rels_parent_fk";
    ALTER TABLE "products_rels" DROP CONSTRAINT "knives_rels_media_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knives_fk";

    -- Add new constraints
    ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

    -- 7. Update indexes
    -- Drop old indexes
    DROP INDEX "knives_slug_idx";
    DROP INDEX "knives_category_idx";
    DROP INDEX "knives_updated_at_idx";
    DROP INDEX "knives_created_at_idx";
    DROP INDEX "knives_rels_order_idx";
    DROP INDEX "knives_rels_parent_idx";
    DROP INDEX "knives_rels_path_idx";
    DROP INDEX "knives_rels_media_id_idx";
    DROP INDEX "payload_locked_documents_rels_knives_id_idx";

    -- Create new indexes
    CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
    CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
    CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
    CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
    CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
    CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
    CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
    CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
    CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Reverse the process

    -- 1. Rename tables back
    ALTER TABLE "products" RENAME TO "knives";
    ALTER TABLE "products_rels" RENAME TO "knives_rels";

    -- 2. Handle enums
    ALTER TYPE "public"."enum_products_status" RENAME TO "enum_knives_status";
    DROP TYPE "public"."enum_products_type";

    -- 3. Remove the 'type' column
    ALTER TABLE "knives" DROP COLUMN "type";

    -- 4. Rename columns back
    ALTER TABLE "orders_items" RENAME COLUMN "product_id" TO "knife_id";
    ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "products_id" TO "knives_id";

    -- 5. Revert constraints
    ALTER TABLE "knives" DROP CONSTRAINT "products_category_id_categories_id_fk";
    ALTER TABLE "knives_rels" DROP CONSTRAINT "products_rels_parent_fk";
    ALTER TABLE "knives_rels" DROP CONSTRAINT "products_rels_media_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";

    ALTER TABLE "knives" ADD CONSTRAINT "knives_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "knives_rels" ADD CONSTRAINT "knives_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."knives"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "knives_rels" ADD CONSTRAINT "knives_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knives_fk" FOREIGN KEY ("knives_id") REFERENCES "public"."knives"("id") ON DELETE cascade ON UPDATE no action;

    -- 6. Revert indexes
    DROP INDEX "products_slug_idx";
    DROP INDEX "products_category_idx";
    DROP INDEX "products_updated_at_idx";
    DROP INDEX "products_created_at_idx";
    DROP INDEX "products_rels_order_idx";
    DROP INDEX "products_rels_parent_idx";
    DROP INDEX "products_rels_path_idx";
    DROP INDEX "products_rels_media_id_idx";
    DROP INDEX "payload_locked_documents_rels_products_id_idx";

    CREATE UNIQUE INDEX "knives_slug_idx" ON "knives" USING btree ("slug");
    CREATE INDEX "knives_category_idx" ON "knives" USING btree ("category_id");
    CREATE INDEX "knives_updated_at_idx" ON "knives" USING btree ("updated_at");
    CREATE INDEX "knives_created_at_idx" ON "knives" USING btree ("created_at");
    CREATE INDEX "knives_rels_order_idx" ON "knives_rels" USING btree ("order");
    CREATE INDEX "knives_rels_parent_idx" ON "knives_rels" USING btree ("parent_id");
    CREATE INDEX "knives_rels_path_idx" ON "knives_rels" USING btree ("path");
    CREATE INDEX "knives_rels_media_id_idx" ON "knives_rels" USING btree ("media_id");
    CREATE INDEX "payload_locked_documents_rels_knives_id_idx" ON "payload_locked_documents_rels" USING btree ("knives_id");
  `)
}
