import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "enum_products_status" ADD VALUE 'sold';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSql does not support removing values from an enum easily.
  // Replacing with a slightly complex workaround if needed, but for now we leave it.
}
