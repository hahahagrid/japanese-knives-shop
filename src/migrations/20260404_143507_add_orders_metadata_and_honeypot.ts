import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "honeypot" varchar;
  ALTER TABLE "orders" ADD COLUMN "metadata_ip" varchar;
  ALTER TABLE "orders" ADD COLUMN "metadata_user_agent" varchar;
  ALTER TABLE "orders" ADD COLUMN "metadata_city" varchar;
  ALTER TABLE "orders" ADD COLUMN "metadata_country" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "honeypot";
  ALTER TABLE "orders" DROP COLUMN "metadata_ip";
  ALTER TABLE "orders" DROP COLUMN "metadata_user_agent";
  ALTER TABLE "orders" DROP COLUMN "metadata_city";
  ALTER TABLE "orders" DROP COLUMN "metadata_country";`)
}
