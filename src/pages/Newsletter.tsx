import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterPage() {
  return (
    <Layout>
      <SEOHead
        title="The Nexus Brief — Subscribe | The Grid Nexus"
        description="Weekly technology, security and gaming intelligence. No noise—only useful updates and practical actions."
        canonicalUrl="https://thegridnexus.com/newsletter"
      />
      <main className="py-12 md:py-20">
        <div className="container-tokens">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-white mb-3">
                The Nexus Brief
              </h1>
              <p className="text-slate-400 leading-relaxed">
                The most important technology, security and gaming developments—explained clearly and connected to practical action.
              </p>
            </div>

            <Card className="bg-ink-900 border-white/[0.06] mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cyan" />
                  Subscribe
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Choose your topics and delivery frequency. Weekly by default.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewsletterForm variant="advanced" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="p-4 rounded-lg bg-ink-900 border border-white/[0.06]">
                <Shield className="h-5 w-5 text-cyan mb-2" />
                <h3 className="text-white text-sm font-semibold mb-1">Privacy-first</h3>
                <p className="text-xs text-slate-400 leading-relaxed">We never share your email. Unsubscribe anytime.</p>
              </div>
              <div className="p-4 rounded-lg bg-ink-900 border border-white/[0.06]">
                <CheckCircle2 className="h-5 w-5 text-green mb-2" />
                <h3 className="text-white text-sm font-semibold mb-1">Curated signal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">No clickbait. No noise. Only actionable intelligence.</p>
              </div>
              <div className="p-4 rounded-lg bg-ink-900 border border-white/[0.06]">
                <Mail className="h-5 w-5 text-violet mb-2" />
                <h3 className="text-white text-sm font-semibold mb-1">Weekly digest</h3>
                <p className="text-xs text-slate-400 leading-relaxed">One email per week with the week's most important stories.</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500">
                By subscribing you agree to our <a href="/privacy" className="text-slate-400 hover:text-foreground underline">Privacy Policy</a>.
                No preselected marketing consent.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
