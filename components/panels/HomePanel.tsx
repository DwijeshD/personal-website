'use client'

import { useEffect, useState } from 'react'
import { PERSON } from '@/lib/data'

const ROLES = [
  { label: 'Backend Engineer',  color: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40' },
  { label: 'AI Systems Builder', color: 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/40' },
  { label: 'Applied ML',        color: 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/40' },
  { label: 'Nusmark',           color: 'bg-[#ec4899]/15 text-[#ec4899] border-[#ec4899]/40' },
]

const STATS = [
  { value: 'BSc CS',  label: 'First Class Honours' },
  { value: '5+',      label: 'Projects Shipped' },
  { value: '∞',       label: 'Curiosity' },
  { value: '↑',       label: 'Always Learning' },
]

const SOCIALS = [
  {
    label: 'GitHub',
    href: PERSON.github,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: PERSON.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: `mailto:${PERSON.email}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
]

function useTyping(strings: string[], speed = 80, pause = 2000) {
  const [text, setText] = useState('')
  const [idx, setIdx]   = useState(0)
  const [del, setDel]   = useState(false)

  useEffect(() => {
    const target = strings[idx]
    const t = setTimeout(() => {
      if (!del) {
        if (text.length < target.length) setText(target.slice(0, text.length + 1))
        else setTimeout(() => setDel(true), pause)
      } else {
        if (text.length > 0) setText(target.slice(0, text.length - 1))
        else { setDel(false); setIdx((i) => (i + 1) % strings.length) }
      }
    }, del ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [text, del, idx, strings, speed, pause])

  return text
}

const TYPED_ROLES = ['"Backend Engineer"', '"AI Systems Builder"', '"Applied ML Practitioner"']

export default function HomePanel({ onNavigate }: { onNavigate: (id: string) => void }) {
  const typed = useTyping(TYPED_ROLES)

  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="min-h-full flex flex-col justify-center px-12 py-10 max-w-3xl">

        {/* Big name */}
        <div className="mb-6">
          <div className="text-[11px] font-mono text-vsc-muted mb-3 tracking-widest uppercase">
            // Hello, World! 👋
          </div>
          <h1
            className="font-black leading-none tracking-tight mb-1"
            style={{
              fontSize: 'clamp(52px, 8vw, 96px)',
              background: 'linear-gradient(135deg, #ffffff 0%, #9cdcfe 40%, #569cd6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            DWIJESH
          </h1>
          <h1
            className="font-black leading-none tracking-tight"
            style={{
              fontSize: 'clamp(52px, 8vw, 96px)',
              background: 'linear-gradient(135deg, #569cd6 0%, #ce9178 60%, #dcdcaa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            DOOKRAZ
          </h1>
        </div>

        {/* Typed role */}
        <div className="font-mono text-sm text-vsc-muted mb-5">
          <span className="token-keyword">const </span>
          <span className="token-var">role </span>
          <span className="token-operator">= </span>
          <span className="token-string">{typed}</span>
          <span className="cursor-blink">|</span>
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ROLES.map((r) => (
            <span
              key={r.label}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${r.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {r.label}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-vsc-text/70 text-sm leading-6 mb-8 max-w-xl font-mono">
          {PERSON.tagline}
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 flex-wrap mb-10">
          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2 px-5 py-2.5 bg-vsc-accent hover:bg-vsc-accent-hover text-white rounded-lg text-sm font-mono font-medium transition-all shadow-lg shadow-vsc-accent/20 hover:shadow-vsc-accent/40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            View Projects
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="flex items-center gap-2 px-5 py-2.5 border border-vsc-border text-vsc-text hover:bg-vsc-hover hover:border-vsc-accent/50 rounded-lg text-sm font-mono transition-all"
          >
            About Me
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center gap-2 px-5 py-2.5 border border-vsc-border text-vsc-text hover:bg-vsc-hover hover:border-vsc-accent/50 rounded-lg text-sm font-mono transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-vsc-sidebar border border-vsc-border rounded-lg px-4 py-3 text-center hover:border-vsc-accent/40 transition-colors"
            >
              <div className="text-xl font-bold text-vsc-accent font-mono">{s.value}</div>
              <div className="text-[11px] text-vsc-muted mt-0.5 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-vsc-border rounded-lg text-xs text-vsc-muted hover:text-vsc-text hover:border-vsc-accent/50 hover:bg-vsc-hover transition-all font-mono"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
