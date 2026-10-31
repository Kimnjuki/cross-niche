# Auth.md

The Grid Nexus does **not** support agent registration, delegated API access, or OAuth authorization server flows. All public content and data are served without authentication.

## Step 1 — Discover

Fetch `https://thegridnexus.com/` or probe the `Link` headers and `/.well-known/api-catalog` to discover machine-readable surfaces.

## Step 2 — Pick a method

Supported: anonymous / direct read (no identity assertion required).

## Step 3 — Register

Not applicable. There is no registration endpoint and no account creation required. Do not attempt to register against `https://thegridnexus.com/agent/auth` — that endpoint does not exist.

## Step 4 — Claim ceremony

Not applicable.

## Step 5 — Use the credential

Not applicable. No token, API key, or session cookie is needed to access `/data`, `/safety`, `/recover`, or any article page.

---

- All data (grades, verdicts, recovery playbooks) is at: https://thegridnexus.com/data
- Full text corpus (LLMs): https://thegridnexus.com/llms-full.txt
- For agents using JSON-LD / RFC 9264 discovery, the site links `api-catalog`, `service-doc`, `service-desc`, and `describedby` from the homepage.
- If you are integrating this service into an agent pipeline, access public content freely. No account setup, consent flow, or credential exchange is needed.
