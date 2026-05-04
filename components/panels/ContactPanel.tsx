import { PERSON } from '@/lib/data'

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const links = [
  {
    href: PERSON.github,
    label: 'GitHub',
    sub: 'DwijeshD',
    icon: <GithubIcon />,
    color: 'text-vsc-text',
  },
  {
    href: PERSON.linkedin,
    label: 'LinkedIn',
    sub: 'dwijesh-dookraz',
    icon: <LinkedinIcon />,
    color: 'text-[#0a66c2]',
  },
  {
    href: `mailto:${PERSON.email}`,
    label: 'Email',
    sub: PERSON.email,
    icon: <MailIcon />,
    color: 'text-vsc-string',
  },
]

export default function ContactPanel() {
  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>

        <div className="flex-1 font-mono text-base leading-7 px-4 py-4">
          <div className="token-comment mb-1">{'/* contact.css */'}</div>
          <div className="mb-4">&nbsp;</div>

          <div className="token-comment mb-4">{'/* Reach out — no recruiters offering "exciting opportunities" */'}</div>

          <div className="token-fn mb-1">.contact-links {'{'}</div>
          <div className="pl-6 space-y-4 mt-3 mb-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded border border-vsc-border hover:border-vsc-accent/60 hover:bg-vsc-hover transition-all group"
              >
                <span className={`${l.color} shrink-0`}>{l.icon}</span>
                <div>
                  <div className="token-prop text-sm">{l.label.toLowerCase()}</div>
                  <div className="token-string text-xs">&quot;{l.sub}&quot;</div>
                </div>
                <span className="ml-auto text-vsc-muted group-hover:text-vsc-text transition-colors text-xs">
                  ↗
                </span>
              </a>
            ))}
          </div>
          <div className="token-fn">{'}'}</div>

          <div className="mt-6">&nbsp;</div>
          <div className="token-comment">{`/* Currently open to backend / ML engineer roles */`}</div>
          <div className="token-comment">{`/* Full-time, contract, and interesting projects `}</div>
          <div className="token-comment">{`   — if the problem is hard, I'm interested */`}</div>
        </div>
      </div>
    </div>
  )
}
