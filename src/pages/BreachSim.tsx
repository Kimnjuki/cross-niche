import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { getPageMetadata } from '@/lib/seo/pageMetadata';
import { BreachSimulator } from '@/components/security/BreachSimulator';

export default function BreachSim() {
  const meta = getPageMetadata('/breach-sim');
  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
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
