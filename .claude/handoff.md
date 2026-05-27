# Handoff — Portfolio Website

## Project
VS Code-themed portfolio site. Next.js 15, React 19, TypeScript, Tailwind CSS.
Repo: `DwijeshD/personalwebsite` (GitHub). Local: `c:\Users\dwije\OneDrive\Desktop\Projects\PortfolioWebsite`

---

## Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **AI chat**: OpenRouter API (streaming SSE), `/api/chat` route
- **Bug reporting**: `/api/report-issue` → GitHub Issues API
- **Git status**: `/api/git-status` → GitHub API (commit count via Link header pagination)
- **Editor**: Monaco Editor (dynamic import, `@monaco-editor/react`)
- **Markdown**: `react-markdown` + `remark-gfm` + `rehype-raw`
- **Icons**: material-icon-theme SVGs in `/public/icons/files/`

---

## Last Committed State
Commit `9b63974` — "feat: stop button, no-flash streaming, file icons, settings polish, SEO"
Branch: `main`, up to date with `origin/main`.

---

## Pending — NOT Yet Committed
All of these are modified but unstaged:

| File | Change |
|------|--------|
| `lib/defaultContent.ts` | home.html reverted to minimal VS Code design; app.tsx → about.md content; link-test.html still present (needs removal) |
| `lib/data.ts` | TABS: `file:app.tsx` → `file:about.md` |
| `app/globals.css` | 6 themes replaced: VS Code Dark+, Dracula, Night Owl, One Dark, Monokai, Solarized Dark |
| `components/SettingsPopup.tsx` | THEMES array updated to match new theme IDs and palettes |
| `components/CopilotPanel.tsx` | Empty stream error msg; stop button; no-flash streaming; attach button removed |
| `components/Sidebar.tsx` | Right-click on blank explorer area now opens context menu (New File / New Folder) |
| `app/globals.css` | Theme CSS vars updated |
| `app/api/model-info/` | New route (unknown — check before commit) |
| `.claude/settings.local.json` | Minor settings |
| `tsconfig.tsbuildinfo` | Auto-generated, skip committing |

**Action needed before commit**: remove `link-test.html` from `lib/defaultContent.ts` (last key in the export object, lines ~1055–1148 approx).

---

## What Has Been Built (Full Feature List)

### Core UI
- VS Code layout: ActivityBar, Sidebar (explorer/search/git/copilot panels), TabBar, editor area, terminal
- 6 colour themes: VS Code Dark+, Dracula, Night Owl, One Dark, Monokai, Solarized Dark
- Keyboard shortcuts: Ctrl+P (command palette), Ctrl+B (sidebar), Ctrl+` (terminal), F11 (fullscreen)
- Monaco editor for code files; MarkdownRenderer for `.md`; HTMLRenderer (sandboxed iframe) for `.html`; LiveCodeRenderer for JS preview
- File explorer: create, rename, delete, copy/paste, duplicate files & folders
- Right-click context menu on files AND on blank explorer area
- material-icon-theme SVGs for all file types (80+ extension mappings in `lib/fileIcons.ts`)

### AI Chat (CopilotPanel)
- Streaming chat via OpenRouter (SSE), 25 msg/hr rate limit per IP
- No-flash streaming: plain text during stream → full markdown render after
- Stop button (filled square) aborts fetch mid-stream via AbortController, keeps partial response
- ThinkingIndicator: rotating words (Thinking/Cogitating/Ruminating…)
- Prefetch cache: top 4 suggested queries pre-fetched on panel open for instant first response
- Bug reporting: "I encountered a bug with the website: [desc]" auto-POSTs to `/api/report-issue`, AI confirms issue number
- Bug preset button in welcome screen (5th icon, red on hover)
- Manual bug report widget (keyword trigger → form → GitHub Issue)
- `@filename` mention syntax attaches file content to AI context

### API Routes
- `/api/chat` — OpenRouter streaming, file context injection, rate limiting
- `/api/report-issue` — GitHub Issues creation, 3/hr/IP rate limit
- `/api/git-status` — GitHub API commit count (Link header pagination) + local branch/ahead/behind
- `/api/ai-action` — File CRUD actions from AI (create/update/delete/create_folder)
- `/api/model-info/` — (new, unknown purpose — check)

### Other
- Source control popup: live branch name + total commit count from GitHub API
- Settings popup: theme picker with 3-color swatches, quick actions, keyboard reference
- Command palette (Ctrl+P): fuzzy file search
- SEO: OG image generation, robots.txt, sitemap.ts, metadata in layout.tsx
- Security: CSP headers, rate limiting, VPN/IP blocking hook (settings), prompt injection defense in AI

---

## Deployment Plan (Not Done Yet)
1. Remove `link-test.html` from `lib/defaultContent.ts`
2. Commit + push pending changes
3. Deploy to **Vercel** (free tier) — import `DwijeshD/personalwebsite`
4. Set env vars in Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `GITHUB_ISSUES_TOKEN`
5. Add custom domain `dwijesh.dev` → Vercel Settings → Domains
6. Add DNS records at registrar (Cloudflare recommended, ~$10/yr for `.dev`)
7. SSL auto-provisioned

---

## Key Files

```
app/
  api/
    chat/route.ts          — OpenRouter streaming chat, rate limit, file context
    report-issue/route.ts  — GitHub Issues integration (3/hr/IP)
    git-status/route.ts    — GitHub API commit count + local branch/ahead/behind
    ai-action/route.ts     — File edit actions (create/update/delete/create_folder)
    model-info/            — Unknown new route (check before committing)
  page.tsx                 — Entry point
  globals.css              — Theme CSS vars (6 themes), custom scrollbar, prose-vsc
  layout.tsx               — Root layout, SEO metadata
  opengraph-image.tsx      — OG image generation
  robots.ts / sitemap.ts   — SEO
components/
  VSCodeLayout.tsx         — Main layout orchestrator, keyboard shortcuts, theme state
  Sidebar.tsx              — Explorer (files/folders), search, git, copilot panels
  TabBar.tsx               — Open file tabs with material-icon-theme SVGs
  CopilotPanel.tsx         — AI chat, streaming, stop button, bug reporting
  SettingsPopup.tsx        — Theme picker, quick actions, shortcuts
  SourceControlPopup.tsx   — Live git data display
  CommandPalette.tsx       — Ctrl+P fuzzy file search
  ActivityBar.tsx          — Left icon bar
  panels/FileEditorPanel.tsx — Monaco + renderer switcher (dynamic imports)
  renderers/
    MarkdownRenderer.tsx   — react-markdown + remark-gfm + rehype-raw
    HTMLRenderer.tsx       — Sandboxed srcdoc iframe, link interceptor
    LiveCodeRenderer.tsx   — Live JS preview
lib/
  data.ts                  — PERSON, SKILLS, PROJECTS, EDUCATION, TABS, AI_SYSTEM_PROMPT
  defaultContent.ts        — All file contents (home.html, about.md, styles.css, skills.json, server.ts, README.md)
  fileIcons.ts             — Shared ext → SVG map (80+ mappings)
  fileSystem.ts            — CustomFile/CustomFolder types
public/
  icons/files/             — material-icon-theme SVGs (50+ file type icons)
  icons/dark/              — UI icons
.env.local                 — OPENROUTER_API_KEY, OPENROUTER_MODEL, GITHUB_ISSUES_TOKEN
```

---

## Known Issues / Watch Out
- **`link-test.html` still in `defaultContent.ts`** — remove before committing/deploying
- `app/api/model-info/` returns active OpenRouter model name — low-severity info disclosure, acceptable
- **`GITHUB_ISSUES_TOKEN` PAT was exposed in chat — rotate before prod deploy** (scoped to Issues:write on `personalwebsite` only)
- Free model (`openrouter/free`) has small context window — file attachments may hit limit despite 2500-char truncation
- `app/api/git-status` calls `execSync('git ...')` locally — gracefully falls back to GitHub API in prod (Vercel has no git binary)
- Monaco editor hardcoded to `vs-dark` — does not follow UI theme switcher (intentional)
- `rehype-raw` required for HTML-in-markdown (README badges, `<div align="center">` etc.)

## Security Fixes Applied
- `app/api/report-issue/route.ts`: replaced `x-forwarded-for` (spoofable) with `x-real-ip`/`cf-connecting-ip` — fixes rate-limit bypass
- `app/api/report-issue/route.ts`: added `allowedOrigin` check — blocks cross-origin issue creation
- `app/api/report-issue/route.ts`: GitHub API error message no longer forwarded to client — prevents internal info disclosure
