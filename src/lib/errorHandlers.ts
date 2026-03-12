// Extend Window interface for third-party globals
declare global {
  interface Window {
    clickioConsent?: {
      hasConsent: boolean;
      addEventListener: () => void;
      removeEventListener: () => void;
      dispatchEvent: () => void;
    };
    Vl?: {
      init: () => void;
    };
  }
}

// Safe initialization helper for third-party scripts
export function safeInitializeThirdParty(
  objectName: keyof Window,
  methodName: string,
  fallback?: () => void
): boolean {
  try {
    const obj = window[objectName];
    if (obj && typeof (obj as any)[methodName] === 'function') {
      (obj as any)[methodName]();
      return true;
    } else {
      if (import.meta.env.DEV) {
        console.warn(`${objectName.toString()}.${methodName} is not available. Script may have failed to load.`);
      }
      fallback?.();
      return false;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Failed to initialize ${objectName.toString()}.${methodName}:`, error);
    }
    fallback?.();
    return false;
  }
}

// Defensive object creation only when needed
export function createDefensiveObject(
  objectName: keyof Window,
  defaultImplementation: any
): any {
  if (!(window as any)[objectName]) {
    (window as any)[objectName] = defaultImplementation;
    if (import.meta.env.DEV) {
      console.warn(`Created defensive fallback for ${String(objectName)}`);
    }
  }
  return (window as any)[objectName];
}
