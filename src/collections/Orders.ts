import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Замовлення',
    plural: 'Замовлення',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'name', 'phone', 'total', 'status', 'createdAt'],
    group: 'Адміністрування',
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
      label: 'Номер замовлення',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'name',
      label: "Ім'я",
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      name: 'message',
      label: 'Повідомлення',
      type: 'textarea',
    },
    {
      name: 'deliveryInfo',
      label: 'Дані для доставки',
      type: 'textarea',
      admin: {
        description: 'Місто, відділення НП, ПІБ отримувача тощо',
      },
    },
    {
      name: 'items',
      label: 'Товари',
      type: 'array',
      admin: {
        description: 'Список товарів у замовленні',
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
      label: 'Загальна сума',
      type: 'number',
      admin: {
        description: 'Сума замовлення в гривнях',
      },
    },
    {
      name: 'status',
      label: 'Статус замовлення',
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
      label: 'Джерело замовлення',
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
