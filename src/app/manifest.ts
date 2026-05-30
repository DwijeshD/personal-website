import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dwijesh Dookraz — Portfolio',
    short_name: 'Dwijesh.dev',
    description:
      'Backend engineer and applied ML practitioner. BSc Computer Science (First Class Honours), University of Southampton.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1e1e',
    theme_color: '#1e1e1e',
    icons: [
      { src: '/vscode-icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/vscode-icon.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
