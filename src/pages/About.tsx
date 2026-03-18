import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, Shield, BookOpen, Award, CheckCircle, Mail } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { authorProfiles } from '@/data/authorData';

const FEATURED_AUTHORS = [
  'diana-wong',
  'james-morrison',
  'dr-emily-watson',
  'sarah-chen',
  'marcus-johnson',
  'lisa-park',
  'dr-robert-kim',
  'kevin-nakamura',
];

export default function About() {
  const team = FEATURED_AUTHORS.map((slug) => ({ slug, ...authorProfiles[slug] })).filter(Boolean);

  return (
    <Layout>
      <SEOHead
        title="About The Grid Nexus | Our Mission, Team & Editorial Standards"
        description="The Grid Nexus is a premier digital publication covering technology, cybersecurity, and gaming. Meet our expert editorial team and learn about our commitment to accurate, in-depth reporting."
        url={typeof window !== 'undefined' ? `${window.location.origin}/about` : '/about'}
        keywords={['about the grid nexus', 'tech journalism', 'cybersecurity news', 'gaming coverage', 'editorial team']}
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold mb-5">About The Grid Nexus</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Independent intelligence across technology, cybersecurity, and gaming — written by specialists, for professionals.
            </p>
          </div>

          {/* ── Our Story ────────────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                The Grid Nexus was founded in 2024 with a clear mandate: the worlds of technology, cybersecurity,
                and gaming are converging faster than any single-domain publication can track. A vulnerability
                discovered in a gaming platform can become a nation-state threat vector overnight. An AI chip
                architecture developed for data centres reshapes the GPU market that powers both enterprise
                workloads and consumer gaming. The Grid Nexus exists to map those intersections — and to explain
                why they matter.
              </p>
              <p className="text-lg leading-relaxed">
                We are managed by <strong>Kim Njuki</strong>, a technology journalist and digital media strategist
                who spent years watching readers struggle to connect dots across fragmented specialist publications.
                The Grid Nexus was built to solve that problem: a single, authoritative destination where a
                security professional can read about the gaming industry's data practices, where a hardware
                enthusiast can understand the geopolitical supply-chain story behind their next GPU, and where
                a game developer can stay current on the threat landscape targeting their platform.
              </p>
              <p className="text-lg leading-relaxed">
                Our editorial team spans three continents and brings together journalists, researchers, and
                practitioners with deep domain expertise. Every article published on The Grid Nexus goes through
                our multi-stage editorial process: research, drafting, fact-checking, and final review by a
                senior editor or subject-matter expert. We do not publish press releases as news. We do not
                accept payment for editorial coverage. We clearly label sponsored content and affiliate
                relationships in accordance with FTC guidelines.
              </p>
              <p className="text-lg leading-relaxed">
                Since launch, The Grid Nexus has published in-depth analysis of major data breaches, exclusive
                hardware benchmarks, investigative reporting on AI policy, and comprehensive gaming industry
                coverage. Our readers include security operations teams, product managers at technology companies,
                game developers, investors, and engaged enthusiasts who demand more than surface-level summaries.
              </p>
            </div>
          </section>

          {/* ── Mission & Values ─────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">Mission &amp; Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To bridge the gap between technology, cybersecurity, and gaming by delivering accurate,
                    deeply reported intelligence that helps professionals and enthusiasts make better decisions
                    in a rapidly evolving digital landscape.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Who We Serve</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Security professionals, software engineers, game developers, technology investors,
                    IT decision-makers, and engaged enthusiasts who need accurate, timely, and contextual
                    coverage across all three domains — not just headlines.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Zap className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">What Makes Us Different</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our cross-niche intelligence model identifies connections between domains that
                    single-vertical publications miss. We combine practitioner expertise with journalistic
                    rigour to deliver analysis that is both technically accurate and accessible.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Editorial Independence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our editorial decisions are made independently of our advertising and affiliate
                    relationships. Sponsored content is always clearly labelled. We never accept payment
                    for positive coverage, and our reviews reflect genuine, unbiased assessment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Editorial Standards ──────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">Our Editorial Standards</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p className="text-lg leading-relaxed">
                Every piece of content published on The Grid Nexus is held to a strict set of editorial
                standards designed to protect our readers and maintain the trust we have built with our audience.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, title: 'Accuracy First', desc: 'All factual claims are verified against primary sources, official documentation, or expert testimony before publication.' },
                { icon: BookOpen, title: 'Source Transparency', desc: 'We cite our sources clearly. When sources must remain confidential, we explain why and provide corroborating context.' },
                { icon: Award, title: 'Expert Review', desc: 'Technical articles are reviewed by practitioners with direct domain expertise — not just generalist editors.' },
                { icon: Shield, title: 'Corrections Policy', desc: 'Errors are corrected promptly and transparently. Corrections are noted in the article with a timestamp.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
                  <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Team ─────────────────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-2">Our Editorial Team</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              The Grid Nexus is written and edited by specialists with real-world experience in their fields —
              not generalist bloggers. Our contributors hold advanced degrees, professional certifications,
              and years of hands-on industry experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {team.map((author) => (
                <Card key={author.slug} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {author.imageUrl && (
                        <img
                          src={author.imageUrl}
                          alt={author.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg leading-tight">{author.name}</h3>
                        <p className="text-sm text-primary font-medium mb-2">{author.jobTitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{author.bio}</p>
                        <div className="flex flex-wrap gap-1">
                          {author.expertise?.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Coverage Areas ───────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-tech/30 bg-tech/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-tech mb-3">Technology &amp; AI</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    In-depth coverage of artificial intelligence, hardware innovation, cloud infrastructure,
                    semiconductor developments, and the startups and incumbents shaping the future of computing.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI &amp; Machine Learning</li>
                    <li>• Hardware &amp; Semiconductors</li>
                    <li>• Cloud &amp; Infrastructure</li>
                    <li>• Startup &amp; Industry News</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-security/30 bg-security/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-security mb-3">Cybersecurity</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Threat intelligence, vulnerability disclosures, breach analysis, and enterprise security
                    guidance — written by practitioners with direct incident response and research experience.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Threat Intelligence</li>
                    <li>• Vulnerability Research</li>
                    <li>• Data Breach Analysis</li>
                    <li>• Security Policy &amp; Compliance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gaming/30 bg-gaming/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gaming mb-3">Gaming</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    News, reviews, and industry analysis covering AAA releases, indie games, esports,
                    gaming hardware, and the business of interactive entertainment.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Game Reviews &amp; Previews</li>
                    <li>• Hardware &amp; Peripherals</li>
                    <li>• Industry &amp; Business News</li>
                    <li>• Esports &amp; Competitive Gaming</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Contact ──────────────────────────────────────────────────── */}
          <section className="mb-8 p-8 rounded-xl border border-border bg-card text-center">
            <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
            <p className="text-muted-foreground mb-2 max-w-xl mx-auto">
              For editorial enquiries, press releases, corrections, or partnership opportunities,
              please reach out to our team.
            </p>
            <p className="text-muted-foreground mb-6">
              <Mail className="inline h-4 w-4 mr-1" />
              <a href="mailto:kimnjuki2@gmail.com" className="text-primary hover:underline font-medium">
                kimnjuki2@gmail.com
              </a>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/editorial">Editorial Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/disclosure">Disclosure</Link>
              </Button>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
