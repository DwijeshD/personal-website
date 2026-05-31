# PortfolioWebsite — Claude Rules

## Deployment Workflow

**Never deploy directly to production without a local dev preview first.**

### Required order before any Vercel production deploy:

1. **Dev** — `npm run dev` on the current branch, verify the change works at `localhost:3000`
2. **Preview** — push to a non-main branch, let Vercel auto-create a preview URL, test there
3. **Production** — only then merge to `main` and push (or run `vercel --prod`)

### Branch → Environment mapping

| Branch | Vercel environment | URL |
|---|---|---|
| `main` | Production | dwijesh.dev |
| `dev` / feature branches | Preview | `*-dwijesh.vercel.app` |
| local | Development | localhost:3000 |

### Rules

- Work on a feature branch, not directly on `main`
- Run `npm run dev` and manually test the golden path before pushing
- Push to the feature branch first — Vercel will generate a preview URL automatically
- Only merge to `main` (and trigger production deploy) after the preview looks correct
- `vercel` (no flag) = preview deploy; `vercel --prod` = production — never run `--prod` without preview sign-off
