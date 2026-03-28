import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'total', 'status', 'createdAt'],
    group: 'Admin',
  },
  access: {
    create: () => true, // Anyone can submit a contact form
    read: ({ req: { user } }) => Boolean(user), // Only admins can read
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'deliveryInfo',
      type: 'textarea',
      admin: {
        description: 'Інформація про доставку (Місто, Відділення НП, тощо)',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Товари в замовленні',
      },
      fields: [
        {
          name: 'knifeId',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'price',
          type: 'number',
        },
        {
          name: 'quantity',
          type: 'number',
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      admin: {
        description: 'Сума замовлення',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новий', value: 'new' },
        { label: 'В роботі', value: 'processing' },
        { label: 'Завершено', value: 'completed' },
        { label: 'Скасовано', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      defaultValue: 'contact_form',
    },
  ],
  timestamps: true,
}
