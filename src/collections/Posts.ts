import type { CollectionConfig } from 'payload'
import { revalidatePost } from '../hooks/revalidate'
import { syncPostMediaAlt } from '../hooks/syncPostMediaAlt'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Стаття',
    plural: 'Статті',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidatePost, syncPostMediaAlt],
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'coverImage',
      label: 'Обкладинка',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      label: 'Контент',
      type: 'richText',
    },
    {
      name: 'publishedDate',
      label: 'Дата публікації',
      type: 'date',
      index: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
