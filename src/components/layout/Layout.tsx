import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { NexusScoreWidget } from '@/components/ui/NexusScoreWidget';
import { CookieConsent } from '@/components/consent/CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Floating Nexus Score Widget */}
      <NexusScoreWidget />
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

