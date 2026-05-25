import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dwijesh.dev'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Dwijesh Dookraz — Backend Engineer & AI Systems',
  description:
    'Backend engineer and applied ML practitioner. BSc Computer Science (First Class Honours), University of Southampton. Building production-grade APIs, AI pipelines, and automation systems.',
  keywords: [
    'Dwijesh Dookraz', 'backend engineer', 'AI systems', 'machine learning',
    'Python', 'FastAPI', 'PyTorch', 'rPPG', 'software engineer', 'portfolio',
    'University of Southampton', 'applied ML', 'deep learning',
  ],
  authors: [{ name: 'Dwijesh Dookraz', url: SITE_URL }],
  creator: 'Dwijesh Dookraz',
  robots: { index: true, follow: true },
  icons: {
    icon: '/vscode-icon.png',
    apple: '/vscode-icon.png',
  },
  openGraph: {
    title: 'Dwijesh Dookraz — Backend Engineer & AI Systems',
    description:
      'Backend engineer and applied ML practitioner. Building production-grade APIs, AI pipelines, and deep learning systems.',
    type: 'profile',
    url: SITE_URL,
    siteName: 'Dwijesh Dookraz — Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dwijesh Dookraz — Backend Engineer & AI Systems',
      },
    ],
    firstName: 'Dwijesh',
    lastName: 'Dookraz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dwijesh Dookraz — Backend Engineer & AI Systems',
    description:
      'Backend engineer and applied ML practitioner. Building production-grade APIs, AI pipelines, and deep learning systems.',
    images: ['/og-image.png'],
    creator: '@DwijeshD',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dwijesh Dookraz',
  url: SITE_URL,
  email: 'dwijeshdookraz1@gmail.com',
  sameAs: [
    'https://github.com/DwijeshD',
    'https://linkedin.com/in/dwijesh-dookraz',
  ],
  jobTitle: 'Backend Engineer',
  description:
    'Backend engineer and applied ML practitioner. BSc Computer Science (First Class Honours) from the University of Southampton.',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Southampton',
  },
  knowsAbout: [
    'Python', 'FastAPI', 'Flask', 'PyTorch', 'Deep Learning',
    'OAuth2', 'Webhooks', 'REST APIs', 'Firestore', 'Azure Functions',
    'rPPG', 'Signal Processing', 'Machine Learning',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
