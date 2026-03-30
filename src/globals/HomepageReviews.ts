import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

export const HomepageReviews: GlobalConfig = {
  slug: 'homepage-reviews',
  label: 'Відгуки на Головній',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('homepage-reviews')],
  },
  fields: [
    {
      name: 'bulkUpload',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/Admin/BulkUploadDropzone',
        },
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Скріншоти відгуків',
    },
  ],
}
