import { Layout } from '@/components/layout/Layout';
import { FileText, Scale, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-4xl">Terms of Service</h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-semibold text-xl mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using NexusMedia ("the Service"), you accept and agree to be bound by 
                  the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-2xl">Use License</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access the materials on NexusMedia's website for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
                and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide information that is accurate, complete, 
                and current at all times. You are responsible for safeguarding the password and for all activities 
                that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">User Content</h2>
              <p className="text-muted-foreground mb-4">
                Our Service allows you to post, link, store, share and otherwise make available certain information, 
                text, graphics, or other material ("Content"). You are responsible for the Content that you post 
                on or through the Service, including its legality, reliability, and appropriateness.
              </p>
              <p className="text-muted-foreground">
                By posting Content on or through the Service, you grant us the right and license to use, modify, 
                publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-2xl">Prohibited Uses</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                You may not use our Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of NexusMedia and its licensors. The Service is protected by copyright, trademark, and other 
                laws. Our trademarks and trade dress may not be used in connection with any product or service without 
                our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Disclaimer</h2>
              <p className="text-muted-foreground mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
                this Company:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Excludes all representations and warranties relating to this website and its contents</li>
                <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
                <li>Does not warrant that the website will be constantly available, or available at all</li>
                <li>Does not warrant that the information on this website is complete, true, accurate, or non-misleading</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall NexusMedia, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                of the Service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which NexusMedia operates, 
                without regard to its conflict of law provisions. Our failure to enforce any right or provision of these 
                Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us through our 
                <a href="/contact" className="text-primary hover:underline ml-1">contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}



