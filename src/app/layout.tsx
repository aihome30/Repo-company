import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateOrganizationSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'wspend - Web Development & Digital Solutions',
    template: '%s | wspend',
  },
  description:
    'Professional web development, backend services, and DevOps solutions for startups, UMKMs, and enterprises in Indonesia.',
  keywords: [
    'web development',
    'software development',
    'digital solutions',
    'startup',
    'UMKM',
    'Indonesia',
    'backend development',
    'DevOps',
  ],
  authors: [{ name: 'wspend' }],
  creator: 'wspend',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'wspend - Web Development & Digital Solutions',
    description:
      'Professional web development, backend services, and DevOps solutions.',
    siteName: 'wspend',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'wspend',
    description: 'Professional web development & digital solutions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateOrganizationSchema();

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
