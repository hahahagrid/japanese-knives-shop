import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'name', 'phone', 'total', 'status', 'createdAt'],
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
      name: 'orderNumber',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
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
          name: 'productId',
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
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          try {
            const lastOrder = await req.payload.find({
              collection: 'orders',
              sort: '-createdAt',
              limit: 1,
              depth: 0,
              pagination: false,
            })

            let nextNumber = 1001
            if (lastOrder.docs.length > 0 && lastOrder.docs[0].orderNumber) {
              const lastNum = parseInt(lastOrder.docs[0].orderNumber.replace('#', ''))
              if (!isNaN(lastNum)) nextNumber = lastNum + 1
            }
            data.orderNumber = `#${nextNumber}`
          } catch (err) {
            console.error('Error generating order number:', err)
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}
