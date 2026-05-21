import type { NextConfig } from 'next'
import path from 'path'

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
      // Next.js App Router requires unsafe-inline; Monaco loads from jsdelivr CDN
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      // Tailwind and Google Fonts need unsafe-inline + font CDN
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com data:",
      // External image services used by README badges + GitHub profile widgets
      "img-src 'self' data: blob: https://capsule-render.vercel.app https://readme-typing-svg.demolab.com https://media.giphy.com https://img.shields.io https://github-profile-summary-cards.vercel.app https://github-readme-streak-stats.herokuapp.com https://github-readme-activity-graph.vercel.app https://komarev.com https://raw.githubusercontent.com",
      // Client calls own API; Monaco fetches workers/types from jsdelivr CDN
      "connect-src 'self' https://cdn.jsdelivr.net",
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
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
