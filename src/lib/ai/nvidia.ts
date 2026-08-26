// src/lib/ai/nvidia.ts
// ─────────────────────────────────────────────────────────────────────────────
// NVIDIA NIM (https://build.nvidia.com) integration for The Grid Nexus.
//
// Provides a lightweight, type-safe client for the OpenAI-compatible NVIDIA
// NIM "chat completions" endpoint, plus a higher-level gaming-security scan
// analyzer used by the security tools. The analyzer always falls back to a
// local deterministic heuristic when the API key is missing or unreachable so
// that scanning functionality stays available and competitive.
// ─────────────────────────────────────────────────────────────────────────────

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
// NOTE: meta/llama-3.3-70b-instruct reached end-of-life on 2026-08-26.
// Use a model that is still available in the live NVIDIA NIM catalog.
const DEFAULT_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct';

/** Well-known, publicly available NVIDIA NIM model slots. */
export const NVIDIA_MODELS = {
  default: DEFAULT_MODEL,
  nemotron70b: 'nvidia/llama-3.1-nemotron-70b-instruct',
  nemotron51b: 'nvidia/llama-3.1-nemotron-51b-instruct',
  mistralLarge: 'mistralai/mistral-large-2-instruct',
} as const;

export type NvidiaModel = (typeof NVIDIA_MODELS)[keyof typeof NVIDIA_MODELS];

/** Read the NVIDIA NIM API key from the Vite environment. */
export function getNvidiaApiKey(): string {
  return (import.meta.env.VITE_NVIDIA_API_KEY as string | undefined) ?? '';
}

/** True when a usable `nvapi-*` NVIDIA key has been configured. */
export function isNvidiaEnabled(): boolean {
  return getNvidiaApiKey().startsWith('nvapi-');
}

/** The human-readable model name used when reporting to the user. */
export function nvidiaModelLabel(model?: string): string {
  if (!model) return 'NVIDIA NIM';
  return model.split('/').pop() ?? model;
}

export interface NvidiaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface NvidiaChatOptions {
  model?: NvidiaModel | string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface NvidiaChatResult {
  content: string;
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Send a chat completion request to the NVIDIA NIM OpenAI-compatible API.
 * Throws `Error('NVIDIA_API_KEY_MISSING')` when no valid key is configured.
 */
export async function nvidiaChat(
  messages: NvidiaChatMessage[],
  options: NvidiaChatOptions = {}
): Promise<NvidiaChatResult> {
  const apiKey = getNvidiaApiKey();
  if (!apiKey.startsWith('nvapi-')) {
    throw new Error('NVIDIA_API_KEY_MISSING');
  }

  let response: Response;
  try {
    response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model ?? DEFAULT_MODEL,
        temperature: options.temperature ?? 0.3,
        top_p: 0.9,
        max_tokens: options.maxTokens ?? 1024,
        messages,
      }),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new Error('NVIDIA_API_NETWORK_ERROR');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      detail = body?.error?.message ?? '';
    } catch {
      // ignore parse failures
    }
    // 401/403 mean the key is valid but not entitled to run this model.
    if (response.status === 401 || response.status === 403) {
      throw new Error('NVIDIA_API_UNAUTHORIZED');
    }
    throw new Error(
      `NVIDIA API error ${response.status}: ${detail || response.statusText}`.trim()
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
    model?: string;
    usage?: NvidiaChatResult['usage'];
  };

  const content =
    typeof data?.choices?.[0]?.message?.content === 'string'
      ? data.choices[0].message.content
      : '';

  return {
    content,
    model: data?.model ?? '',
    usage: data?.usage,
  };
}

// ── Gaming-security scan analysis ──────────────────────────────────────────

export interface GamingSecurityFindings {
  /** Normalised severity band matching the tool tiers. */
  severity: 'excellent' | 'good' | 'fair' | 'needs_work';
  /** Short human summary of the scan result. */
  summary: string;
  /** Things the user is doing correctly. */
  strengths: string[];
  /** Specific weaknesses the user should address. */
  gaps: string[];
  /** Concrete, actionable remediation steps. */
  recommendations: string[];
  /** Which path produced this result. */
  provider: 'nvidia' | 'heuristic';
  /** Model used (only when provider is `nvidia`). */
  model?: string;
}

export interface GamingScanInput {
  /** e.g. "Steam", "PlayStation", "Xbox". */
  platform: string;
  /** Account handle if the user provided one. */
  handle?: string;
  /** Overall score as a percentage (0–100). */
  scorePct: number;
  /** Questions the user passed. */
  passed: string[];
  /** Questions the user failed / is unsure about. */
  failed: string[];
  /** Particularly high-impact failed questions. */
  critical: string[];
}

function severityFromScore(pct: number): GamingSecurityFindings['severity'] {
  if (pct >= 85) return 'excellent';
  if (pct >= 65) return 'good';
  if (pct >= 40) return 'fair';
  return 'needs_work';
}

/**
 * Deterministic heuristic analyzer — the offline-safe fallback. Produces
 * sensible, consistent advice from the scan inputs without any API call.
 */
export function buildGamingSecurityFindings(
  input: GamingScanInput
): GamingSecurityFindings {
  const severity = severityFromScore(input.scorePct);
  const bandName =
    severity === 'excellent'
      ? 'Excellent'
      : severity === 'good'
        ? 'Good'
        : severity === 'fair'
          ? 'Fair'
          : 'At Risk';

  const summary = `${input.platform} security scan complete — ${
    input.handle ? `"${input.handle}" — ` : ''
  }${bandName} (${input.scorePct}%). ${
    input.critical.length
      ? `${input.critical.length} critical issue${
          input.critical.length === 1 ? '' : 's'
        } need immediate attention.`
      : input.failed.length
        ? `${input.failed.length} area${
            input.failed.length === 1 ? '' : 's'
          } can be tightened.`
        : 'Nothing critical found. Keep maintaining these habits.'
  }`;

  const recommendations: string[] = [];
  if (input.critical.length > 0) {
    recommendations.push(
      `Fix high-impact items first: ${input.critical.join('; ')}.`
    );
  }
  if (input.failed.some((f) => /2fa|auth|steam guard|verification/i.test(f))) {
    recommendations.push('Enable two-factor authentication; store recovery codes offline.');
  }
  if (input.failed.some((f) => /password|reus/i.test(f))) {
    recommendations.push('Use a unique password per platform via a password manager, then rotate the reused ones.');
  }
  if (input.failed.some((f) => /private|name|location|profile/i.test(f))) {
    recommendations.push('Harden your public profile — privacy settings prevent social engineering.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Review linked devices/authorisations and re-authenticate periodically.');
    recommendations.push('Monitor login history for any unrecognised location.');
  }

  return {
    severity,
    summary,
    strengths: input.passed.slice(0, 5),
    gaps: input.failed,
    recommendations: recommendations.slice(0, 4),
    provider: 'heuristic',
  };
}

/** Extract a JSON object from a model reply that may include prose/fences. */
function extractJsonObject(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1] : trimmed;
  try {
    const parsed = JSON.parse(candidate) as unknown;
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    const block = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (block >= 0 && end > block) {
      try {
        const parsed = JSON.parse(trimmed.slice(block, end + 1)) as unknown;
        return parsed && typeof parsed === 'object'
          ? (parsed as Record<string, unknown>)
          : null;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function toStrArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeSeverity(value: unknown): GamingSecurityFindings['severity'] {
  if (
    value === 'excellent' ||
    value === 'good' ||
    value === 'fair' ||
    value === 'needs_work'
  ) {
    return value;
  }
  if (value === 'needs-work') return 'needs_work';
  return 'fair';
}

/**
 * Run an AI-powered gaming-security scan via NVIDIA NIM. Falls back to the
 * deterministic heuristic whenever the NVIDIA provider is unavailable.
 */
export async function analyzeGamingSecurityScan(
  input: GamingScanInput,
  options: NvidiaChatOptions = {}
): Promise<GamingSecurityFindings> {
  if (!isNvidiaEnabled()) {
    return buildGamingSecurityFindings(input);
  }

  const systemPrompt =
    'You are an elite gaming-account security analyst at The Grid Nexus. ' +
    'Return ONLY strict JSON, no prose, no markdown fences. ' +
    'The JSON must have exactly these keys: "summary" (string), ' +
    '"severity" ("excellent" | "good" | "fair" | "needs_work"), ' +
    '"strengths" (array of strings), "gaps" (array of strings), ' +
    '"recommendations" (array of 2-4 concrete remediation strings).';

  const userPrompt = [
    `Analyze this ${input.platform} gaming account security scan.`,
    input.handle ? `Account handle: ${input.handle}.` : '',
    `Overall score: ${input.scorePct}%.`,
    '',
    'Confirmed strengths (passed):',
    input.passed.length
      ? input.passed.map((p) => `- ${p}`).join('\n')
      : '- none',
    '',
    'Weaknesses / gaps:',
    input.failed.length
      ? input.failed.map((f) => `- ${f}`).join('\n')
      : '- none',
    '',
    'High-impact (critical) issues:',
    input.critical.length
      ? input.critical.map((c) => `- ${c}`).join('\n')
      : '- none',
    '',
    'Write a concise summary (max 2 sentences), a severity level, the ' +
      'strengths, the gaps, and actionable recommendations tailored to ' +
      'gaming platforms.',
  ]
    .filter(Boolean)
    .join('\n');

  const chat = await nvidiaChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { temperature: 0.3, maxTokens: 700, signal: options.signal }
  );

  const parsed = extractJsonObject(chat.content);
  const fallback = buildGamingSecurityFindings(input);

  const strengths = toStrArray(parsed?.strengths);
  const gaps = toStrArray(parsed?.gaps);
  const recommendations = toStrArray(parsed?.recommendations);

  return {
    severity:
      parsed && typeof parsed.severity === 'string'
        ? sanitizeSeverity(parsed.severity)
        : fallback.severity,
    summary:
      parsed && typeof parsed.summary === 'string'
        ? parsed.summary.trim()
        : fallback.summary,
    strengths: strengths.length ? strengths : fallback.strengths,
    gaps: gaps.length ? gaps : fallback.gaps,
    recommendations: recommendations.length
      ? recommendations
      : fallback.recommendations,
    provider: 'nvidia',
    model: chat.model ? nvidiaModelLabel(chat.model) : DEFAULT_MODEL,
  };
}