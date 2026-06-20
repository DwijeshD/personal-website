import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'optional',
  variable: '--font-jetbrains-mono',
})

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
  verification: { google: 'QchqJ-794tSYJ4m3tCeC2b-wLST5ZQJyjtXasG6vJ2Q' },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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
        width: 1440,
        height: 900,
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
        'OAuth2', 'Webhooks', 'REST APIs', 'Firestore', 'Google Cloud Platform', 'GCP Cloud Run',
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
  '/icons/files/pdf.svg',
  '/icons/files/json.svg',
  '/icons/files/typescript.svg',
  '/icons/files/image.svg',
  // Sidebar folder/file
  '/icons/files/folder.svg',
  '/icons/files/folder-open.svg',
  '/icons/files/file.svg',
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        {/* Preconnect to Monaco CDN — resolves DNS+TLS in parallel with page load */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />

        {/* Preload icon fonts — font-display:block means these block render; starting early cuts wait */}
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fonts/file-icons.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fonts/octicons.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fonts/fontawesome.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fonts/devopicons.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fonts/mfixx.woff2" />

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
        {children}
        <SpeedInsights />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.addEventListener('load',function(){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}")});`,
            }}
          />
        )}
      </body>
    </html>
  )
}
