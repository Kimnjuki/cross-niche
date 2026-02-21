import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, Shield } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function About() {
  return (
    <Layout>
      <SEOHead
        title="About The Grid Nexus | Tech, Security & Gaming Intelligence"
        description="Learn about The Grid Nexus, your trusted source for tech news, cybersecurity insights, and gaming industry analysis. Expert coverage since 2026."
        keywords={['about us', 'tech news', 'cybersecurity', 'gaming intelligence', 'editorial standards', 'mission statement']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About The Grid Nexus</h1>
            <p className="text-xl text-muted-foreground">
              Demystifying complex trends in technology, cybersecurity, and gaming
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg leading-relaxed mb-6">
              The Grid Nexus is a premier digital publication established in 2026, dedicated to demystifying complex trends in technology, cybersecurity, and gaming. Managed by Kim Njuki, our mission is to provide actionable intelligence for the digital age.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              We aggregate, analyze, and curate content from across these three critical domains, 
              providing actionable insights, expert analysis, and real-time intelligence to help 
              you make informed decisions in an increasingly complex digital world. For transparency, you can reach us at{' '}
              <a href="mailto:kimnjuki2@gmail.com" className="text-primary hover:underline">kimnjuki2@gmail.com</a>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To bridge the gap between different technology domains and provide a unified 
                  platform for discovering, understanding, and acting on critical information 
                  across tech, security, and gaming.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Who We Serve</h3>
                <p className="text-muted-foreground">
                  Security professionals, game developers, tech enthusiasts, researchers, 
                  journalists, and anyone who needs to understand the intersection of these 
                  rapidly evolving fields.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">What Makes Us Different</h3>
                <p className="text-muted-foreground">
                  Our AI-powered curation engine discovers unexpected connections between 
                  domains, helping you see the bigger picture and anticipate trends before 
                  they become mainstream.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trust & Security</h3>
                <p className="text-muted-foreground">
                  We take your privacy and data security seriously. All content is verified, 
                  and we maintain strict editorial standards to ensure accuracy and reliability.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6">
              Connect with experts and enthusiasts across tech, security, and gaming
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Explore Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

