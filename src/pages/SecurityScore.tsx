import { Layout } from '@/components/layout/Layout';
import { Shield, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

export default function SecurityScore() {
  const criteria = [
    {
      title: 'Data Collection Practices',
      description: 'How much personal data does the game collect and for what purposes?',
      weight: '25%',
    },
    {
      title: 'Account Security',
      description: 'Two-factor authentication, password requirements, and recovery options.',
      weight: '25%',
    },
    {
      title: 'Privacy Policy Transparency',
      description: 'Clarity and accessibility of privacy policies and data usage terms.',
      weight: '20%',
    },
    {
      title: 'Third-Party Data Sharing',
      description: 'Extent of data sharing with advertisers and other third parties.',
      weight: '15%',
    },
    {
      title: 'Breach History & Response',
      description: 'Past security incidents and how the company handled them.',
      weight: '15%',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="Security Score Methodology | The Grid Nexus"
        description="Learn how we calculate security scores for games. Our methodology evaluates data collection, account security, privacy policies, and more."
        keywords={['security score', 'gaming security', 'privacy assessment', 'data protection', 'security methodology']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-gaming">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Security Score Methodology</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Our Security Score provides gamers with a quick, reliable assessment of how well games protect user data and privacy. Here's how we calculate it.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link to="/gaming" className="text-primary hover:underline">Gaming News</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security" className="text-primary hover:underline">Security Updates</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/guides" className="text-primary hover:underline">Security Guides</Link>
          </div>
        </div>

        {/* Score Scale */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="font-display font-semibold text-2xl mb-6">Score Scale</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { range: '90-100', label: 'Excellent', color: 'bg-gaming text-gaming-foreground' },
              { range: '70-89', label: 'Good', color: 'bg-primary text-primary-foreground' },
              { range: '50-69', label: 'Fair', color: 'bg-yellow-500 text-white' },
              { range: '0-49', label: 'Poor', color: 'bg-security text-security-foreground' },
            ].map((score) => (
              <div key={score.range} className={`${score.color} rounded-lg p-4 text-center`}>
                <p className="font-bold text-xl">{score.range}</p>
                <p className="text-sm opacity-90">{score.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Criteria */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="font-display font-semibold text-2xl mb-6">Evaluation Criteria</h2>
          <div className="space-y-4">
            {criteria.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <span className="text-sm font-medium text-primary">{item.weight}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto bg-muted/50 rounded-xl p-6 mb-8">
          <div className="flex gap-4">
            <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Important Note</h3>
              <p className="text-sm text-muted-foreground">
                Security Scores are based on publicly available information and our independent research. 
                Scores are updated quarterly or when significant changes occur. This rating system is 
                intended to inform consumers and should not be considered legal or professional security advice.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Links Section */}
        <div className="max-w-3xl mx-auto pt-8 border-t border-border">
          <h2 className="font-display font-semibold text-xl mb-4">Related Resources</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/gaming" className="text-primary hover:underline">Gaming News</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security" className="text-primary hover:underline">Cybersecurity</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/guides" className="text-primary hover:underline">Security Guides</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/about" className="text-primary hover:underline">About Us</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
