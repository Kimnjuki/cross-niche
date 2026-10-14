import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateCheckup,
  CheckupQuestion,
  Answer,
  MIN_COVERAGE_FOR_SCORE,
} from "./evaluator";

const QUESTIONS: CheckupQuestion[] = [
  { id: "recovery_email", dimension: "email_recovery", critical: "Secure your recovery email" },
  { id: "recovery_phone", dimension: "email_recovery" },
  { id: "mfa", dimension: "account_auth", critical: "Enable two-factor authentication" },
  { id: "unique_password", dimension: "account_auth" },
  { id: "log_out_shared", dimension: "session_hygiene" },
  { id: "malware_scan", dimension: "session_hygiene" },
  { id: "verify_downloads", dimension: "downloads_scams" },
  { id: "recognize_scams", dimension: "downloads_scams" },
  { id: "payment_privacy", dimension: "payments_privacy" },
  { id: "suspected_compromise", dimension: "account_auth", danger: "Route to account recovery" },
];

// total applicable weight = 30*2 + 25*2 + 20*2 + 15*2 + 10*1 = 190
const TOTAL_APPLICABLE = 190;

function run(overrides: Record<string, Answer>) {
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = "no"; // danger default = no compromise
  // reset danger question default to "no"
  answers["suspected_compromise"] = "no";
  Object.assign(answers, overrides);
  return evaluateCheckup({ version: "readiness_v1", questions: QUESTIONS, answers });
}

function allYes() {
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = q.danger ? "no" : "yes";
  return evaluateCheckup({ version: "readiness_v1", questions: QUESTIONS, answers });
}

test("all controls satisfied -> 100 score, full coverage", () => {
  const r = allYes();
  assert.equal(r.coverageRatio, 1);
  assert.equal(r.readinessScore, 100);
  assert.equal(r.criticalIssues.length, 0);
});

test("all controls missing -> 0 score", () => {
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = q.danger ? "no" : "no";
  const r = evaluateCheckup({ version: "readiness_v1", questions: QUESTIONS, answers });
  assert.equal(r.readinessScore, 0);
  assert.equal(r.coverageRatio, 1);
  // both critical controls answered "no" surface as urgent tasks
  assert.ok(r.criticalIssues.includes("Secure your recovery email"));
  assert.ok(r.criticalIssues.includes("Enable two-factor authentication"));
});

test("partial answers -> 50 score", () => {
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = q.danger ? "no" : "partial";
  const r = evaluateCheckup({ version: "readiness_v1", questions: QUESTIONS, answers });
  assert.equal(r.readinessScore, 50);
});

test("unknown (non-critical) excludes from score, lowers coverage", () => {
  const r = run({ recovery_phone: "unknown", recovery_email: "yes", mfa: "yes", unique_password: "yes", log_out_shared: "yes", malware_scan: "yes", verify_downloads: "yes", recognize_scams: "yes", payment_privacy: "yes" });
  assert.equal(r.readinessScore, 100); // unanswered doesn't drag the average down
  assert.ok(Math.abs(r.coverageRatio - (TOTAL_APPLICABLE - 30) / TOTAL_APPLICABLE) < 0.0001);
});

test("not_applicable excludes entirely, does not reduce coverage", () => {
  const r = run({ payment_privacy: "not_applicable", recovery_email: "yes", recovery_phone: "yes", mfa: "yes", unique_password: "yes", log_out_shared: "yes", malware_scan: "yes", verify_downloads: "yes", recognize_scams: "yes" });
  assert.equal(r.coverageRatio, 1);
  assert.equal(r.readinessScore, 100);
});

test("critical control unanswered -> band withheld (null score)", () => {
  const r = run({ mfa: "unknown", recovery_email: "yes", recovery_phone: "yes", unique_password: "yes", log_out_shared: "yes", malware_scan: "yes", verify_downloads: "yes", recognize_scams: "yes", payment_privacy: "yes" });
  assert.equal(r.readinessScore, null);
});

test("coverage below threshold -> band withheld (null score)", () => {
  // only 3 of 9 applicable controls answered (recovery_email 30 + recovery_phone 30 + mfa 25 = 85); rest unknown
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = q.danger ? "no" : "unknown";
  answers["recovery_email"] = "yes";
  answers["recovery_phone"] = "yes";
  answers["mfa"] = "yes";
  const r = evaluateCheckup({ version: "readiness_v1", questions: QUESTIONS, answers });
  assert.ok(r.coverageRatio < MIN_COVERAGE_FOR_SCORE);
  assert.equal(r.readinessScore, null);
});

test("danger=yes routes to recovery first and is excluded from score", () => {
  const r = run({
    suspected_compromise: "yes",
    recovery_email: "yes", recovery_phone: "yes", mfa: "yes", unique_password: "yes",
    log_out_shared: "yes", malware_scan: "yes", verify_downloads: "yes", recognize_scams: "yes", payment_privacy: "yes",
  });
  assert.equal(r.readinessScore, 100); // screening question doesn't pollute score
  assert.equal(r.priorityTasks[0], "Route to account recovery");
});

test("dimension weights matter: 30% dim 'no' costs more than 10% dim 'no'", () => {
  const noRecovery = run({ recovery_email: "no", recovery_phone: "yes", mfa: "yes", unique_password: "yes", log_out_shared: "yes", malware_scan: "yes", verify_downloads: "yes", recognize_scams: "yes", payment_privacy: "yes" });
  const noPayment = run({ recovery_email: "yes", recovery_phone: "yes", mfa: "yes", unique_password: "yes", log_out_shared: "yes", malware_scan: "yes", verify_downloads: "yes", recognize_scams: "yes", payment_privacy: "no" });
  assert.ok(noRecovery.readinessScore! < noPayment.readinessScore!);
});

test("result carries the no-safety-guarantee limitation", () => {
  const r = allYes();
  assert.ok(r.limitations.some((l) => l.includes("not a device scan")));
});

test("priority tasks are bounded to at most 3 and de-duplicated", () => {
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = q.danger ? "no" : "no";
  const r = evaluateCheckup({ version: "readiness_v1", questions: QUESTIONS, answers });
  assert.ok(r.priorityTasks.length <= 3);
  assert.equal(new Set(r.priorityTasks).size, r.priorityTasks.length);
});
