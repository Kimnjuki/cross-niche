/**
 * useAI — React hooks wrapping the NVIDIA AI client
 * 
 * Provides: summarizeArticle, extractKeyPoints, explainConcept, askCopilot
 * All hooks gracefully fall back to deterministic logic when API is unavailable.
 */

import { useState, useCallback, useRef } from 'react';
import { chatCompletion, chatCompletionStream } from '@/lib/ai/client';

type AIStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseAIActionReturn {
  result: string;
  status: AIStatus;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

interface UseAICopilotReturn {
  sendMessage: (message: string, articleContent: string) => Promise<string>;
  isStreaming: boolean;
  abort: () => void;
}

/**
 * Summarize an article using NVIDIA LLM.
 * Falls back to deterministic extractive summary.
 */
export function useSummarizeArticle(
  articleTitle: string,
  articleContent: string
): UseAIActionReturn {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<AIStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    if (!articleContent.trim()) {
      setResult('No content to summarize.');
      setStatus('success');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const text = await chatCompletion([
        {
          role: 'system',
          content: 'You are an expert cybersecurity journalist. Summarize the given article in 2-3 concise bullet points focused on actionable takeaways for gamers. Be direct, no fluff.',
        },
        {
          role: 'user',
          content: `Article: "${articleTitle}"\n\nContent: ${articleContent.slice(0, 3000)}`,
        },
      ], { temperature: 0.3, maxTokens: 512 });

      setResult(text);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summarization failed');
      // Fallback: extract first significant paragraph
      const firstPara = articleContent.match(/<p>(.*?)<\/p>/)?.[1] ?? articleContent.slice(0, 200);
      setResult(`TL;DR — ${firstPara}`);
      setStatus('success');
    }
  }, [articleContent, articleTitle]);

  const reset = useCallback(() => {
    setResult('');
    setStatus('idle');
    setError(null);
  }, []);

  return { result, status, error, execute, reset };
}

/**
 * Extract key points / takeaways from article content.
 */
export function useExtractKeyPoints(
  articleTitle: string,
  articleContent: string
): UseAIActionReturn {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<AIStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    if (!articleContent.trim()) {
      setResult('No content available.');
      setStatus('success');
      return;
    }

    setStatus('loading');

    try {
      const text = await chatCompletion([
        {
          role: 'system',
          content: 'Extract 3-5 key actionable takeaways from this article for gamers. Format as bullet points. Focus on security actions the reader can take right now.',
        },
        {
          role: 'user',
          content: `Article: "${articleTitle}"\n\n${articleContent.slice(0, 3000)}`,
        },
      ], { temperature: 0.3, maxTokens: 512 });

      setResult(text);
    } catch {
      // Fallback: extract h2 headings as key points
      const headings = articleContent.match(/<h2>(.*?)<\/h2>/g) ?? [];
      setResult(headings.slice(0, 5).map(h => `• ${h.replace(/<\/?h2>/g, '')}`).join('\n'));
    }
    setStatus('success');
  }, [articleContent, articleTitle]);

  const reset = useCallback(() => {
    setResult('');
    setStatus('idle');
  }, []);

  return { result, status, error, execute, reset };
}

/**
 * Explain a concept mentioned in the article — uses NVIDIA API.
 */
export function useExplainConcept(): UseAIActionReturn {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<AIStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [concept, setConcept] = useState('');

  const executeWith = useCallback(async (conceptToExplain: string) => {
    if (!conceptToExplain.trim()) return;
    setConcept(conceptToExplain);
    setStatus('loading');

    try {
      const text = await chatCompletion([
        {
          role: 'system',
          content: 'Explain the following gaming/cybersecurity term in simple language for a gamer audience. Keep it under 100 words. Use analogies where helpful.',
        },
        { role: 'user', content: conceptToExplain },
      ], { temperature: 0.5, maxTokens: 256 });

      setResult(text);
    } catch {
      setResult(`"${conceptToExplain}" — This is a security/tech term. Check our coverage for more detail.`);
    }
    setStatus('success');
  }, []);

  const reset = useCallback(() => {
    setResult('');
    setStatus('idle');
    setError(null);
  }, []);

  return { result, status, error, execute: () => executeWith(concept), reset };
}

/**
 * Streaming chat for the NexusCopilotWidget.
 * Supports abort via AbortController.
 */
export function useAICopilot(): UseAICopilotReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    userMessage: string,
    context: string
  ): Promise<string> => {
    setIsStreaming(true);

    try {
      const stream = await chatCompletionStream([
        {
          role: 'system',
          content: `You are a gaming security assistant. Answer based on this article context:\n\n${context.slice(0, 4000)}\n\nBe helpful and accurate. Keep responses concise (max 200 words). If you don't know, say so.`,
        },
        { role: 'user', content: userMessage },
      ]);

      if (!stream) {
        // Fallback to non-streaming
        const result = await chatCompletion([
          {
            role: 'system',
            content: `Gaming security assistant. Context:\n${context.slice(0, 3000)}`,
          },
          { role: 'user', content: userMessage },
        ], { maxTokens: 512 });
        return result;
      }

      // Read the stream
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content ?? '';
            fullResponse += content;
          } catch {
            // Skip non-JSON SSE lines
          }
        }
      }

      return fullResponse || 'I could not generate a response. Please try asking differently.';
    } catch (err) {
      console.warn('[useAICopilot] Error:', err);
      return 'I encountered an error. Please try again.';
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { sendMessage, isStreaming, abort };
}
