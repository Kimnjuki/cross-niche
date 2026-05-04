import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Users, Shield, AlertTriangle, CheckCircle, XCircle,
  ArrowLeft, RefreshCw, ChevronRight, MessageSquare,
  ThumbsUp, ThumbsDown, Flag, Zap, Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type Verdict = 'approved' | 'flagged' | 'removed';

interface ModerationCategory {
  name: string;
  score: number;
  triggered: boolean;
}

interface ModerationResult {
  verdict: Verdict;
  confidence: number;
  overallToxicity: number;
  categories: ModerationCategory[];
  reasoning: string;
  recommendation: string;
  appliedPolicies: string[];
  editSuggestion?: string;
}

// ── Mock moderation engine ─────────────────────────────────────────────────

function moderateText(text: string): ModerationResult {
  const lower = text.toLowerCase();
  const len = text.length;

  const hasToxic = /\b(hate|kill|die|trash|garbage|stupid|idiot|noob|loser|worthless|trash|dogwater)\b/i.test(text);
  const hasSpam = /(http[s]?:\/\/|buy now|click here|free coins|discord\.gg\/|join my server)/i.test(text);
  const hasPII = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
  const hasPositive = /(great game|thanks|well played|good luck|gg|love this|appreciate|helpful|friendly|awesome)\b/i.test(text);
  const isShort = len < 5;
  const isOffTopic = /(free v-bucks|account giveaway|sell account|buy gold|powerleveling)/i.test(text);

  const toxicityScore = hasToxic ? 72 + Math.random() * 20 : hasSpam ? 45 : isOffTopic ? 30 : hasPositive ? 5 : 12;
  const spamScore = hasSpam || isOffTopic ? 80 + Math.random() * 15 : 8;
  const harassmentScore = hasToxic ? 65 + Math.random() * 25 : 6;
  const piiScore = hasPII ? 95 : 2;
  const offTopicScore = isOffTopic || hasSpam ? 75 : 10;
  const qualityScore = isShort ? 85 : hasToxic ? 40 : hasPositive ? 15 : 20;

  const categories: ModerationCategory[] = [
    { name: 'Toxicity', score: Math.round(toxicityScore), triggered: toxicityScore > 50 },
    { name: 'Spam / Promotion', score: Math.round(spamScore), triggered: spamScore > 50 },
    { name: 'Harassment', score: Math.round(harassmentScore), triggered: harassmentScore > 50 },
    { name: 'PII / Personal Data', score: Math.round(piiScore), triggered: piiScore > 50 },
    { name: 'Off-Topic Content', score: Math.round(offTopicScore), triggered: offTopicScore > 50 },
    { name: 'Low Quality', score: Math.round(qualityScore), triggered: qualityScore > 70 },
  ];

  const triggered = categories.filter(c => c.triggered);
  const overallToxicity = Math.round(Math.max(...categories.map(c => c.score)));

  let verdict: Verdict;
  let confidence: number;
  let reasoning: string;
  let recommendation: string;
  let appliedPolicies: string[] = [];
  let editSuggestion: string | undefined;

  if (piiScore > 50) {
    verdict = 'removed';
    confidence = 97;
    reasoning = 'Content contains personal identifiable information (PII) such as phone numbers or email addresses, which violates our privacy policy.';
    recommendation = 'Remove the PII and repost without personal contact information.';
    appliedPolicies = ['Privacy Policy §3.1 — No PII disclosure', 'Community Rule 7 — No doxxing or contact sharing'];
  } else if (hasToxic && harassmentScore > 60) {
    verdict = 'removed';
    confidence = 89;
    reasoning = 'High-confidence toxicity and harassment signals detected. Content includes language that targets or degrades other community members.';
    recommendation = 'Rewrite constructively. Criticism of gameplay/mechanics is fine; targeting individuals is not.';
    editSuggestion = text.replace(/\b(trash|garbage|stupid|idiot|noob|loser|worthless|dogwater)\b/gi, '[removed]');
    appliedPolicies = ['Code of Conduct §2 — Respect', 'Community Rule 3 — No personal attacks'];
  } else if (hasSpam || isOffTopic) {
    verdict = 'flagged';
    confidence = 83;
    reasoning = 'Content appears to be promotional or off-topic. External links or solicitations detected.';
    recommendation = 'Remove promotional links. If you\'re recommending a resource, describe it in text instead.';
    appliedPolicies = ['Community Rule 5 — No unsolicited promotions', 'Community Rule 6 — Stay on topic'];
  } else if (hasToxic) {
    verdict = 'flagged';
    confidence = 74;
    reasoning = 'Moderately elevated toxicity score. Some language may be interpreted as hostile, though context is ambiguous.';
    recommendation = 'Consider rephrasing to be more constructive. Borderline content may be reviewed by a human moderator.';
    editSuggestion = text.replace(/\b(trash|garbage|stupid|idiot|noob|loser)\b/gi, '[flagged]');
    appliedPolicies = ['Code of Conduct §2 — Respect', 'Community Guideline 4 — Constructive tone'];
  } else {
    verdict = 'approved';
    confidence = hasPositive ? 96 : 88;
    reasoning = 'No policy violations detected. Content is within community guidelines and appears constructive or neutral.';
    recommendation = 'Post approved. Content meets community standards.';
    appliedPolicies = ['All checks passed'];
  }

  return { verdict, confidence, overallToxicity, categories, reasoning, recommendation, appliedPolicies, editSuggestion };
}

// ── Example prompts ────────────────────────────────────────────────────────

const EXAMPLES = [
  { label: 'Clean post', text: 'GG everyone, that was a really intense match! Anyone have tips for improving my aim? I\'ve been struggling with long-range shots in Valorant.' },
  { label: 'Toxic post', text: 'This team is absolute trash. You\'re all dogwater noobs who should uninstall. I can\'t believe I got matched with these losers.' },
  { label: 'Spam', text: 'Get free V-Bucks here! https://free-vbucks-hack.com Click now before it expires! Join my Discord discord.gg/freestuff' },
  { label: 'Contains PII', text: 'If anyone needs help with the game, call me at 555-867-5309 or email john.player@gmail.com anytime!' },
];

const VERDICT_CONFIG = {
  approved: { label: 'Approved', color: 'text-[#39FF14]', bgColor: 'bg-[#39FF14]/10', borderColor: 'border-[#39FF14]/30', icon: CheckCircle },
  flagged: { label: 'Flagged for Review', color: 'text-[#FFB800]', bgColor: 'bg-[#FFB800]/10', borderColor: 'border-[#FFB800]/30', icon: Flag },
  removed: { label: 'Auto-Removed', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/30', icon: XCircle },
};

// ── Component ──────────────────────────────────────────────────────────────

export default function CommunityModerator() {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setText(val);
    setCharCount(val.length);
  };

  const analyze = useCallback(async (input?: string) => {
    const content = input ?? text;
    if (!content.trim()) return;
    setAnalyzing(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 900));
    setResult(moderateText(content));
    setAnalyzing(false);
  }, [text]);

  const loadExample = (example: typeof EXAMPLES[number]) => {
    setText(example.text);
    setCharCount(example.text.length);
    analyze(example.text);
  };

  const verdictCfg = result ? VERDICT_CONFIG[result.verdict] : null;
  const VerdictIcon = verdictCfg?.icon;

  return (
    <Layout>
      <SEO
        title="Community AI Moderator — The Grid Nexus"
        description="Test any post against The Grid Nexus community guidelines. Get instant AI moderation verdicts with policy citations and edit suggestions."
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#FF007A]/10 border border-[#FF007A]/30">
              <Users className="h-7 w-7 text-[#FF007A]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">Community AI Moderator</h1>
              <p className="text-muted-foreground text-sm">Pre-check any post against Nexus community guidelines before you submit</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Toxicity Detection', 'Spam Filtering', 'PII Protection', 'Policy Citations'].map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input panel */}
          <div className="space-y-4">
            <Card className="border-[#FF007A]/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#FF007A]" /> Post Content
                </CardTitle>
                <CardDescription>Paste or type the post you want to check</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={text}
                  onChange={handleChange}
                  placeholder="Enter any post, comment, or message to check against community guidelines…"
                  className="w-full h-40 p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF007A]/30 placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className={cn('text-xs', charCount > MAX_CHARS * 0.9 ? 'text-[#FFB800]' : 'text-muted-foreground')}>
                    {charCount}/{MAX_CHARS}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setText(''); setCharCount(0); setResult(null); }}>
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => analyze()}
                      disabled={analyzing || !text.trim()}
                      className="bg-[#FF007A] hover:bg-[#FF007A]/80 text-white"
                    >
                      {analyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <><Zap className="h-3.5 w-3.5 mr-1" /> Check Post</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Quick examples</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.label}
                    onClick={() => loadExample(ex)}
                    disabled={analyzing}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-[#FF007A]/30 hover:bg-[#FF007A]/5 transition-all text-left group"
                  >
                    <div>
                      <span className="text-sm font-medium">{ex.label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ex.text}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#FF007A] shrink-0 ml-2" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Policy reference */}
            <Card className="border-border bg-muted/10">
              <CardContent className="pt-4 pb-4 text-xs space-y-1.5 text-muted-foreground">
                <div className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Checks performed
                </div>
                {['Toxicity & hate speech (ML + keyword)', 'Spam & promotional links', 'Harassment & personal attacks', 'PII / contact info disclosure', 'Off-topic content detection', 'Post quality threshold'].map(c => (
                  <div key={c} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3 w-3 text-[#39FF14]" /> {c}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Results panel */}
          <div>
            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64">
                <Shield className="h-10 w-10 text-[#FF007A] animate-pulse mb-4" />
                <p className="text-muted-foreground">Running moderation checks…</p>
                <div className="flex gap-1 mt-3">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-[#FF007A] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {result && !analyzing && verdictCfg && VerdictIcon && (
              <div className="space-y-4">
                {/* Verdict */}
                <Card className={cn('border-2', verdictCfg.borderColor, verdictCfg.bgColor)}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <VerdictIcon className={cn('h-8 w-8', verdictCfg.color)} />
                      <div>
                        <div className={cn('text-xl font-bold', verdictCfg.color)}>{verdictCfg.label}</div>
                        <div className="text-xs text-muted-foreground">{result.confidence}% confidence</div>
                      </div>
                    </div>
                    <p className="text-sm">{result.reasoning}</p>
                  </CardContent>
                </Card>

                {/* Overall toxicity */}
                <Card>
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Overall Toxicity Score</span>
                      <span className={cn('font-bold', result.overallToxicity > 60 ? 'text-destructive' : result.overallToxicity > 30 ? 'text-[#FFB800]' : 'text-[#39FF14]')}>
                        {result.overallToxicity}/100
                      </span>
                    </div>
                    <Progress value={result.overallToxicity} className="h-2" />

                    <div className="space-y-2 pt-2">
                      {result.categories.map(cat => (
                        <div key={cat.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={cn('flex items-center gap-1', cat.triggered ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                              {cat.triggered && <AlertTriangle className="h-3 w-3 text-[#FFB800]" />}
                              {cat.name}
                            </span>
                            <span className={cn(cat.triggered ? 'text-[#FFB800] font-semibold' : 'text-muted-foreground')}>{cat.score}%</span>
                          </div>
                          <Progress value={cat.score} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendation */}
                <Card className="border-[#00F0FF]/20 bg-[#00F0FF]/5">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                      <ThumbsUp className="h-4 w-4 text-[#00F0FF] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-[#00F0FF] mb-1">Recommendation</div>
                        <p className="text-sm">{result.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit suggestion */}
                {result.editSuggestion && (
                  <Card className="border-[#FFB800]/20 bg-[#FFB800]/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-[#FFB800]">
                        <MessageSquare className="h-3.5 w-3.5" /> Suggested Edit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground font-mono bg-background/50 p-3 rounded border border-border">{result.editSuggestion}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Policies */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Applied Policies</div>
                    {result.appliedPolicies.map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm py-1 border-b border-border/50 last:border-0">
                        <Shield className="h-3 w-3 text-[#FF007A] shrink-0" />
                        {p}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {!result && !analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-semibold">No post checked yet</p>
                <p className="text-sm mt-1">Enter text or pick an example to see the moderation verdict.</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-8 border-[#FF007A]/20 bg-gradient-to-r from-[#FF007A]/5 to-[#B026FF]/5">
          <CardContent className="pt-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Read the full community guidelines</p>
              <p className="text-sm text-muted-foreground">Understand all the rules before posting in community spaces.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button asChild size="sm" variant="outline">
                <Link to="/community-guidelines">Community Guidelines</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/community">Join Community</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
