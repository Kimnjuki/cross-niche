# Root Cause: Bloat in Git History Makes Coolify's Clone Drop Connection

## Deploy log symptom
- `git ls-remote https://github.com/Kimnjuki/cross-niche refs/heads/main` → **succeeds**
- `git clone --depth=1 ...` → `fatal: unable to access 'https://github.com/Kimnjuki/cross-niche/': Empty reply from server`

## Why
A `ls-remote` only fetches ref names (tiny). A `clone` downloads the full packfile for the branch tip.
The repo is **56.5 MB** because the working tree contains:
- `cross-niche/` — a **full nested copy of the project** (56.1 MB), tracked as regular blobs
- `cross-niche-intelligence-main/` — a full nested copy (gitlink)
- `assets/` + `public/assets/` — duplicate copies of 25.3 MB of images
- `playwright-report/`, `docs/`, `seo/`, CSV dumps, `.docx`, `bun.lockb`, etc.

Coolify's clone command requests the entire 56 MB packfile. GitHub serves it a few MB at a time; the connection from the deployment server gets dropped mid-transfer → "Empty reply from server".

## Fix (used)
A single **cleanup commit** on `main` that:
1. `git rm` the nested `cross-niche/` directory (56.1 MB)
2. `git rm --cached` the nested `cross-niche-intelligence-main/` gitlink (0.7 MB directory)
3. Remove `playwright-report/`, `docs/`, `seo/`, `templates/`, `data/`, `config/`, `tests/`, CSV dumps, `.docx`, `bun.lockb`, `install.cmd`, `diagnostic-script.sh`
4. Delete duplicate `assets/` copy — the app only references `/assets/*` (served from `public/assets/`)
5. Keep `public/assets/` (needed by Vite)
6. Harden `.gitignore` so the bloat never returns
7. Harden `.dockerignore`

Because Coolify clones with `--depth=1`, only the tip commit's blobs are downloaded. After this deletion, the packfile for the branch tip drops to a few MB, the clone completes quickly, and deployment proceeds.

No history rewrite is needed — this fixes deployments immediately while history rewrite (optional) reclaims the GitHub repo size over time.

## Files removed
- `cross-niche/` (56.1 MB) — nested duplicate of the project
- `cross-niche-intelligence-main/` — nested gitlink
- `playwright-report/`, `docs/`, `seo/`, `templates/`, `data/`, `config/`, `tests/`
- `assets/` (root duplicate; keep `public/assets/`)
- `content_*_rows.csv`, `view_*.csv`, `*_rows.csv`, `internal_all.csv`
- `thegridnexus_articles_2026.docx`
- `bun.lockb`, `install.cmd`, `diagnostic-script.sh`
- `convex-admin-mutations.ts`, `convex-content-queries.ts`, `complete-homepage-component.tsx` (scratch files)

## Files kept
- All `src/`, `public/`, `convex/`, `scripts/`, `index.html`, config files, package files