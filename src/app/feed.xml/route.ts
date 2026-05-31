import { NextResponse } from 'next/server'

export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dwijesh.dev'

const projects = [
  {
    title: 'rPPG Heart Rate Monitor',
    description:
      'Remote photoplethysmography system using deep learning to measure heart rate from webcam video — no wearables required.',
    link: `${SITE_URL}/?file=server.ts`,
    pubDate: 'Mon, 01 Jan 2024 00:00:00 GMT',
  },
  {
    title: 'AI Agent Orchestration Framework',
    description:
      'Autonomous multi-agent system with LLM orchestration, RAG pipelines, and real-time tool integrations.',
    link: `${SITE_URL}/?file=about.md`,
    pubDate: 'Fri, 01 Mar 2024 00:00:00 GMT',
  },
  {
    title: 'Production ML Pipeline',
    description:
      'End-to-end machine learning pipeline with FastAPI serving, Azure Functions, and Firestore — ships models to production.',
    link: `${SITE_URL}/?file=server.ts`,
    pubDate: 'Wed, 01 May 2024 00:00:00 GMT',
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
