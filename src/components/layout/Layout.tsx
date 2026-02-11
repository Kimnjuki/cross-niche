import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalPulseSidebar } from './GlobalPulseSidebar';
import { NexusScoreWidget } from '@/components/ui/NexusScoreWidget';
import { CookieConsent } from '@/components/consent/CookieConsent';

interface LayoutProps {
  children: ReactNode;
  /** Show Grid Nexus left rail (Threat Radar, AI Pulse, Gaming Ticker). Default: true. */
  showPulseSidebar?: boolean;
}

export function Layout({ children, showPulseSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showPulseSidebar && <GlobalPulseSidebar />}
      <div className={showPulseSidebar ? 'pl-[64px]' : ''}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {/* Floating Nexus Score Widget */}
      <NexusScoreWidget />
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

