/**
 * Service worker: set extension icon and badge by threat level.
 * No API keys. Icon is drawn with canvas (no external assets for state).
 */

const API_BASE = 'https://thegridnexus.com';
const THREAT_SCORE_API = `${API_BASE}/api/threat-score`;

function getDomainFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function fetchThreatLevel(domain) {
  try {
    const res = await fetch(`${THREAT_SCORE_API}?domain=${encodeURIComponent(domain)}`, { method: 'GET', credentials: 'omit' });
    if (!res.ok) return 'unknown';
    const data = await res.json();
    const level = (data.level || data.risk || 'unknown').toLowerCase();
    if (['safe', 'low', 'green'].includes(level)) return 'safe';
    if (['caution', 'medium', 'yellow'].includes(level)) return 'caution';
    if (['high', 'danger', 'red'].includes(level)) return 'high';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function drawIconImageData(size, color) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * Math.PI);
  ctx.fill();
  return ctx.getImageData(0, 0, size, size);
}

const COLORS = { safe: '#22c55e', caution: '#eab308', high: '#ef4444', unknown: '#94a3b8' };

async function updateIconForTab(tabId, level) {
  const color = COLORS[level] || COLORS.unknown;
  const sizes = [16, 48];
  const imageData = {};
  for (const size of sizes) {
    imageData[size] = drawIconImageData(size, color);
  }
  try {
    await chrome.action.setIcon({ tabId, imageData });
  } catch (_) {}
  try {
    const badge = level === 'safe' ? 'S' : level === 'caution' ? 'C' : level === 'high' ? 'H' : '';
    await chrome.action.setBadgeText({ tabId, text: badge });
    await chrome.action.setBadgeBackgroundColor({ tabId, color });
  } catch (_) {}
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const domain = getDomainFromUrl(tab.url);
  if (!domain) return;
  const level = await fetchThreatLevel(domain);
  await updateIconForTab(tabId, level);
});
