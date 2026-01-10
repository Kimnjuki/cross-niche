import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { NexusScoreWidget } from '@/components/ui/NexusScoreWidget';

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
    </div>
  );
}

