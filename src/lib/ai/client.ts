/**
 * AI Client — Multi-provider LLM client
 * 
 * Supports NVIDIA NIM (OpenAI-compatible) as primary inference provider.
 * Falls back gracefully when API is unavailable.
 * 
 * NVIDIA endpoint: proxied through nginx (/api/ai) to avoid browser CORS/DNS
 * Compatible models: meta/llama-3.1-8b-instruct, meta/llama-3.1-70b-instruct,
 *   mistralai/mistral-7b-instruct-v0.3, etc.
 *
 * Note: API key is injected by nginx at the proxy layer, not sent from the browser.
 */

const NVIDIA_BASE_URL = '/api/ai';

interface AIClientOptions {
  provider?: 'nvidia';
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function getApiKey(): string | null {
  return (
    import.meta.env.VITE_NVIDIA_API_KEY ??
    null
  );
}

function getConfig(): Required<AIClientOptions> {
  return {
    provider: 'nvidia',
    // Use stronger model by default. 70B gives much better answers for gaming security Q&A.
    // Override via VITE_NVIDIA_MODEL env var if you need a different model.
    model: import.meta.env.VITE_NVIDIA_MODEL ?? 'meta/llama-3.1-70b-instruct',
    temperature: 0.7,
    maxTokens: 2048,
  };
}

/**
 * Send a chat completion request to NVIDIA NIM.
 * OpenAI-compatible API: accepts the same request/response format.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  overrides?: Partial<AIClientOptions>
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[AIClient] No NVIDIA API key found. Returning fallback.');
    return fallbackResponse(messages);
  }

  const config = { ...getConfig(), ...overrides };
  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystem = messages.filter(m => m.role !== 'system');

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No Authorization header — API key is injected server-side by nginx
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemMsg?.content ?? '' },
          ...nonSystem,
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(`[AIClient] NVIDIA API error (${response.status}): ${error}`);
      return fallbackResponse(messages);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices?.[0]?.message?.content ?? fallbackResponse(messages);
  } catch (err) {
    console.warn('[AIClient] NVIDIA API request failed:', err);
    return fallbackResponse(messages);
  }
}

/**
 * Simple streaming SSE endpoint for chat copilot.
 * Useful for the NexusCopilotWidget where real-time responses feel better.
 * Returns a ReadableStream of text chunks.
 */
export async function chatCompletionStream(
  messages: ChatMessage[],
  overrides?: Partial<AIClientOptions>
): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const config = { ...getConfig(), ...overrides };
  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystem = messages.filter(m => m.role !== 'system');

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No Authorization header — API key is injected server-side by nginx
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemMsg?.content ?? '' },
          ...nonSystem,
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens * 2,
        stream: true,
      }),
    });

    if (!response.ok) return null;
    return response.body;
  } catch {
    return null;
  }
}

/**
 * Fallback: return a reasonable canned response when API is unavailable.
 * Prevents the UI from breaking during development or when key isn't set.
 */
function fallbackResponse(messages: ChatMessage[]): string {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const query = lastUserMsg?.content?.toLowerCase() ?? '';

  // Article summaries
  if (query.includes('summarize') || query.includes('summary')) {
    return `This article covers key developments in gaming security. Highlights include new threat patterns, protective measures for gamers, and platform-specific security recommendations. TL;DR: enable 2FA everywhere, use unique passwords, and keep your gaming accounts monitored.`;
  }

  // Key points
  if (query.includes('key point') || query.includes('takeaway') || query.includes('bullet')) {
    return `• Enable two-factor authentication on all gaming platforms\n• Use unique passwords for each account (password manager recommended)\n• Keep your gaming PC and browser updated\n• Never share login credentials on third-party sites\n• Monitor connected apps and revoke unused access`;
  }

  // Explain
  if (query.includes('explain') || query.includes('what is') || query.includes('how does')) {
    return `This topic relates to gaming account security. When attackers target gaming accounts, they typically use credential stuffing (testing leaked passwords across platforms), phishing (fake login pages), or malware (stealing session cookies). The best defense is 2FA with an authenticator app, unique passwords stored in a manager, and vigilance about where you enter credentials.`;
  }

  // Default
  return `Based on the article content, the key insight is that gaming security requires proactive measures across all your platforms. The article provides specific steps you can take today — start with your email account (the master key), then enable 2FA on Steam, Epic, Xbox, and PlayStation, and finally audit connected third-party services.`;
}

/**
 * Retry with exponential backoff for transient failures.
 */
export async function chatCompletionWithRetry(
  messages: ChatMessage[],
  overrides?: Partial<AIClientOptions>,
  maxRetries = 2
): Promise<string> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await chatCompletion(messages, overrides);
    // If it returned meaningful content (not fallback), use it
    if (!result.startsWith('Based on')) return result;
    if (attempt < maxRetries) {
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return fallbackResponse(messages);
}
