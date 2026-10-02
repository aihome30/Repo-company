import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'PT. Rizki AI - Web Development & Digital Solutions',
    template: '%s | PT. Rizki AI',
  },
  description:
    'Professional web development, backend services, and DevOps solutions for startups, UMKMs, and enterprises.',
  keywords: [
    'web development',
    'software development',
    'digital solutions',
    'startup',
    'UMKM',
    'Indonesia',
  ],
  authors: [{ name: 'PT. Rizki AI' }],
  creator: 'PT. Rizki AI',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'PT. Rizki AI - Web Development & Digital Solutions',
    description:
      'Professional web development, backend services, and DevOps solutions.',
    siteName: 'PT. Rizki AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT. Rizki AI',
    description: 'Professional web development & digital solutions',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
