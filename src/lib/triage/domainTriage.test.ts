import { test } from "node:test";
import assert from "node:assert/strict";
import {
  triageDomain,
  normalizeHostname,
  detectSecretToken,
  isOfficialHost,
  OfficialDomain,
  KnownBadIndicator,
} from "./domainTriage";

const OFFICIAL: OfficialDomain[] = [
  { host: "steamcommunity.com", label: "Steam" },
  { host: "steampowered.com", label: "Steam" },
  { host: "discord.com", label: "Discord" },
];

const BAD: KnownBadIndicator[] = [{ host: "steamcommunit-login.ru", label: "Steam phishing kit" }];

test("exact official host matches", () => {
  const r = triageDomain("steamcommunity.com", OFFICIAL, BAD);
  assert.equal(r.verdict, "no_known_indicators");
  assert.equal(r.matchedOfficial, "Steam");
});

test("subdomain of official host matches", () => {
  const r = triageDomain("store.steampowered.com", OFFICIAL, BAD);
  assert.equal(r.matchedOfficial, "Steam");
});

test("suffix trap: steamcommunity.com.evil.com does NOT match", () => {
  const r = triageDomain("steamcommunity.com.evil.com", OFFICIAL, BAD);
  assert.equal(r.verdict, "insufficient_evidence");
  assert.equal(r.matchedOfficial, null);
});

test("prefix trap: evil-steamcommunity.com does NOT match", () => {
  const r = triageDomain("evil-steamcommunity.com", OFFICIAL, BAD);
  assert.equal(r.matchedOfficial, null);
});

test("known-bad host -> known_malicious", () => {
  const r = triageDomain("steamcommunit-login.ru", OFFICIAL, BAD);
  assert.equal(r.verdict, "known_malicious");
  assert.equal(r.matchedBad, "Steam phishing kit");
});

test("HTTPS is NOT treated as proof of trust", () => {
  const r = triageDomain("https://steamcommunit-login.ru/login", OFFICIAL, BAD);
  assert.equal(r.verdict, "known_malicious");
});

test("unknown domain -> insufficient_evidence (never safe)", () => {
  const r = triageDomain("totally-unknown-domain.example", OFFICIAL, BAD);
  assert.equal(r.verdict, "insufficient_evidence");
});

test("homograph (non-ASCII) is flagged", () => {
  const r = triageDomain("steamcommúnity.com", OFFICIAL, BAD);
  assert.ok(r.reasons.some((x) => x.includes("non-ASCII")));
  assert.equal(r.matchedOfficial, null);
});

test("token-bearing URL is flagged and blocked from submission", () => {
  const r = triageDomain("https://steamcommunity.com/reset?token=abc123", OFFICIAL, BAD);
  assert.equal(r.hasSecretToken, true);
  assert.equal(r.blockSubmission, true);
  assert.ok(r.reasons.some((x) => x.toLowerCase().includes("token")));
});

test("signed URL (x-amz-signature) is flagged as secret-bearing", () => {
  assert.equal(detectSecretToken("https://cdn.example.com/file?sig=abc&x-amz-signature=def"), true);
});

test("unparseable input -> insufficient_evidence", () => {
  const r = triageDomain("not a url at all", OFFICIAL, BAD);
  assert.equal(r.verdict, "insufficient_evidence");
  assert.equal(r.normalizedHost, null);
});

test("normalizeHostname lowercases and strips path/port/scheme", () => {
  assert.equal(normalizeHostname("HTTPS://SteamCommunity.com:443/login?x=1"), "steamcommunity.com");
  assert.equal(normalizeHostname("  steamcommunity.com  "), "steamcommunity.com");
});

test("isOfficialHost enforces the dot boundary", () => {
  assert.equal(isOfficialHost("steamcommunity.com", "steamcommunity.com"), true);
  assert.equal(isOfficialHost("store.steampowered.com", "steampowered.com"), true);
  assert.equal(isOfficialHost("steamcommunity.com.evil.com", "steamcommunity.com"), false);
  assert.equal(isOfficialHost("evil-steamcommunity.com", "steamcommunity.com"), false);
});
