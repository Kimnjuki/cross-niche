/**
 * Hook for running an NVIDIA-AI gaming-security scan against the NVIDIA NIM
 * API with a deterministic heuristic fallback. Handles the loading / error /
 * result lifecycle and request cancellation on unmount / re-run.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  analyzeGamingSecurityScan,
  buildGamingSecurityFindings,
  isNvidiaEnabled,
  type GamingScanInput,
  type GamingSecurityFindings,
} from '@/lib/ai/nvidia';

export type NvidiaScanStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseNvidiaSecurityScanResult {
  status: NvidiaScanStatus;
  isLoading: boolean;
  /** The latest findings (heuristic immediately, NVIDIA when requested). */
  findings: GamingSecurityFindings | null;
  /** True when a real NVIDIA NIM key is configured. */
  nvidiaConfigured: boolean;
  error: string | null;
  /** Run an NVIDIA-powered deep scan. Falls back to heuristic on failure. */
  run: (input: GamingScanInput) => Promise<void>;
  /**
   * Compute the heuristic findings synchronously without any network call —
   * used to render an instant baseline before the user opts into NVIDIA.
   */
  applyHeuristic: (input: GamingScanInput) => void;
  reset: () => void;
}

/** Map known NVIDIA client error codes to friendly, user-facing text. */
function mapNvidiaError(code: string): string {
  switch (code) {
    case 'NVIDIA_API_KEY_MISSING':
      return 'No NVIDIA API key is configured. Showing built-in analysis instead.';
    case 'NVIDIA_API_NETWORK_ERROR':
      return 'Could not reach the NVIDIA API. Showing built-in analysis instead.';
    case 'NVIDIA_API_UNAUTHORIZED':
      return 'Your NVIDIA key is not authorized to run this model. Enable model access on build.nvidia.com — showing built-in analysis instead.';
    default:
      return code || 'AI deep scan could not complete. Showing built-in analysis instead.';
  }
}

export function useNvidiaSecurityScan(): UseNvidiaSecurityScanResult {
  const [status, setStatus] = useState<NvidiaScanStatus>('idle');
  const [findings, setFindings] = useState<GamingSecurityFindings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const applyHeuristic = useCallback((input: GamingScanInput) => {
    const result = buildGamingSecurityFindings(input);
    if (mountedRef.current) {
      setFindings(result);
      setStatus('success');
      setError(null);
    }
  }, []);

  const run = useCallback(async (input: GamingScanInput) => {
    abortRef.current?.abort();

    // Immediate deterministic baseline so the UI is never empty.
    const baseline = buildGamingSecurityFindings(input);
    if (mountedRef.current) {
      setFindings(baseline);
      setStatus('loading');
      setError(null);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await analyzeGamingSecurityScan(input, {
        signal: controller.signal,
      });
      if (!mountedRef.current || controller.signal.aborted) return;
      setFindings(result);
      setStatus('success');
      setError(null);
    } catch (err) {
      if (!mountedRef.current || controller.signal.aborted) return;
      const message = mapNvidiaError(
        err instanceof Error ? err.message : ''
      );
      setStatus('error');
      setError(message);
      // Keep the heuristic baseline visible even when the call fails.
      setFindings(baseline);
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    if (mountedRef.current) {
      setStatus('idle');
      setFindings(null);
      setError(null);
    }
  }, []);

  return {
    status,
    isLoading: status === 'loading',
    findings,
    nvidiaConfigured: isNvidiaEnabled(),
    error,
    run,
    applyHeuristic,
    reset,
  };
}