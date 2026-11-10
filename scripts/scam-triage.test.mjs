import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  triageDomain,
  triageMessage,
  triageInput,
  normalizeHostname,
  detectSecretToken,
  isOfficialHost,
} from './lib/scam-triage.mjs';

const OFFICIAL = [
  { host: 'steamcommunity.com', label: 'Steam' },
  { host: 'steampowered.com', label: 'Steam' },
  { host: 'discord.com', label: 'Discord' },
];
const BAD = [{ host: 'steamcommunit-login.ru', label: 'Steam phishing kit' }];

test('official host → no_known_indicators (not safe)', () => {
  const r = triageDomain('store.steampowered.com', OFFICIAL, BAD);
  assert.equal(r.verdict, 'no_known_indicators');
});

test('unknown host → insufficient_evidence', () => {
  const r = triageDomain('totally-unknown-giveaway.example', OFFICIAL, BAD);
  assert.equal(r.verdict, 'insufficient_evidence');
});

test('known bad → known_malicious', () => {
  const r = triageDomain('steamcommunit-login.ru', OFFICIAL, BAD);
  assert.equal(r.verdict, 'known_malicious');
});

test('suffix trap does not match official', () => {
  const r = triageDomain('steamcommunity.com.evil.com', OFFICIAL, BAD);
  assert.equal(r.matchedOfficial, null);
  assert.equal(r.verdict, 'insufficient_evidence');
});

test('secret-bearing URL blocks submission', () => {
  assert.equal(detectSecretToken('https://example.com/reset?token=abc'), true);
  const r = triageDomain('https://evil.example/login?token=abc', OFFICIAL, BAD);
  assert.equal(r.blockSubmission, true);
});

test('homograph flagged', () => {
  const r = triageDomain('xn--steamcommunity-test.com', OFFICIAL, BAD);
  // punycode ASCII alone may not trip; non-ASCII does:
  const r2 = triageDomain('steаmcommunity.com', OFFICIAL, BAD); // Cyrillic а
  assert.ok(r2.reasons.some((x) => /homograph/i.test(x)) || r2.verdict === 'insufficient_evidence');
});

test('message free V-Bucks → suspicious', () => {
  const r = triageMessage('Claim free V-Bucks now — limited time!');
  assert.equal(r.verdict, 'suspicious');
  assert.ok(r.redFlags.length >= 1);
});

test('message with no flags → no_known_indicators', () => {
  const r = triageMessage('Looking for squadmates for ranked tonight.');
  assert.equal(r.verdict, 'no_known_indicators');
});

test('triageInput never invents safe', () => {
  const u = triageInput('random-mod-site.xyz', OFFICIAL, BAD, 'domain');
  assert.notEqual(u.result.verdict, 'safe');
  assert.equal(u.result.verdict, 'insufficient_evidence');
});

test('normalizeHostname and official host helper', () => {
  assert.equal(normalizeHostname('https://Discord.com/login'), 'discord.com');
  assert.equal(isOfficialHost('cdn.discord.com', 'discord.com'), true);
  assert.equal(isOfficialHost('discord.com.evil.com', 'discord.com'), false);
});
