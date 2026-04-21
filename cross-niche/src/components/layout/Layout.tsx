import { type ReactNode } from 'react';
import { NexusNavBar } from './NexusNavBar';
import { Footer } from './Footer';
import { GlobalPulseSidebar } from './GlobalPulseSidebar';
import { NexusScoreWidget } from '@/components/ui/NexusScoreWidget';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { AdScriptInitializer } from '@/components/ads/AdScriptInitializer';
import { AIIntelligenceTicker } from './AIIntelligenceTicker';

interface LayoutProps {
  children: ReactNode;
  /** Show Grid Nexus left rail (Threat Radar, AI Pulse, Gaming Ticker). Default: true. */
  showPulseSidebar?: boolean;
}

export function Layout({ children, showPulseSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdScriptInitializer />
      {showPulseSidebar && <GlobalPulseSidebar />}
      <div className={showPulseSidebar ? 'pl-[64px]' : ''}>
        <NexusNavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <AIIntelligenceTicker />
      {/* Floating Nexus Score Widget */}
      <NexusScoreWidget />
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

