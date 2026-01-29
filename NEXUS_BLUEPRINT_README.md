# Nexus Cursor Blueprint – Stack Mapping

The blueprint in `NEXUS_CURSOR_BLUEPRINT.json` is written for generic Cursor workflows. This repo uses **Vite + React + Convex/Supabase** (no Prisma, no Next.js). Use this mapping when implementing.

| Blueprint reference | This repo |
|--------------------|-----------|
| Prisma schema | **Convex schema** (`convex/schema.ts`) + tables / indexes |
| Next.js dynamic route `[slug]` | **Vite/React route** (e.g. React Router or existing router) + dynamic path like `/topic/:slug` or `/nexus-intersection/:slug` |
| `/api/ai-updates` | Convex **query** or **HTTP action**, or a Vite proxy to an external API |
| `@Nexus-Standard` | Existing design system (Tailwind, `src/components/ui`, shadcn) |

## Features overview

| ID | Name | Notes |
|----|------|--------|
| **nexus-001** | Nexus Risk-to-Reward Gaming Index | Security rating in gaming reviews: Convex model + `GameSecurityCard` + score formula. |
| **nexus-002** | Interactive AI-Pulse Roadmap | Timeline (e.g. Framer Motion), filter by Productivity / Creative / Gaming AI; data from Convex or API. |
| **nexus-003** | The Breach Simulation | State machine (BreachSim), Nexus XP in localStorage, terminal-style UI. |
| **nexus-004** | Unified Cross-Section Reports | One Tech + one Security + one Gaming piece; common keyword “Nexus Summary”; use Convex queries + React route. |
| **nexus-005** | Threat Score Chrome Extension | Implemented in `chrome-extension/`: manifest v3, popup + content script + background; calls `GET /api/threat-score?domain=`. See `chrome-extension/README.md`. |

## Suggested order

1. **nexus-001** – Fits existing Gaming + security content; extends Convex schema and review UI.
2. **nexus-003** – Self-contained (state machine + XP + UI); good for a dedicated Security/Training page.
3. **nexus-002** – Needs data source (Convex or API) for “AI updates”; then timeline + filters.
4. **nexus-004** – Reuses Convex content + niches; add route + “intersection” query + summary component.
5. **nexus-005** – Separate extension project; integrate with your threat/score API later.

To implement a feature, say e.g. *“Implement nexus-001 (Nexus Risk-to-Reward Gaming Index) using Convex and our existing design system.”*
