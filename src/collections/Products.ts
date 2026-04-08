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
import { syncMediaAlt } from '../hooks/syncMediaAlt'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Товар',
    plural: 'Товари',
  },
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
    afterChange: [revalidateProduct, syncMediaAlt],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      label: 'Назва',
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
      label: 'Тип товару',
      type: 'select',
      index: true,
      options: [
        { label: 'Ніж', value: 'knife' },
        { label: 'Аксесуар', value: 'accessory' },
      ],
      defaultValue: 'knife',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      index: true,
      options: [
        { label: 'В наявності', value: 'in_stock' },
        { label: 'Під замовлення', value: 'custom_order' },
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
      label: 'Категорія',
      type: 'relationship',
      relationTo: 'categories',
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'images',
      label: 'Зображення',
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
      label: 'Опис',
      type: 'richText',
    },
    {
      name: 'specs',
      label: 'Характеристики',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'knife',
      },
      fields: [
        { name: 'manufacturer', type: 'text', label: 'Виробник' },
        { name: 'country', type: 'text', label: 'Країна виробник' },
        { name: 'steel', type: 'text', label: 'Матеріал клинка / Сталь' },
        { name: 'hardness', type: 'text', label: 'Твердість сталі (HRC)' },
        { name: 'bladeLength', type: 'text', label: 'Довжина клинка (мм)' },
        { name: 'edgeLength', type: 'text', label: 'Довжина РК (мм)' },
        { name: 'handleLength', type: 'text', label: "Довжина руків'я (мм)" },
        { name: 'totalLength', type: 'text', label: 'Загальна довжина (мм)' },
        { name: 'bladeHeight', type: 'text', label: 'Висота клинка (мм)' },
        { name: 'thickness', type: 'text', label: 'Товщина клинка (мм)' },
        { name: 'weight', type: 'text', label: 'Вага (г)' },
        { name: 'finish', type: 'text', label: 'Обробка клинка' },
        { name: 'layers', type: 'text', label: 'Кількість шарів' },
        { name: 'handleMaterial', type: 'text', label: "Матеріал руків'я" },
        { name: 'bolster', type: 'text', label: 'Матеріал больстера' },
        { name: 'sharpeningAngle', type: 'text', label: 'Кут загострення' },
      ],
    },
  ],
  timestamps: true,
}
