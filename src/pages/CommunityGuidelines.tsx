import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { MessageSquare, Shield, AlertTriangle, CheckCircle, XCircle, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunityGuidelines() {
  return (
    <Layout>
      <SEOHead
        title="Community Guidelines | The Grid Nexus"
        description="The Grid Nexus community guidelines for comments and discussions. How to participate respectfully in our tech, security, and gaming community."
        keywords={['community guidelines', 'comment policy', 'discussion rules', 'the grid nexus']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="font-display font-bold text-4xl">Community Guidelines</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our community thrives on respectful, on-topic discussion. These guidelines keep
            The Grid Nexus a valuable space for everyone interested in tech, cybersecurity, and gaming.
          </p>
        </div>

        {/* Core Principles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Core Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Be Respectful', desc: 'Treat every member with civility. Disagreement is fine; personal attacks are not.' },
              { title: 'Stay On Topic', desc: 'Keep comments relevant to the article or discussion thread.' },
              { title: 'Add Value', desc: 'Share knowledge, ask genuine questions, and contribute meaningfully.' },
              { title: 'Be Accurate', desc: 'Verify claims before posting. Correct yourself if you get something wrong.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* What's Not Allowed */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              What's Not Allowed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Harassment & Hate Speech', desc: 'No targeted harassment, threats, or discriminatory content based on identity.' },
              { title: 'Spam & Self-Promotion', desc: 'No repetitive posts, unsolicited promotional links, or affiliate schemes.' },
              { title: 'Misinformation', desc: 'Do not knowingly post false technical claims, especially on security topics where bad advice causes real harm.' },
              { title: 'Personal Information', desc: 'Never share other people\'s private data (doxxing) or your own sensitive credentials.' },
              { title: 'Illegal Content', desc: 'No content that promotes or facilitates illegal activity, malware distribution, or unauthorized access.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enforcement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Comments that violate these guidelines will be removed. Repeated violations result in
              a temporary or permanent ban from commenting. We apply these rules consistently and
              without regard to viewpoint.
            </p>
            <p>
              If you see a comment that violates these guidelines, use the report function. Our
              moderation team reviews reports and acts on them as quickly as possible.
            </p>
            <p>
              Appeals can be submitted via our <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
            </p>
          </CardContent>
        </Card>

        {/* Related Pages */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          Also see our{' '}
          <Link to="/content-policy" className="text-primary hover:underline">Content Policy</Link>
          {' '}and{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
        </div>
      </div>
    </Layout>
  );
}
