/**
 * Nexus Intersection (nexus-004): unified cross-section — 1 Tech, 1 Security, 1 Gaming linked by common keyword.
 */

import { Layout } from '@/components/layout/Layout';
import { NexusIntersectionTemplate } from '@/components/nexus/NexusIntersectionTemplate';
import { SEOHead } from '@/components/seo/SEOHead';
import { useNexusIntersection } from '@/hooks/useNexusIntersection';
import { Link2 } from 'lucide-react';

export default function NexusIntersectionPage() {
  const { tech, security, gaming, commonKeyword, isLoading, error } = useNexusIntersection();

  return (
    <Layout>
      <SEOHead
        title="Nexus Intersection | The Grid Nexus"
        description="Cross-section of Tech, Security, and Gaming: one article from each niche linked by a common theme. Discover how topics connect across the Nexus."
        keywords={['nexus intersection', 'cross-section', 'tech security gaming', 'themed articles', commonKeyword]}
        url={window.location.href}
        type="website"
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
          <p className="text-muted-foreground max-w-2xl">
            One Tech article, one Security alert, and one Gaming guide — linked by a common keyword in a{' '}
            <strong>Nexus Summary</strong> at the top. See how themes connect across niches.
          </p>
        </header>

        <NexusIntersectionTemplate
          tech={tech}
          security={security}
          gaming={gaming}
          commonKeyword={commonKeyword}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </Layout>
  );
}
