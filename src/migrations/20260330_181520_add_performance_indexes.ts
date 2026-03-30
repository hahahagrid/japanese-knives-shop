import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE INDEX "products_type_idx" ON "products" USING btree ("type");
  CREATE INDEX "products_status_idx" ON "products" USING btree ("status");
  CREATE INDEX "posts_published_date_idx" ON "posts" USING btree ("published_date");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "products_type_idx";
  DROP INDEX "products_status_idx";
  DROP INDEX "posts_published_date_idx";`)
}
