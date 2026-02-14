# The Grid Nexus Threat Score — Chrome Extension (nexus-005)

Manifest V3 Chrome extension that shows a **Threat Score** (Safe / Caution / High Risk) for the current tab’s domain. The popup calls your API; the toolbar icon and badge update by risk level.

## Setup

1. **Icons** (required for load unpacked):
   ```bash
   cd chrome-extension
   node generate-icons.js
   ```
   This writes `icons/icon-16.png`, `icons/icon-48.png`, `icons/icon-128.png` (minimal placeholders). Replace with proper icons before publishing.

2. **Load in Chrome**
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - **Load unpacked** → select the `chrome-extension` folder

3. **API**
   - The extension calls `https://thegridnexus.com/api/threat-score?domain=<hostname>` (GET).
   - Implement that route on your server. Response shape (JSON):
     - `level`: `"safe"` | `"caution"` | `"high"` (or `"unknown"`)
     - `label`: display string (e.g. `"Safe"`, `"Caution"`, `"High Risk"`)
     - `description`: optional short text
   - If the API is missing or returns an error, the popup shows **Unknown** and the icon stays grey.

## Security & Permissions (Chrome Web Store)

- **No API keys** in the extension. Any secret must live on the server; the extension only sends the current tab’s hostname to your API.
- **Permissions used:**
  - `activeTab` — access to the current tab when the user clicks the extension.
  - `tabs` — to read the current tab URL for the popup.
  - `scripting` — for extension behavior.
- **Host permission:** only `https://thegridnexus.com/*` for the threat-score request. No access to other sites’ content.
- **Content script:** runs on all pages but only sets `window.__nexusCurrentHostname` (no data sent off the page from the content script).

## Files

| File | Purpose |
|------|--------|
| `manifest.json` | Manifest V3 config, permissions, popup, background, content script |
| `popup.html` / `popup.js` | Popup UI: current domain + threat score (Safe / Caution / High Risk) |
| `background.js` | Service worker: fetches score on tab URL change, sets icon colour and badge (S/C/H) |
| `content_script.js` | Reads current hostname (for possible future use); no external calls |
| `icons/` | Extension icons; generate with `node generate-icons.js` |

## Icon states

- **Green** — Safe (badge “S”).
- **Yellow** — Caution (badge “C”).
- **Red** — High Risk (badge “H”).
- **Grey** — Unknown or API error.

Icon colour is drawn in the background script (no extra icon files for states).
