import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalPulseSidebar } from './GlobalPulseSidebar';
import { NexusScoreWidget } from '@/components/ui/NexusScoreWidget';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { useConvexDisabled } from '@/components/SafeConvexProvider';

interface LayoutProps {
  children: ReactNode;
  /** Show Grid Nexus left rail (Threat Radar, AI Pulse, Gaming Ticker). Default: true. */
  showPulseSidebar?: boolean;
}

export function Layout({ children, showPulseSidebar = true }: LayoutProps) {
  const isConvexDisabled = useConvexDisabled();

  return (
    <div className="min-h-screen flex flex-col">
      {isConvexDisabled && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-200">
          Demo mode: showing sample data. Set <code className="bg-amber-500/20 px-1 rounded">VITE_CONVEX_URL</code> as a Build Time Variable in Coolify and redeploy for live data.
        </div>
      )}
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

