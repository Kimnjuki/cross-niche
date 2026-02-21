/**
 * Editorial Policy page – E-E-A-T trust signal.
 * Covers standards, fact-checking, corrections, and content transparency.
 */

import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FileCheck, Shield, RefreshCw, Mail, BookOpen } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Editorial() {
  return (
    <Layout>
      <SEOHead
        title="Editorial Policy | The Grid Nexus"
        description="Editorial standards, fact-checking methodology, and correction policy. The Grid Nexus is committed to accuracy and transparency in tech coverage."
        keywords={['editorial policy', 'editorial standards', 'fact-checking', 'corrections', 'journalism', 'tech news', 'content standards']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="font-display font-bold text-4xl mb-4">Editorial Policy</h1>
            <p className="text-xl text-muted-foreground">
              Our commitment to accuracy, transparency, and journalistic integrity
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg leading-relaxed mb-4">
              We follow a <strong>human-in-the-loop AI content policy</strong>. All content is fact-checked 
              and edited for accuracy. We do not publish verbatim AI output without editorial oversight.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our editorial policy outlines the standards we follow, how we verify information, 
              and how we handle corrections for technology, cybersecurity, and gaming coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <FileCheck className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Editorial Standards</h2>
                <p className="text-muted-foreground mb-4">
                  All content is produced under clear editorial guidelines. We prioritize original 
                  reporting, expert analysis, and verified information. Sponsored or affiliate 
                  content is clearly labeled per our{' '}
                  <Link to="/disclosure" className="text-primary hover:underline">disclosure policy</Link>.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Original reporting and analysis, not aggregation alone</li>
                  <li>Fact-checking before publication</li>
                  <li>Clear attribution and links to sources</li>
                  <li>No clickbait; headlines reflect content</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Fact-Checking Methodology</h2>
                <p className="text-muted-foreground mb-4">
                  We verify claims using primary sources, official statements, and reputable 
                  industry reports. For security and vulnerability reports, we cross-reference 
                  with CVE databases and vendor advisories.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Primary sources preferred over secondary</li>
                  <li>Multiple corroboration for breaking news</li>
                  <li>Expert review for technical claims</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <RefreshCw className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Correction Policy</h2>
                <p className="text-muted-foreground mb-4">
                  When we make an error, we correct it promptly and transparently. Corrections 
                  are noted at the top or bottom of the article with the date and nature of the 
                  change. Significant corrections may be highlighted in a dedicated section.
                </p>
                <p className="text-sm text-muted-foreground">
                  To report an error, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Content Updates</h2>
                <p className="text-muted-foreground mb-4">
                  Evergreen content is reviewed periodically. When we update articles with new 
                  information, we reflect the change in the &quot;Last updated&quot; date and, where 
                  applicable, in structured data (dateModified) for search engines.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-6 mb-12">
            <div className="flex gap-4">
              <Mail className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-lg mb-2">Questions or Feedback?</h2>
                <p className="text-muted-foreground mb-4">
                  We welcome feedback on our coverage and editorial standards. Reach out via our{' '}
                  <Link to="/contact" className="text-primary hover:underline">contact page</Link> or 
                  learn more <Link to="/about" className="text-primary hover:underline">about us</Link>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/about"
              className="text-primary hover:underline font-medium"
            >
              About The Grid Nexus
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/disclosure"
              className="text-primary hover:underline font-medium"
            >
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
