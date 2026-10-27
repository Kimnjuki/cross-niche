# Auth.md

The Grid Nexus does **not** support agent registration, delegated access, or API credential issuance. All public content and data are served without authentication.

## Step 1 — Discover

There is no OAuth authorization-server metadata and no authorization server. Nothing to discover.

## Step 2 — Pick a method

No registration method is available. The Grid Nexus accepts no agent registration and issues no credentials.

## Step 3 — Register

There is no registration endpoint. Do not attempt to register; there is nothing to register for.

## Step 4 — Claim ceremony

Not applicable — no registration flow exists.

## Step 5 — Use the credential

Not applicable — no credential is issued.

## Authentication

No authentication is required. Public data (game grades, safety verdicts, recovery playbooks) is served without a key: <https://thegridnexus.com/data>. The Grid Nexus never asks users for passwords, two-factor codes, or recovery codes.

For machine-readable page content, send `Accept: text/markdown` and the server returns a Markdown version of the page.
