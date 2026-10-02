export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PT. Rizki AI',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    description: 'Professional web development and digital solutions for startups, UMKMs, and enterprises',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jakarta',
      addressCountry: 'ID',
    },
    sameAs: [
      'https://twitter.com/pt-rizki-ai',
      'https://linkedin.com/company/pt-rizki-ai',
      'https://github.com/pt-rizki-ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'hello@pt-rizki-ai.com',
      telephone: '+62-812-3456-7890',
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  image?: string;
  price?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image: service.image,
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'IDR',
      },
    }),
    provider: {
      '@type': 'Organization',
      name: 'PT. Rizki AI',
    },
  };
}
