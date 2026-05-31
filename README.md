# Dwijesh Dookraz — Portfolio

A personal portfolio built as a fully functional VS Code clone running in the browser. Visitors interact with it exactly like an IDE — browse files, edit code live, run terminal commands, and chat with an AI assistant that answers questions about my work.

**Live:** [dwijesh.dev](https://dwijesh.dev)

---

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # SSE streaming chat (OpenRouter, edge runtime)
│   │   ├── ai-action/route.ts     # Structured file-action endpoint
│   │   ├── report-issue/route.ts  # GitHub Issues integration
│   │   ├── git-status/route.ts    # Live commit count via GitHub API
│   │   └── model-info/route.ts    # AI model display name
│   ├── globals.css                # Theme variables, scrollbar styles
│   ├── layout.tsx                 # Root layout + SEO metadata + analytics
│   └── page.tsx                   # Entry → VSCodeLayout
│
├── components/
│   ├── layout/
│   │   ├── VSCodeLayout.tsx       # Root shell — wires all panels + state
│   │   ├── ActivityBar.tsx        # Left icon rail
│   │   ├── TitleBar.tsx           # Menu bar (File / Edit / View / …)
│   │   ├── TabBar.tsx             # Open file tabs
│   │   ├── Sidebar.tsx            # Explorer + Search panels
│   │   └── StatusBar.tsx          # Bottom status line
│   ├── panels/
│   │   ├── FileEditorPanel.tsx    # Monaco editor + renderer switcher
│   │   ├── BottomPanel.tsx        # Terminal + Problems panel
│   │   └── ResumePanel.tsx        # PDF resume viewer
│   ├── renderers/
│   │   ├── MarkdownRenderer.tsx   # react-markdown + rehype-sanitize
│   │   ├── HTMLRenderer.tsx       # Sandboxed iframe preview
│   │   ├── SVGRenderer.tsx        # SVG preview (script-isolated)
│   │   ├── TxtRenderer.tsx        # Plain text viewer
│   │   └── LiveCodeRenderer.tsx   # JS/TS/CSS/JSON live execution
│   ├── overlays/
│   │   ├── CommandPalette.tsx     # Ctrl+P fuzzy file search
│   │   ├── AiActionModal.tsx      # AI file-action confirmation
│   │   ├── SettingsPopup.tsx      # Theme picker + quick actions
│   │   └── SourceControlPopup.tsx # Git status + commit count
│   └── modals/
│       ├── AboutModal.tsx
│       └── KeyboardShortcutsModal.tsx
│
├── features/
│   ├── copilot/                   # AI chat — streaming, file attach, intent detection
│   ├── sidebar/                   # File tree, search, context menu, git status
│   ├── terminal/                  # Interactive terminal + built-in commands
│   └── renderer/                  # Syntax highlight + TypeScript stripping
│
├── hooks/
│   ├── useEditorState.ts          # File system, tabs, content
│   ├── usePanelState.ts           # Panel visibility, themes, zoom
│   ├── useKeyboardShortcuts.ts    # Global keybindings
│   ├── useResizablePanel.ts       # Drag-to-resize terminal
│   ├── useGitStatus.ts            # Live GitHub commit count
│   └── useEditorPrefetch.ts       # Prefetch renderer chunks
│
├── lib/
│   ├── fileSystem.ts              # File/folder types + AI action validation
│   ├── monacoConfig.ts            # Monaco language + diagnostics config
│   ├── contextBuilder.ts          # Keyword-triggered AI context injection
│   ├── rateLimit.ts               # In-memory rate limiter (25 req/day per IP)
│   ├── diagnostics.ts             # Problems panel error/warning computation
│   └── profile.ts                 # Static portfolio data
│
└── shared/
    ├── content/                   # Default file contents (home.html, about.md, …)
    └── utils/api/security.ts      # Origin allowlist + VPN/proxy detection
```

## Features

| Feature | Detail |
|---|---|
| Monaco editor | Real syntax highlighting, multi-language, same engine as VS Code |
| File renderers | Markdown (sanitized), HTML (sandboxed), SVG, TXT, live JS/TS/CSS/JSON |
| Split view | Code / Split / Preview per tab |
| File system | Create, rename, delete files and folders in-browser |
| AI copilot | OpenRouter SSE streaming, `@file` attachment, edit intent detection, confirmation modal |
| Terminal | Interactive fake shell — `help`, `ls`, `whoami`, `skills`, `projects`, `contact`, `neofetch`, and more |
| Command palette | `Ctrl+P` fuzzy file search |
| Source control | Live GitHub API commit count, branch display |
| Bug reporting | Files GitHub Issues via authenticated API |
| Themes | 6 VS Code themes — Dark+, Dracula, Night Owl, One Dark, Monokai, Solarized Dark |
| Security | CSP headers, origin allowlist, rehype-sanitize, iframe sandboxing, VPN detection, rate limiting |
| Analytics | Vercel Analytics + Speed Insights, Microsoft Clarity |
| SEO | Open Graph, Twitter cards, JSON-LD schema, RSS feed, sitemap, robots.txt |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 — App Router, Edge Runtime |
| UI | React 19, TypeScript (strict), Tailwind CSS v4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-sanitize` |
| AI | OpenRouter API — SSE streaming |
| Error tracking | Sentry |
| Analytics | Vercel Analytics, Vercel Speed Insights, Microsoft Clarity |
| Deployment | Vercel |

## Running Locally

```bash
# 1. Clone
git clone https://github.com/DwijeshD/personalwebsite
cd personalwebsite

# 2. Install
npm install

# 3. Environment
cp .env.local.example .env.local
# Fill in the required variables (see below)

# 4. Dev server
npm run dev
# → http://localhost:3000
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | AI chat + file actions — [openrouter.ai/keys](https://openrouter.ai/keys) |
| `OPENROUTER_MODEL` | No | Model override (defaults to a free model) |
| `GITHUB_ISSUES_TOKEN` | No | Bug report filing — needs `issues: write` scope |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL (defaults to `https://dwijesh.dev`) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | No | Microsoft Clarity project ID |

## Deployment

```
main → Production (dwijesh.dev)
feature branches → Preview URLs (*-dwijesh.vercel.app)
```

Push to a feature branch to get an automatic Vercel preview. Merge to `main` to deploy to production.

## Contact

**Dwijesh Dookraz** · [dwijeshdookraz1@gmail.com](mailto:dwijeshdookraz1@gmail.com) · [GitHub](https://github.com/DwijeshD) · [LinkedIn](https://linkedin.com/in/dwijesh-dookraz)
