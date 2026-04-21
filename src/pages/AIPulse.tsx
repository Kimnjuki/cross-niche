import { memo, useState, useMemo, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Zap, Shield, Globe, BookOpen, Search, Filter, ThumbsUp, ThumbsDown,
  ExternalLink, ChevronRight, TrendingUp, AlertTriangle, FlaskConical,
  Rocket, Clock, X, Activity,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = 'ai_attack' | 'ai_tool_launch' | 'ai_breach' | 'ai_regulation' | 'ai_defense' | 'ai_research' | 'ai_africa';
type Impact = 'critical' | 'high' | 'medium' | 'low' | 'hype_only';

interface PulseItem {
  id: string;
  title: string;
  summary: string;
  category: Category;
  impact: Impact;
  isHype: boolean;
  affectedPlatforms: string[];
  affectedPersonas: string[];
  africaRelevance: boolean;
  publishedAt: string;
  sourceUrl?: string;
  linkedTool?: { label: string; to: string };
  linkedBreachSim?: string;
  benchmarks?: Array<{ name: string; value: string }>;
  hypeVotes: { signal: number; hype: number };
}

// ── Static data ────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<Category, { label: string; icon: React.ElementType; color: string; bg: string; emoji: string }> = {
  ai_attack:      { label: 'AI-Powered Attack',        icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',      emoji: '⚡' },
  ai_tool_launch: { label: 'New AI Tool',               icon: Rocket,        color: 'text-tech',       bg: 'bg-tech/10 border-tech/30',             emoji: '🚀' },
  ai_breach:      { label: 'AI Tool Breach',            icon: Shield,        color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', emoji: '🔴' },
  ai_regulation:  { label: 'Regulation / Policy',       icon: BookOpen,      color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', emoji: '⚖️' },
  ai_defense:     { label: 'AI Defense Capability',     icon: Shield,        color: 'text-security',   bg: 'bg-security/10 border-security/30',     emoji: '🛡️' },
  ai_research:    { label: 'Research Finding',          icon: FlaskConical,  color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', emoji: '🔬' },
  ai_africa:      { label: 'Africa AI Signal',          icon: Globe,         color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30',   emoji: '🌍' },
};

const IMPACT_META: Record<Impact, { label: string; color: string; bg: string }> = {
  critical:  { label: 'Critical',   color: 'text-red-400',    bg: 'bg-red-500/10 border border-red-500/30' },
  high:      { label: 'High',       color: 'text-orange-400', bg: 'bg-orange-500/10 border border-orange-500/30' },
  medium:    { label: 'Medium',     color: 'text-yellow-400', bg: 'bg-yellow-500/10 border border-yellow-500/30' },
  low:       { label: 'Low',        color: 'text-green-400',  bg: 'bg-green-500/10 border border-green-500/30' },
  hype_only: { label: 'Hype Only',  color: 'text-muted-foreground', bg: 'bg-muted/60 border border-border' },
};

const PULSE_ITEMS: PulseItem[] = [
  // ── AI-Powered Attacks ──────────────────────────────────────────────────────
  {
    id: 'p1',
    title: 'GPT-4o Used to Mass-Generate Spear-Phishing Emails at 100× Human Speed',
    summary: 'Researchers at Stanford demonstrated automated spear-phishing generation using GPT-4o and LinkedIn data. The AI-generated emails outperformed human-written equivalents with 54% click rates vs 12%. This is the first peer-reviewed study quantifying the uplift.',
    category: 'ai_attack',
    impact: 'critical',
    isHype: false,
    affectedPlatforms: ['Email', 'LinkedIn'],
    affectedPersonas: ['creator', 'sysadmin', 'general'],
    africaRelevance: false,
    publishedAt: '2026-04-20T08:00:00Z',
    linkedBreachSim: 'streaming_account_takeover',
    linkedTool: { label: 'Simulate phishing on your setup', to: '/breach-sim' },
    hypeVotes: { signal: 1243, hype: 89 },
  },
  {
    id: 'p2',
    title: 'Deepfake Audio Used in $25M Wire Transfer Fraud Against Hong Kong Firm',
    summary: 'Finance employee was convinced to transfer $25M after a deepfake video call appeared to show the company CFO authorising the transaction. Real-time voice and face synthesis was used. Incident highlights the collapse of "seeing is believing" as a verification method.',
    category: 'ai_attack',
    impact: 'critical',
    isHype: false,
    affectedPlatforms: ['Video Conferencing', 'Banking'],
    affectedPersonas: ['creator', 'sysadmin'],
    africaRelevance: true,
    publishedAt: '2026-04-18T10:00:00Z',
    hypeVotes: { signal: 2105, hype: 43 },
  },
  {
    id: 'p3',
    title: 'AI-Generated Malware Variants Evade Static Analysis Tools at 87% Rate',
    summary: 'Security firm Endgame published analysis showing GPT-4-generated malware variants evade signature-based detection tools at 87% rate. The AI rewrites malware functionally while preserving behavior, making hash-based blocking obsolete.',
    category: 'ai_attack',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['Windows', 'Linux', 'macOS'],
    affectedPersonas: ['sysadmin'],
    africaRelevance: false,
    publishedAt: '2026-04-16T14:00:00Z',
    linkedTool: { label: 'Check CVEs on your software', to: '/tools/exploit-risk-meter' },
    hypeVotes: { signal: 876, hype: 212 },
  },

  // ── New AI Tools ─────────────────────────────────────────────────────────────
  {
    id: 'p4',
    title: 'Anthropic Releases Claude 4 Opus with Extended Thinking and 200K Context',
    summary: 'Anthropic\'s Claude 4 Opus scores 87.5% on MMLU and introduces extended thinking mode for complex multi-step reasoning. 200K token context enables analysis of entire codebases in a single prompt. Security researchers are using it for automated CVE analysis.',
    category: 'ai_tool_launch',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['Anthropic API', 'Claude.ai'],
    affectedPersonas: ['sysadmin', 'creator', 'general'],
    africaRelevance: false,
    publishedAt: '2026-04-19T16:00:00Z',
    benchmarks: [
      { name: 'MMLU', value: '87.5%' },
      { name: 'HumanEval', value: '92.1%' },
      { name: 'Context', value: '200K tokens' },
    ],
    linkedTool: { label: 'Find AI security tools', to: '/tools/ai-tool-finder' },
    hypeVotes: { signal: 3401, hype: 289 },
  },
  {
    id: 'p5',
    title: 'Microsoft Security Copilot Now Analyses Incidents in Real Time Inside Defender',
    summary: 'Microsoft integrates Security Copilot directly into Defender XDR. SOC analysts can now ask natural language questions about alerts and get enriched triage summaries. Early pilots show 40% reduction in mean time to respond (MTTR).',
    category: 'ai_tool_launch',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['Microsoft Defender', 'Azure'],
    affectedPersonas: ['sysadmin'],
    africaRelevance: false,
    publishedAt: '2026-04-14T09:00:00Z',
    benchmarks: [
      { name: 'MTTR reduction', value: '40%' },
      { name: 'Alert triage speed', value: '3× faster' },
    ],
    linkedTool: { label: 'Compare AI security tools', to: '/tools/ai-tool-finder' },
    hypeVotes: { signal: 1872, hype: 531 },
  },

  // ── AI Breaches ───────────────────────────────────────────────────────────────
  {
    id: 'p6',
    title: 'OpenAI Discloses Breach: Internal Chat Logs Accessed by Attacker in 2023',
    summary: 'OpenAI disclosed it suffered a breach in early 2023 where an attacker accessed the company\'s internal messaging system and stole details about the design of AI systems. The breach was not disclosed publicly until now. No source code or model weights were accessed.',
    category: 'ai_breach',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['ChatGPT', 'OpenAI API'],
    affectedPersonas: ['sysadmin', 'creator', 'general'],
    africaRelevance: false,
    publishedAt: '2026-04-15T11:30:00Z',
    linkedTool: { label: 'Check if you\'re exposed', to: '/tools/ioc-lookup' },
    hypeVotes: { signal: 4210, hype: 128 },
  },
  {
    id: 'p7',
    title: 'Midjourney Prompt Injection Vulnerability Allowed NSFW Bypass at Scale',
    summary: 'Security researcher discovered a systematic prompt injection vulnerability in Midjourney\'s safety filtering allowing mass bypass of content restrictions. Used by bad actors to generate restricted imagery. Midjourney patched within 48 hours but 3,000+ images were generated before fix.',
    category: 'ai_breach',
    impact: 'medium',
    isHype: false,
    affectedPlatforms: ['Midjourney'],
    affectedPersonas: ['creator', 'general'],
    africaRelevance: false,
    publishedAt: '2026-04-11T08:00:00Z',
    hypeVotes: { signal: 1543, hype: 402 },
  },

  // ── Regulation ─────────────────────────────────────────────────────────────────
  {
    id: 'p8',
    title: 'EU AI Act Enforcement Begins: High-Risk AI Systems Face €30M Fines',
    summary: 'The EU AI Act\'s enforcement phase kicked off in April 2026 for high-risk AI categories. Organizations deploying AI in hiring, credit scoring, or biometric surveillance must complete conformity assessments or face fines up to €30M or 6% of global revenue.',
    category: 'ai_regulation',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['All AI platforms (EU market)'],
    affectedPersonas: ['sysadmin', 'creator'],
    africaRelevance: true,
    publishedAt: '2026-04-01T00:00:00Z',
    hypeVotes: { signal: 2341, hype: 156 },
  },
  {
    id: 'p9',
    title: 'Kenya AI Policy Draft: Government Proposes Mandatory AI Audits for Fintechs',
    summary: 'The Kenya ICT Authority released a draft AI policy requiring mandatory algorithmic audits for fintech companies using AI in credit scoring. The policy specifically addresses mobile money lending apps that have faced discrimination complaints.',
    category: 'ai_africa',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['M-Pesa', 'Fuliza', 'KCB M-Pesa'],
    affectedPersonas: ['sysadmin'],
    africaRelevance: true,
    publishedAt: '2026-04-17T10:00:00Z',
    hypeVotes: { signal: 891, hype: 67 },
  },

  // ── AI Defense ─────────────────────────────────────────────────────────────────
  {
    id: 'p10',
    title: 'Google\'s AI-Powered Fuzzer OSS-Fuzz Gen Discovers 26 Zero-Days in Open Source',
    summary: 'Google expanded its AI-assisted fuzzing project to 272 open-source projects. Using LLM-generated fuzzing targets, it discovered 26 previously unknown vulnerabilities including critical issues in OpenSSL, libpng, and SQLite. All have been patched.',
    category: 'ai_defense',
    impact: 'high',
    isHype: false,
    affectedPlatforms: ['OpenSSL', 'libpng', 'SQLite'],
    affectedPersonas: ['sysadmin'],
    africaRelevance: false,
    publishedAt: '2026-04-12T14:00:00Z',
    linkedTool: { label: 'See CVEs for your software', to: '/tools/exploit-risk-meter' },
    hypeVotes: { signal: 1102, hype: 89 },
  },

  // ── Research ───────────────────────────────────────────────────────────────────
  {
    id: 'p11',
    title: 'Researchers Demonstrate Cross-Model Prompt Injection via Poisoned RAG Documents',
    summary: 'MIT researchers showed that documents embedded in RAG (Retrieval Augmented Generation) databases can contain hidden prompt injections that hijack LLM behaviour across any connected model. Enterprise AI assistants using company docs are potentially compromised.',
    category: 'ai_research',
    impact: 'critical',
    isHype: false,
    affectedPlatforms: ['ChatGPT Enterprise', 'Microsoft 365 Copilot', 'Claude for Teams'],
    affectedPersonas: ['sysadmin', 'creator'],
    africaRelevance: false,
    publishedAt: '2026-04-10T09:00:00Z',
    hypeVotes: { signal: 1876, hype: 234 },
  },
  {
    id: 'p12',
    title: 'AGI Timeline Predictions: 17 Leading Researchers Now Converge on 2030±2 Years',
    summary: 'A meta-survey of 350 AI researchers shows a significant tightening of AGI timeline predictions. Median estimate moved from 2047 to 2030–2032. Security implications: legacy infrastructure unprepared for AI-accelerated attack sophistication within 5 years.',
    category: 'ai_research',
    impact: 'medium',
    isHype: true,
    affectedPlatforms: [],
    affectedPersonas: ['general', 'sysadmin'],
    africaRelevance: false,
    publishedAt: '2026-04-08T11:00:00Z',
    hypeVotes: { signal: 2341, hype: 1892 },
  },

  // ── Africa AI ───────────────────────────────────────────────────────────────────
  {
    id: 'p13',
    title: 'Nigeria NITDA Issues AI Chatbot Scam Warning: Fake "Bank AI Agents" Targeting Customers',
    summary: 'NITDA issued a warning about fake AI chatbots impersonating First Bank, GTBank, and Zenith Bank customer service agents. The bots harvest card details and OTPs via WhatsApp and Telegram. Over 4,000 incidents reported in Q1 2026.',
    category: 'ai_africa',
    impact: 'critical',
    isHype: false,
    affectedPlatforms: ['First Bank', 'GTBank', 'Zenith Bank', 'WhatsApp'],
    affectedPersonas: ['general'],
    africaRelevance: true,
    publishedAt: '2026-04-20T06:30:00Z',
    hypeVotes: { signal: 1543, hype: 23 },
  },
  {
    id: 'p14',
    title: 'Safaricom and Google Partner to Launch Swahili Voice AI for M-Pesa Support',
    summary: 'Safaricom announced a partnership with Google to deploy a Swahili-language AI voice agent for M-Pesa customer support. The agent handles account queries, mini-statement requests, and PIN resets. Privacy researchers raise concerns about voice biometric data retention.',
    category: 'ai_africa',
    impact: 'medium',
    isHype: false,
    affectedPlatforms: ['M-Pesa', 'Safaricom'],
    affectedPersonas: ['general'],
    africaRelevance: true,
    publishedAt: '2026-04-13T09:00:00Z',
    hypeVotes: { signal: 1102, hype: 145 },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function hyp(item: PulseItem) {
  const total = item.hypeVotes.signal + item.hypeVotes.hype;
  return total === 0 ? 50 : Math.round((item.hypeVotes.hype / total) * 100);
}

// ── Hype-o-meter ────────────────────────────────────────────────────────────────

const HypeMeter = memo(function HypeMeter({
  item, onVote,
}: { item: PulseItem; onVote: (id: string, v: 'signal' | 'hype') => void }) {
  const hypePct = hyp(item);
  const signalPct = 100 - hypePct;
  const color = hypePct > 60 ? '#eab308' : hypePct > 40 ? '#3b82f6' : '#22c55e';
  return (
    <div className="mt-3 pt-3 border-t space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">Community Signal</span>
        <span className="font-mono">{(item.hypeVotes.signal + item.hypeVotes.hype).toLocaleString()} votes</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted/40 gap-px">
        <div className="h-full bg-green-500 transition-all duration-500 rounded-l-full" style={{ width: `${signalPct}%` }} />
        <div className="h-full bg-yellow-500 transition-all duration-500 rounded-r-full" style={{ width: `${hypePct}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-green-400"><span>✓ Real signal</span><span className="font-mono">{signalPct}%</span></span>
          <span className="flex items-center gap-1 text-yellow-400"><span>~ Hype</span><span className="font-mono">{hypePct}%</span></span>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onVote(item.id, 'signal')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
          >
            <ThumbsUp className="h-3 w-3" /> Real
          </button>
          <button
            type="button"
            onClick={() => onVote(item.id, 'hype')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
          >
            <ThumbsDown className="h-3 w-3" /> Hype
          </button>
        </div>
      </div>
    </div>
  );
});

// ── Pulse Card ─────────────────────────────────────────────────────────────────

const PulseCard = memo(function PulseCard({
  item, onVote,
}: { item: PulseItem; onVote: (id: string, v: 'signal' | 'hype') => void }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_META[item.category];
  const imp = IMPACT_META[item.impact];
  const CatIcon = cat.icon;

  return (
    <Card className={cn('border hover:border-primary/30 transition-colors', item.isHype && 'opacity-80')}>
      <CardContent className="pt-4 pb-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn('p-1.5 rounded-lg shrink-0 border', cat.bg)}>
            <CatIcon className={cn('h-4 w-4', cat.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <Badge className={cn('text-xs border', cat.bg, cat.color)}>{cat.emoji} {cat.label}</Badge>
              <Badge className={cn('text-xs', imp.bg, imp.color)}>{imp.label}</Badge>
              {item.africaRelevance && <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">🌍 Africa</Badge>}
              {item.isHype && <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/30">~ Likely Hype</Badge>}
            </div>
            <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
          </div>
          <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
            <Clock className="h-3 w-3" />{timeAgo(item.publishedAt)}
          </span>
        </div>

        {/* Summary */}
        <p className={cn('text-xs text-muted-foreground leading-relaxed', !expanded && 'line-clamp-3')}>
          {item.summary}
        </p>

        {/* Benchmarks */}
        {item.benchmarks && item.benchmarks.length > 0 && expanded && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.benchmarks.map((b) => (
              <div key={b.name} className="text-xs bg-tech/10 text-tech px-2 py-1 rounded border border-tech/20">
                <span className="font-semibold">{b.value}</span> <span className="text-muted-foreground">{b.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Affected platforms */}
        {item.affectedPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.affectedPlatforms.slice(0, 4).map((p) => (
              <span key={p} className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded">{p}</span>
            ))}
          </div>
        )}

        {/* Expand / Collapse */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
        >
          {expanded ? '← Less' : 'Read more →'}
        </button>

        {/* Cross-tool CTAs */}
        {expanded && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.linkedTool && (
              <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                <Link to={item.linkedTool.to}>
                  <ChevronRight className="h-3 w-3" /> {item.linkedTool.label}
                </Link>
              </Button>
            )}
            {item.linkedBreachSim && (
              <Button asChild size="sm" className="h-7 text-xs gap-1 bg-destructive/80 hover:bg-destructive">
                <Link to="/breach-sim">
                  <Activity className="h-3 w-3" /> Simulate this attack
                </Link>
              </Button>
            )}
            {item.sourceUrl && (
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs gap-1">
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" /> Source
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Hype-o-meter */}
        <HypeMeter item={item} onVote={onVote} />
      </CardContent>
    </Card>
  );
});

// ── Trending Sidebar ────────────────────────────────────────────────────────────

const TrendingPanel = memo(function TrendingPanel({ items }: { items: PulseItem[] }) {
  const top = useMemo(() =>
    [...items].sort((a, b) => (b.hypeVotes.signal + b.hypeVotes.hype) - (a.hypeVotes.signal + a.hypeVotes.hype)).slice(0, 5),
  [items]);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-security" /> Trending (24h)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {top.map((item, i) => {
          const cat = CATEGORY_META[item.category];
          return (
            <div key={item.id} className="flex items-start gap-2">
              <span className="font-mono text-xs text-muted-foreground w-4 shrink-0">#{i + 1}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium line-clamp-2 leading-snug">{item.title}</p>
                <p className={cn('text-xs mt-0.5', cat.color)}>{cat.emoji} {cat.label}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

// ── Main Page ──────────────────────────────────────────────────────────────────

const AIPulse = memo(function AIPulse() {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [impactFilter, setImpactFilter]     = useState<Impact | 'all'>('all');
  const [africaOnly, setAfricaOnly]         = useState(false);
  const [search, setSearch]                 = useState('');
  const [items, setItems]                   = useState<PulseItem[]>(PULSE_ITEMS);

  const handleVote = useCallback((id: string, vote: 'signal' | 'hype') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id !== id ? item : {
          ...item,
          hypeVotes: { ...item.hypeVotes, [vote]: item.hypeVotes[vote] + 1 },
        }
      )
    );
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (impactFilter !== 'all' && item.impact !== impactFilter) return false;
      if (africaOnly && !item.africaRelevance) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.summary.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [items, categoryFilter, impactFilter, africaOnly, search]);

  const categoryCounts = useMemo(() =>
    Object.fromEntries(
      (Object.keys(CATEGORY_META) as Category[]).map((c) => [c, items.filter((i) => i.category === c).length])
    ),
  [items]);

  const criticalCount = useMemo(() => filtered.filter((i) => i.impact === 'critical').length, [filtered]);

  return (
    <Layout>
      <SEOHead
        title="AI Pulse Tracker — AI Security Signals Decoded | The Grid Nexus"
        description="The AI security pulse — tracked, rated, and decoded. AI-powered attacks, new tools, breaches, regulation, and Africa AI signals. With community hype-o-meter."
        keywords={['ai pulse', 'ai security', 'ai attacks', 'ai regulation', 'africa ai', 'hype meter', 'ai threat tracker']}
        url={typeof window !== 'undefined' ? window.location.href : '/ai-pulse'}
        type="website"
      />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-tech/10 border border-tech/20">
                <Zap className="h-7 w-7 text-tech" />
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl">AI Pulse Tracker</h1>
                <p className="text-sm text-muted-foreground">The AI security pulse — tracked, rated & decoded.</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm">
              AI-native threats, AI-powered defence tools, AI policy, and AI tool security posture. Each item is community-rated with our hype-o-meter.
            </p>
          </div>

          {/* Critical banner */}
          {criticalCount > 0 && categoryFilter === 'all' && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 mb-6 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span className="font-semibold text-red-400">{criticalCount} critical-impact</span>
              <span className="text-muted-foreground">items in the current feed require attention</span>
            </div>
          )}

          {/* Category filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 border',
                categoryFilter === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-foreground/30'
              )}
            >
              All ({items.length})
            </button>
            {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 border',
                    categoryFilter === cat
                      ? cn(meta.bg, meta.color, 'border-current')
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  {meta.emoji} {meta.label} <span className="font-mono opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search + impact + africa filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search AI signals…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {(['critical', 'high', 'medium', 'low', 'hype_only'] as Impact[]).map((imp) => {
                const m = IMPACT_META[imp];
                return (
                  <button
                    key={imp}
                    type="button"
                    onClick={() => setImpactFilter(impactFilter === imp ? 'all' : imp)}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium border transition-all',
                      impactFilter === imp ? cn(m.bg, m.color) : 'border-border text-muted-foreground hover:border-foreground/30'
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setAfricaOnly((v) => !v)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium border transition-all',
                africaOnly ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'border-border text-muted-foreground'
              )}
            >
              🌍 Africa only
            </button>
            {(categoryFilter !== 'all' || impactFilter !== 'all' || africaOnly || search) && (
              <button
                type="button"
                onClick={() => { setCategoryFilter('all'); setImpactFilter('all'); setAfricaOnly(false); setSearch(''); }}
                className="px-2.5 py-1 rounded text-xs text-muted-foreground border border-border hover:text-foreground flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Feed */}
            <div className="lg:col-span-3 space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No items match your filters.</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <PulseCard key={item.id} item={item} onVote={handleVote} />
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <TrendingPanel items={items} />

              {/* Category breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">By Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const count = categoryCounts[cat] ?? 0;
                    const pct = Math.round((count / items.length) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={cn('flex items-center gap-1', meta.color)}>{meta.emoji} {meta.label}</span>
                          <span className="text-muted-foreground font-mono">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/40">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color.replace('text-', '') }} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-security/5 border-security/20">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <p className="text-xs font-semibold text-security flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> See the full picture
                  </p>
                  {[
                    { to: '/nexus-intersection', label: 'Risk Heatmap', sub: 'Where gaming × AI × threats collide' },
                    { to: '/breach-sim', label: 'Simulate an Attack', sub: 'See how AI attacks play out on your setup' },
                    { to: '/tools/ai-tool-finder', label: 'AI Tool Finder', sub: '12+ vetted AI security tools' },
                  ].map(({ to, label, sub }) => (
                    <Link key={to} to={to} className="flex items-center gap-2 text-xs hover:text-foreground transition-colors group">
                      <ChevronRight className="h-3.5 w-3.5 text-security shrink-0" />
                      <div>
                        <p className="font-medium group-hover:underline">{label}</p>
                        <p className="text-muted-foreground">{sub}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
});

export default AIPulse;
