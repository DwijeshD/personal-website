import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Dwijesh Dookraz — Backend Engineer & AI Systems'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #0e1a2e 50%, #0a1628 100%)',
          fontFamily: 'monospace',
          padding: '60px 72px',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #007acc, #4ec9b0, #6366f1)',
          display: 'flex',
        }} />

        {/* VS Code dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, display: 'flex' }} />
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {/* File path */}
          <div style={{ color: '#858585', fontSize: '16px', marginBottom: '24px', display: 'flex' }}>
            portfolio / src / <span style={{ color: '#4ec9b0' }}>&nbsp;README.md</span>
          </div>

          {/* Name */}
          <div style={{ color: '#ffffff', fontSize: '72px', fontWeight: 700, lineHeight: 1.1, marginBottom: '16px', display: 'flex' }}>
            Dwijesh Dookraz
          </div>

          {/* Title */}
          <div style={{ color: '#4ec9b0', fontSize: '28px', marginBottom: '36px', display: 'flex' }}>
            Backend Engineer · AI Systems · Applied ML
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Python', 'FastAPI', 'PyTorch', 'OAuth2', 'Webhooks', 'Deep Learning'].map(tag => (
              <div key={tag} style={{
                background: 'rgba(0, 122, 204, 0.15)',
                border: '1px solid rgba(0, 122, 204, 0.4)',
                borderRadius: '4px',
                padding: '6px 14px',
                color: '#9cdcfe',
                fontSize: '16px',
                display: 'flex',
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px' }}>
          <div style={{ color: '#858585', fontSize: '16px', display: 'flex' }}>
            github.com/DwijeshD
          </div>
          <div style={{ color: '#858585', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ec9b0', display: 'flex' }} />
            Available for opportunities
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
