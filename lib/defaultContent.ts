export const DEFAULT_CONTENT: Record<string, string> = {

  'home.html': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dwijesh Dookraz</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Consolas, 'Courier New', monospace;
    background: #1e1e1e;
    color: #d4d4d4;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 48px;
  }
  .page { max-width: 720px; width: 100%; }
  .eyebrow {
    font-size: 11px;
    color: #6a9955;
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .name {
    font-size: clamp(48px, 9vw, 88px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -.02em;
    margin-bottom: 4px;
  }
  .n1 {
    background: linear-gradient(135deg, #fff 0%, #9cdcfe 40%, #569cd6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .n2 {
    background: linear-gradient(135deg, #569cd6 0%, #ce9178 60%, #dcdcaa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .code-line { font-size: 13px; color: #6c6c6c; margin: 20px 0 24px; }
  .kw { color: #569cd6; }
  .var { color: #9cdcfe; }
  .str { color: #ce9178; }
  .cursor { color: #aeafad; animation: blink 1s step-end infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
  }
  .pill::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: .7;
    flex-shrink: 0;
  }
  .pa { color: #f59e0b; background: rgba(245,158,11,.1); border-color: rgba(245,158,11,.3); }
  .pp { color: #a855f7; background: rgba(168,85,247,.1); border-color: rgba(168,85,247,.3); }
  .pb { color: #3b82f6; background: rgba(59,130,246,.1); border-color: rgba(59,130,246,.3); }
  .pk { color: #ec4899; background: rgba(236,72,153,.1); border-color: rgba(236,72,153,.3); }
  .tagline {
    font-size: 13px;
    color: rgba(212,212,212,.65);
    line-height: 1.8;
    max-width: 480px;
    margin-bottom: 32px;
  }
  .ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
  a.bp {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #0e639c;
    color: #fff;
    border: none;
    border-radius: 6px;
    font: 600 13px Consolas, monospace;
    text-decoration: none;
    transition: background .15s;
  }
  a.bp:hover { background: #1177bb; }
  a.bs {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: transparent;
    color: #d4d4d4;
    border: 1px solid #3c3c3c;
    border-radius: 6px;
    font: 13px Consolas, monospace;
    text-decoration: none;
    transition: border-color .15s, background .15s;
  }
  a.bs:hover { border-color: #0e639c; background: rgba(14,99,156,.1); }
  .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 32px; }
  .stat {
    background: #252526;
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: center;
    transition: border-color .15s;
  }
  .stat:hover { border-color: rgba(14,99,156,.5); }
  .sv { font-size: 20px; font-weight: 700; color: #0e639c; }
  .sl { font-size: 10px; color: #6c6c6c; text-transform: uppercase; letter-spacing: .1em; margin-top: 2px; }
  .links { display: flex; flex-wrap: wrap; gap: 8px; }
  a.lnk {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    font-size: 12px;
    color: #6c6c6c;
    text-decoration: none;
    transition: color .15s, border-color .15s, background .15s;
  }
  a.lnk:hover { color: #d4d4d4; border-color: rgba(14,99,156,.5); background: rgba(14,99,156,.05); }
</style>
</head>
<body>
<div class="page">
  <div class="eyebrow">// Hello, World! &#128075;</div>
  <div class="name">
    <div class="n1">DWIJESH</div>
    <div class="n2">DOOKRAZ</div>
  </div>
  <div class="code-line">
    <span class="kw">const </span><span class="var">role </span>= <span class="str">"Backend Engineer"</span><span class="cursor">|</span>
  </div>
  <div class="pills">
    <span class="pill pa">Backend Engineer</span>
    <span class="pill pp">AI Systems Builder</span>
    <span class="pill pb">Applied ML</span>
    <span class="pill pk">Nusmark</span>
  </div>
  <p class="tagline">I build production-grade backend systems, AI pipelines, and automation tools that operate on real data, real users, and real constraints.</p>
  <div class="ctas">
    <a class="bp" href="#">&#8960;/&#8960; View Projects</a>
    <a class="bs" href="#">About Me</a>
    <a class="bs" href="#">&#9993; Contact</a>
  </div>
  <div class="stats">
    <div class="stat"><div class="sv">BSc CS</div><div class="sl">First Class Honours</div></div>
    <div class="stat"><div class="sv">5+</div><div class="sl">Projects Shipped</div></div>
    <div class="stat"><div class="sv">&#8734;</div><div class="sl">Curiosity</div></div>
    <div class="stat"><div class="sv">&#8593;</div><div class="sl">Always Learning</div></div>
  </div>
  <div class="links">
    <a class="lnk" href="https://github.com/DwijeshD" target="_blank">GitHub</a>
    <a class="lnk" href="https://linkedin.com/in/dwijesh-dookraz" target="_blank">LinkedIn</a>
    <a class="lnk" href="mailto:dwijeshdookraz1@gmail.com" target="_blank">Email</a>
  </div>
</div>
</body>
</html>`,

  'about.md': `# Portfolio — VS Code Edition

> A developer portfolio built as a functional VS Code environment running entirely in the browser.

**Dwijesh Dookraz** · [GitHub](https://github.com/DwijeshD) · [LinkedIn](https://linkedin.com/in/dwijesh-dookraz) · [dwijeshdookraz1@gmail.com](mailto:dwijeshdookraz1@gmail.com)

---

## What This Is

This is not a standard portfolio page. It is a **VS Code replica running in the browser** — complete with a real file system, a Monaco code editor, live preview renderers, a Copilot-style AI assistant, and interactive file tabs.

Every part of this portfolio is navigable like a codebase. Open files, edit code, switch themes, use the command palette, and chat with the AI — all inside what looks and behaves like VS Code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 — App Router, Edge Runtime |
| UI Library | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Code Editor | Monaco Editor (\`@monaco-editor/react\`) |
| Markdown | \`react-markdown\` + \`remark-gfm\` + \`rehype-raw\` |
| AI Backend | OpenRouter API — SSE streaming |
| File Icons | material-icon-theme SVGs (80+ types) |
| Deployment | Vercel |

---

## Features

### Editor
- **Monaco Editor** — real syntax highlighting, multi-language, same engine as VS Code
- **Live HTML Preview** — HTML files render in a sandboxed iframe with link interception
- **Live React Preview** — \`.tsx\` files execute in-browser via Babel standalone
- **Split View** — toggle between code, preview, or both side-by-side

### File System
- Create, rename, and delete files and folders in the sidebar
- File icons driven by material-icon-theme (extension-aware)

### Navigation
- **Command Palette** — \`Ctrl+P\` fuzzy file search
- **Tab Bar** — open multiple files, close with \`×\`, scroll on overflow
- **Activity Bar** — Explorer, Search, Source Control, AI Assistant panels

### AI Assistant
- Copilot-style streaming chat powered by OpenRouter
- Attach files via \`@filename\` mention — AI reads full file content
- Edit intent detection — phrases like "edit", "refactor", "update X file" trigger the AI action pipeline
- Confirmation modal before any file change is applied
- Context injection — AI receives relevant profile info based on query keywords
- Rate limited: 25 chat messages / day per IP

### Appearance
- **6 themes** — VS Code Dark+, Dracula, Night Owl, One Dark, Monokai, Solarized Dark
- Settings panel with theme picker and keyboard reference
- StatusBar showing current file, branch, and git commit count

### Infrastructure
- Source Control panel — live commit count from GitHub API
- Bug reporting — files GitHub Issues via authenticated API call
- VPN/proxy detection and rate limiting on all API routes
- SEO — Open Graph, Twitter cards, structured metadata

---

## Project Structure

\`\`\`
app/
  page.tsx                     Entry — renders VSCodeLayout
  api/
    chat/route.ts              Streaming chat (OpenRouter, edge runtime)
    ai-action/route.ts         File edit actions via AI (create/update/delete)
    report-issue/route.ts      GitHub Issues integration
    git-status/route.ts        Live commit count via GitHub API

components/
  VSCodeLayout.tsx             Root — tab state, keyboard shortcuts, file system
  ActivityBar.tsx              Left icon strip
  Sidebar.tsx                  Explorer, search, git panels
  TabBar.tsx                   Open file tabs with close buttons
  CopilotPanel.tsx             AI chat — streaming, file attachment, action detection
  CommandPalette.tsx           Ctrl+P fuzzy file navigator
  SettingsPopup.tsx            Theme picker, quick actions, keyboard reference
  SourceControlPopup.tsx       Git status display
  panels/FileEditorPanel.tsx   Monaco + renderer switcher
  renderers/
    MarkdownRenderer.tsx       react-markdown + rehype-raw
    HTMLRenderer.tsx           srcdoc iframe with link interceptor
    LiveCodeRenderer.tsx       Live React/JS preview via Babel

lib/
  data.ts                      PERSON, SKILLS, PROJECTS, EDUCATION, TABS, AI_SYSTEM_PROMPT
  defaultContent.ts            All default file contents
  fileIcons.ts                 Extension → material-icon SVG path map
  contextBuilder.ts            Keyword-triggered context injection for AI
  rateLimit.ts                 In-memory rate limiter (25 req/day per IP)
\`\`\`

---

## Files in This Editor

| File | Purpose |
|---|---|
| \`home.html\` | Landing page — introduction and links |
| \`about.md\` | This file — how the portfolio works |
| \`styles.css\` | Design system — VS Code Dark colour palette |
| \`skills.json\` | Skills data — languages, frameworks, tools |
| \`server.ts\` | Backend sample — Nusmark calendar API |
| \`README.md\` | Personal README — projects and experience |

---

## AI Action Pipeline

When the AI detects edit intent in a message:

\`\`\`
User message → intent detection (keyword match)
  → POST /api/ai-action
  → model returns { action, path, content }
  → AiActionModal shown (diff preview)
  → user confirms → VSCodeLayout applies change
\`\`\`

Supported actions: \`create_file\`, \`update_file\`, \`delete_file\`, \`create_folder\`

---

## Environment Variables

| Variable | Purpose |
|---|---|
| \`OPENROUTER_API_KEY\` | AI chat and file edit actions |
| \`GITHUB_ISSUES_TOKEN\` | Bug report filing (Issues: write scope) |

---

## Contact

Open to backend and ML engineering roles.

| | |
|---|---|
| GitHub | [github.com/DwijeshD](https://github.com/DwijeshD) |
| LinkedIn | [linkedin.com/in/dwijesh-dookraz](https://linkedin.com/in/dwijesh-dookraz) |
| Email | [dwijeshdookraz1@gmail.com](mailto:dwijeshdookraz1@gmail.com) |
`,

  'styles.css': `/* VS Code Dark — Design System
   Edit this file to see the preview update live. */

:root {
  --bg:      #1e1e1e;
  --surface: #252526;
  --border:  #3c3c3c;
  --accent:  #0e639c;
  --accent2: #1177bb;
  --text:    #d4d4d4;
  --muted:   #6c6c6c;
  --green:   #6a9955;
  --teal:    #4ec9b0;
  --blue:    #9cdcfe;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
}

/* ── Header ─────────────────────── */
.header {
  padding: 20px 32px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

h1 {
  font-size: 22px;
  font-weight: 900;
  color: var(--blue);
  letter-spacing: -.01em;
}

.subtitle {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

/* ── Layout ─────────────────────── */
.container {
  padding: 32px;
  max-width: 800px;
}

section { margin-bottom: 40px; }

h2 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--green);
  margin-bottom: 16px;
}

h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 6px;
}

/* ── Cards ──────────────────────── */
.flex { display: flex; gap: 12px; }

.card {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  transition: border-color .15s, transform .15s;
}

.card:hover {
  border-color: rgba(14, 99, 156, .5);
  transform: translateY(-1px);
}

.badge {
  display: inline-block;
  font-size: 10px;
  color: #dcdcaa;
  background: rgba(220, 220, 170, .1);
  border: 1px solid rgba(220, 220, 170, .25);
  border-radius: 4px;
  padding: 2px 8px;
  margin-bottom: 10px;
}

.content {
  font-size: 12px;
  color: rgba(212, 212, 212, .6);
  line-height: 1.7;
  margin-bottom: 14px;
}

/* ── Lists ──────────────────────── */
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

li {
  padding-left: 18px;
  position: relative;
  font-size: 13px;
  color: rgba(212, 212, 212, .75);
}

li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #569cd6;
}

/* ── Interactive ─────────────────── */
a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }

button {
  padding: 7px 14px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  font: 12px Consolas, monospace;
  cursor: pointer;
  transition: background .15s;
}

button:hover { background: var(--accent2); }

input[type="text"] {
  padding: 8px 12px;
  background: #2d2d2d;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font: 13px Consolas, monospace;
  outline: none;
  width: 100%;
  transition: border-color .15s;
}

input[type="text"]:focus { border-color: var(--accent); }
input[type="text"]::placeholder { color: var(--muted); }

.item { margin-top: 12px; }

strong { color: var(--text); font-weight: 600; }`,

  'skills.json': `{
  "languages": ["Python", "Java", "JavaScript", "TypeScript", "Haskell", "C"],
  "backend": ["Flask", "FastAPI", "REST API Design"],
  "systems": ["Webhooks", "OAuth2", "Event-Driven Architecture"],
  "databases": ["Firestore", "NoSQL Patterns"],
  "cloud": ["Azure Functions", "Serverless Architecture"],
  "aiml": [
    "PyTorch",
    "Deep Learning",
    "Signal Processing (rPPG)",
    "Model Training Pipelines",
    "Optuna",
    "scikit-learn"
  ],
  "data": [
    "Feature Engineering",
    "Preprocessing",
    "MAE Evaluation",
    "k-Fold Cross-Validation"
  ],
  "tools": ["Git", "Docker", "API Integrations", "Automation Systems"]
}`,

  'server.ts': `// server.ts — Nusmark Calendar Platform

interface Endpoint {
  method: string
  path: string
  description: string
}

const API_VERSION: string = 'v1'
const BASE_URL: string = 'https://api.nusmark.com'

const endpoints: Endpoint[] = [
  { method: 'POST',   path: '/auth/google',           description: 'Initiate Google OAuth2 flow'          },
  { method: 'POST',   path: '/auth/outlook',          description: 'Initiate Microsoft OAuth2 flow'       },
  { method: 'GET',    path: '/calendar/events',       description: 'List synced calendar events'          },
  { method: 'POST',   path: '/calendar/sync',         description: 'Trigger manual sync'                  },
  { method: 'DELETE', path: '/calendar/events/:id',   description: 'Remove a calendar event'              },
  { method: 'POST',   path: '/webhooks/google',       description: 'Handle Google push notification'      },
  { method: 'POST',   path: '/webhooks/outlook',      description: 'Handle Microsoft change notification' },
  { method: 'GET',    path: '/health',                description: 'Service health check'                 },
]

console.log(BASE_URL + '/api/' + API_VERSION)
console.log('─────────────────────────────────────────────────────────────')
console.log('')
endpoints.forEach(({ method, path, description }) => {
  console.log('  ' + method.padEnd(8) + path.padEnd(28) + description)
})
console.log('')
console.warn('Stack: Python · FastAPI · Firestore · OAuth2 · Webhooks · Azure')`,

  'README.md': `# Dwijesh Dookraz

**Software Engineer — Backend, AI Systems, Applied Machine Learning**

---

## About

Computer Science graduate (First Class Honours) from the University of Southampton.
Focused on backend engineering and applied machine learning. I work on systems where theory meets
reality — APIs, webhooks, OAuth flows, distributed data handling, and ML models deployed on
imperfect data.

## Stack

- **Next.js 15** · App Router · Edge Runtime
- **React 19** · TypeScript · Tailwind CSS
- **OpenRouter** · llama-3.3-70b · SSE streaming
- **Monaco Editor** · Syntax highlighting · Live preview

## Projects

| Project | Stack | Status |
|---------|-------|--------|
| AI Calendar Integration | Python, FastAPI, OAuth2, Webhooks | Production |
| rPPG Heart Rate Prediction | PyTorch, Deep Learning | 82% |
| ML Pipelines | PyTorch, Optuna, k-Fold CV | Research |
| Recommender System | Matrix Factorization, SGD | Complete |
| Gene Expression Analysis | scikit-learn, PCA | Complete |

## Contact

- **GitHub:** https://github.com/DwijeshD
- **Email:** dwijeshdookraz1@gmail.com
- **LinkedIn:** https://linkedin.com/in/dwijesh-dookraz

> Currently open to backend / ML engineer roles.
`,
}
