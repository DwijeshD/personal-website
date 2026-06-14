import { NextResponse } from 'next/server'

export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dwijesh.dev'

const projects = [
  {
    title: 'VS Code Portfolio',
    description:
      'Personal portfolio built as an interactive VS Code environment — Monaco Editor, file tree, integrated terminal, GitHub integration, and an AI copilot. Built with Next.js 15, TypeScript, and deployed on Vercel.',
    link: `${SITE_URL}/?file=projects.ts`,
    pubDate: 'Wed, 01 Jan 2026 00:00:00 GMT',
  },
  {
    title: 'Hybrid Recommender System',
    description:
      'Two-approach recommender built from scratch in pure Python + NumPy. Combines collaborative filtering and matrix factorisation with streaming SGD — scales to 20M ratings. MAE 0.587 on MovieLens.',
    link: `${SITE_URL}/?file=projects.ts`,
    pubDate: 'Sun, 01 Mar 2026 00:00:00 GMT',
  },
  {
    title: 'Heart Rate Estimation via rPPG',
    description:
      'Final-year dissertation implementing DeepPhys for non-contact heart rate estimation from facial video. Collected custom dataset spanning Fitzpatrick II–VI to address demographic gaps in public benchmarks.',
    link: `${SITE_URL}/?file=projects.ts`,
    pubDate: 'Sun, 01 Jun 2025 00:00:00 GMT',
  },
  {
    title: 'Gene Expression Analysis — Osteosarcoma',
    description:
      'ML and statistical genomics pipeline on GSE1000 microarray data. LDA + Random Forest + differential expression converge on the same ECM regulatory signature across 22,283 probes.',
    link: `${SITE_URL}/?file=projects.ts`,
    pubDate: 'Sat, 01 Mar 2025 00:00:00 GMT',
  },
  {
    title: 'Nusmark — AI Productivity Platform',
    description:
      'AI-powered productivity platform with calendar sync (Google + Outlook), WhatsApp AI assistant, multi-channel notifications, and internal analytics. Deployed on GCP Cloud Run.',
    link: `${SITE_URL}/?file=projects.ts`,
    pubDate: 'Sun, 01 Dec 2024 00:00:00 GMT',
  },
  {
    title: 'Semantic Word Cluster Discovery',
    description:
      'Discovers optimal semantic clusters in a 17M-token Wikipedia corpus using co-occurrence embeddings, UMAP reduction, and silhouette-guided K-means — without ground-truth labels. Optimal k=7, validation silhouette 0.698.',
    link: `${SITE_URL}/?file=projects.ts`,
    pubDate: 'Sat, 01 Jun 2024 00:00:00 GMT',
  },
]

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function GET() {
  const items = projects
    .map(
      p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <description>${escapeXml(p.description)}</description>
      <link>${escapeXml(p.link)}</link>
      <guid>${escapeXml(p.link)}</guid>
      <pubDate>${p.pubDate}</pubDate>
    </item>`,
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dwijesh Dookraz — Portfolio</title>
    <link>${SITE_URL}</link>
    <description>Backend engineer and applied ML practitioner. Projects and updates.</description>
    <language>en-gb</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
