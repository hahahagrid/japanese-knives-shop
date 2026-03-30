import type { CollectionConfig } from 'payload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

import { revalidateProduct, revalidateDelete } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'price', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data && !data.slug && data.title && operation === 'create') {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
    afterChange: [revalidateProduct],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Авто-генерується з назви. Можна змінити вручну.',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Ніж (Knife)', value: 'knife' },
        { label: 'Аксесуар (Accessory)', value: 'accessory' },
      ],
      defaultValue: 'knife',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'В наявності (In Stock)', value: 'in_stock' },
        { label: 'Під замовлення (Custom Order)', value: 'custom_order' },
      ],
      defaultValue: 'in_stock',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Ціна в гривнях (залиште порожнім, якщо ціна за запитом)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'specs',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'knife',
      },
      fields: [
        { name: 'manufacturer', type: 'text', label: 'Виробник (Manufacturer)' },
        { name: 'country', type: 'text', label: 'Країна виробник (Country)' },
        { name: 'steel', type: 'text', label: 'Матеріал клинка / Сталь (Steel)' },
        { name: 'hardness', type: 'text', label: 'Твердість сталі (Hardness)' },
        { name: 'bladeLength', type: 'text', label: 'Довжина клинка (Blade Length)' },
        { name: 'edgeLength', type: 'text', label: 'Довжина РК (Cutting Edge Length)' },
        { name: 'handleLength', type: 'text', label: "Довжина руків'я (Handle Length)" },
        { name: 'totalLength', type: 'text', label: 'Загальна довжина (Total Length)' },
        { name: 'bladeHeight', type: 'text', label: 'Висота клинка (Blade Height)' },
        { name: 'thickness', type: 'text', label: 'Товщина клинка (Thickness)' },
        { name: 'weight', type: 'text', label: 'Вага (Weight)' },
        { name: 'finish', type: 'text', label: 'Обробка клинка (Finish/Treatment)' },
        { name: 'layers', type: 'text', label: 'Кількість шарів (Layers)' },
        { name: 'handleMaterial', type: 'text', label: "Матеріал руків'я (Handle Material)" },
        { name: 'bolster', type: 'text', label: 'Матеріал больстера (Bolster Material)' },
        { name: 'sharpeningAngle', type: 'text', label: 'Кут загострення (Sharpening Angle)' },
      ],
    },
  ],
  timestamps: true,
}
