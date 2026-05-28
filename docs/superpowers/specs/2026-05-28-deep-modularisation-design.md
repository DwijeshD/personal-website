# Deep Modularisation — Sub-feature Directories
**Date:** 2026-05-28
**Approach:** A — Sub-feature directories. Each large component gets a sibling directory of focused sub-files. Original file becomes a thin coordinator.
**Constraint:** Zero functionality changes. Build must pass. No external import path changes (consumers keep their existing `@/components/panels/...` imports).

---

## Problem Summary

| File | Lines | Issue |
|------|-------|-------|
| `components/panels/CopilotPanel.tsx` | 1095 | Streaming renderer, markdown parser, bug widget, logs, intent detection, prefetch cache — all inline |
| `components/panels/TerminalTab.tsx` | 981 | 3 mini-games (dino, matrix, donut) + command data + command runner + terminal shell |
| `lib/defaultContent.ts` | 884 | 6 file contents as one 884-line export |
| `components/layout/Sidebar.tsx` | 597 | File tree, search, context menu, git status — 4 features |
| `components/layout/TitleBar.tsx` | 296 | 40+ menu item definitions inline |
| `components/renderers/LiveCodeRenderer.tsx` | 253 | Syntax highlighters for 9 languages inline |

---

## Group 1 — Terminal

### New directories
```
components/terminal/
  DinoGame.tsx         — canvas, physics, collision, keyboard/touch, sprites (~220 lines)
  MatrixEffect.tsx     — canvas character rain, useEffect loop (~70 lines)
  DonutGame.tsx        — ASCII torus math, frame computation, render loop (~60 lines)

lib/terminal/
  content.ts           — FORTUNES, TIMELINE_LINES, ARCHITECTURE_LINES, STACK_LINES, NEOFETCH (~130 lines)
  commands.ts          — runCmd(), buildHelpText(), all 11 command switch cases (~200 lines)
  monitor.ts           — bar(), fmtTime(), buildMonitorFrame(), makeLogs(), makeDeployLogs() (~80 lines)
```

### Coordinator after split
`components/panels/TerminalTab.tsx` retains: `TerminalLine` type, `TerminalHandle` type, THEMES constant, input/history state, line rendering JSX, `execute()` dispatcher, scroll effect, forwardRef — **~150 lines**.

### Import pattern
TerminalTab imports games as `import DinoGame from '@/components/terminal/DinoGame'` etc.
Commands import content as `import { FORTUNES, ... } from '@/lib/terminal/content'`.
No changes needed outside TerminalTab.

---

## Group 2 — Copilot

### New directories
```
components/copilot/
  BugReportWidget.tsx  — IssueState machine, form fields, submit/error/done UI
  LogsView.tsx         — LogEntry type, timestamp display, log line rendering
  ThinkingIndicator.tsx — THINKING_WORDS rotation, animated dots

lib/copilot/
  renderMarkdown.ts    — renderMd() — bold, inline code, bullets, headings, line breaks
  parseThinkBlocks.ts  — parseThinkBlocks() — <think> XML extraction
  detectIntent.ts      — detectIntent(), BUG_KEYWORDS regex, isEditRequest()
  fetchChat.ts         — fetchFullResponse() — SSE streaming, rate-limit header parsing

hooks/
  useStreamingDisplay.ts  — displayIdx state, CHARS_PER_TICK tick loop, buffer→displayed
  usePrefetchCache.ts     — prefetch fetch on mount, suggested queries, model caching
```

### Coordinator after split
`components/panels/CopilotPanel.tsx` retains: message list state, `handleSend()`, `@mention` file attachment detection, layout JSX, action flow wiring — **~200 lines**.

### Type ownership
- `Message` interface stays in CopilotPanel (it's local to the component)
- `LogEntry` moves to `components/copilot/LogsView.tsx` (owned by that component)
- `IssueState` moves to `components/copilot/BugReportWidget.tsx`

---

## Group 3 — Sidebar

### New directory
```
components/sidebar/
  FileTree.tsx    — folder/file tree rendering, FileRow, rename input, new-file/folder input
  ContextMenu.tsx — CtxBtn, CtxSep, right-click handlers (delete/rename/copy/paste/copyPath)
  SearchPanel.tsx — search input, content search, result list with line numbers
```

### Coordinator after split
`components/layout/Sidebar.tsx` retains: panel switching logic (explorer vs. search), props interface, CopilotButton, BottomSection — **~100 lines**.

### State ownership
File system mutation state (`newMode`, `newName`, `ctxPos`, `ctxTarget`, `clipboard`, `renameId`, `renameVal`) moves into `FileTree.tsx` and `ContextMenu.tsx` as local state. Sidebar only receives and passes down the workspace props.

---

## Group 4 — Content

### New directory
```
lib/content/
  home.ts      — export const HOME_HTML = `...`   (the full home.html template)
  about.ts     — export const ABOUT_MD = `...`
  styles.ts    — export const STYLES_CSS = `...`
  skills.ts    — export const SKILLS_JSON = `...`
  server.ts    — export const SERVER_TS = `...`
  readme.ts    — export const README_MD = `...`
  index.ts     — imports all 6, re-exports as DEFAULT_CONTENT (same shape as before)
```

### Consumer compatibility
`CopilotPanel.tsx` and `VSCodeLayout.tsx` currently import `DEFAULT_CONTENT` from `@/lib/defaultContent`.
After split, update those two import lines to `@/lib/content`.
Delete `lib/defaultContent.ts`.

---

## Group 5 — TitleBar

### New file
```
lib/menuDefinitions.ts  — buildMenus(handlers: MenuHandlers): MenuDef[]
```
`buildMenus` takes a handlers object (all the callbacks TitleBar currently receives as props) and returns the full `MenuDef[]` array — all 7 menus, 40+ items.

### Coordinator after split
`TitleBar.tsx` calls `buildMenus(props)` and passes result to `<MenuBar>` — drops from 296 to **~80 lines**.

---

## Group 6 — LiveCodeRenderer

### New directory
```
lib/renderers/
  syntaxHighlight.ts   — jsDoc(), jsonDoc(), cssDoc(), reactDoc(), syntaxDoc(), sqlDoc(),
                         shellDoc(), yamlDoc(), xmlDoc(), KEYWORDS, buildDoc(ext)
  stripTypeScript.ts   — stripTs()
```

### Coordinator after split
`components/renderers/LiveCodeRenderer.tsx` retains: `buildDoc` call, iframe sandbox, debounce, DARK_BASE constant — **~80 lines**.

---

## Parallel Agent Plan

All 6 groups touch completely separate files. All 6 agents run simultaneously.

| Agent | Group | Files created | Files modified |
|-------|-------|---------------|---------------|
| 1 | Terminal | `components/terminal/`, `lib/terminal/` | `components/panels/TerminalTab.tsx` |
| 2 | Copilot | `components/copilot/`, `lib/copilot/`, 2 hooks | `components/panels/CopilotPanel.tsx` |
| 3 | Sidebar | `components/sidebar/` | `components/layout/Sidebar.tsx` |
| 4 | Content | `lib/content/` | `CopilotPanel.tsx` import, `VSCodeLayout.tsx` import, delete `lib/defaultContent.ts` |
| 5 | TitleBar | `lib/menuDefinitions.ts` | `components/layout/TitleBar.tsx` |
| 6 | LiveCodeRenderer | `lib/renderers/` | `components/renderers/LiveCodeRenderer.tsx` |

**CONFLICT NOTE:** Agent 2 (Copilot) and Agent 4 (Content) both modify `CopilotPanel.tsx` — Agent 2 rewrites the whole file, Agent 4 only updates one import line. **Resolution:** Agent 4 skips the CopilotPanel import update; Agent 2 handles it by importing DEFAULT_CONTENT from `@/lib/content` directly in its rewrite.

---

---

## Group 7 — `src/` directory migration (sequential, runs after Groups 1–6)

Next.js natively supports a `src/` directory. Moving everything in means all source lives under one roof with `public/`, config files, and `node_modules/` cleanly separated at the root.

### Moves
```
app/        → src/app/
components/ → src/components/
hooks/      → src/hooks/
lib/        → src/lib/
```

`public/` stays at root — Next.js requirement.

### Config changes (2 files only)

**`tsconfig.json`** — update `@/` alias:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

**`tailwind.config.ts`** — update content globs:
```ts
content: [
  './src/app/**/*.{ts,tsx}',
  './src/components/**/*.{ts,tsx}',
  './src/lib/**/*.{ts,tsx}',
  './src/hooks/**/*.{ts,tsx}',
],
```

### Import changes
**None.** All imports use the `@/` alias which resolves via tsconfig. Relative imports within a directory stay correct since relative positions don't change. Only the two config files above need edits.

### Sequencing
Must run **after** all 6 parallel groups complete, since those groups create files in `components/`, `lib/`, and `hooks/`. Moving before them would require updating every new file path in the agents' prompts.

---

## Success Criteria

- [ ] `npm run type-check` passes
- [ ] `npm run build` passes
- [ ] No file exceeds 250 lines
- [ ] Each new file has one clear responsibility
- [ ] All source code lives under `src/`
- [ ] `public/` remains at project root
- [ ] Zero functionality changes (visual output identical)
