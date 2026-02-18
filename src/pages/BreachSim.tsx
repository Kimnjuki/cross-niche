import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreachSimulator } from '@/components/security/BreachSimulator';

export default function BreachSim() {
  return (
    <Layout>
      <SEOHead
        title="Breach Simulator | The Grid Nexus"
        description="Run realistic cybersecurity incident simulations and learn proper response playbooks."
        keywords={['breach simulator', 'incident response', 'ransomware', 'phishing', 'data breach', 'cybersecurity training']}
        url={typeof window !== 'undefined' ? window.location.href : '/breach-sim'}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <BreachSimulator />
      </div>
    </Layout>
  );
}
