'use client'

export default function ResumePanel() {
  return (
    <div className="panel-fade-in w-full h-full flex flex-col">
      {/* Some visitors have Adobe Acrobat set as their browser's PDF handler,
          which can fail to render inline in an iframe (blank panel / trust
          prompt) instead of using the browser's own viewer. Always offer an
          escape hatch rather than trying to detect it. */}
      <div className="shrink-0 px-3 py-1.5 text-xs text-vsc-muted bg-vsc-bg border-b border-vsc-border/20 flex items-center justify-between">
        <span>Having trouble viewing?</span>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-vsc-accent hover:underline">
          Open in new tab
        </a>
      </div>
      <iframe
        src="/resume.pdf"
        title="Dwijesh Dookraz — Resume"
        className="flex-1 w-full border-0"
      />
    </div>
  )
}
