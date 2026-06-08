'use client'

interface Props {
  src: string
  title?: string
}

export default function PDFRenderer({ src, title = 'PDF Document' }: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      <iframe
        src={src}
        title={title}
        className="flex-1 w-full border-0 bg-[#1e1e1e]"
        referrerPolicy="no-referrer"
      />
      <div className="shrink-0 flex justify-center py-2 border-t border-vsc-border/20 bg-vsc-bg">
        <a
          href={src}
          download
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] rounded text-vsc-muted hover:text-vsc-text hover:bg-vsc-hover transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  )
}
