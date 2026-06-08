'use client'

import Image from 'next/image'

export function CopilotIcon({ size = 48, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <Image
      src="/vscode-copilot.png"
      width={size}
      height={size}
      alt="Copilot"
      style={{
        filter: `invert(1) ${muted ? 'brightness(0.5)' : 'brightness(1)'}`,
        mixBlendMode: 'screen',
        display: 'block',
      }}
    />
  )
}
