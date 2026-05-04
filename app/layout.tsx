import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dwijesh Dookraz — Portfolio',
  description:
    'Backend engineer and applied ML practitioner. Building production-grade systems, AI pipelines, and automation tools.',
  openGraph: {
    title: 'Dwijesh Dookraz — Portfolio',
    description: 'Backend engineer · AI Systems · Applied ML',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
