import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dwijesh.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date('2026-06-09'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date('2026-06-09'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
