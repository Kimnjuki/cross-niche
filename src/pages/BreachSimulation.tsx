/**
 * The Breach Simulation (nexus-003) — cybersecurity training module.
 */

import { Layout } from '@/components/layout/Layout';
import { BreachSimulation } from '@/components/nexus/BreachSimulation';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldAlert, Info, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

export default function BreachSimulationPage() {
  return (
    <Layout>
      <SEOHead
        title="Breach Simulation | The Grid Nexus"
        description="Interactive cybersecurity training: make choices in a phishing scenario. Earn Nexus XP for secure decisions. Terminal-style simulation."
        keywords={['breach simulation', 'phishing', 'cybersecurity training', 'Nexus XP', 'security awareness']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">Breach & Attack Simulation</h1>
              <p className="text-muted-foreground">Interactive Cybersecurity Training & BAS Guide</p>
            </div>
          </div>
          <div className="prose prose-lg max-w-3xl">
            <p className="text-muted-foreground mb-4">
              Breach and Attack Simulation (BAS) is an automated security testing approach that continuously validates 
              your security controls by simulating real-world attack scenarios. This interactive training module lets you 
              experience BAS concepts firsthand through realistic cybersecurity scenarios.
            </p>
            <p className="text-muted-foreground mb-4">
              In this simulation, you'll face various security challenges — from phishing emails to suspicious downloads. 
              Make secure choices to earn <strong>Nexus XP</strong> (saved in your browser). The <strong>Breach Level</strong> bar 
              fills when you take risky actions; keep it low to succeed and learn best practices for real-world security.
            </p>
            <p className="text-muted-foreground">
              This training module demonstrates how BAS platforms work by allowing you to experience attack scenarios 
              in a safe, controlled environment. Learn how to identify threats, make secure decisions, and understand 
              the impact of security choices.
            </p>
          </div>
        </header>

        {/* What is BAS Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              What is Breach and Attack Simulation (BAS)?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              Breach and Attack Simulation (BAS) is a security testing methodology that uses automated tools to simulate 
              cyberattacks against your organization's infrastructure. Unlike traditional penetration testing, BAS runs 
              continuously, providing ongoing validation of your security controls.
            </p>
            <p className="text-muted-foreground mb-4">
              BAS platforms simulate a wide range of attack scenarios based on frameworks like MITRE ATT&CK, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Phishing and social engineering attacks</li>
              <li>Ransomware and malware distribution</li>
              <li>Lateral movement and privilege escalation</li>
              <li>Data exfiltration attempts</li>
              <li>Credential theft and account compromise</li>
            </ul>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Key Benefit</AlertTitle>
              <AlertDescription>
                BAS helps identify security gaps before attackers exploit them, providing continuous security validation 
                rather than point-in-time assessments.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Interactive Simulation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Interactive BAS Training Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <BreachSimulation />
          </CardContent>
        </Card>

        {/* BAS vs Traditional Pentesting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">BAS vs Traditional Penetration Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-left p-4 font-semibold">BAS</th>
                    <th className="text-left p-4 font-semibold">Penetration Testing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Frequency</td>
                    <td className="p-4 text-muted-foreground">Continuous, automated</td>
                    <td className="p-4 text-muted-foreground">Quarterly or annually</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Coverage</td>
                    <td className="p-4 text-muted-foreground">Thousands of attack scenarios</td>
                    <td className="p-4 text-muted-foreground">Limited by time and scope</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Cost</td>
                    <td className="p-4 text-muted-foreground">Subscription-based, predictable</td>
                    <td className="p-4 text-muted-foreground">Per-engagement, variable</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Reporting</td>
                    <td className="p-4 text-muted-foreground">Real-time dashboards</td>
                    <td className="p-4 text-muted-foreground">Delivered after engagement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Common Attack Scenarios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Common Attack Scenarios in BAS</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              BAS platforms simulate various attack scenarios to test your security controls. Here are some common scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
              <li>
                <strong>Phishing Attacks:</strong> Simulates email-based attacks to test user awareness and email security controls
              </li>
              <li>
                <strong>Ransomware:</strong> Tests endpoint protection and backup systems against ransomware-like behavior
              </li>
              <li>
                <strong>Lateral Movement:</strong> Simulates how attackers move through your network after initial compromise
              </li>
              <li>
                <strong>Data Exfiltration:</strong> Tests data loss prevention (DLP) controls and network monitoring
              </li>
              <li>
                <strong>Credential Theft:</strong> Validates password policies and multi-factor authentication effectiveness
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Learn More</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <Link to="/security" className="text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Security News & Alerts
                    </Link>
                  </li>
                  <li>
                    <Link to="/guides" className="text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Cybersecurity Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/nexus-intersection" className="text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Cross-Industry Security Insights
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
