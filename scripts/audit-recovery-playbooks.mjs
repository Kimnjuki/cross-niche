#!/usr/bin/env node
/**
 * QA02 — recovery playbook audit.
 * Checks the committed source (not the public projection):
 *   - 56 guides
 *   - at least four steps
 *   - reviewedAt present and not stale
 *   - official links are https and on that platform's domain allowlist
 *   - no prompt asking the reader to send credentials to The Grid Nexus
 *   - suspected-malware leads with isolating the device
 *   - scam-recovery leads with not paying
 *   - Steam API-key and Discord token guidance still exist
 *
 * Does not HEAD the network. Host allowlisting is the local check.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const playbooks = JSON.parse(
  fs.readFileSync(path.join(root, 'src', 'data', 'recovery-playbooks.json'), 'utf8'),
).pages ?? [];
const platforms = JSON.parse(
  fs.readFileSync(path.join(root, 'src', 'data', 'platform-security.json'), 'utf8'),
).platforms ?? [];

const bySlug = Object.fromEntries(platforms.map((p) => [p.slug, p]));
const failures = [];
const EXPECTED = 56;
const MAX_AGE_DAYS = 400;
const now = Date.parse('2026-11-10T00:00:00Z');

const CREDENTIAL_PROMPT =
  /(?:send|paste|submit|give)\s+(?:us\s+|me\s+)?(?:your\s+)?(?:password|token|seed|cookie|mfa|2fa)|<input[^>]*password|we (?:need|require) your (?:password|token)/i;
const MALWARE_FIRST = /isolat|infected|clean(?:ed)? device|stop using|malware/i;

function hostAllowed(platform, urlString) {
  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  const host = parsed.hostname.toLowerCase();
  const bases = new Set((platform.officialDomains || []).map((d) => d.toLowerCase()));
  for (const link of platform.links || []) {
    try {
      bases.add(new URL(link.url).hostname.toLowerCase());
    } catch {
      /* ignore malformed catalog links */
    }
  }
  for (const base of bases) {
    if (host === base || host.endsWith(`.${base}`)) return true;
  }
  return false;
}

if (playbooks.length !== EXPECTED) {
  failures.push(`count ${playbooks.length} != ${EXPECTED}`);
}

for (const page of playbooks) {
  const slug = page.platform?.slug;
  const scenario = page.playbook?.scenario;
  const id = `${slug}/${scenario}`;
  const platform = bySlug[slug];
  const steps = page.playbook?.steps?.steps ?? [];

  if (!platform) failures.push(`${id}: unknown platform`);
  if (steps.length < 4) failures.push(`${id}: only ${steps.length} steps`);
  if (page.playbook?.steps?.schemaVersion == null) failures.push(`${id}: missing schemaVersion`);

  const reviewedAt = page.playbook?.reviewedAt;
  if (!reviewedAt) {
    failures.push(`${id}: missing reviewedAt`);
  } else {
    const ageDays = (now - reviewedAt) / 86_400_000;
    if (ageDays > MAX_AGE_DAYS) failures.push(`${id}: reviewedAt is ${Math.round(ageDays)} days old`);
    if (reviewedAt > now + 86_400_000) failures.push(`${id}: reviewedAt is in the future`);
  }

  const links = page.officialLinks ?? [];
  if (links.length < 1) failures.push(`${id}: no official links`);
  if (platform) {
    for (const link of links) {
      if (!hostAllowed(platform, link.url)) {
        failures.push(`${id}: link host not on allowlist ${link.url}`);
      }
    }
  }

  const blob = [
    page.playbook?.steps?.disclaimer || '',
    ...steps.map((s) => `${s.title || ''} ${s.body || ''}`),
  ].join('\n');
  if (CREDENTIAL_PROMPT.test(blob)) failures.push(`${id}: credential prompt`);

  const first = `${steps[0]?.title || ''} ${steps[0]?.body || ''}`;
  if (scenario === 'suspected-malware' && !MALWARE_FIRST.test(first)) {
    failures.push(`${id}: malware scenario is not device-first`);
  }
  if (scenario === 'scam-recovery-contact' && !/pay|money|third[- ]party/i.test(first)) {
    failures.push(`${id}: scam aftermath does not lead with do-not-pay`);
  }
}

function corpus(slug) {
  return playbooks
    .filter((p) => p.platform?.slug === slug)
    .map((p) => (p.playbook?.steps?.steps ?? []).map((s) => `${s.title} ${s.body}`).join('\n'))
    .join('\n');
}

if (!/api key/i.test(corpus('steam'))) failures.push('steam: no API key guidance');
if (!/token/i.test(corpus('discord'))) failures.push('discord: no token guidance');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Recovery audit passed: ${playbooks.length} playbooks.`);
