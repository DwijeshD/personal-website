export const DEFAULT_CONTENT: Record<string, string> = {

  'home.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dwijesh Portfolio</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    *{
      margin:0;
      padding:0;
      box-sizing:border-box;
    }

    body{
      background:#121212;
      color:#f5f5f5;
      font-family:'Space Grotesk',sans-serif;
      overflow-x:hidden;
    }

    .noise{
      position:fixed;
      inset:0;
      opacity:.03;
      background-image:url("https://grainy-gradients.vercel.app/noise.svg");
      pointer-events:none;
    }

    .container{
      max-width:1200px;
      margin:auto;
      padding:80px 60px;
    }

    .fade{
      opacity:0;
      transform:translateY(25px);
      animation:fadeUp 1s forwards;
    }

    .fade:nth-child(1){animation-delay:.2s;}
    .fade:nth-child(2){animation-delay:.5s;}
    .fade:nth-child(3){animation-delay:.8s;}
    .fade:nth-child(4){animation-delay:1.1s;}
    .fade:nth-child(5){animation-delay:1.4s;}

    @keyframes fadeUp{
      to{
        opacity:1;
        transform:translateY(0);
      }
    }

    .top-text{
      color:#d7ff38;
      font-family:'JetBrains Mono',monospace;
      font-size:15px;
      margin-bottom:30px;
      letter-spacing:1px;
    }

    .hero{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:50px;
      min-height:70vh;
    }

    .left{
      flex:1;
    }

    .name{
      font-size:7rem;
      line-height:.9;
      font-weight:700;
      letter-spacing:-5px;
    }

    .name-top{
      color:#f0e8c4;
    }

    .name-bottom{
      color:#ff5a3c;
    }

    .tags{
      display:flex;
      gap:12px;
      flex-wrap:wrap;
      margin-top:35px;
    }

    .tag{
      border:1px solid rgba(255,255,255,.15);
      padding:10px 18px;
      border-radius:10px;
      background:rgba(255,255,255,.03);
      backdrop-filter:blur(10px);
      font-size:14px;
      color:#ddd;
      transition:.3s;
    }

    .tag:hover{
      transform:translateY(-3px);
      border-color:#ff5a3c;
    }

    .typing-wrapper{
      margin-top:40px;
      height:40px;
      display:flex;
      align-items:center;
    }

    .typing{
      font-size:1.2rem;
      color:#d7ff38;
      font-family:'JetBrains Mono',monospace;
      white-space:nowrap;
      overflow:hidden;
      border-right:2px solid #d7ff38;
      width:0;
      animation:
        typing 4s steps(40,end) infinite,
        blink .8s infinite;
    }

    @keyframes typing{
      0%{width:0}
      40%{width:100%}
      60%{width:100%}
      100%{width:0}
    }

    @keyframes blink{
      50%{
        border-color:transparent;
      }
    }

    .description{
      margin-top:35px;
      color:#b9b9b9;
      line-height:1.8;
      max-width:650px;
      font-size:1.05rem;
    }

    .buttons{
      margin-top:40px;
      display:flex;
      gap:18px;
      flex-wrap:wrap;
    }

    .btn{
      padding:15px 28px;
      border:none;
      cursor:pointer;
      font-size:15px;
      border-radius:12px;
      transition:.3s;
      font-weight:500;
    }

    .btn-primary{
      background:#f0b52d;
      color:#111;
    }

    .btn-secondary{
      background:transparent;
      border:1px solid rgba(255,255,255,.2);
      color:white;
    }

    .btn:hover{
      transform:translateY(-4px);
      opacity:.9;
    }

    .right{
      flex:1;
      display:flex;
      justify-content:center;
      align-items:center;
    }

    .glass-card{
      width:420px;
      height:420px;
      border-radius:30px;
      background:linear-gradient(
        145deg,
        rgba(255,255,255,.08),
        rgba(255,255,255,.02)
      );

      border:1px solid rgba(255,255,255,.08);

      backdrop-filter:blur(25px);

      position:relative;
      overflow:hidden;

      box-shadow:
        0 0 50px rgba(255,90,60,.08),
        inset 0 0 50px rgba(255,255,255,.02);

      animation:float 5s ease-in-out infinite;
    }

    @keyframes float{
      0%,100%{
        transform:translateY(0px);
      }
      50%{
        transform:translateY(-15px);
      }
    }

    .orb{
      position:absolute;
      border-radius:50%;
      filter:blur(20px);
    }

    .orb1{
      width:180px;
      height:180px;
      background:#ff5a3c;
      top:-30px;
      right:-30px;
      opacity:.35;
    }

    .orb2{
      width:140px;
      height:140px;
      background:#d7ff38;
      bottom:20px;
      left:20px;
      opacity:.2;
    }

    .mini-terminal{
      position:absolute;
      inset:40px;
      border-radius:20px;
      background:#0d0d0d;
      padding:25px;
      font-family:'JetBrains Mono',monospace;
      color:#ddd;
      border:1px solid rgba(255,255,255,.06);
    }

    .line{
      margin-bottom:18px;
      opacity:0;
      animation:fadeTerminal .5s forwards;
    }

    .line:nth-child(1){animation-delay:2s;}
    .line:nth-child(2){animation-delay:2.5s;}
    .line:nth-child(3){animation-delay:3s;}
    .line:nth-child(4){animation-delay:3.5s;}

    @keyframes fadeTerminal{
      to{
        opacity:1;
      }
    }

    .green{
      color:#d7ff38;
    }

    .orange{
      color:#ff5a3c;
    }

    .blue{
      color:#64b5ff;
    }

    .stats{
      margin-top:80px;
      display:grid;
      grid-template-columns:repeat(4,1fr);
      border:1px solid rgba(255,255,255,.08);
      border-radius:20px;
      overflow:hidden;
      background:rgba(255,255,255,.02);
    }

    .stat{
      padding:40px;
      text-align:center;
      border-right:1px solid rgba(255,255,255,.05);
    }

    .stat:last-child{
      border-right:none;
    }

    .stat h2{
      font-size:2.5rem;
      color:#f0e8c4;
    }

    .stat p{
      margin-top:10px;
      color:#888;
      letter-spacing:2px;
      font-size:12px;
    }

    @media(max-width:1000px){

      .hero{
        flex-direction:column;
      }

      .name{
        font-size:5rem;
      }

      .glass-card{
        width:100%;
        max-width:420px;
      }

      .stats{
        grid-template-columns:1fr 1fr;
      }
    }

    @media(max-width:700px){

      .container{
        padding:40px 25px;
      }

      .name{
        font-size:3.8rem;
      }

      .stats{
        grid-template-columns:1fr;
      }
    }

  </style>
</head>

<body>

<div class="noise"></div>

<div class="container">

  <div class="top-text fade">
    // hello world !! welcome to my portfolio
  </div>

  <section class="hero">

    <div class="left">

      <div class="fade">
        <h1 class="name">
          <span class="name-top">Dwijesh</span><br>
          <span class="name-bottom">Dookraz</span>
        </h1>
      </div>

      <div class="tags fade">
        <div class="tag">Backend Engineer</div>
        <div class="tag">AI / ML Dev</div>
        <div class="tag">Systems Design</div>
        <div class="tag">Python Engineer</div>
      </div>

      <div class="typing-wrapper fade">
        <div class="typing">
          Exploring LLMs & RAG pipelines 🤖
        </div>
      </div>

      <p class="description fade">
        I build scalable AI systems, autonomous agents, and backend
        infrastructure. Focused on production-grade software engineering,
        local LLM orchestration, RAG pipelines, real-time integrations,
        and machine learning systems that actually ship.
      </p>

      <div class="buttons fade">
        <button class="btn btn-primary">Projects</button>
        <button class="btn btn-secondary">About Me</button>
        <button class="btn btn-secondary">Contact</button>
      </div>

    </div>

    <div class="right fade">

      <div class="glass-card">

        <div class="orb orb1"></div>
        <div class="orb orb2"></div>

        <div class="mini-terminal">

          <div class="line">
            <span class="green">$</span> boot portfolio.sh
          </div>

          <div class="line">
            Initialising <span class="orange">AI agents</span>...
          </div>

          <div class="line">
            Loading <span class="blue">LLM infrastructure</span>...
          </div>

          <div class="line">
            Status: <span class="green">ONLINE</span>
          </div>

        </div>

      </div>

    </div>

  </section>

  <section class="stats fade">

    <div class="stat">
      <h2>3+</h2>
      <p>YEARS BUILDING</p>
    </div>

    <div class="stat">
      <h2>20+</h2>
      <p>PROJECTS</p>
    </div>

    <div class="stat">
      <h2>AI</h2>
      <p>AUTOMATION</p>
    </div>

    <div class="stat">
      <h2>∞</h2>
      <p>ALWAYS LEARNING</p>
    </div>

  </section>

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
