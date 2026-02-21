import { Layout } from '@/components/layout/Layout';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

export default function Disclosure() {
  return (
    <Layout>
      <SEOHead
        title="Affiliate Disclosure | The Grid Nexus"
        description="Learn about our affiliate relationships and how we maintain editorial independence. Transparent disclosure of our revenue sources."
        keywords={['affiliate disclosure', 'transparency', 'editorial independence', 'affiliate links']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-yellow-500">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-4xl">Affiliate Disclosure</h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-semibold text-xl mb-4">Our Commitment to Transparency</h2>
                <p className="text-muted-foreground">
                  At NexusMedia, we believe in complete transparency with our readers. This disclosure 
                  explains our affiliate relationships and how we earn revenue while maintaining editorial independence.
                </p>
              </CardContent>
            </Card>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">What Are Affiliate Links?</h2>
              <p className="text-muted-foreground mb-4">
                Some links on our website are affiliate links. This means that if you click on a link and 
                make a purchase, we may receive a small commission at no additional cost to you. These 
                commissions help support our work and allow us to continue providing free content.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">How We Identify Affiliate Content</h2>
              <p className="text-muted-foreground mb-4">
                We clearly mark affiliate content in the following ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Tools and products with affiliate links display an "Affiliate" badge</li>
                <li>Sponsored articles are clearly labeled as "Sponsored"</li>
                <li>Disclosure notices appear on relevant pages</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Editorial Independence</h2>
              <p className="text-muted-foreground mb-4">
                Our affiliate relationships never influence our editorial content. We only recommend 
                products and services that we genuinely believe provide value to our readers. Our reviews 
                and recommendations are based on thorough research and testing, regardless of affiliate status.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Our Affiliate Partners</h2>
              <p className="text-muted-foreground mb-4">
                We work with various affiliate programs and networks, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Software and security tool providers</li>
                <li>Gaming peripheral manufacturers</li>
                <li>Cloud service providers</li>
                <li>Hardware retailers</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Questions?</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our affiliate relationships or this disclosure, 
                please don't hesitate to <Link to="/contact" className="text-primary hover:underline">contact us</Link>. We're committed to maintaining your trust.
              </p>
            </section>

            {/* Internal Links Section */}
            <section className="mt-8 pt-8 border-t border-border">
              <h2 className="font-display font-semibold text-xl mb-4">Related Pages</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/about" className="text-primary hover:underline">About Us</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/contact" className="text-primary hover:underline">Contact</Link>
              </div>
            </section>

            <p className="text-sm text-muted-foreground border-t border-border pt-6 mt-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
