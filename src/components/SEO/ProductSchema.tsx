import React from 'react'

interface ProductSchemaProps {
  id: string
  name: string
  description?: string
  image?: string
  price?: number
  currency?: string
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock'
  url: string
}

export function ProductSchema({ 
  id, 
  name, 
  description, 
  image, 
  price, 
  currency = 'UAH', 
  availability = 'InStock',
  url
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'ski': id,
    'name': name,
    'description': description,
    'image': image,
    'offers': {
      '@type': 'Offer',
      'url': url,
      'priceCurrency': currency,
      'price': price || 0,
      'availability': `https://schema.org/${availability}`,
      'itemCondition': 'https://schema.org/NewCondition',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
