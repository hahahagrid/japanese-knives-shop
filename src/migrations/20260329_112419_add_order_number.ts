import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "order_number" varchar;
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "orders_order_number_idx";
  ALTER TABLE "orders" DROP COLUMN "order_number";`)
}
