import { Layout } from '@/components/layout/Layout';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-4xl">Privacy Policy</h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-semibold text-xl mb-4">Our Commitment to Your Privacy</h2>
                <p className="text-muted-foreground">
                  At NexusMedia, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-2xl">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us and information that is automatically 
                collected when you use our services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and profile information when you create an account</li>
                <li><strong>Content Data:</strong> Articles you read, bookmarks, comments, and preferences</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, and navigation paths</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-2xl">How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and content recommendations</li>
                <li>Send you newsletters, updates, and promotional communications (with your consent)</li>
                <li>Analyze usage patterns to enhance our platform</li>
                <li>Detect and prevent fraud, abuse, and security issues</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-2xl">Data Security</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">
                We may use third-party services that collect, monitor, and analyze information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Analytics providers (e.g., Google Analytics)</li>
                <li>Cloud hosting and database services</li>
                <li>Email service providers</li>
                <li>Content delivery networks</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These third parties have access to your information only to perform specific tasks on our behalf 
                and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Withdraw consent at any time</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to track activity on our website and hold 
                certain information. You can instruct your browser to refuse all cookies or to indicate when 
                a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us through our 
                <a href="/contact" className="text-primary hover:underline ml-1">contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

