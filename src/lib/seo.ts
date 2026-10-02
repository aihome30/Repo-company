import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  path?: string;
}

export function generateSEOMetadata(props: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = new URL(props.path || '/', baseUrl);

  return {
    title: props.title,
    description: props.description,
    keywords: props.keywords,
    openGraph: {
      title: props.title,
      description: props.description,
      url: url.toString(),
      type: props.ogType || 'website',
      siteName: 'wspend',
      images: props.ogImage
        ? [{ url: props.ogImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: props.title,
      description: props.description,
      images: props.ogImage ? [props.ogImage] : undefined,
    },
    alternates: {
      canonical: url.toString(),
    },
  };
}

export function generateStructuredData(data: any) {
  return {
    __html: JSON.stringify(data),
  };
}
