# CLAUDE.md

The full project overview, tech stack, directory structure, and conventions live
in **[AGENTS.md](./AGENTS.md)** — it is the single source of truth for this repo.

@AGENTS.md

## Commands

**Use `npm`** — this repo is npm-locked (`package-lock.json`).

| Task | Command |
| --- | --- |
| Install deps | `npm ci` |
| Dev server | `npm run dev` (port 3000) |
| Production build | `npm run build` (Vite → `dist/`) |
| Browser tests | `npx playwright test` |

## Stack (see AGENTS.md for detail)

TanStack Start + React 19 + TanStack Router v1, built with **Vite 7**, styled
with **Tailwind CSS 4**, written in **TypeScript 5.7 (strict)**, deployed on
**Netlify**.

## Notes

- Never commit secrets, `.env*` files, or `*token*.json` / `*credentials*.json`.
- **Lockfile drift:** `package-lock.json` is currently out of sync with
  `package.json` (`playwright` is missing from the lock), so `npm ci` fails.
  The SessionStart hook uses `npm install` to work around it. Run `npm install`
  and commit the updated `package-lock.json` to restore `npm ci`.
