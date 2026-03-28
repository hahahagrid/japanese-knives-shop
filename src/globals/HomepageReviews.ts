import type { GlobalConfig } from 'payload'

export const HomepageReviews: GlobalConfig = {
  slug: 'homepage-reviews',
  label: 'Відгуки на Головній',
  access: {
    read: () => true,
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
