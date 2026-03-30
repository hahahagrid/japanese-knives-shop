import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Налаштування сайту',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('site-settings')],
  },
  fields: [
    { name: 'contactEmail', label: 'Email для зв\'язку', type: 'email' },
    { name: 'contactPhone', label: 'Контактний телефон', type: 'text' },
    { name: 'instagramUrl', label: 'Instagram', type: 'text', admin: { description: 'Повне посилання на ваш Instagram (н.п. https://instagram.com/user)' } },
    { name: 'telegramUrl', label: 'Telegram', type: 'text', admin: { description: 'Повне посилання на ваш Telegram (н.п. https://t.me/user)' } },
    { name: 'youtubeUrl', label: 'YouTube', type: 'text', admin: { description: 'Повне посилання на ваш YouTube (н.п. https://youtube.com/@user)' } },
    { name: 'workHours', label: 'Графік роботи', type: 'text', admin: { description: 'Наприклад: Пн-Пт 10:00-19:00' } },
    { name: 'address', label: 'Адреса / Загальна локація', type: 'text' },
  ],
}
