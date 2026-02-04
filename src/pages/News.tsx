import { Layout } from '@/components/layout/Layout';
import { NewsFeed } from '@/components/news/NewsFeed';
import { SEOHead } from '@/components/seo/SEOHead';

export default function News() {
  return (
    <Layout>
      <SEOHead
        title="Live Wire – Breaking Tech, Security & Gaming News | The Grid Nexus"
        description="Real-time news feed from top sources. Breaking technology, cybersecurity, and gaming headlines."
        keywords={['tech news', 'breaking news', 'cybersecurity news', 'gaming news', 'live news']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <NewsFeed limit={24} title="Live Wire" showTitle />
      </div>
    </Layout>
  );
}
