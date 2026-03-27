/**
 * Expands roadmapArticles2026 entries to long-form bodies (~850–950 words) using
 * title, subtitle, summary, focusKeyword, and the short seed body.
 * Run: npx tsx scripts/expand-roadmap-bodies.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { roadmapArticles2026 } from "../convex/roadmapArticles2026.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "convex", "roadmapArticles2026.ts");

type Article = (typeof roadmapArticles2026)[number];

function seedSnippet(body: string): string {
  const oneLine = body.replace(/\s+/g, " ").trim();
  if (oneLine.length <= 320) return oneLine;
  return `${oneLine.slice(0, 317)}…`;
}

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function pick<T>(arr: T[], seed: number, i: number): T {
  return arr[(seed + i) % arr.length];
}

const openings = (a: Article) => [
  `This roadmap piece centers on ${a.focusKeyword} as it shows up in real programs: not slide-deck theory, but the sequencing of controls, telemetry, and accountability that makes outcomes measurable.`,
  `Across enterprises and platform operators, ${a.focusKeyword} is increasingly treated as a cross-functional initiative—security, infrastructure, product, and risk—rather than a single team’s side project.`,
  `The subtitle frames the immediate pressure: ${a.subtitle}`,
];

const sentenceBuilders: ((a: Article, i: number) => string)[] = [
  (a) =>
    `If you start from the seed observation—${seedSnippet(a.body).replace(/\.$/, "")}—the next step is to translate that into a roadmap: what to instrument first, what to automate next, and what to prove with evidence rather than intent.`,
  (a) =>
    `A practical ${a.focusKeyword} roadmap in 2026 assumes noisy data, partial visibility, and attackers who adapt quickly; the goal is not perfect prediction but faster, safer decisions with clear ownership.`,
  (a) =>
    `Your summary line captures the arc: ${a.summary}`,
  (a) =>
    `For executives, the value story is risk reduction and operational resilience; for practitioners, it is fewer false positives, tighter feedback loops, and workflows that do not require heroic manual effort.`,
  (a) =>
    `Start with a narrow scope: pick the highest-risk workflows, the most sensitive assets, or the most abused interfaces—then expand only after you can show measurable improvement in detection, response time, or control coverage.`,
  (a) =>
    `Telemetry quality matters as much as model sophistication: inconsistent timestamps, missing identity context, and unlabeled events will undermine any analytics layer, no matter how advanced the algorithms.`,
  (a) =>
    `Automation should be layered: first standardize enrichment and routing, then introduce guided responses, and only then pursue closed-loop actions—each stage gated by rollback plans and audit trails.`,
  (a) =>
    `Integrations are where roadmaps stall or succeed: SOAR playbooks, ticketing, CMDB links, identity providers, and cloud control planes should be treated as first-class requirements, not “phase two” glue work.`,
  (a) =>
    `Threat modeling should be explicit about abuse cases: insider risk, supply-chain compromise, credential stuffing, social engineering, and third-party integrations—then map those abuse cases to concrete detections and tests.`,
  (a) =>
    `Testing should be continuous: purple-team exercises, tabletop drills, and replay of historical incidents to validate that detections fire, escalations reach the right owners, and containment steps actually work.`,
  (a) =>
    `Metrics should be outcome-oriented: time-to-triage, time-to-contain, coverage of critical assets, percent of alerts with identity context, and repeat-incident rate—paired with sampling audits for false negatives.`,
  (a) =>
    `Privacy and compliance constraints are not blockers; they are design inputs—data minimization, retention boundaries, and access controls should be embedded early so analytics programs do not create new liabilities.`,
  (a) =>
    `For gaming and consumer platforms, player trust is part of security ROI: transparent enforcement, appeals processes, and proportionate penalties reduce churn and improve the quality of telemetry you receive.`,
  (a) =>
    `For cloud-native stacks, prioritize drift detection and misconfiguration prevention alongside runtime defense; many incidents still begin with exposed storage, weak IAM paths, or unpatched ingress.`,
  (a) =>
    `Identity remains the spine: MFA coverage, session risk signals, device posture, and privileged access management should be continuously verified—not checked annually on a spreadsheet.`,
  (a) =>
    `Vendor risk is part of the roadmap: understand what third parties can access, how their compromise would manifest in your logs, and how you would revoke trust quickly without breaking the business.`,
  (a) =>
    `Resilience planning should include degraded-mode operations: what happens when key SaaS APIs are down, when logs are delayed, or when an automation channel misfires—manual runbooks still matter.`,
  (a) =>
    `Documentation and knowledge transfer are force multipliers: runbooks, decision records, and on-call training reduce variance when teams rotate and incidents arrive at 2 a.m.`,
  (a) =>
    `Budget realistically for maintenance: models drift, rules rot, and integrations break with upstream changes—allocate time for tuning, pruning, and refactoring, not only net-new features.`,
  (a) =>
    `Finally, treat ${a.focusKeyword} as a living program: quarterly reviews of scope, threat landscape shifts, and technology changes—so the roadmap stays aligned with reality, not last year’s plan.`,
  (a) =>
    `Cross-functional alignment workshops help: bring incident response, engineering, and risk together to agree on definitions of “severity,” “done,” and “acceptable residual risk” for ${a.focusKeyword} initiatives.`,
  (a) =>
    `Where AI assists analysts, keep humans in the loop for irreversible actions, and log model versions, prompts, and outputs for investigations—future auditors will ask for this trail.`,
  (a) =>
    `For roadmap sequencing, favor incremental wins: ship a thin vertical slice that improves one workflow end-to-end, then widen coverage rather than boiling the ocean with parallel workstreams.`,
  (a) =>
    `Communication plans matter: executives need crisp KPIs, engineers need concrete acceptance criteria, and operators need clarity on escalation—${a.focusKeyword} programs fail quietly when narratives diverge.`,
];

function expandBody(a: Article): string {
  const seed = hashSlug(a.slug);
  const parts: string[] = [];

  parts.push(`## Strategic context`);
  parts.push(
    `${openings(a)[0]} ${openings(a)[1]} ${openings(a)[2]} The title anchors the narrative: ${a.title} The following sections unpack priorities, operating patterns, and measurement for ${a.focusKeyword}.`,
  );

  parts.push(`## Why ${a.focusKeyword} matters now`);
  for (let i = 0; i < 4; i++) {
    parts.push(pick(sentenceBuilders, seed, i)(a, i));
  }

  parts.push(`## Roadmap phases: from baseline to scale`);
  for (let i = 4; i < 12; i++) {
    parts.push(pick(sentenceBuilders, seed, i)(a, i));
  }

  parts.push(`## Governance, risks, and what “good” looks like`);
  for (let i = 12; i < 19; i++) {
    parts.push(pick(sentenceBuilders, seed, i)(a, i));
  }

  parts.push(`## Long-term positioning`);
  for (let i = 19; i < sentenceBuilders.length; i++) {
    parts.push(pick(sentenceBuilders, seed, i)(a, i));
  }

  return parts.join("\n\n");
}

function main() {
  const next = roadmapArticles2026.map((article) => {
    const body = expandBody(article);
    const wc = wordCount(body);
    const minutes = Math.max(6, Math.round(wc / 200));
    return {
      ...article,
      body,
      wordCount: wc,
      estimatedReadingTimeMinutes: minutes,
    };
  });

  const file =
    "export const roadmapArticles2026 = " + JSON.stringify(next, null, 2) + ";\n";
  fs.writeFileSync(outPath, file, "utf8");
  console.log(`Wrote ${outPath}`);
  console.log(
    `Articles: ${next.length}; word counts: min=${Math.min(...next.map((a) => a.wordCount))} max=${Math.max(...next.map((a) => a.wordCount))}`,
  );
}

main();
