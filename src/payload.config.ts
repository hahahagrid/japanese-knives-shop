import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Knives } from './collections/Knives'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { Orders } from './collections/Orders'
import { SiteSettings } from './globals/SiteSettings'
import { HomepageReviews } from './globals/HomepageReviews'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Knives, Categories, Posts, Orders],
  globals: [SiteSettings, HomepageReviews],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // push: true,
  }),
  sharp,
  plugins: [],
})
