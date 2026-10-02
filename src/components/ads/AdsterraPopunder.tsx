import { useEffect } from 'react';
import { hasAdConsent } from '@/lib/adsenseConfig';
import { ADSTERRA_CONFIG, isLocalhost } from '@/lib/adsterraConfig';

const LOADED_FLAG = '__adsterra_popunder_loaded__';
const LAST_SHOWN_KEY = 'adsterra-popunder-last-shown';

function injectPopunder(src: string): void {
  const w = window as unknown as Record<string, unknown>;
  if (w[LOADED_FLAG]) return;
  if (document.querySelector('script[data-adsterra="popunder"]')) return;
  try {
    const last = Number(localStorage.getItem(LAST_SHOWN_KEY) || 0);
    const capMs = ADSTERRA_CONFIG.popunder.frequencyCapHours * 3600 * 1000;
    if (last && Date.now() - last < capMs) return;
  } catch { /* storage unavailable — continue */ }
  const s = document.createElement('script');
  s.async = true;
  s.src = src.startsWith('//') ? `https:${src}` : src;
  s.setAttribute('data-adsterra', 'popunder');
  s.onerror = () => {};
  (document.body || document.documentElement).appendChild(s);
  w[LOADED_FLAG] = true;
  try { localStorage.setItem(LAST_SHOWN_KEY, String(Date.now())); } catch { /* ignore */ }
}

/**
 * Site-wide Popunder: delayed after load, optionally after first
 * interaction (best for LCP/CLS), frequency-capped, consent-gated.
 */
export function AdsterraPopunder() {
  useEffect(() => {
    const cfg = ADSTERRA_CONFIG.popunder;
    if (!ADSTERRA_CONFIG.enabled || !cfg.enabled || !cfg.configured) return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (ADSTERRA_CONFIG.settings.disableOnLocalhost && isLocalhost()) return;

    let cancelled = false;
    let timer: number | undefined;

    const fire = () => {
      if (cancelled) return;
      if (ADSTERRA_CONFIG.settings.requireConsent && !hasAdConsent()) return;
      timer = window.setTimeout(() => injectPopunder(cfg.scriptSrc), Math.max(0, cfg.delayMs));
    };

    if (ADSTERRA_CONFIG.settings.requireConsent && !hasAdConsent()) {
      const onConsent = () => {
        window.removeEventListener('cookieConsentUpdated', onConsent);
        arm();
      };
      window.addEventListener('cookieConsentUpdated', onConsent);
      return () => window.removeEventListener('cookieConsentUpdated', onConsent);
    }

    function arm() {
      if (cancelled) return;
      if (cfg.requireInteraction) {
        const onInteract = () => {
          window.removeEventListener('scroll', onInteract);
          window.removeEventListener('click', onInteract);
          fire();
        };
        window.addEventListener('scroll', onInteract, { passive: true });
        window.addEventListener('click', onInteract);
      } else if (document.readyState === 'complete') {
        fire();
      } else {
        window.addEventListener('load', fire, { once: true });
      }
    }

    arm();
    return () => { cancelled = true; if (timer !== undefined) window.clearTimeout(timer); };
  }, []);

  return null;
}
