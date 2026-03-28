import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'instagramUrl', type: 'text', admin: { description: 'Повне посилання на ваш Instagram (н.п. https://instagram.com/user)' } },
    { name: 'telegramUrl', type: 'text', admin: { description: 'Повне посилання на ваш Telegram (н.п. https://t.me/user)' } },
    { name: 'youtubeUrl', type: 'text', admin: { description: 'Повне посилання на ваш YouTube (н.п. https://youtube.com/@user)' } },
    { name: 'workHours', type: 'text', admin: { description: 'Наприклад: Пн-Пт 10:00-19:00' } },
    { name: 'address', type: 'text' },
  ],
}
