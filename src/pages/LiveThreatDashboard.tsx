import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { ThreatIntelligenceDashboard } from '@/components/security/ThreatIntelligenceDashboard';
import { LiveThreatFeed } from '@/components/home/LiveThreatFeed';

export default function LiveThreatDashboard() {
  return (
    <Layout>
      <SEOHead
        title="Live Threat Dashboard | The Grid Nexus"
        description="Monitor trending vulnerabilities, ransomware campaigns, and active threat intelligence signals."
        keywords={['live threats', 'threat intelligence', 'vulnerabilities', 'ransomware', 'cybersecurity dashboard']}
        url={typeof window !== 'undefined' ? window.location.href : '/live-threat-dashboard'}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl mb-3">Live Threat Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Fast situational awareness across critical threats, attack campaigns, and enterprise-impacting events.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ThreatIntelligenceDashboard />
            </div>
            <div className="lg:col-span-1">
              <LiveThreatFeed />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
