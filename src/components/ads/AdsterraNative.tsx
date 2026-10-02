import { useEffect, useMemo, useState } from 'react';
import { hasAdConsent } from '@/lib/adsenseConfig';
import {
  ADSTERRA_CONFIG,
  isAdsterraSlotConfigured,
  isLocalhost,
  type AdsterraNativeSlot,
} from '@/lib/adsterraConfig';

interface AdsterraNativeProps {
  slot: AdsterraNativeSlot;
  className?: string;
  label?: string;
}

function buildSrcDoc(key: string, width: number, height: number): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;min-height:100vh}*{box-sizing:border-box}</style></head><body><script type="text/javascript">atOptions = {'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};<\/script><script type="text/javascript" src="//www.highperformanceformat.com/${key}/invoke.js"><\/script></body></html>`;
}

/**
 * Adsterra Native Banner — iframe-isolated so each placement keeps its own
 * `atOptions` (all Adsterra banners share that global; without isolation
 * only the last one renders — the classic React failure mode).
 */
export function AdsterraNative({ slot, className, label }: AdsterraNativeProps) {
  const [consented, setConsented] = useState<boolean>(() => hasAdConsent());
  const cfg = ADSTERRA_CONFIG.native[slot];
  const srcDoc = useMemo(
    () => buildSrcDoc(cfg.key, cfg.width, cfg.height),
    [cfg.key, cfg.width, cfg.height],
  );

  useEffect(() => {
    const onConsent = () => setConsented(hasAdConsent());
    window.addEventListener('cookieConsentUpdated', onConsent);
    return () => window.removeEventListener('cookieConsentUpdated', onConsent);
  }, []);

  if (!ADSTERRA_CONFIG.enabled) return null;
  if (ADSTERRA_CONFIG.settings.disableOnLocalhost && isLocalhost()) return null;
  if (ADSTERRA_CONFIG.settings.requireConsent && !consented) return null;
  if (!isAdsterraSlotConfigured(slot)) return null;

  return (
    <div
      className={className}
      role="complementary"
      aria-label={label ?? `Sponsored content (${slot})`}
      style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
    >
      <div style={{ width: '100%', maxWidth: cfg.width, minHeight: cfg.height }}>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.45, textAlign: 'center', marginBottom: 4 }}>
          Advertisement
        </span>
        <iframe
          title={label ?? `Adsterra native banner — ${slot}`}
          srcDoc={srcDoc}
          width={cfg.width}
          height={cfg.height}
          scrolling="no"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{ border: 0, margin: '0 auto', display: 'block', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
}
