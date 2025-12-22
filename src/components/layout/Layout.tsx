import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BreakingNewsBanner } from '@/components/layout/BreakingNewsBanner';
import { ThreatAlertSidebar } from '@/components/threats/ThreatAlertSidebar';
import { useThreatAlerts } from '@/hooks/useThreatAlerts';
import { NexusScoreWidget } from '@/components/nexus/NexusScoreWidget';

interface LayoutProps {
  children: React.ReactNode;
  showThreatSidebar?: boolean;
}

export function Layout({ children, showThreatSidebar = false }: LayoutProps) {
  const { data: threats } = useThreatAlerts(5);

  return (
    <div className="min-h-screen flex flex-col">
      <BreakingNewsBanner />
      <Navbar />
      <main className="flex-1">
        {showThreatSidebar ? (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">{children}</div>
              <aside className="lg:col-span-1">
                <div className="sticky top-20">
                  <ThreatAlertSidebar alerts={threats} />
                </div>
              </aside>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
      <NexusScoreWidget />
    </div>
  );
}
