import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, Shield, BookOpen, Award, CheckCircle, Mail, RefreshCw, Eye, Scale } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { authorProfiles } from '@/data/authorData';

const FEATURED_AUTHORS = [
  'kim-njuki',
];

export default function About() {
  const team = FEATURED_AUTHORS.map((slug) => ({ slug, ...authorProfiles[slug] })).filter(Boolean);

  return (
    <Layout>
      <SEOHead
        title="About The Grid Nexus | Player Security Strategy"
        description="The Grid Nexus provides evidence-backed player security guidance — checkup, recovery, and threat awareness for gamers — with claims cited to primary sources."
        url={typeof window !== 'undefined' ? `${window.location.origin}/about` : '/about'}
        keywords={['about the grid nexus', 'player security', 'gaming safety', 'scam awareness']}
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold mb-5">Player Security for Gamers</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prevent, check, recover, and learn — evidence-backed guidance to protect your accounts, inventory, and identity across gaming platforms.
            </p>
          </div>

          {/* ── What We Provide ────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">What We Provide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-security mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Check Your Security</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Self-assessment tools for Steam, Discord, and other gaming platforms — anonymous, free, and without querying protected services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <RefreshCw className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Recovery Guidance</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Step-by-step playbooks for recovering compromised accounts, securing linked emails, and escalating to official support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Eye className="h-8 w-8 text-tech mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Threat Awareness</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Up-to-date information on scams, malicious mods, account takeovers, and platform-specific risks affecting gamers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Scale className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Evidence-Backed Grades</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Platform security grades with transparent methodology, provenance, and coverage indicators — never a fabricated score.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Our Story ────────────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                The Grid Nexus was founded in 2024 with a clear mandate: gamers need security guidance they can
                actually trust. Account takeovers, inventory theft, QR-login scams, and fake support agents cost
                players real money and real accounts every day — yet most advice online is generic, outdated, or
                written by people who have never been scammed themselves.
              </p>
              <p className="text-lg leading-relaxed">
                We built The Grid Nexus to fix that. Every guide, checkup, and recovery playbook is grounded in
                official platform documentation (Steam, Discord, and others), reviewed against current threats,
                and written in plain language. We do not claim to scan your account, guarantee recovery, or
                outperform antivirus products — we tell you exactly what we do and what we don't.
              </p>
              <p className="text-lg leading-relaxed">
                Behind the player-facing tools, our research desk covers the technology, cybersecurity, and
                gaming intersections that shape the threat landscape — from supply-chain attacks on game
                engines to AI-driven scam campaigns targeting gaming communities.
              </p>
            </div>
          </section>

          {/* ── Mission & Values ─────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6">Mission & Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To help gamers prevent account takeovers, recognize scams, and recover safely — with
                    guidance grounded in official sources, clearly labeled as self-assessment where applicable,
                    and never overstated.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Who We Serve</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Gamers of all levels — from casual players to streamers and parents — who want practical,
                    trustworthy security guidance. Our research desk additionally serves security professionals
                    and industry readers tracking the intersection of gaming and cyber threats.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Editorial Independence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our editorial decisions are made independently of our advertising and affiliate relationships. Sponsored content is always clearly labelled. We never accept payment for positive coverage, and our reviews reflect genuine, unbiased assessment.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Corrections Policy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Errors are corrected promptly and transparently. Corrections are noted in the article with a timestamp.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Team ─────────────────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-2">Editorial Team</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Player security guidance is written and reviewed by our editorial team. Contributor biographies
              are published only with the contributor's consent and corroborating evidence on file.
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
              <Card className="border-security/30 bg-security/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-security mb-3">Player Security</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Account protection, scam recognition, and safe gaming practices across Steam, Discord,
                    Epic, PlayStation, Xbox, Nintendo, and mobile platforms.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Account takeover prevention</li>
                    <li>• Scam & phishing awareness</li>
                    <li>• Inventory & payment safety</li>
                    <li>• Privacy settings guidance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gaming/30 bg-gaming/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gaming mb-3">Recovery & Response</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Step-by-step playbooks for compromised accounts, stolen items, QR-login scams, and
                    mobile-money fraud — always routed through official support channels.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Platform recovery guides</li>
                    <li>• Incident triage steps</li>
                    <li>• Official support directories</li>
                    <li>• Evidence preservation tips</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-tech/30 bg-tech/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-tech mb-3">Research Desk</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Cross-domain analysis at the intersection of technology, cybersecurity, and gaming —
                    for security professionals and industry readers tracking emerging threats.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Threat intelligence</li>
                    <li>• Gaming industry security</li>
                    <li>• Technology & AI developments</li>
                    <li>• Regional threat landscapes</li>
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
