/**
 * The Breach Simulation (nexus-003) — cybersecurity training module.
 */

import { Layout } from '@/components/layout/Layout';
import { BreachSimulation } from '@/components/nexus/BreachSimulation';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldAlert } from 'lucide-react';

export default function BreachSimulationPage() {
  return (
    <Layout>
      <SEOHead
        title="Breach Simulation | The Grid Nexus"
        description="Interactive cybersecurity training: make choices in a phishing scenario. Earn Nexus XP for secure decisions. Terminal-style simulation."
        keywords={['breach simulation', 'phishing', 'cybersecurity training', 'Nexus XP', 'security awareness']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">Breach Simulation</h1>
              <p className="text-muted-foreground">Cybersecurity training module</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            A text-based simulation. You receive a phishing email — choose an action. Secure choices earn <strong>Nexus XP</strong> (saved in your browser). 
            The <strong>Breach Level</strong> bar fills when you take risky actions; keep it low to succeed.
          </p>
        </header>

        <BreachSimulation />
      </div>
    </Layout>
  );
}
