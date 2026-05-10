'use client'

import { PERSON } from '@/lib/data'

export default function ResumePanel() {
  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-16 h-16 rounded-lg bg-[#e44d26]/10 border border-[#e44d26]/30 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e44d26" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>

        <div>
          <div className="text-vsc-text font-semibold text-base mb-1">Dwijesh_Dookraz_Resume.pdf</div>
          <div className="text-vsc-muted text-sm">Resume not hosted yet.</div>
        </div>

        <a
          href={`mailto:${PERSON.email}?subject=Resume Request`}
          className="flex items-center gap-2 px-4 py-2 rounded bg-vsc-accent/10 border border-vsc-accent/30 text-vsc-accent hover:bg-vsc-accent/20 transition-colors text-sm"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Request via email
        </a>
      </div>
    </div>
  )
}
