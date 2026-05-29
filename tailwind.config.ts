import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vsc: {
          bg:             '#1e1e1e',
          sidebar:        '#252526',
          activitybar:    '#333333',
          titlebar:       '#1a1a1a',
          'tab-active':   '#1e1e1e',
          'tab-inactive': '#2d2d2d',
          'tab-border':   '#252526',
          statusbar:      '#007acc',
          border:         '#454545',
          selection:      '#264f78',
          hover:          '#2a2d2e',
          input:          '#3c3c3c',
          text:           '#d4d4d4',
          muted:          '#858585',
          keyword:        '#569cd6',
          string:         '#ce9178',
          number:         '#b5cea8',
          fn:             '#dcdcaa',
          type:           '#4ec9b0',
          comment:        '#6a9955',
          operator:       '#d4d4d4',
          accent:         '#007acc',
          'accent-hover': '#1a8ad4',
          'panel-hdr':    '#252526',
          red:            '#f44747',
          yellow:         '#ffcc00',
          green:          '#89d185',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: '11px',
        sm: '12px',
        base: '13px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}

export default config
