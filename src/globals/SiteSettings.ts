import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'telegramUrl', type: 'text' },
    { name: 'workHours', type: 'text', admin: { description: 'Наприклад: Пн-Пт 10:00-19:00' } },
    { name: 'address', type: 'text' },
  ],
}
