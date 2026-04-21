/**
 * Quality Guidelines Page - Demonstrates commitment to high-quality content
 * Addresses Webmaster quality guidelines and thin content concerns
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { CheckCircle, AlertTriangle, BookOpen, Target, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function QualityGuidelines() {
  return (
    <Layout>
      <SEOHead
        title="Content Quality Guidelines | The Grid Nexus"
        description="Our comprehensive approach to creating high-quality, valuable content that exceeds Webmaster guidelines and user expectations."
        keywords={['content quality', 'webmaster guidelines', 'thin content', 'user experience', 'content standards']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-nexus-blue" />
            <h1 className="font-display font-bold text-4xl">Content Quality Guidelines</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive framework for creating exceptional content that exceeds Webmaster guidelines 
            and delivers real value to our readers.
          </p>
        </div>

        {/* Quality Framework */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-nexus-blue" />
              The Grid Nexus Quality Framework
            </CardTitle>
            <CardDescription>
              Our systematic approach to ensuring every piece of content meets the highest standards of quality, 
              originality, and user value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Expert-Driven Content</h4>
                    <p className="text-sm text-muted-foreground">
                      All content is created or reviewed by industry professionals with proven expertise 
                      in technology, cybersecurity, or gaming.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Original Research & Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      We conduct original research, analyze data, and provide unique insights that can't be found elsewhere.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Comprehensive Coverage</h4>
                    <p className="text-sm text-muted-foreground">
                      Each topic is explored in-depth with proper context, examples, and practical applications.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">User-Centric Approach</h4>
                    <p className="text-sm text-muted-foreground">
                      Content is designed to solve real problems, answer specific questions, and provide actionable insights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Technical Accuracy</h4>
                    <p className="text-sm text-muted-foreground">
                      All technical information is fact-checked, verified, and regularly updated for accuracy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-security-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Transparent Sourcing</h4>
                    <p className="text-sm text-muted-foreground">
                      We cite sources, provide references, and clearly distinguish between facts and analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anti-Thin Content Measures */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Preventing Thin Content
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-nexus-blue" />
                  Content Depth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Minimum 500 words for news articles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>1,000+ words for analysis pieces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>2,000+ words for in-depth reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>No auto-generated or spun content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-security-green" />
                  Value Addition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Unique insights and perspectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Original data and research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Expert analysis and commentary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Practical applications and examples</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gaming-purple" />
                  Content Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Clear introduction and conclusion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Logical flow and organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Supporting evidence and examples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Proper formatting and readability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Categories & Standards */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-6">Category-Specific Standards</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Technology Articles</CardTitle>
                  <Badge className="bg-nexus-blue">Tech</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Technical accuracy verified by experts</li>
                      <li>• Code examples with explanations</li>
                      <li>• Performance benchmarks and data</li>
                      <li>• Real-world implementation guidance</li>
                      <li>• Industry context and implications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Indicators:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Original research or testing</li>
                      <li>• Expert quotes and insights</li>
                      <li>• Comparative analysis</li>
                      <li>• Future trend predictions</li>
                      <li>• Practical takeaways</li>
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
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Security professional authorship</li>
                      <li>• CVE and MITRE ATT&CK references</li>
                      <li>• Responsible disclosure practices</li>
                      <li>• Incident timeline and analysis</li>
                      <li>• Mitigation strategies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Indicators:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Threat intelligence integration</li>
                      <li>• Industry-specific insights</li>
                      <li>• Prevention recommendations</li>
                      <li>• Risk assessment frameworks</li>
                      <li>• Compliance considerations</li>
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
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Gaming industry expertise</li>
                      <li>• Market data and statistics</li>
                      <li>• Developer/publisher insights</li>
                      <li>• Esports ecosystem coverage</li>
                      <li>• Technology trend analysis</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Indicators:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Industry expert interviews</li>
                      <li>• Tournament coverage and analysis</li>
                      <li>• Game security examination</li>
                      <li>• Platform technology insights</li>
                      <li>• Market trend predictions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quality Assurance Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-security-green" />
              Quality Assurance Process
            </CardTitle>
            <CardDescription>
              Our multi-layered approach to ensuring content excellence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-nexus-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-nexus-blue font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Expert Assignment</h4>
                  <p className="text-sm text-muted-foreground">
                    Content is assigned to subject matter experts with proven industry experience.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-nexus-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-nexus-blue font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Research & Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive research, data collection, and original analysis are conducted.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-nexus-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-nexus-blue font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Editorial Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Content undergoes technical accuracy review and quality assessment.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-nexus-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-nexus-blue font-bold">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">Publication</h4>
                  <p className="text-sm text-muted-foreground">
                    Final quality check ensures compliance with all guidelines before publication.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Value Proposition */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-nexus-blue" />
              Delivering User Value
            </CardTitle>
            <CardDescription>
              How we ensure our content provides genuine value to our readers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Problem-Solving Content</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Addresses specific user pain points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Provides actionable solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Offers practical implementation guidance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Educational Excellence</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Complex topics explained clearly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Progressive learning structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                    <span>Real-world examples and case studies</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continuous Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Continuous Improvement
            </CardTitle>
            <CardDescription>
              Our commitment to ongoing quality enhancement and user feedback integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We regularly review and update our content based on user feedback, industry developments, 
                and evolving best practices. Our quality guidelines are living documents that evolve 
                with our commitment to excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 text-sm text-nexus-blue hover:underline"
                >
                  <Target className="w-4 h-4" />
                  Send Feedback
                </Link>
                <Link 
                  to="/content-policy" 
                  className="inline-flex items-center gap-2 text-sm text-nexus-blue hover:underline"
                >
                  <Shield className="w-4 h-4" />
                  View Content Policy
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            These guidelines are regularly updated to reflect industry best practices and user needs. 
            Last updated: February 2026
          </p>
        </div>
      </div>
    </Layout>
  );
}
