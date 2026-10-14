/**
 * Pure, versioned evaluator for the Player Protection Checkup (blueprint F01/T05).
 *
 * Self-contained (no Convex, no React, no network): the exact same function runs
 * browser-side for anonymous checkups and server-side for persisted results, so
 * the score can never be tampered with by client inputs — the server recomputes
 * from the raw answers.
 *
 * Scoring policy (blueprint "scoring_and_evidence_policy"):
 *   - Dimensions: email/recovery 30%, account auth 25%, session/device hygiene 20%,
 *     downloads/scams 15%, payments/privacy 10%.
 *   - Answer values: yes=1, partial=0.5, no=0. unknown=excluded (uncovered),
 *     not_applicable=excluded entirely (deterministic rules, not user choice).
 *   - readiness = 100 * sum(answeredWeight * value) / sum(answeredWeight).
 *   - coverage = sum(answeredWeight) / sum(applicableWeight).
 *   - Band withheld (score null) when coverage < 0.8 OR a critical control is unanswered.
 *   - Critical overrides: a "danger" answer of yes routes to recovery; a "critical"
 *     control answered no/partial surfaces an urgent task regardless of average.
 *
 * A score is self-reported readiness, NOT a device scan, audit, or breach guarantee.
 */

export type CheckupDimension =
  | "email_recovery"
  | "account_auth"
  | "session_hygiene"
  | "downloads_scams"
  | "payments_privacy";

export type Answer = "yes" | "partial" | "no" | "unknown" | "not_applicable";

export const DIMENSION_WEIGHTS: Record<CheckupDimension, number> = {
  email_recovery: 30,
  account_auth: 25,
  session_hygiene: 20,
  downloads_scams: 15,
  payments_privacy: 10,
};

const ANSWER_VALUE: Record<Answer, number | null> = {
  yes: 1,
  partial: 0.5,
  no: 0,
  unknown: null,
  not_applicable: null,
};

export interface CheckupQuestion {
  id: string;
  dimension: CheckupDimension;
  /** relative weight within its dimension (default 1) */
  weight?: number;
  /** task label surfaced as urgent when answered "no" or "partial" */
  critical?: string;
  /** recovery label surfaced when answered "yes" (immediate danger) */
  danger?: string;
}

export interface CheckupInput {
  version: string;
  questions: CheckupQuestion[];
  answers: Record<string, Answer>;
}

export interface DimensionResult {
  dimension: CheckupDimension;
  dimensionWeight: number;
  applicableWeight: number;
  answeredWeight: number;
  /** 0..1 within-dimension score */
  score: number;
}

export interface CheckupResult {
  version: string;
  /** 0..1 fraction of applicable weight that was answered */
  coverageRatio: number;
  /** 0..100, or null when the band is withheld (insufficient coverage / critical unanswered) */
  readinessScore: number | null;
  dimensions: DimensionResult[];
  criticalIssues: string[];
  priorityTasks: string[];
  limitations: string[];
}

export const CHECKUP_LIMITATIONS = [
  "Self-reported readiness — not a device scan, account audit, or breach guarantee.",
  "Dimension weights are a prioritization heuristic, not a validated probability.",
  "A higher score is not evidence that a breach was prevented.",
] as const;

/** Minimum coverage (0..1) below which no overall band is shown. */
export const MIN_COVERAGE_FOR_SCORE = 0.8;

export function evaluateCheckup(input: CheckupInput): CheckupResult {
  const { questions, answers } = input;

  const dims = new Map<CheckupDimension, DimensionResult>();
  for (const d of Object.keys(DIMENSION_WEIGHTS) as CheckupDimension[]) {
    dims.set(d, {
      dimension: d,
      dimensionWeight: DIMENSION_WEIGHTS[d],
      applicableWeight: 0,
      answeredWeight: 0,
      score: 0,
    });
  }

  let totalApplicable = 0;
  let totalAnswered = 0;
  let totalScoreWeight = 0;
  let criticalUnanswered = false;
  const criticalIssues: string[] = [];
  const priorityTasks: string[] = [];

  for (const q of questions) {
    // Effective weight = relative question weight × its dimension weight
    // (dimensions 30/25/20/15/10 per the blueprint scoring policy).
    const w = (q.weight ?? 1) * DIMENSION_WEIGHTS[q.dimension];
    const answer = answers[q.id] ?? "unknown";
    const dim = dims.get(q.dimension)!;

    // "danger" questions are screening questions, not scored controls:
    // they trigger recovery routing but never contribute to score/coverage.
    if (q.danger) {
      if (answer === "yes") {
        criticalIssues.push(q.danger);
        priorityTasks.unshift(q.danger); // highest priority
      }
      continue;
    }

    if (answer === "not_applicable") {
      // excluded entirely — not applicable, not uncovered
      continue;
    }

    dim.applicableWeight += w;
    totalApplicable += w;

    if (q.critical && (answer === "no" || answer === "partial")) {
      criticalIssues.push(q.critical);
      priorityTasks.push(q.critical);
    }
    if (q.critical && answer === "unknown") {
      criticalUnanswered = true;
    }

    const value = ANSWER_VALUE[answer];
    if (value === null) {
      // unknown — applicable but unanswered
      continue;
    }

    dim.answeredWeight += w;
    totalAnswered += w;
    dim.score += w * value;
    totalScoreWeight += w * value;
  }

  for (const dim of dims.values()) {
    dim.score = dim.answeredWeight > 0 ? dim.score / dim.answeredWeight : 0;
  }

  const coverageRatio = totalApplicable > 0 ? totalAnswered / totalApplicable : 0;
  const rawScore = totalAnswered > 0 ? (totalScoreWeight / totalAnswered) * 100 : null;

  const bandWithheld = coverageRatio < MIN_COVERAGE_FOR_SCORE || criticalUnanswered;

  // Add generic prioritized tasks from the weakest answered dimensions (bounded to 3 total).
  const weakest = [...dims.values()]
    .filter((d) => d.answeredWeight > 0)
    .sort((a, b) => a.score - b.score)
    .map((d) => `Improve ${dimensionLabel(d.dimension).toLowerCase()}`);
  for (const t of weakest) {
    if (priorityTasks.length >= 3) break;
    priorityTasks.push(t);
  }

  return {
    version: input.version,
    coverageRatio,
    readinessScore: bandWithheld ? null : rawScore,
    dimensions: [...dims.values()],
    criticalIssues: [...new Set(criticalIssues)],
    priorityTasks: [...new Set(priorityTasks)].slice(0, 3),
    limitations: [...CHECKUP_LIMITATIONS],
  };
}

function dimensionLabel(d: CheckupDimension): string {
  const map: Record<CheckupDimension, string> = {
    email_recovery: "Email and recovery readiness",
    account_auth: "Account authentication",
    session_hygiene: "Session and device hygiene",
    downloads_scams: "Downloads and scam practices",
    payments_privacy: "Payments and privacy",
  };
  return map[d];
}
