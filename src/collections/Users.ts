import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor'],
      defaultValue: ['admin'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
      },
    },
  ],
}
