import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "enum_products_availability" AS ENUM('available', 'unavailable');
    ALTER TABLE "products" ADD COLUMN "availability" "enum_products_availability" DEFAULT 'available' NOT NULL;
    
    -- Migrate existing 'sold' status to new availability field
    -- We assume 'sold' status exists from previous attempt or temporary state
    UPDATE "products" 
    SET "availability" = 'unavailable', "status" = 'in_stock' 
    WHERE "status"::text = 'sold';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products" DROP COLUMN "availability";
    DROP TYPE "enum_products_availability";
  `)
}
