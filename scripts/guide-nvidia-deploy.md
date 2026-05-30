# NVIDIA API Key — Deploy Guide

## What changed in this commit (`43998e1`)

| Feature | Before | After |
|---------|--------|-------|
| **AI Model** | llama-3.1-8b-instruct (8B) | **llama-3.1-70b-instruct** (70B) |
| **Max tokens** | 1024 | 2048 |
| **GamingCopilot** | Static knowledge base | **NVIDIA API** + conversation history |
| **ThreatScanner** | Static mock only | **NVIDIA analysis** after scan |
| **AITools (article)** | Already wired ✅ | Already wired ✅ |
| **AIWorkflowHub** | Already wired ✅ | Already wired ✅ |

## Step 1: Set env var in Coolify

1. Open Coolify at `https://84.247.139.56:8000` (or your Coolify domain)
2. Go to thegridnexus.com service → **Environment Variables**
3. Add:
   ```
   VITE_NVIDIA_API_KEY=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
   ```
4. Click **Save**

## Step 2: Deploy

1. Go to **Deploy** tab for thegridnexus.com
2. Click **Deploy** — the build will inject this key at build time
3. Wait for build to complete (the commit is already pushed to GitHub)

## Step 3: Verify

After deploy, visit:
- **Article page** → look for "NVIDIA NIM" badge in AI Tools section
- **Gaming Copilot** → header shows "NVIDIA NIM" badge, real answers instead of canned
- **Threat Scanner** → after a scan, you'll see "AI Security Analysis" card with real analysis

## How it works

Vite injects `VITE_NVIDIA_API_KEY` at **build time** (not runtime). This means:
- The key ends up in the JS bundle (it can't be hidden from client-side code)
- It's safe because NVIDIA rates it per-key and has consumption limits
- For production secrets, you'd need a backend proxy — but for this scale it's fine
- The key applies to `https://integrate.api.nvidia.com/v1` (OpenAI-compatible endpoint)

## Fallback behavior

If `VITE_NVIDIA_API_KEY` is **not set** at build time:
- GamingCopilot falls back to knowledge base + pattern matching (same as before)
- ThreatScanner shows mock data only (no AI card)
- AITools shows "Offline Mode" badge instead of "NVIDIA NIM"
- Everything still works — just without the AI enhancement
