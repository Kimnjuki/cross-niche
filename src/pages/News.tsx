import { Layout } from '@/components/layout/Layout';
import { NewsFeed } from '@/components/news/NewsFeed';
import { SEOHead } from '@/components/seo/SEOHead';
import { getPageMetadata } from '@/lib/seo/pageMetadata';

export default function News() {
  const meta = getPageMetadata('/news');
  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={['tech news', 'breaking news', 'cybersecurity news', 'gaming news', 'live news']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">Live Wire</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time breaking news from top sources. Stay updated with the latest technology, cybersecurity, and gaming headlines as they happen.
          </p>
        </div>
        <NewsFeed limit={24} title="Live Wire" showTitle />
      </div>
    </Layout>
  );
}
