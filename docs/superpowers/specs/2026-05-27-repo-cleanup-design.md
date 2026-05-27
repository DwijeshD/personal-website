# Repo Cleanup — Industry-Grade Organisation & Architecture
**Date:** 2026-05-27  
**Approach:** A — Layered cleanup (data → hooks → structure → tooling)  
**Constraint:** Zero functionality changes. Build must pass before and after.

---

## Problems Being Fixed

| # | Problem | Location |
|---|---------|----------|
| 1 | Portfolio data defined twice | `lib/data.ts` + `lib/profileContext.ts` |
| 2 | `lib/data.ts` mixes 3 unrelated concerns (tabs, portfolio data, AI prompt) | `lib/data.ts` |
| 3 | God component with 20+ state vars and all event handlers | `components/VSCodeLayout.tsx` |
| 4 | No custom hooks — all side effects inline | `components/VSCodeLayout.tsx` |
| 5 | Popup/overlay components flat alongside layout components | `components/*.tsx` |
| 6 | Dev artifacts committed / not gitignored | `.playwright-mcp/`, `graphify-out/`, `skills-lock.json` |
| 7 | No ESLint config | — |

---

## Layer 1 — Data

### Goal
Single source of truth for all portfolio data. Each file has one clear responsibility.

### File changes

**Delete:** `lib/data.ts` (split into three files below)  
**Delete:** `lib/profileContext.ts` (merged into `lib/profile.ts`)

**Create: `lib/profile.ts`**  
Merges `profileContext.ts` and the portfolio constants from `data.ts`.  
Exports:
- `profile` object (structured — used by `contextBuilder.ts`)
- `PERSON`, `ABOUT`, `SKILLS`, `EXPERIENCE`, `PROJECTS`, `EDUCATION` flat constants (used by `defaultContent.ts` and any future consumers)

**Create: `lib/tabs.ts`**  
Contains only the `TABS` array. Imported by `VSCodeLayout`.

**Create: `lib/ai/systemPrompt.ts`**  
Contains only `AI_SYSTEM_PROMPT`. Imported by `app/api/chat/route.ts` and `app/api/ai-action/route.ts`.

### Import updates required
- `lib/contextBuilder.ts` → import `profile` from `lib/profile.ts`
- `lib/defaultContent.ts` → import flat constants from `lib/profile.ts`
- `components/VSCodeLayout.tsx` → import `TABS` from `lib/tabs.ts`
- `app/api/chat/route.ts` → import `AI_SYSTEM_PROMPT` from `lib/ai/systemPrompt.ts`
- `app/api/ai-action/route.ts` → same

---

## Layer 2 — Hooks

### Goal
VSCodeLayout becomes ~120 lines of pure composition. All stateful logic lives in focused, testable hooks.

### New files in `hooks/`

**`hooks/useEditorState.ts`**  
Owns: `openTabs`, `activeTab`, `fileContents`, `fileModes`, `workspaceFiles`, `workspaceFolders`, `recentFiles`  
Returns: state + `navigate(id)`, `closeTab(id)`, `executeAiAction(action)`

**`hooks/usePanelState.ts`**  
Owns: `sidePanel`, `terminalOpen`, `copilotOpen`, `bottomTab`, `aboutOpen`, `shortcutsOpen`, `sourceControlOpen`, `settingsOpen`, `settingsTheme`, `bugReportTrigger`, `zoomIdx`, `aiThinking`, `pendingAiAction`, `lastCommand`  
Returns: state + all toggle/open/close handlers

**`hooks/useKeyboardShortcuts.ts`**  
Signature: `useKeyboardShortcuts(handlers: KeyboardHandlers, activeTab: string)`  
Owns: the `window.addEventListener('keydown', ...)` effect  
Returns: nothing (pure side effect)

**`hooks/useResizablePanel.ts`**  
Owns: `terminalHeight`, `isResizing`  
Returns: `{ terminalHeight, isResizing, startResize }`

**`hooks/useGitStatus.ts`**  
Owns: the git-status fetch on mount  
Returns: `gitStatus: { branch: string; totalCommits: number } | null`

**`hooks/useEditorPrefetch.ts`**  
Owns: dynamic import warmup + API warmup effects on mount  
Returns: nothing (pure side effect)

---

## Layer 3 — Component Structure

### Goal
Components grouped by role. Clear at a glance what each subdirectory contains.

### Directory structure after

```
components/
  layout/
    TitleBar.tsx
    ActivityBar.tsx
    Sidebar.tsx
    TabBar.tsx
    StatusBar.tsx
    VSCodeLayout.tsx
  overlays/
    SettingsPopup.tsx
    SourceControlPopup.tsx
    AiActionModal.tsx
    CommandPalette.tsx
  modals/              ← already correct
    AboutModal.tsx
    KeyboardShortcutsModal.tsx
  panels/              ← already correct
    AIPanel.tsx
    FileEditorPanel.tsx
    ResumePanel.tsx
    SourceControlPanel.tsx
    BottomPanel.tsx
    CopilotPanel.tsx
  renderers/           ← already correct
    HTMLRenderer.tsx
    LiveCodeRenderer.tsx
    MarkdownRenderer.tsx
```

`MenuBar.tsx` — audit for usage; remove if dead code.

### .gitignore additions
```
.playwright-mcp/
graphify-out/
skills-lock.json
```

---

## Layer 4 — Tooling

**Add `.eslintrc.json`:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

---

## Parallel Agent Plan

| Agent | Layer | Files touched |
|-------|-------|---------------|
| 1 | Data | `lib/profile.ts` (new), `lib/tabs.ts` (new), `lib/ai/systemPrompt.ts` (new), update imports in contextBuilder, defaultContent, VSCodeLayout, API routes, delete old files |
| 2 | Hooks | `hooks/*.ts` (6 new files), slim `VSCodeLayout.tsx` |
| 3 | Structure | Move components to subdirs, update all imports, .gitignore, dead code audit |
| 4 | Tooling + verify | `.eslintrc.json`, `npm run build`, `npm run type-check` |

Agents 1, 2, 3 run in **parallel**. Agent 4 runs after all three complete.

---

## Success Criteria

- [ ] `npm run build` passes
- [ ] `npm run type-check` passes  
- [ ] No duplicate portfolio data in the codebase
- [ ] `VSCodeLayout.tsx` ≤ 150 lines
- [ ] Each hook has one clear responsibility
- [ ] `.playwright-mcp/` not tracked by git
- [ ] Zero functionality changes (visual output identical)
