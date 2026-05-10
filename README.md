# Dwijesh Dookraz — Portfolio

A personal portfolio built as a fully functional VS Code clone. Visitors interact with it exactly like an IDE: browse files, edit code live, run commands in the terminal, and chat with an AI assistant that answers questions about my work.

**Live:** _coming soon_

---

## Architecture

```
app/                        # Next.js App Router
├── api/
│   ├── chat/route.ts       # SSE streaming chat endpoint (OpenRouter)
│   └── ai-action/route.ts  # Structured file-action endpoint
├── globals.css             # Theme variables, syntax tokens, font-face
├── layout.tsx              # Root layout + metadata
└── page.tsx                # Entry point → VSCodeLayout

components/
├── VSCodeLayout.tsx         # Root shell — wires all panels together
├── ActivityBar.tsx          # Left icon rail (Explorer, Search, Git, Copilot)
├── TitleBar.tsx             # Menu bar (File / Edit / View / …)
├── TabBar.tsx               # Open file tabs
├── Sidebar.tsx              # Explorer + Search panels, file tree with font icons
├── StatusBar.tsx            # Bottom status line
├── CopilotPanel.tsx         # AI chat panel with prefetch cache
├── CommandPalette.tsx       # Ctrl+P quick-open
├── BottomPanel.tsx          # Terminal panel
├── TerminalTab.tsx          # Fake interactive terminal
├── SourceControlPopup.tsx   # Git popup (branch, live commits)
├── SettingsPopup.tsx        # Theme switcher + settings
├── MenuBar.tsx              # Dropdown menu system
├── AiActionModal.tsx        # AI file-action confirmation dialog
├── modals/
│   ├── AboutModal.tsx
│   └── KeyboardShortcutsModal.tsx
├── panels/
│   ├── FileEditorPanel.tsx  # Monaco editor + split preview
│   ├── SourceControlPanel.tsx  # Git history (live GitHub API)
│   └── ResumePanel.tsx
└── renderers/
    ├── MarkdownRenderer.tsx  # react-markdown with GFM
    ├── HTMLRenderer.tsx      # Sandboxed iframe preview
    └── LiveCodeRenderer.tsx  # JS/TS/CSS/JSON live preview

lib/
├── data.ts                  # Static portfolio content (tabs, skills, projects)
├── profileContext.ts        # AI context data (identity, experience, projects)
├── contextBuilder.ts        # Builds per-request AI context from profile
├── defaultContent.ts        # Default file contents for each tab
├── fileSystem.ts            # File/folder types + AI action validation
└── monacoConfig.ts          # Monaco language + diagnostics config

public/
└── fonts/                   # file-icons extension WOFF2 fonts (5 families)
    ├── file-icons.woff2
    ├── fontawesome.woff2
    ├── devopicons.woff2
    ├── octicons.woff2
    └── mfixx.woff2
```

## Key Features

| Feature | Implementation |
|---|---|
| Monaco editor | `@monaco-editor/react`, lazy-loaded, dark theme |
| Split preview | Code / Split / Preview per file tab |
| File tree icons | file-icons extension fonts (5 WOFF2 families, PUA chars) |
| AI copilot | OpenRouter streaming SSE, prefetch cache for zero-latency first reply |
| Live terminal | Fake shell with built-in commands (`help`, `ls`, `cat`, `skills`, `contact`) |
| Source control | Live GitHub API commits, fallback to hardcoded history |
| Themes | CSS variables, 6 themes (Default, Rosé Pine, Tokyo Night, Catppuccin, Nord, Gruvbox) |
| Security | CSP headers, origin allowlist, prompt injection defence, AI action confirmation modal |

## Tech Stack

- **Framework:** Next.js 15 (App Router, Edge runtime for API routes)
- **UI:** React 19, Tailwind CSS 3
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **AI:** OpenRouter (`openrouter/free` model) via SSE streaming
- **Markdown:** `react-markdown` + `remark-gfm`
- **Language:** TypeScript (strict mode)

## Running Locally

```bash
# 1. Clone
git clone https://github.com/DwijeshD/personalwebsite
cd personalwebsite

# 2. Install
npm install

# 3. Environment
cp .env.local.example .env.local
# Add your OpenRouter API key (free at openrouter.ai/keys)

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
| `npm run type-check` | TypeScript check (no emit) |
| `npm run lint` | ESLint |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | Free key from [openrouter.ai](https://openrouter.ai/keys) |

## Contact

**Dwijesh Dookraz** · [dwijeshdookraz1@gmail.com](mailto:dwijeshdookraz1@gmail.com) · [GitHub](https://github.com/DwijeshD) · [LinkedIn](https://linkedin.com/in/dwijesh-dookraz)
