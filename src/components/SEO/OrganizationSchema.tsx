export function OrganizationSchema({ phone, email }: { phone?: string | null; email?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Japanese Kitchen Knives | Преміальні японські ножі',
    'url': 'https://japanese-kitchen-knives.com.ua',
    'logo': 'https://japanese-kitchen-knives.com.ua/favicon.svg',
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': phone || '',
        'email': email || '',
        'contactType': 'customer service',
        'availableLanguage': ['Ukrainian', 'English']
      }
    ],
    'description': 'Інтернет-магазин преміальних японських ножів ручної роботи від найкращих майстрів.'
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
