import { useEffect } from 'react';
import { safeInitializeThirdParty, createDefensiveObject } from '@/lib/errorHandlers';

/**
 * Hook for safely initializing third-party scripts
 * Prevents crashes when external scripts fail to load due to CORS or network issues
 */
export function useThirdPartyScript(
  objectName: keyof Window,
  methodName: string,
  fallback?: () => void
) {
  useEffect(() => {
    safeInitializeThirdParty(objectName, methodName, fallback);
  }, [objectName, methodName, fallback]);
}

/**
 * Hook for creating defensive objects only when needed
 */
export function useDefensiveObject(
  objectName: keyof Window,
  defaultImplementation: any
) {
  useEffect(() => {
    createDefensiveObject(objectName, defaultImplementation);
  }, [objectName, defaultImplementation]);
}
