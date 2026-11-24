import { Layout } from '@/components/layout/Layout';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Privacy() {
  return (
    <Layout>
      <SEOHead
        title="Privacy Policy | The Grid Nexus"
        description="Read The Grid Nexus privacy policy. Learn exactly what data we collect (and don't), which third-party services we use, and how to exercise your data rights."
        url={typeof window !== 'undefined' ? `${window.location.origin}/privacy` : '/privacy'}
      />
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
                  At The Grid Nexus, we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our website and use our services.
                  This policy applies to all visitors and registered users of thegridnexus.com.
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
                <li><strong>Account Information (only if you sign in):</strong> Name, email address, and profile avatar, provided via Clerk authentication. Our security tools (Scam Checker, Security Checkup, Steam Scanner) require <em>no account</em> and collect <em>no answers</em> — results stay in your browser memory only.</li>
                <li><strong>Newsletter email:</strong> If you subscribe, your email is stored in our Convex database to send the newsletter. You can unsubscribe at any time.</li>
                <li><strong>Usage Data:</strong> Pages visited and aggregate events via Google Analytics 4 (measurement ID G-XMGRJBSN5Y). We do not track individual security-tool answers.</li>
                <li><strong>Device Information:</strong> IP address, browser type, and operating system, collected automatically by our hosting provider and analytics.</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies for authentication (Clerk), consent preferences, and — only with your consent — advertising (Google AdSense) and analytics (GA4).</li>
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
                <li>Send you newsletters if you subscribed (with your consent; unsubscribe anytime)</li>
                <li>Analyze aggregate usage patterns via Google Analytics 4 to enhance our platform</li>
                <li>Detect and prevent fraud, abuse, and security issues</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Serve advertisements through Google AdSense — <strong>only after you grant advertising consent</strong> via our cookie banner</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Google AdSense</h2>
              <p className="text-muted-foreground mb-4">
                We use Google AdSense to display advertisements on our website. Google AdSense uses cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Serve personalized ads based on your interests and browsing behavior</li>
                <li>Measure ad performance and effectiveness</li>
                <li>Prevent fraud and abuse</li>
                <li>Limit the number of times you see an ad</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Google may use information about your visits to this and other websites to provide relevant advertisements. 
                You can opt-out of personalized advertising by visiting{' '}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google's Ad Settings
                </a>
                {' '}or by adjusting your cookie preferences on our website.
              </p>
              <p className="text-muted-foreground">
                For more information about how Google uses data when you use our site, please visit{' '}
                <a 
                  href="https://policies.google.com/technologies/partner-sites" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google's Privacy & Terms
                </a>.
              </p>
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
                We use the following third-party services, each of which processes data under its own privacy policy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Google Analytics 4</strong> (measurement ID G-XMGRJBSN5Y) — aggregate usage analytics. Loads only after analytics consent.</li>
                <li><strong>Google AdSense</strong> (publisher ID ca-pub-9278124025449370) — advertising. Loads only after advertising consent.</li>
                <li><strong>Clerk</strong> — authentication for optional user accounts. Processes name, email, and avatar if you sign in.</li>
                <li><strong>Convex</strong> — backend database and hosting. Stores newsletter emails and account data (only if you create an account).</li>
                <li><strong>Sentry</strong> — error monitoring. Receives anonymized error reports in production.</li>
                <li><strong>Vercel / Coolify</strong> — hosting and CDN. Processes IP addresses and request logs.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These third parties have access to your information only to perform specific tasks on our behalf
                and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have rights under applicable data protection laws,
                including the <strong>General Data Protection Regulation (GDPR)</strong> for users in the
                European Economic Area, and the <strong>California Consumer Privacy Act (CCPA)</strong> for
                California residents. These rights include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</li>
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data</li>
                <li><strong>Right to Object:</strong> Object to certain types of processing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
                <li><strong>Right to Opt-Out (CCPA):</strong> California residents may opt out of the sale of personal information</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, please contact us via our{' '}
                <a href="/contact" className="text-primary hover:underline">contact page</a>.
                We will respond to verified requests within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Cookies & Consent</h2>
              <p className="text-muted-foreground mb-4">
                We use a consent banner to let you choose which categories of cookies to allow:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Essential</strong> — required for the site to function (authentication session, consent preferences). Always on.</li>
                <li><strong>Analytics</strong> — Google Analytics 4. Off by default; enabled only with your consent.</li>
                <li><strong>Advertising</strong> — Google AdSense. Off by default; enabled only with your consent.</li>
              </ul>
              <p className="text-muted-foreground">
                You can change your preferences at any time by clearing your browser's local storage or using the cookie settings link in the footer. Rejecting analytics or advertising prevents the corresponding scripts from loading.
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
              <p className="text-muted-foreground mb-2">
                If you have any questions about this Privacy Policy or wish to exercise your data rights,
                please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-1">
                <li><strong>Website:</strong>{' '}
                  <a href="/contact" className="text-primary hover:underline">thegridnexus.com/contact</a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}


