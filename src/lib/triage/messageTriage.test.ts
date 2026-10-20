import { test } from "node:test";
import assert from "node:assert/strict";
import { triageMessage, extractUrl } from "./messageTriage";

test("flags free-currency/skin generators", () => {
  const r = triageMessage("FREE V-BUCKS GENERATOR - unlimited coins, act now!!");
  assert.equal(r.verdict, "suspicious");
  assert.equal(r.matchedCategory, "free-skin-generators");
  assert.ok(r.redFlags.length >= 1);
});

test("flags QR-code verification scams", () => {
  const r = triageMessage("verify your account by scanning this QR code to join the server");
  assert.equal(r.verdict, "suspicious");
  assert.equal(r.matchedCategory, "discord-verify-qr-scams");
});

test("flags paid recovery agents", () => {
  const r = triageMessage("your account was hacked, I can recover it for a fee");
  assert.equal(r.verdict, "suspicious");
  assert.equal(r.matchedCategory, "fake-support-recovery");
});

test("flags cheat downloads", () => {
  const r = triageMessage("download this free aimbot no ban undetected");
  assert.equal(r.verdict, "suspicious");
  assert.equal(r.matchedCategory, "free-game-cheats-aimbot");
});

test("returns no indicators for benign text (never 'safe')", () => {
  const r = triageMessage("just a normal message about gaming this weekend");
  assert.equal(r.verdict, "no_known_indicators");
  assert.equal(r.redFlags.length, 0);
  assert.ok(r.recommendedActions.some((a) => /not proof/i.test(a)));
});

test("extracts a URL from free text", () => {
  assert.equal(
    extractUrl("click https://steamcommunit-login.ru/login now"),
    "https://steamcommunit-login.ru/login"
  );
  assert.equal(extractUrl("no url here"), null);
});
