# CSV → Convex Import: Full Step-by-Step (Terminal)

Import all table contents from CSV files in the project root into Convex.

---

## Prerequisites

- Node.js 18+ and npm
- Convex CLI logged in (`npx convex login`)
- **`npx convex dev`** run once (or `npx convex deploy`) so that:
  - Your Convex deployment exists and **`.env.local`** contains **`CONVEX_URL`**
  - The import script uses this URL to call Convex over HTTP (no shell, no long CLI args)
- CSV files in **project root** (same folder as `package.json`):
  - `niches_rows.csv`
  - `tags_rows.csv`
  - `users_rows.csv`
  - `content_rows.csv`
  - `content_niches_rows.csv`
  - `content_tags_rows.csv`
  - `content_tables_rows.csv`

*(View CSVs like `view_*.csv` are not imported; they are derived from base tables.)*

---

## Step 1: Open terminal in project root

```bash
cd c:\Users\Administrator\Downloads\cross-niche-intelligence-main
```

*(Or your actual project path.)*

---

## Step 2: Install dependencies

```bash
npm install
```

This installs `convex` and `csv-parse` (and the rest). If you added `csv-parse` manually, ensure it’s in `package.json` devDependencies and run `npm install` again.

---

## Step 3: Start Convex (push schema and get deployment)

In a **separate terminal** (keep it open):

```bash
npx convex dev
```

- First time: follow prompts (create/link project, etc.).
- Wait until you see something like “Convex functions ready” and the schema is pushed.
- This sets `CONVEX_DEPLOYMENT` in `.env.local` (or your env) so the import script can call Convex.

*(Alternatively use a production deployment: run `npx convex deploy` and ensure the same env is used in Step 5.)*

---

## Step 4: Confirm CSV files exist

From project root:

**PowerShell:**

```powershell
Get-ChildItem -Path . -Filter "*_rows.csv" -Name
```

**Cmd:**

```cmd
dir *_rows.csv /b
```

You should see at least: `niches_rows.csv`, `tags_rows.csv`, `users_rows.csv`, `content_rows.csv`, `content_niches_rows.csv`, `content_tags_rows.csv`, `content_tables_rows.csv`.

---

## Step 5: Run the import script

In the **first** terminal (project root, with Convex dev running in the other):

```bash
npm run import:csv
```

Or directly:

```bash
node scripts/import-csv-to-convex.mjs
```

The script will:

1. **Niches** – insert from `niches_rows.csv`
2. **Tags** – insert from `tags_rows.csv` (builds tag id → Convex id map)
3. **Users** – insert from `users_rows.csv`
4. **Content** – insert from `content_rows.csv` in batches of 5 (builds content uuid → Convex id map)
5. **Content Niches** – insert from `content_niches_rows.csv` (using content id map)
6. **Content Tags** – insert from `content_tags_rows.csv` (using content + tag id maps)
7. **Content Tables** – insert from `content_tables_rows.csv` (using content id map)

Any missing CSV is skipped with a warning. Order is fixed so foreign keys (content id, tag id) exist before junction tables.

---

## Step 6: Check for errors

- If the script exits with code `0` and prints “Import finished.”, the run completed.
- If it throws, read the message (e.g. “Convex import:insertX failed: …”). Fix the cause (env, schema, CSV format, Convex dashboard) and run again.

---

## Step 7: Verify in Convex Dashboard

1. Open [dashboard.convex.dev](https://dashboard.convex.dev) and select your project.
2. Go to **Data**.
3. Check table row counts:
   - **niches** – a few rows
   - **tags** – many rows
   - **users** – expected user count
   - **content** – expected articles
   - **contentNiches** – content–niche links
   - **contentTags** – content–tag links
   - **contentTables** – only if you had table data

---

## Step 8: (Optional) Re-run or clear first

- **Re-run:** The script does not clear tables. Running again will **duplicate** rows. To re-import cleanly, clear the Convex tables (Dashboard → Data → delete docs or truncate) then run `npm run import:csv` again.
- **Idempotency:** Not supported; design is “run once after empty DB.”

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| `CONVEX_URL is not set` | Run `npx convex dev` in another terminal once so it writes `CONVEX_URL` to `.env.local`. The import script reads `.env.local` and uses the Convex HTTP client (no shell). |
| `Cannot find module 'csv-parse'` | The script uses a built-in CSV parser; no extra package is required. If you see this, ensure you're running the script from the repo that contains `scripts/import-csv-to-convex.mjs`. |
| `niches_rows.csv not found` | Run from project root: `cd` to the folder that contains `package.json` and the CSV files. |
| `Convex import:insertContentBatch failed` | Check Convex Dashboard → Logs for the failing mutation. Often: field type mismatch (e.g. date vs number), or payload too large (script uses batches of 5 for content). |
| Content body truncated or broken | Ensure CSV uses quoted fields for `body` (newlines and commas inside quotes). The script uses `csv-parse` with `relax_quotes`. |
| Tag or content id map empty | Mutations return `{ ids: [...] }`. If stdout is not JSON (e.g. extra logs), the script may not parse it. Check Convex Dashboard → Logs and that `convex run` is returning only the mutation result. |
| Command line too long / E2BIG on content | Reduce batch size in `scripts/import-csv-to-convex.mjs`: change `const BATCH = 5` to `2` or `1` for content. |

---

## Quick copy-paste (all steps)

```bash
cd c:\Users\Administrator\Downloads\cross-niche-intelligence-main
npm install
```

Then in **another terminal**:

```bash
cd c:\Users\Administrator\Downloads\cross-niche-intelligence-main
npx convex dev
```

Back in the **first** terminal:

```bash
npm run import:csv
```

Then verify in Convex Dashboard → Data.
