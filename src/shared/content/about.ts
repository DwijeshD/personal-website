export const ABOUT_MD = `# Portfolio — VS Code Edition

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
`
