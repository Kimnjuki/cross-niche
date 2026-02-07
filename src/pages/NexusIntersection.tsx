/**
 * Nexus Intersection (nexus-004): unified cross-section — 1 Tech, 1 Security, 1 Gaming linked by common keyword.
 */

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { NexusIntersectionTemplate } from '@/components/nexus/NexusIntersectionTemplate';
import { SEOHead } from '@/components/seo/SEOHead';
import { useNexusIntersection } from '@/hooks/useNexusIntersection';
import { Link2, RefreshCw, Lightbulb, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NexusIntersectionPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [keyword, setKeyword] = useState('');
  const { tech, security, gaming, commonKeyword, isLoading, error } = useNexusIntersection(keyword || undefined);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setKeyword(''); // Clear keyword on refresh
    window.location.reload(); // Force fresh fetch from Convex
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Keyword is already applied via hook, just prevent form submission
  };

  const clearKeyword = () => {
    setKeyword('');
  };

  return (
    <Layout>
      <SEOHead
        title="Nexus Intersection | Where Tech, Gaming & Security Converge | The Grid Nexus"
        description="Explore the convergence of technology, gaming, and cybersecurity. Discover cross-industry innovations, emerging trends, and the future of interconnected tech ecosystems. See how AI, security, and gaming technologies intersect."
        keywords={[
          'tech convergence',
          'gaming security',
          'AI in gaming',
          'cybersecurity for gamers',
          'tech industry crossover',
          'how AI is transforming gaming and cybersecurity',
          'intersection of gaming technology and security',
          'cross-industry tech trends 2026',
          'gaming platforms security vulnerabilities and solutions',
          'how blockchain impacts gaming and tech security',
          'future of AI in gaming and cybersecurity',
          'esports infrastructure security challenges',
          'gaming industry adopting enterprise security practices',
          'tech innovations from gaming industry to mainstream',
          'how gaming engines are used in tech development',
          'security threats in online gaming ecosystems',
          'AI and machine learning in game development and security',
        ]}
        url={window.location.href}
        type="website"
        faqs={[
          {
            question: 'What is Nexus Intersection?',
            answer: 'Nexus Intersection is a unique feature that connects one Tech article, one Security alert, and one Gaming guide through a common keyword, showing how topics converge across different niches.',
          },
          {
            question: 'How are articles connected in Nexus Intersection?',
            answer: 'Articles are connected by identifying common keywords or themes that appear across tech, security, and gaming content, revealing unexpected connections and cross-industry trends.',
          },
          {
            question: 'Why is understanding tech convergence important?',
            answer: 'Understanding how technologies converge helps identify emerging trends, security implications, and innovation opportunities that span multiple industries.',
          },
        ]}
      />
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">Nexus Intersection</h1>
              <p className="text-muted-foreground">Tech · Security · Gaming</p>
            </div>
          </div>
          <div className="prose prose-lg max-w-3xl">
            <p className="text-muted-foreground mb-4">
              One Tech article, one Security alert, and one Gaming guide — linked by a common keyword in a{' '}
              <strong>Nexus Summary</strong> at the top. See how themes connect across niches.
            </p>
            <p className="text-muted-foreground">
              The convergence of technology, gaming, and cybersecurity is reshaping how we think about innovation. 
              Gaming technologies are influencing enterprise security, AI is transforming both gaming and cybersecurity, 
              and cross-industry innovations are creating new opportunities. Explore how these worlds intersect.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <form onSubmit={handleKeywordSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by keyword (e.g., AI, security, cloud)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10 pr-10"
                />
                {keyword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearKeyword}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-2">
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                New intersection
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/breach-sim" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Security training
                </Link>
              </Button>
            </div>
          </div>
          {keyword && (
            <div className="mt-2 text-sm text-muted-foreground">
              Filtering by keyword: <strong className="text-foreground">{keyword}</strong>
            </div>
          )}
        </header>

        <NexusIntersectionTemplate
          key={refreshKey}
          tech={tech}
          security={security}
          gaming={gaming}
          commonKeyword={commonKeyword}
          isLoading={isLoading}
          error={error}
        />

        {/* Cross-links & tips */}
        <Card className="mt-10 border-dashed">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Explore more
            </h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/tech" className="text-primary hover:underline">Tech</Link>
              <Link to="/security" className="text-primary hover:underline">Security</Link>
              <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
              <Link to="/guides" className="text-primary hover:underline">Guides</Link>
              <Link to="/ai-pulse" className="text-primary hover:underline">AI Pulse</Link>
              <Link to="/roadmap" className="text-primary hover:underline">Roadmap</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
