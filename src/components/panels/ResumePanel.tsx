'use client'

export default function ResumePanel() {
  return (
    <div className="panel-fade-in w-full h-full flex flex-col">
      <iframe
        src="/resume.pdf"
        title="Dwijesh Dookraz — Resume"
        className="flex-1 w-full border-0"
      />
    </div>
  )
}
