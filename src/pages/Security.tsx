import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ViewToggle } from '@/components/ui/view-toggle';
import { mockArticles } from '@/data/mockData';
import { useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

export default function Security() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const { data: securityContent, isLoading } = useContentByFeed('secured', 20);

  const securityArticles = securityContent && securityContent.length > 0
    ? mapContentToArticles(securityContent)
    : mockArticles.filter(a => a.niche === 'security');
  
  const highImpact = securityArticles.filter(a => a.impactLevel === 'high').length;
  const mediumImpact = securityArticles.filter(a => a.impactLevel === 'medium').length;

  return (
    <Layout>
      <SEOHead
        title="Cybersecurity News & Threat Intelligence | The Grid Nexus"
        description="Critical security news, threat intelligence, and protection guides. Stay informed about the latest vulnerabilities and how to protect your digital life."
        keywords={['cybersecurity', 'security news', 'threat intelligence', 'cyber threats', 'data privacy', 'network security']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-security">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl text-security">Secured</h1>
              <p className="text-muted-foreground">Cybersecurity & Privacy</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Critical security news, threat intelligence, and protection guides. Stay informed about the latest vulnerabilities and how to protect your digital life.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link to="/topics?q=cybersecurity" className="text-primary hover:underline">Cybersecurity Topics</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/topics?q=data+privacy" className="text-primary hover:underline">Data Privacy</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/guides" className="text-primary hover:underline">Security Guides</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
          </div>
        </div>

        {/* Threat Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-security/20 bg-security/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-security/10">
                <AlertTriangle className="h-6 w-6 text-security" />
              </div>
              <div>
                <p className="text-2xl font-bold text-security">{highImpact}</p>
                <p className="text-sm text-muted-foreground">High Impact Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{mediumImpact}</p>
                <p className="text-sm text-muted-foreground">Medium Impact</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gaming/20 bg-gaming/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gaming/10">
                <CheckCircle className="h-6 w-6 text-gaming" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gaming">Protected</p>
                <p className="text-sm text-muted-foreground">System Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View toggle (Ars / WIRED style) */}
        <div className="flex justify-end mb-6">
          <ViewToggle value={viewMode} onChange={setViewMode} ariaLabel="Article layout" />
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <ArticleGrid articles={securityArticles} columns={3} viewMode={viewMode} />
        )}
      </div>
    </Layout>
  );
}
