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

function buildSrcDoc(invokeSrc: string, containerId: string, slot: string): string {
  // Exact Adsterra container-style snippet, scoped inside its own document
  // so the shared container ID never collides across placements.
  // Includes a tiny height relay so the parent iframe grows with the creative.
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent}*{box-sizing:border-box}</style></head><body><div id="${containerId}"></div><script async data-cfasync="false" src="${invokeSrc}"><\/script><script>(function(){function r(){try{var h=Math.max(document.body?document.body.scrollHeight:0,document.documentElement?document.documentElement.scrollHeight:0);parent.postMessage({__adsterraNative:'${slot}',height:h},'*');}catch(e){}}try{new MutationObserver(r).observe(document.documentElement,{childList:true,subtree:true,attributes:true});}catch(e){}window.addEventListener('load',function(){r();setTimeout(r,1500);setTimeout(r,4000);});setTimeout(r,2000);})();<\/script></body></html>`;
}

/**
 * Adsterra Native Banner — iframe-isolated so each placement keeps its own
 * document. Your unit uses the container-style snippet (invoke.js fills
 * `div#container-…`); without isolation the duplicated container ID would
 * mean only the first placement renders — the classic React failure mode.
 */
export function AdsterraNative({ slot, className, label }: AdsterraNativeProps) {
  const [consented, setConsented] = useState<boolean>(() => hasAdConsent());
  const [frameHeight, setFrameHeight] = useState<number>(320);
  const cfg = ADSTERRA_CONFIG.native[slot];
  const srcDoc = useMemo(
    () => buildSrcDoc(cfg.invokeSrc, cfg.containerId, slot),
    [cfg.invokeSrc, cfg.containerId, slot],
  );

  useEffect(() => {
    const onConsent = () => setConsented(hasAdConsent());
    window.addEventListener('cookieConsentUpdated', onConsent);
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { __adsterraNative?: string; height?: number } | null;
      if (!data || data.__adsterraNative !== slot) return;
      const h = Math.round(Number(data.height) || 0);
      if (h >= 60 && h <= 1200) setFrameHeight(h);
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('cookieConsentUpdated', onConsent);
      window.removeEventListener('message', onMessage);
    };
  }, [slot]);

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
      <div style={{ width: '100%', maxWidth: 480, minHeight: frameHeight }}>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.45, textAlign: 'center', marginBottom: 4 }}>
          Advertisement
        </span>
        <iframe
          title={label ?? `Adsterra native banner — ${slot}`}
          srcDoc={srcDoc}
          width={480}
          height={frameHeight}
          scrolling="no"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          style={{ border: 0, margin: '0 auto', display: 'block', maxWidth: '100%', height: frameHeight }}
        />
      </div>
    </div>
  );
}
