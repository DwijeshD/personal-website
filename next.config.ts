import type { NextConfig } from 'next'
import path from 'path'
import { withSentryConfig } from '@sentry/nextjs'
import withBundleAnalyzer from '@next/bundle-analyzer'

const analyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Disallow embedding this site in any frame
  { key: 'X-Frame-Options', value: 'DENY' },
  // Leak only origin on same-origin, nothing cross-origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not used by this site
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  // Force HTTPS for 1 year (only meaningful behind HTTPS)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Disable DNS prefetch leakage
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js App Router requires unsafe-inline; Monaco loads from jsdelivr CDN; Microsoft Clarity
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.clarity.ms",
      // Tailwind and Google Fonts need unsafe-inline + font CDN
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com data:",
      // External image services used by README badges + GitHub profile widgets
      "img-src 'self' data: blob: https://capsule-render.vercel.app https://readme-typing-svg.demolab.com https://media.giphy.com https://img.shields.io https://skillicons.dev https://github-profile-summary-cards.vercel.app https://github-readme-streak-stats.herokuapp.com https://github-readme-activity-graph.vercel.app https://komarev.com https://raw.githubusercontent.com",
      // Client calls own API; Monaco fetches from jsdelivr; Clarity telemetry; Sentry error reporting
      "connect-src 'self' https://cdn.jsdelivr.net https://www.clarity.ms https://*.clarity.ms https://*.ingest.sentry.io https://*.ingest.de.sentry.io",
      // Monaco editor spawns web workers via blob: URLs
      "worker-src blob: 'self'",
      // No plugins (Flash etc.)
      "object-src 'none'",
      // Prevent base-tag injection
      "base-uri 'self'",
      // Prevent form hijacking
      "form-action 'self'",
      // Block this site from being embedded anywhere
      "frame-ancestors 'none'",
      // Sandboxed iframes in the HTML preview are data: URIs / srcdoc — allow frames but only same-origin
      "frame-src 'self' blob:",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    // Security headers without framing restrictions (used as a base for PDF routes)
    const securityHeadersNoFrame = securityHeaders.filter(
      (h) => h.key !== 'X-Frame-Options' && h.key !== 'Content-Security-Policy'
    )

    // CSP for PDF routes: identical to the global CSP but with frame-ancestors 'self'
    const pdfCSP = securityHeaders
      .find((h) => h.key === 'Content-Security-Policy')!
      .value.replace("frame-ancestors 'none'", "frame-ancestors 'self'")

    return [
      {
        // Apply full security headers to all non-PDF routes
        source: '/((?!.*\\.pdf).*)',
        headers: securityHeaders,
      },
      {
        // For PDF routes: allow same-origin framing, keep all other security headers
        source: '/:path*.pdf',
        headers: [
          ...securityHeadersNoFrame,
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: pdfCSP },
        ],
      },
    ]
  },
}

export default analyze(withSentryConfig(nextConfig, {
  org: "dwijesh-dookraz",
  project: "personal-portfolio-website",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
}));
