'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  chart: string
}

let mermaidInitialised = false

export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default

        if (!mermaidInitialised) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              primaryColor: '#007acc',
              primaryTextColor: '#d4d4d4',
              primaryBorderColor: '#3c3c3c',
              lineColor: '#569cd6',
              secondaryColor: '#252526',
              tertiaryColor: '#1e1e1e',
              background: '#1e1e1e',
              mainBkg: '#252526',
              nodeBorder: '#3c3c3c',
              clusterBkg: '#2d2d2d',
              titleColor: '#d4d4d4',
              edgeLabelBackground: '#252526',
              fontFamily: "'JetBrains Mono', Consolas, monospace",
              fontSize: '13px',
            },
          })
          mermaidInitialised = true
        }

        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg: rendered } = await mermaid.render(id, chart.trim())

        if (!cancelled) setSvg(rendered)
      } catch (e) {
        if (!cancelled) setError(String(e))
      }
    }

    render()
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <pre className="text-red-400 text-xs p-3 bg-[#1e1e1e] rounded border border-red-800">
        {error}
      </pre>
    )
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center py-8 text-[#6c6c6c] text-sm">
        rendering diagram…
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
