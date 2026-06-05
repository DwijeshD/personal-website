export const README_MD = `# portfolio.dwijesh.dev

> An interactive VS Code-themed portfolio. Navigate like an editor. Everything is live.

\`Next.js 15\` · \`TypeScript\` · \`Monaco Editor\` · \`Claude AI\` · \`Vercel\` · \`MIT\`

A portfolio designed to feel exactly like working in VS Code — Monaco editor, live file previews, an AI Copilot, a real terminal, and GitHub integrations. Built as a full-stack Next.js app and deployed on Vercel.

---

## 🚀 Features

- **VS Code shell** — title bar, activity bar, sidebar, tab bar, status bar, all pixel-matched
- **Monaco editor** — full syntax highlighting, IntelliSense, and multi-file editing
- **Live preview** — split-pane view renders HTML, SVG, CSS, TypeScript, and Markdown in real time
- **AI Copilot** — Claude-backed assistant with full context about my background and projects
- **Integrated terminal** — xterm.js-powered with real portfolio commands (\`whoami\`, \`projects\`, \`dino\`)
- **File system** — create, rename, delete files; all state persisted across tabs
- **Source control panel** — GitHub commit count, live branch info via GraphQL API
- **Command palette** — \`Ctrl+Shift+P\` for fuzzy-search navigation
- **Quick open** — \`Ctrl+P\` to jump to any file instantly
- **URL sync** — every open file syncs to \`?file=<name>\` — bookmarkable and shareable
- **PWA** — installable with offline support via service worker
- **SEO** — OpenGraph tags, JSON-LD structured data, sitemap, RSS feed

---

## 🚧 Planned Features

- 💡 Items below represent features that are scoped or in progress
- 🤝 Reach out if you want to see something added

| Status | Feature | Area |
|--------|---------|------|
| 🟡 In progress | Mobile-responsive layout | UI |
| 🟡 In progress | Persist workspace to \`localStorage\` across sessions | Core |
| 🔵 Planned | Theme switcher — Light+, Monokai, Solarized | UI |
| 🔵 Planned | Minimap toggle in editor toolbar | Editor |
| 🔵 Planned | Multi-cursor editing support | Editor |
| 🟣 Idea | Drag-to-reorder tabs | UI |
| 🟣 Idea | File diff view (before / after AI edits) | Editor |
| 🟣 Idea | Vim keybinding mode | Editor |

---

## 🛠️ How to Use

### File Tree
Click any file in the **Explorer** panel to open it in a tab:

| File | Contents |
|------|----------|
| \`home.html\` | Homepage — GitHub activity graph and stats |
| \`about.svg\` | Architecture diagram — production stack |
| \`skills.css\` | Skills breakdown — languages, tools, frameworks |
| \`projects.ts\` | Projects with descriptions and tech stack |
| \`README.md\` | This file |

### Tabs
Open files appear as **tabs** at the top. Click to switch. Middle-click or **×** to close.

### Activity Bar

| Icon | Panel |
|------|-------|
| Files | Explorer — file tree |
| Search | Find text across files |
| Source Control | GitHub commits and branch info |
| Copilot | AI assistant |
| Settings | Theme and font size |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+P\` | Quick open |
| \`Ctrl+Shift+P\` | Command palette |
| \`Ctrl+Shift+I\` | Toggle AI Copilot |
| \`Ctrl+\`\` | Toggle terminal |
| \`Ctrl+B\` | Toggle sidebar |
| \`Ctrl+,\` | Settings |
| \`Ctrl+?\` | Shortcut reference |

### Terminal
Press \`Ctrl+\`\` or click **Terminal** in the bottom panel:

\`\`\`
help        list all commands
whoami      quick bio
skills      list technologies
projects    show projects
contact     contact details
dino        secret game
clear       clear terminal
\`\`\`

---

## 💬 FAQ

#### Why build a portfolio as a VS Code clone?
Most portfolios are static pages. This one is an actual application — it demonstrates the kind of UI engineering, API integration, and system design I do professionally. It also makes navigating a portfolio more interesting than scrolling a landing page.

#### Is the AI Copilot actually intelligent?
Yes — it's backed by Claude (Anthropic) with a custom system prompt giving it full context about my background, projects, and experience. Ask it anything: *"What's your ML stack?"*, *"Are you open to contract work?"*, *"Explain the rPPG project"*.

#### Can I edit the files?
Absolutely. Every file is fully editable in the Monaco editor. Changes stay in your session — the live preview updates in real time. Nothing is persisted server-side.

#### Does the terminal actually run code?
The terminal runs a custom command interpreter — not a real shell. It's designed for portfolio navigation, not arbitrary code execution. For live code execution, use the **Split** view on a \`.ts\` or \`.tsx\` file.

#### What is the rPPG project?
Open \`thesis.md\` (via \`Ctrl+P\`) for a full deep-dive. Short version: a PyTorch implementation of DeepPhys for non-contact heart rate estimation from facial video, with a focus on fairness across skin tones.

#### Is this open source?
The source is on GitHub. Feel free to use it as inspiration — just swap in your own content.

#### How do I contact you?
- **GitHub:** [github.com/DwijeshD](https://github.com/DwijeshD)
- **LinkedIn:** [linkedin.com/in/dwijesh-dookraz](https://linkedin.com/in/dwijesh-dookraz)
- **Email:** dwijeshdookraz1@gmail.com

Or just ask the AI Copilot — it can relay any message.

---

## 📄 License

MIT — see [LICENSE](https://opensource.org/licenses/MIT) for details.

> Currently open to backend / ML engineer roles.
`
