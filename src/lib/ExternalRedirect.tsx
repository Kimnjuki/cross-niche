import { useEffect } from 'react';

/**
 * Redirect component that forces a full client-side redirect.
 * Unlike React Router's <Navigate>, this uses window.location.href
 * which avoids creating preconnect Link headers with http:// 
 * that cause Semrush redirect chain warnings.
 */
export function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
}
