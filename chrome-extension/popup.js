/**
 * Popup: show current tab domain and Threat Score from API.
 * No API keys — server handles auth if needed.
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

function setScoreUI(level, label, desc) {
  const badge = document.getElementById('badge');
  const labelEl = document.getElementById('label');
  const descEl = document.getElementById('desc');
  const messageEl = document.getElementById('message');
  messageEl.textContent = '';
  messageEl.className = '';
  badge.className = 'score-badge ' + (level || 'unknown');
  badge.textContent = level === 'safe' ? '✓' : level === 'caution' ? '!' : level === 'high' ? '!' : '?';
  labelEl.textContent = label || 'Threat Score';
  descEl.textContent = desc || '';
}

function setLoading() {
  document.getElementById('domain').textContent = '…';
  setScoreUI('unknown', 'Threat Score', 'Checking…');
  document.getElementById('message').textContent = '';
}

function setError(msg) {
  setScoreUI('unknown', 'Threat Score', '');
  const messageEl = document.getElementById('message');
  messageEl.className = 'error';
  messageEl.textContent = msg;
}

async function fetchThreatScore(domain) {
  const url = `${THREAT_SCORE_API}?domain=${encodeURIComponent(domain)}`;
  const res = await fetch(url, { method: 'GET', credentials: 'omit' });
  if (!res.ok) {
    if (res.status === 404) return { level: 'unknown', label: 'Unknown', description: 'API not configured' };
    throw new Error(`API ${res.status}`);
  }
  const data = await res.json();
  return {
    level: (data.level || data.risk || 'unknown').toLowerCase(),
    label: data.label || data.level || 'Unknown',
    description: data.description || data.message || '',
  };
}

function applyScore(domain, data) {
  document.getElementById('domain').textContent = domain || '—';
  const level = (data.level || 'unknown').toLowerCase();
  const safe = ['safe', 'low', 'green'].includes(level);
  const caution = ['caution', 'medium', 'yellow'].includes(level);
  const high = ['high', 'danger', 'red'].includes(level);
  const l = safe ? 'safe' : caution ? 'caution' : high ? 'high' : 'unknown';
  const desc = data.description || (safe ? 'Low risk' : caution ? 'Proceed with caution' : high ? 'High risk' : 'No data');
  setScoreUI(l, data.label || 'Threat Score', desc);
}

async function init() {
  setLoading();
  let tab;
  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch {
    setError('Cannot read current tab');
    return;
  }
  if (!tab || !tab.url) {
    setError('No URL (e.g. new tab)');
    return;
  }
  const domain = getDomainFromUrl(tab.url);
  if (!domain) {
    setError('Invalid URL');
    return;
  }
  document.getElementById('domain').textContent = domain;
  try {
    const data = await fetchThreatScore(domain);
    applyScore(domain, data);
  } catch (e) {
    setError('Score unavailable. Ensure ' + API_BASE + ' is reachable.');
    applyScore(domain, { level: 'unknown', label: 'Unknown', description: 'API error or not configured' });
  }
}

document.addEventListener('DOMContentLoaded', init);
