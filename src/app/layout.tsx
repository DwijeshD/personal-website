import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClarityInit from '@/components/analytics/ClarityInit'

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
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
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
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Dwijesh Dookraz — Portfolio',
      description:
        'Portfolio of Dwijesh Dookraz — backend engineer and applied ML practitioner.',
      author: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'Portfolio — VS Code',
      applicationCategory: 'DeveloperApplication',
      url: SITE_URL,
      description:
        'Interactive portfolio built as a VS Code clone — Monaco editor, file tree, AI copilot, and terminal.',
      author: { '@id': `${SITE_URL}/#person` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    },
  ],
}

const PRELOAD_ICONS = [
  // Activity bar (visible immediately)
  '/icons/dark/files.svg',
  '/icons/dark/search.svg',
  '/icons/dark/source-control.svg',
  '/icons/dark/settings-gear.svg',
  // Default tab file icons
  '/icons/files/html.svg',
  '/icons/files/markdown.svg',
  '/icons/files/css.svg',
  '/icons/files/json.svg',
  '/icons/files/typescript.svg',
  // Sidebar folder/file
  '/icons/files/folder.svg',
  '/icons/files/folder-open.svg',
  '/icons/files/file.svg',
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {PRELOAD_ICONS.map(href => (
          <link key={href} rel="preload" as="image" type="image/svg+xml" href={href} />
        ))}
        <link rel="alternate" type="application/rss+xml" title="Dwijesh Dookraz — Portfolio" href="/feed.xml" />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <ClarityInit projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID} />
        )}
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </body>
    </html>
  )
}
