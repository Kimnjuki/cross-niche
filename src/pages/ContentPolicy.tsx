/**
 * Content Policy Page - Addresses AdSense Policy Violations
 * Demonstrates commitment to high-quality content and user experience
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Shield, CheckCircle, AlertCircle, BookOpen, Users, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ContentPolicy() {
  return (
    <Layout>
      <SEOHead
        title="Content Quality Policy | The Grid Nexus"
        description="Our commitment to high-quality, original content that meets AdSense policies and provides value to our readers."
        keywords={['content policy', 'quality guidelines', 'adSense compliance', 'editorial standards']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-nexus-blue" />
            <h1 className="font-display font-bold text-4xl">Content Quality Policy</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our commitment to delivering high-quality, original content that meets AdSense policies 
            and provides exceptional value to our readers.
          </p>
        </div>

        {/* Policy Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-security-green" />
              AdSense Policy Compliance
            </CardTitle>
            <CardDescription>
              We strictly adhere to Google AdSense program policies to ensure a safe, valuable experience for our users and advertisers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No Low-Value Content</h4>
                  <p className="text-sm text-muted-foreground">
                    All pages contain substantial, original content with minimum 300 words for articles and 500+ words for in-depth analysis.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No Under Construction Pages</h4>
                  <p className="text-sm text-muted-foreground">
                    All published pages are complete with meaningful content, never showing ads on placeholder or navigation-only pages.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Original, Expert Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Our content is created by security professionals, tech experts, and gaming industry veterans with real-world experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">User-Focused Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Ads are strategically placed to complement, not disrupt, the user experience with proper content-to-ad ratios.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Standards */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-nexus-blue" />
            Our Content Standards
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Fact-checked by industry experts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Source citations and references</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Regular content updates and corrections</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Original Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Unique insights and perspectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>In-depth research and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>No content scraping or aggregation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Actionable insights and takeaways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Educational and informative content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Practical applications and examples</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Categories */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-nexus-blue" />
            Content Categories & Quality Metrics
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Technology Coverage</CardTitle>
                  <Badge className="bg-nexus-blue">Tech</Badge>
                </div>
                <CardDescription>
                  In-depth analysis of emerging technologies, industry trends, and technical developments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Minimum Requirements:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 800+ words for analysis articles</li>
                      <li>• Expert author credentials</li>
                      <li>• Technical accuracy verification</li>
                      <li>• Original research or insights</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Indicators:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Code examples and implementations</li>
                      <li>• Performance benchmarks</li>
                      <li>• Industry expert quotes</li>
                      <li>• Real-world use cases</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Security Intelligence</CardTitle>
                  <Badge className="bg-threat-red">Security</Badge>
                </div>
                <CardDescription>
                  Threat analysis, vulnerability research, and cybersecurity best practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Minimum Requirements:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 1,000+ words for threat analysis</li>
                      <li>• Security professional authorship</li>
                      <li>• CVE and MITRE ATT&CK references</li>
                      <li>• Responsible disclosure practices</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Indicators:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Incident timeline analysis</li>
                      <li>• Mitigation strategies</li>
                      <li>• Industry threat intelligence</li>
                      <li>• Prevention recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Gaming Industry Analysis</CardTitle>
                  <Badge className="bg-gaming-purple">Gaming</Badge>
                </div>
                <CardDescription>
                  Industry insights, security in gaming, and technological developments in gaming.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Minimum Requirements:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 600+ words for industry news</li>
                      <li>• Gaming industry expertise</li>
                      <li>• Market data and statistics</li>
                      <li>• Developer/publisher insights</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Indicators:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Esports tournament coverage</li>
                      <li>• Game security analysis</li>
                      <li>• Technology trend reporting</li>
                      <li>• Industry expert interviews</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compliance Measures */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Compliance & Quality Assurance
            </CardTitle>
            <CardDescription>
              Our systematic approach to maintaining content quality and AdSense compliance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Automated Quality Checks</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Content length verification (300+ words minimum)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Originality detection and plagiarism prevention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Readability and structure analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Ad placement compliance verification</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Editorial Review Process</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Expert fact-checking and verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Technical accuracy review by specialists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Content value assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>AdSense policy compliance review</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Reporting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-nexus-blue" />
              Report Quality Issues
            </CardTitle>
            <CardDescription>
              Help us maintain high standards by reporting content quality concerns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you encounter content that doesn't meet our quality standards or AdSense compliance requirements, 
                please let us know. We take all reports seriously and respond promptly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 text-sm text-nexus-blue hover:underline"
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Content Issue
                </Link>
                <Link 
                  to="/feedback" 
                  className="inline-flex items-center gap-2 text-sm text-nexus-blue hover:underline"
                >
                  <Users className="w-4 h-4" />
                  Send Feedback
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Last updated: February 2026 | This policy is regularly reviewed and updated to ensure ongoing compliance.
          </p>
        </div>
      </div>
    </Layout>
  );
}
