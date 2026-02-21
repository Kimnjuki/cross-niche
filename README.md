# The Grid Nexus - Cross-Niche Intelligence Platform

**Live URL**: https://thegridnexus.com

A comprehensive intelligence platform covering technology, cybersecurity, and gaming with real-time content aggregation, user authentication, and bookmarking features.

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm
- Git

### Local development

1. **Clone and install**
   ```bash
   git clone https://github.com/Kimnjuki/cross-niche.git
   cd cross-niche
   npm install
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set at least:
   ```env
   VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
   VITE_APP_URL=http://localhost:8080
   ```
   Or run with built-in Convex URL: `npm run dev:convex`

3. **Start dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:8080 (or the port Vite prints).

### Production build

```bash
npm run build
npm run preview   # test production build locally
```

Output is in `dist/`.

## Technologies

- **Vite** – Build and dev server  
- **TypeScript** – Type safety  
- **React 18** – UI  
- **Convex** – Backend (content, articles, news feed)  
- **Supabase** – Optional / legacy (migrations in `/supabase`)  
- **shadcn-ui**, **Tailwind** – UI and styling  
- **React Query**, **React Router** – Data and routing  

See [docs/architecture.md](docs/architecture.md) for database and architecture decisions.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:convex` | Dev with Convex URL pre-set |
| `npm run build` | Production build |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run type-check` | TypeScript check (no emit) |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run generate:sitemap` | Generate sitemaps |

## Environment variables

Required for run:

- `VITE_CONVEX_URL` – Convex deployment URL (see [Convex Dashboard](https://dashboard.convex.dev))

Optional:

- `VITE_APP_URL` – App URL (for SEO/canonical)
- `VITE_SUPABASE_*` – Only if using Supabase features

All variables are documented in [.env.example](.env.example).

## Deployment

1. Set in your host: `VITE_CONVEX_URL`, `VITE_APP_URL` (production URL).
2. Build: `npm run build` (output: `dist/`).
3. Deploy `dist/` to any static host (Vercel, Netlify, Coolify, nginx, etc.).
4. Use [docs/pre-deployment-checklist.md](docs/pre-deployment-checklist.md) before each release.

For Docker: use the included `Dockerfile` and `nginx.conf` (e.g. with Coolify).

## Project structure

```
├── src/
│   ├── components/   # React components
│   ├── lib/          # Utilities, SEO, API
│   ├── pages/        # Page components
│   ├── hooks/        # Custom hooks
│   └── types/        # TypeScript types
├── convex/           # Convex backend (primary data)
├── public/           # Static assets
├── scripts/          # Build and content scripts
├── supabase/         # Optional migrations
├── tests/            # E2E and tests
└── docs/             # Architecture, checklists
```

## Troubleshooting

**Build fails**

- Clear and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Use Node 18+: `node --version`

**Convex / no content**

- Ensure `VITE_CONVEX_URL` is set in `.env` or use `npm run dev:convex`.
- Check [Convex Dashboard](https://dashboard.convex.dev) that the deployment is running.

**Port in use**

- Use the port Vite suggests, or: `npx kill-port 8080` (or your port).

**Supabase (if used)**

- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`.
- Ensure project is active and RLS allows needed access.

## Contributing

1. Fork the repo  
2. Create a feature branch  
3. Commit and push  
4. Open a Pull Request  

## License

MIT – see [LICENSE](LICENSE) for details.
