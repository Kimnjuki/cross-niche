import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  PLATFORM_GRADE_REDIRECTS,
  canonicalGradePath,
  isRedirectedGameSlug,
} from './lib/game-platform-split.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nginx = fs.readFileSync(path.join(root, 'nginx.conf'), 'utf8');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

const LEGACY_TOOLS = [
  ['/tools/security-scanner', '/tools/scam-check'],
  ['/tools/nexusguard', '/tools'],
  ['/tools/security-briefing', '/threats'],
  ['/tools/breach-explainer', '/threats'],
  ['/tools/exploit-risk-meter', '/threats'],
  ['/tools/pc-builder', '/tools'],
  ['/tools/threat-scanner', '/tools/scam-check'],
];

function vercelDestination(source) {
  const hit = (vercel.redirects || []).find((r) => r.source === source);
  return hit?.destination;
}

test('platform grades canonicalise to hubs', () => {
  assert.equal(canonicalGradePath('steam'), '/platforms/steam/security');
  assert.equal(canonicalGradePath('discord'), '/platforms/discord/security');
  assert.equal(canonicalGradePath('playstation-network'), '/platforms/playstation/security');
  assert.equal(canonicalGradePath('fortnite'), '/games/fortnite');
  assert.equal(isRedirectedGameSlug('nintendo-switch-online'), false);
  assert.equal(Object.keys(PLATFORM_GRADE_REDIRECTS).length, 3);
});

test('nginx 301s platform grade URLs and does not loop', () => {
  for (const [slug, dest] of Object.entries(PLATFORM_GRADE_REDIRECTS)) {
    assert.match(nginx, new RegExp(`location = /games/${slug} \\{ return 301 ${dest}; \\}`));
    assert.notEqual(dest, `/games/${slug}`);
  }
  assert.match(nginx, /rewrite \^\/security-tools\/\?\$\s+\/tools permanent;/);
  assert.doesNotMatch(nginx, /rewrite \^\/security-tools\/\?\$\s+\/tools\/security-scanner/);
  for (const [from, to] of LEGACY_TOOLS) {
    assert.match(nginx, new RegExp(`location = ${from} \\{ return 301 ${to}; \\}`));
    assert.notEqual(from, to);
  }
});

test('vercel redirects match nginx', () => {
  assert.equal(vercelDestination('/security-tools'), '/tools');
  assert.equal(vercelDestination('/nexus/nexusguard'), '/tools');
  for (const [slug, dest] of Object.entries(PLATFORM_GRADE_REDIRECTS)) {
    assert.equal(vercelDestination(`/games/${slug}`), dest);
  }
  for (const [from, to] of LEGACY_TOOLS) {
    assert.equal(vercelDestination(from), to);
  }
});

test('recovery playbook audit passes', () => {
  const result = spawnSync(process.execPath, ['scripts/audit-recovery-playbooks.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
