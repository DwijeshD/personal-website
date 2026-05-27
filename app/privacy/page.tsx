import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dwijesh Dookraz',
  description: 'Privacy policy for dwijesh.dev — what data is collected and how it is used.',
  robots: { index: true, follow: true },
}

const UPDATED = 'May 2025'
const EMAIL   = 'dwijeshdookraz1@gmail.com'

const lines = [
  { t: 'h1',   s: '# Privacy Policy'                                                                      },
  { t: 'blank'                                                                                              },
  { t: 'meta', s: `> Last updated: ${UPDATED}`                                                             },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 1. Overview'                                                                        },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'This is a personal portfolio website. It is not a commercial service and does not'      },
  { t: 'text', s: 'collect, sell, or share personal data with third parties.'                              },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 2. Data Collected'                                                                  },
  { t: 'blank'                                                                                              },
  { t: 'bold', s: '**IP Addresses**'                                                                       },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'Your IP address is temporarily held in memory to enforce rate limits on the AI chat'    },
  { t: 'text', s: 'and bug report features (e.g. 25 AI messages per hour, 3 bug reports per hour).'        },
  { t: 'text', s: 'This data is never written to disk, never logged, and is discarded when the server'     },
  { t: 'text', s: 'restarts. It is not linked to any other personal information.'                          },
  { t: 'blank'                                                                                              },
  { t: 'bold', s: '**AI Chat Messages**'                                                                   },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'Messages you send in the AI chat panel are forwarded to OpenRouter (openrouter.ai)'     },
  { t: 'text', s: 'to generate responses. They are not stored by this site. OpenRouter\'s own privacy'     },
  { t: 'text', s: 'policy applies to how they handle forwarded messages.'                                   },
  { t: 'blank'                                                                                              },
  { t: 'bold', s: '**Bug Reports**'                                                                        },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'If you submit a bug report, the title and description you provide are posted as a'      },
  { t: 'text', s: 'GitHub Issue on the public repository for this site. Do not include personal or'        },
  { t: 'text', s: 'sensitive information in bug reports.'                                                   },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 3. Cookies & Local Storage'                                                         },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'This site does not set cookies. Browser localStorage may be used to persist your'      },
  { t: 'text', s: 'editor state (open files, theme preference) entirely within your browser. This data'    },
  { t: 'text', s: 'never leaves your device.'                                                              },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 4. Third-Party Services'                                                            },
  { t: 'blank'                                                                                              },
  { t: 'li',   s: '- **OpenRouter** — AI inference provider. See openrouter.ai/privacy'                   },
  { t: 'li',   s: '- **GitHub** — Bug reports are posted as public issues'                                 },
  { t: 'li',   s: '- **Vercel** — Hosting provider. May log requests per their infrastructure policy'      },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 5. AI-Generated Content'                                                            },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'The AI chat assistant may produce inaccurate, incomplete, or outdated responses.'       },
  { t: 'text', s: 'Do not share sensitive, confidential, or personal information in chat messages.'        },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 6. Your Rights'                                                                     },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'Since IP addresses held in memory reset with each deployment and are not persisted,'    },
  { t: 'text', s: 'there is no stored personal data to retrieve or delete. If you have questions,'         },
  { t: 'text', s: `contact: ${EMAIL}`                                                                      },
  { t: 'blank'                                                                                              },
  { t: 'h2',   s: '## 7. Changes'                                                                         },
  { t: 'blank'                                                                                              },
  { t: 'text', s: 'This policy may be updated. The date at the top of this file reflects the last'        },
  { t: 'text', s: 'revision. Continued use of the site constitutes acceptance of the current policy.'     },
]

function renderLine(line: typeof lines[0], i: number) {
  const n = i + 1
  const num = (
    <span className="privacy-ln" aria-hidden="true">{String(n).padStart(3, ' ')}</span>
  )

  if (line.t === 'blank') {
    return (
      <div key={i} className="privacy-row">
        {num}
        <span className="privacy-code">&nbsp;</span>
      </div>
    )
  }

  const cls =
    line.t === 'h1'   ? 'privacy-h1'   :
    line.t === 'h2'   ? 'privacy-h2'   :
    line.t === 'meta' ? 'privacy-meta' :
    line.t === 'bold' ? 'privacy-bold' :
    line.t === 'li'   ? 'privacy-li'   :
    'privacy-text'

  return (
    <div key={i} className="privacy-row">
      {num}
      <span className={`privacy-code ${cls}`}>{line.s}</span>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div className="privacy-root">
      {/* Title bar */}
      <div className="privacy-titlebar">
        <span className="privacy-titlebar-dots">
          <span /><span /><span />
        </span>
        <span className="privacy-titlebar-name">privacy.md — Dwijesh Dookraz</span>
        <Link href="/" className="privacy-back">← back to portfolio</Link>
      </div>

      {/* Tab bar */}
      <div className="privacy-tabs">
        <div className="privacy-tab privacy-tab-active">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2h7l4 4v8H2V2z" fill="#519aba" opacity=".8"/>
            <path d="M9 2v4h4" fill="none" stroke="#519aba" strokeWidth="1.2" opacity=".5"/>
          </svg>
          <span>privacy.md</span>
          <span className="privacy-tab-close">×</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="privacy-breadcrumb">
        <span>portfolio</span>
        <span className="privacy-bc-sep">›</span>
        <span>privacy.md</span>
      </div>

      {/* Editor */}
      <div className="privacy-editor">
        <div className="privacy-lines">
          {lines.map((line, i) => renderLine(line, i))}
        </div>
      </div>

      {/* Status bar */}
      <div className="privacy-statusbar">
        <span>Markdown</span>
        <span className="privacy-sb-sep" />
        <span>UTF-8</span>
        <span className="privacy-sb-sep" />
        <span>LF</span>
        <span className="privacy-sb-right">
          <a href={`mailto:${EMAIL}`} className="privacy-sb-email">{EMAIL}</a>
        </span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .privacy-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
          font-size: 13px;
          line-height: 1.6;
          overflow: hidden;
        }

        /* Title bar */
        .privacy-titlebar {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 38px;
          background: #323233;
          padding: 0 16px;
          flex-shrink: 0;
          user-select: none;
        }
        .privacy-titlebar-dots {
          display: flex; gap: 6px;
        }
        .privacy-titlebar-dots span {
          width: 12px; height: 12px; border-radius: 50%;
          background: #555;
        }
        .privacy-titlebar-dots span:nth-child(1) { background: #ff5f57; }
        .privacy-titlebar-dots span:nth-child(2) { background: #febc2e; }
        .privacy-titlebar-dots span:nth-child(3) { background: #28c840; }
        .privacy-titlebar-name {
          flex: 1;
          text-align: center;
          color: #cccccc;
          font-size: 12px;
          letter-spacing: 0.01em;
        }
        .privacy-back {
          color: #858585;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.03em;
          transition: color 0.15s;
        }
        .privacy-back:hover { color: #cccccc; }

        /* Tabs */
        .privacy-tabs {
          display: flex;
          background: #252526;
          border-bottom: 1px solid #1e1e1e;
          flex-shrink: 0;
          height: 35px;
          align-items: stretch;
        }
        .privacy-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          font-size: 12px;
          color: #969696;
          border-right: 1px solid #1e1e1e;
          cursor: default;
          user-select: none;
        }
        .privacy-tab-active {
          background: #1e1e1e;
          color: #d4d4d4;
          border-top: 1px solid #007acc;
        }
        .privacy-tab-close {
          color: #555;
          margin-left: 4px;
          font-size: 14px;
          line-height: 1;
        }

        /* Breadcrumb */
        .privacy-breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 16px;
          background: #1e1e1e;
          border-bottom: 1px solid #2d2d2d;
          font-size: 11px;
          color: #858585;
          flex-shrink: 0;
        }
        .privacy-bc-sep { color: #555; }

        /* Editor */
        .privacy-editor {
          flex: 1;
          overflow-y: auto;
          overflow-x: auto;
          padding: 12px 0 32px;
          scroll-behavior: smooth;
        }
        .privacy-editor::-webkit-scrollbar { width: 8px; }
        .privacy-editor::-webkit-scrollbar-track { background: #1e1e1e; }
        .privacy-editor::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }

        /* Lines */
        .privacy-lines { display: flex; flex-direction: column; }

        .privacy-row {
          display: flex;
          align-items: baseline;
          min-height: 22px;
          padding-right: 32px;
        }
        .privacy-row:hover { background: rgba(255,255,255,0.03); }

        .privacy-ln {
          display: inline-block;
          width: 52px;
          min-width: 52px;
          text-align: right;
          padding-right: 20px;
          color: #495162;
          font-size: 12px;
          user-select: none;
          flex-shrink: 0;
        }
        .privacy-row:hover .privacy-ln { color: #858585; }

        .privacy-code {
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 13px;
          line-height: 22px;
        }

        /* Syntax colours */
        .privacy-h1   { color: #569cd6; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
        .privacy-h2   { color: #4ec9b0; font-weight: 500; }
        .privacy-meta { color: #6a9955; font-style: italic; }
        .privacy-bold { color: #ce9178; font-weight: 500; }
        .privacy-li   { color: #d4d4d4; }
        .privacy-li::before { content: ''; }
        .privacy-text { color: #9cdcfe; }

        /* Status bar */
        .privacy-statusbar {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 24px;
          background: #007acc;
          padding: 0 12px;
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          flex-shrink: 0;
          user-select: none;
          letter-spacing: 0.02em;
        }
        .privacy-sb-sep {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.25);
        }
        .privacy-sb-right {
          margin-left: auto;
        }
        .privacy-sb-email {
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          transition: color 0.15s;
        }
        .privacy-sb-email:hover { color: #fff; }

        @media (max-width: 600px) {
          .privacy-titlebar-name { display: none; }
          .privacy-ln { width: 36px; min-width: 36px; padding-right: 12px; }
          .privacy-code { font-size: 12px; }
        }
      `}</style>
    </div>
  )
}
