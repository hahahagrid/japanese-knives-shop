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
    'sku': id,
    'name': name,
    'description': description,
    'image': image,
    'brand': {
      '@type': 'Brand',
      'name': 'Japanese Kitchen Knives',
    },
    'offers': {
      '@type': 'Offer',
      'url': url,
      'priceCurrency': currency,
      'price': price || 0,
      'availability': `https://schema.org/${availability}`,
      'itemCondition': 'https://schema.org/NewCondition',
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': 0,
          'currency': currency,
        },
        'shippingDestination': {
          '@type': 'DefinedRegion',
          'addressCountry': 'UA',
        },
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'handlingTime': {
            '@type': 'QuantitativeValue',
            'minValue': 0,
            'maxValue': 1,
            'unitCode': 'd',
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': 1,
            'maxValue': 3,
            'unitCode': 'd',
          },
        },
      },
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'applicableCountry': 'UA',
        'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
        'merchantReturnDays': 14,
        'returnMethod': 'https://schema.org/ReturnByMail',
        'returnFees': 'https://schema.org/FreeReturn',
      },
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5.0',
      'reviewCount': '1',
    },
    'review': {
      '@type': 'Review',
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': '5',
      },
      'author': {
        '@type': 'Person',
        'name': 'Verified Customer',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
