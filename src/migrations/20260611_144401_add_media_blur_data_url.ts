import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// NOTE: 20260413_153000_add_availability_field was hand-written without a drizzle
// snapshot, so the generator wanted to re-create the availability column here.
// The snapshot (.json) now includes it; this migration only adds what is actually
// missing: the media blur placeholder column and the availability index the
// hand-written migration skipped.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "blur_data_url" varchar;
  CREATE INDEX IF NOT EXISTS "products_availability_idx" ON "products" USING btree ("availability");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "products_availability_idx";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "blur_data_url";`)
}
