<div align="center">

# VS Code Portfolio

**An interactive VS Code environment — not a static page.**

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,vscode,vercel,sentry,github,git,jest,eslint" />
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_API-181717?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel_Analytics-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" />
  <img src="https://img.shields.io/badge/Mermaid-FF3670?style=for-the-badge&logo=mermaid&logoColor=white" />
</p>

</div>

![Preview](/.github/assets/preview.png)

## Overview

This portfolio is a browser-based VS Code-style environment.

Instead of presenting my work through a normal static landing page, the site gives visitors an interactive developer workspace. Users can browse files, open tabs, inspect project data, use a Monaco-powered editor, view rendered previews, run terminal commands, and ask an AI copilot about my background and technical work.

The interface itself is part of the portfolio. It demonstrates frontend architecture, UI state management, API integration, developer tooling, analytics, monitoring, deployment, and performance-aware design.

> **Goal:** make the portfolio feel like real software, not a generic personal website.

---

## Core Idea

Most portfolios show project cards.

This portfolio behaves like a small web-based IDE.

| Standard Portfolio | VS Code Portfolio |
|---|---|
| Static sections | Interactive file workspace |
| Scroll-based navigation | Explorer, tabs, terminal, and command palette |
| Plain project cards | Structured project files and live previews |
| Basic contact page | Terminal commands, GitHub integration, and AI copilot |
| Claims technical skill | Demonstrates technical skill through the product itself |

The design is intentionally familiar to developers because it borrows the structure of VS Code: activity bar, sidebar, editor tabs, main editor area, terminal, and status bar.

---

## Features

| Feature | Description |
|---|---|
| **VS Code Shell** | Activity bar, sidebar, editor tabs, editor area, terminal, and status bar |
| **Monaco Editor** | Syntax-highlighted viewing for files such as HTML, SVG, TypeScript, Markdown, and JSON |
| **Live Preview** | Selected files can render visually inside the app |
| **Project Explorer** | Browse portfolio content through a file-tree interface |
| **AI Copilot** | Ask questions about projects, skills, experience, and background |
| **Integrated Terminal** | Run portfolio and system commands such as `whoami`, `skills`, `projects`, `timeline`, `contact`, `ls`, `open`, `architecture`, `stack`, `logs`, `deploy`, `monitor`, and `theme` |
| **GitHub Integration** | Uses GitHub data to support repository and contribution information |
| **Query Param File Routing** | Open files are shareable through `?file=filename.ext` |
| **Keyboard Navigation** | Supports VS Code-style shortcuts for faster navigation |
| **Command Palette** | Quickly access actions and workspace commands |
| **Status Bar** | Shows current file and editor state |
| **Analytics Layer** | Tracks usage and visitor behaviour using lightweight analytics |
| **Monitoring Layer** | Captures errors and runtime issues through Sentry |
| **Performance Insights** | Measures real-world loading and interaction performance |
| **Testing Setup** | Supports linting, unit tests, and browser-level tests |
| **Vercel Deployment** | Uses Vercel for production hosting and preview deployments |

---

## Tech Stack

### Core

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" />
</p>

| Technology | Role | Why It Was Chosen |
|---|---|---|
| **Next.js** | Application framework | Strong fit for React apps, routing, API routes, metadata, deployment, and Vercel hosting |
| **React** | UI framework | Good for a highly interactive interface with panels, tabs, terminal state, and live preview state |
| **TypeScript** | Type safety | Keeps file data, project data, command logic, and component props safer |
| **Tailwind CSS** | Styling | Fast way to build consistent layouts without maintaining large custom CSS files |

---

### Editor Layer

| Technology | Role | Why It Was Chosen |
|---|---|---|
| **Monaco Editor** | Code editor | Gives the site an authentic VS Code-like editing/viewing experience |
| **Custom Preview Renderer** | Live file rendering | Allows files such as `home.html`, `about.svg`, and `README.md` to render visually |
| **Virtual File System** | Workspace model | Makes the portfolio behave like a small codebase without exposing private internals |

---

### Tooling

<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode" />
</p>

| Tool | Role | Why It Was Chosen |
|---|---|---|
| **Git** | Version control | Standard source control for project history |
| **GitHub** | Repository hosting | Public project visibility and API access |
| **VS Code** | Design reference | Familiar developer interface and strong visual identity |
| **ESLint** | Code quality | Catches avoidable problems and keeps the codebase consistent |
| **Jest** | Unit testing | Useful for testing helpers, command parsing, and data utilities |
| **Playwright** | Browser testing | Useful for testing real UI flows such as opening files and using the terminal |
| **Mermaid** | Diagrams | Useful for architecture diagrams and system explanations |

---

### Deployment

<p>
  <img src="https://skillicons.dev/icons?i=vercel" />
</p>

| Platform | Role | Why It Was Chosen |
|---|---|---|
| **Vercel** | Hosting and deployment | Best fit for a Next.js portfolio because it is fast, simple, and low maintenance |
| **Preview Deployments** | Pre-production testing | Every branch can be tested before production |
| **Custom Domain** | Public identity | `dwijesh.dev` gives the site a clean professional URL |

Vercel was chosen because the project does not need heavy backend infrastructure. It gives fast global hosting, simple deployment, automatic builds, preview URLs, analytics support, and low operational cost.

---

## URL Sync

The portfolio uses query-parameter based file routing.

Instead of separate public routes for every section, the app opens files inside the VS Code-style workspace using the `file` query parameter.

Example:

```txt
http://localhost:3000/?file=README.md
https://dwijesh.dev/?file=README.md
```

Other examples:

```txt
https://dwijesh.dev/?file=home.html
https://dwijesh.dev/?file=about.svg
https://dwijesh.dev/?file=projects.ts
https://dwijesh.dev/?file=experience.json
```

This keeps the whole experience inside one interactive editor shell while still allowing specific files to be shared directly.

---

## Analytics & Monitoring

The portfolio includes analytics and monitoring because it behaves like a real frontend application.

| Tool | Used For | Why It Was Chosen |
|---|---|---|
| **Vercel Analytics** | Page views and visitor behaviour | Native to the deployment platform, low setup, and cost efficient |
| **Vercel Speed Insights** | Core Web Vitals and performance | Helps identify slow loads, layout shifts, and poor interaction timing |
| **Sentry** | Error tracking and runtime monitoring | Captures frontend exceptions and production issues |
| **Application Logs** | Debugging and terminal output | Helps explain system behaviour inside the portfolio interface |

### Why These Tools

| Requirement | Decision |
|---|---|
| **Low cost** | Use Vercel-native tooling where possible |
| **Low maintenance** | Avoid managing separate analytics servers |
| **Useful data** | Track real performance and runtime failures |
| **Production mindset** | Treat the portfolio like an actual deployed product |
| **Recruiter reliability** | Keep the site stable when someone important opens it |

The analytics stack is intentionally lightweight. No bloated enterprise setup. Just enough visibility to know whether the site is fast, usable, and healthy.

---

## Performance Strategy

The site uses rich UI components, editor rendering, live previews, icons, analytics, and API calls. That can become heavy if not controlled.

| Area | Strategy |
|---|---|
| **Initial Load** | Keep the first screen fast and avoid loading unnecessary heavy components immediately |
| **Monaco Editor** | Load editor logic carefully because Monaco can increase bundle size |
| **Live Preview** | Render only the active file preview |
| **Icons and Images** | Use existing hosted icons instead of bundling unnecessary assets |
| **API Calls** | Cache or limit calls where possible |
| **Re-renders** | Keep editor, sidebar, terminal, and tabs from re-rendering unnecessarily |
| **Analytics** | Use lightweight tools that do not dominate the app |
| **Mobile Layout** | Preserve usability without forcing the full desktop IDE layout onto small screens |

### Performance Goals

| Metric | Goal |
|---|---|
| **Fast first load** | User should see useful content quickly |
| **Smooth navigation** | Tabs, explorer, preview, and terminal should feel responsive |
| **Low layout shift** | Panels should not jump around during load |
| **Controlled bundle size** | Heavy editor features should not damage the whole site |
| **Good Core Web Vitals** | Measured through Vercel Speed Insights |

---

## SEO Strategy

The main portfolio experience runs inside a single interactive VS Code-style shell.

Files are opened through query parameters:

```txt
/?file=README.md
/?file=projects.ts
/?file=home.html
/?file=about.svg
/?file=experience.json
```

The goal is not to pretend every file is a separate traditional page. The goal is to make the interactive workspace discoverable while keeping the VS Code experience intact.

| SEO Feature | Purpose |
|---|---|
| **Homepage Metadata** | Gives Google a clear title, description, and site identity |
| **Open Graph Tags** | Improves link previews on social platforms |
| **Canonical Domain** | Keeps search results focused on `dwijesh.dev` |
| **Readable Preview Content** | Ensures rendered content is understandable |
| **Structured README** | Makes the project clear on GitHub |
| **Sitemap / Robots.txt** | Helps crawlers understand the site |
| **Favicon / Site Icon** | Improves branding in browser tabs and search results |

The SEO strategy is simple: keep the interactive editor experience, but make the homepage and key rendered content readable to search engines.

---

## AI Copilot

The AI copilot lets visitors ask questions about my work instead of manually searching through every file.

Example questions:

```txt
What projects has Dwijesh built?
What did he work on at Nusmark?
Explain the heart rate monitoring project.
What backend experience does he have?
What machine learning work has he done?
What is his strongest project?
How does this portfolio work technically?
```

### Copilot Design

| Component | Purpose |
|---|---|
| **Profile Context** | Gives the copilot structured information about my background |
| **Project Context** | Allows answers about specific projects |
| **System Prompt** | Keeps answers focused on portfolio-relevant information |
| **API Route** | Keeps AI calls server-side |
| **Streaming UI** | Makes responses feel faster |
| **Rate Limiting** | Controls cost and prevents abuse |
| **Fallback Handling** | Handles failed AI requests cleanly |

The copilot is included because it demonstrates practical AI product integration: context building, prompt design, API routing, streaming responses, and frontend state handling.

---

## Security Considerations

| Area | Approach |
|---|---|
| **Environment Variables** | Keep secrets server-side |
| **API Keys** | Never expose keys in frontend code |
| **GitHub Tokens** | Use minimum required permissions |
| **AI API Route** | Route AI calls through the backend/API layer |
| **Rate Limiting** | Prevent abuse and control API cost |
| **Input Validation** | Validate request payloads before processing |
| **Error Handling** | Avoid leaking internal stack traces |
| **Private Data** | Do not expose private repos, private issues, or sensitive metadata |
| **Dependencies** | Keep packages maintained and remove unused libraries |

The portfolio is public, so the security rule is blunt:

> Anything shipped to the browser should be safe for anyone to inspect.

---

## Testing Strategy

| Tool | Purpose |
|---|---|
| **TypeScript** | Catches type errors before runtime |
| **ESLint** | Catches bad patterns and keeps code consistent |
| **Jest** | Tests helpers, utilities, command parsing, and data logic |
| **Playwright** | Tests real browser flows |

### Useful Test Areas

| Area | What Should Be Tested |
|---|---|
| **Terminal Commands** | Commands return the expected output |
| **File Opening** | Explorer opens the correct file |
| **Query Param Routing** | `?file=README.md` opens the right file |
| **Tabs** | Opening and switching tabs works correctly |
| **Live Preview** | Supported files render correctly |
| **Command Palette** | Commands execute correctly |
| **Theme Switching** | Themes apply without breaking layout |
| **GitHub API Layer** | Loading, success, empty, and error states work |
| **AI Copilot** | Prompt submission, loading, streaming, and failure states work |

Testing is included because the site has real application behaviour. It is not just static HTML.

---

## Architecture

```txt
┌─────────────────────────────────────────────┐
│                 Browser User                │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              Next.js Application            │
│                                             │
│  VS Code Shell                              │
│  ├─ Activity Bar                            │
│  ├─ Sidebar / Explorer                      │
│  ├─ Tabs                                    │
│  ├─ Monaco Editor                           │
│  ├─ Live Preview                            │
│  ├─ Terminal                                │
│  ├─ Command Palette                         │
│  └─ Status Bar                              │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              Internal App Logic             │
│                                             │
│  ├─ Virtual File System                     │
│  ├─ File Query Routing                      │
│  ├─ Project Data                            │
│  ├─ Profile / Experience Data               │
│  ├─ Terminal Command Parser                 │
│  ├─ Theme State                             │
│  ├─ Editor State                            │
│  └─ Preview Rendering                       │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              External Integrations          │
│                                             │
│  ├─ GitHub API                              │
│  ├─ AI API Route                            │
│  ├─ Vercel Analytics                        │
│  ├─ Vercel Speed Insights                   │
│  ├─ Sentry Monitoring                       │
│  └─ Vercel Deployment                       │
└─────────────────────────────────────────────┘
```

---

## Design Decisions

| Decision | Reason |
|---|---|
| **VS Code-style interface** | Familiar to developers and more memorable than a normal portfolio |
| **Monaco Editor** | Makes file viewing feel like a real editor |
| **Virtual file system** | Lets portfolio content behave like a real workspace |
| **Query param file routing** | Allows direct file links without leaving the main editor shell |
| **Terminal commands** | Adds interaction while keeping the developer theme |
| **AI copilot** | Lets visitors ask direct questions about my work |
| **GitHub API integration** | Connects the portfolio to real development activity |
| **Vercel deployment** | Low-cost, low-maintenance, strong Next.js support |
| **Sentry monitoring** | Gives visibility into production errors |
| **Vercel analytics** | Lightweight analytics without extra infrastructure |
| **TypeScript** | Safer code and cleaner data structures |
| **Tailwind CSS** | Fast styling and consistent UI implementation |

---

## How to Use

Open:

```txt
https://dwijesh.dev
```

To open a specific file directly, use:

```txt
https://dwijesh.dev/?file=README.md
https://dwijesh.dev/?file=home.html
https://dwijesh.dev/?file=about.svg
https://dwijesh.dev/?file=projects.ts
https://dwijesh.dev/?file=experience.json
```

The `file` query parameter controls which workspace file opens by default.

---

## Navigating the Interface

| Area | What It Does |
|---|---|
| **Explorer Panel** | Browse workspace files |
| **Editor Tabs** | Switch between opened files |
| **Editor Area** | View source content through Monaco |
| **Live Preview** | Render supported files visually |
| **Terminal** | Run portfolio/system commands |
| **Command Palette** | Quickly trigger actions |
| **Status Bar** | View current file and app state |
| **AI Copilot** | Ask questions about projects and background |

---

## Terminal Commands

Open the integrated terminal and run:

```txt
PORTFOLIO
  whoami          short bio and background
  skills          list technologies and technical areas
  projects        project list
  projects open <name>
                  open a specific project
  timeline        career and education timeline
  contact         GitHub · LinkedIn · email

SYSTEM
  ls              list workspace files
  open <file>     open file in editor
  cat <file>      alias for open
  architecture    system architecture diagram
  stack           technology stack
  logs            live app log stream
  deploy          simulate CI/CD pipeline
  monitor         live system metrics
  theme [name]    list or apply a color theme
```

No fake commands are listed here. Only actual supported commands should appear.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + P` | Quick open |
| `Ctrl + Shift + P` | Command palette |
| `Ctrl + Shift + I` | Toggle AI Copilot |
| `Ctrl + Backtick` | Toggle terminal |
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + ,` | Settings |

---

## File System

| File | Contents |
|---|---|
| `home.html` | Landing page, intro, profile overview, and contact information |
| `about.svg` | Visual explanation of the portfolio system |
| `projects.ts` | Structured project data with technologies, descriptions, and links |
| `experience.json` | Skills, education, experience, and engineering profile |
| `README.md` | Project documentation |


---

## Cost Efficiency

This project is designed to look polished without needing expensive infrastructure.

| Area | Cost-Efficient Choice |
|---|---|
| **Hosting** | Vercel instead of managing a VPS |
| **Analytics** | Vercel Analytics instead of a separate analytics platform |
| **Monitoring** | Sentry for focused error visibility |
| **Icons** | Existing hosted icon services instead of custom asset hosting |
| **Frontend Stack** | Mostly frontend-driven app to avoid unnecessary backend complexity |
| **AI Usage** | API route and rate limiting to control spend |
| **Preview Deployments** | Vercel previews instead of maintaining a separate staging server |
| **Testing** | Jest and Playwright instead of heavier enterprise tooling |

The stack keeps operational cost low while still showing production-level thinking.

---

## Roadmap

| Status | Feature |
|---|---|
| **Done** | VS Code-style shell |
| **Done** | Monaco editor integration |
| **Done** | File explorer and editor tabs |
| **Done** | Query param file routing |
| **Done** | Live preview support |
| **Done** | Terminal command system |
| **Done** | GitHub integration |
| **Done** | Vercel deployment |
| **Done** | Sentry monitoring |
| **In Progress** | Better metadata and indexed preview content |
| **In Progress** | Improved GitHub side panel |
| **In Progress** | More complete project previews |
| **In Progress** | Performance optimisation |
| **Planned** | Blog/content files inside the workspace |
| **Planned** | Improved mobile layout |
| **Planned** | More AI copilot context |
| **Planned** | Better performance budget tracking |


---

## Contact

<p>
  <a href="https://github.com/DwijeshD">
    <img src="https://img.shields.io/badge/GitHub-DwijeshD-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://linkedin.com/in/DwijeshD">
    <img src="https://img.shields.io/badge/LinkedIn-Dwijesh_Dookraz-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:dwijeshdookraz1@gmail.com">
    <img src="https://img.shields.io/badge/Email-dwijeshdookraz1%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>
