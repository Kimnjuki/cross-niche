import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ToolCrossLinks } from '@/components/tools/ToolPageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState, ErrorState } from '@/components/common/StateComponents';
import { moderateText, redactPII } from '@/lib/moderation/rulesEngine';
import { toolRateLimiters } from '@/lib/utils/rateLimit';
import type { StatusType } from '@/lib/types/status';
import type { ModerationResult } from '@/lib/moderation/rulesEngine';
import {
  Users, Shield, AlertTriangle, CheckCircle, XCircle,
  ArrowLeft, RefreshCw, ChevronRight, MessageSquare,
  ThumbsUp, ThumbsDown, Flag, Zap, Info, Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Example texts ──────────────────────────────────────────────────────────

const EXAMPLES = [
  {
    label: 'Clean Comment',
    text: 'Great guide! The security tips really helped me secure my Steam account. Thanks for putting this together.',
  },
  {
    label: 'Toxic / Harassment',
    text: 'This guide is garbage and you\'re a complete idiot for writing it. Everyone who upvoted this is a moron. Uninstall your PC.',
  },
  {
    label: 'Spam / Promotion',
    text: 'Check out this site for free Steam keys: https://totallylegitkeys.example.com. Limited time offer! DM me for more.',
  },
  {
    label: 'PII Leak',
    text: 'I talked to John Smith from the dev team, his email is john.smith@company.com and his phone is 555-0123. He said the patch is delayed.',
  },
  {
    label: 'NSFW / Inappropriate',
    text: 'This game is so sexy, I want to have sex with every character. The mods should add explicit adult content immediately.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityModerator() {
  const [customText, setCustomText] = useState('');
  const [mode, setMode] = useState<'example' | 'custom'>('example');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');

  const analyze = useCallback(async (text: string, source: 'example' | 'custom') => {
    if (!text.trim()) return;

    if (!toolRateLimiters.communityModerator.consume()) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    setContent(text);
    setMode(source);

    try {
      // Analysis is instant, but simulate a small processing delay (max 300ms)
      const startTime = Date.now();
      const analysis = moderateText(text);
      const elapsed = Date.now() - startTime;
      if (elapsed < 200) {
        await new Promise((r) => setTimeout(r, 200 - elapsed));
      }

      setResult(analysis);
      setStatus('success');
    } catch (err) {
      console.error('Moderation error:', err);
      setStatus('error');
    }
  }, []);

  const handleCustomSubmit = useCallback(() => {
    if (!customText.trim()) return;
    analyze(customText.trim(), 'custom');
  }, [customText, analyze]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleCustomSubmit();
      }
    },
    [handleCustomSubmit]
  );

  const reset = useCallback(() => {
    setCustomText('');
    setContent('');
    setResult(null);
    setStatus('idle');
    setMode('example');
    toolRateLimiters.communityModerator.reset();
  }, []);

  return (
    <ErrorBoundary toolName="Community Moderator">
      <Layout>
        <SEO
          title="Community Content Moderator — The Grid Nexus"
          description="AI-powered content moderation tool for gaming communities. Detect toxicity, spam, PII leaks, and NSFW content in real-time."
        />
        <div className="min-h-screen bg-[#0B0E14] text-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/tools/security-scanner" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Users className="w-7 h-7 text-[#B026FF]" />
                  Community Content Moderator
                </h1>
                <p className="text-gray-400 mt-1">
                  Analyze text for toxic behavior, spam, PII leaks, and NSFW content. Powered by The Grid Nexus moderation engine.
                </p>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <ErrorState
                title="Analysis rate limited"
                message="Please wait a moment before submitting more content for analysis."
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Examples + Custom Input */}
              <div className="lg:col-span-2 space-y-6">
                {/* Example cards */}
                <Card className="bg-[#131820] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#B026FF]" />
                      Example Content
                    </CardTitle>
                    <CardDescription>Click an example to analyze it</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {EXAMPLES.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => analyze(example.text, 'example')}
                        className="w-full text-left p-3 bg-[#0B0E14] rounded-lg border border-gray-800 hover:border-[#B026FF]/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                            {example.label}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#B026FF] transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">{example.text}</p>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Custom input */}
                <Card className="bg-[#131820] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Flag className="w-5 h-5 text-[#B026FF]" />
                      Custom Text
                    </CardTitle>
                    <CardDescription>
                      Paste or type your own content above. Press Ctrl+Enter to submit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Paste Discord message, forum post, or chat log here…"
                      rows={5}
                      className="w-full bg-[#0B0E14] border border-gray-700 rounded-lg p-3 text-sm text-white placeholder:text-gray-500 focus:border-[#B026FF] focus:outline-none resize-y"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {customText.length} characters
                      </span>
                      <Button
                        onClick={handleCustomSubmit}
                        disabled={status === 'loading' || !customText.trim()}
                        className="bg-[#B026FF] hover:bg-[#B026FF]/80 text-white"
                      >
                        {status === 'loading' ? 'Analyzing…' : 'Analyze'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Results */}
              <div className="lg:col-span-1 space-y-6">
                {/* Loading */}
                {status === 'loading' && <LoadingState />}

                {/* Initial state */}
                {status === 'idle' && !result && (
                  <Card className="bg-[#131820] border-gray-800">
                    <CardContent className="pt-8 text-center">
                      <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">
                        Select an example or enter custom text to analyze
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Result */}
                {status === 'success' && result && (
                  <ResultPanel result={result} content={content} mode={mode} onReset={reset} />
                )}
              </div>
            </div>
          </div>
        </div>
        <ToolCrossLinks related={[
            "/tools/gaming-copilot",
            "/tools/sentiment-analyzer",
            "/tools/news-personalizer",
            "/tools/threat-scanner",
          ]} />
      </Layout>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════════════

function ResultPanel({
  result,
  content,
  mode,
  onReset,
}: {
  result: ModerationResult;
  content: string;
  mode: 'example' | 'custom';
  onReset: () => void;
}) {
  const verdictIcon = (verdict: typeof result.verdict) => {
    switch (verdict) {
      case 'approved': return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'flagged': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'removed': return <XCircle className="w-8 h-8 text-red-400" />;
    }
  };

  const verdictColor = (verdict: typeof result.verdict) => {
    switch (verdict) {
      case 'approved': return 'text-green-400 border-green-700 bg-green-900/20';
      case 'flagged': return 'text-yellow-400 border-yellow-700 bg-yellow-900/20';
      case 'removed': return 'text-red-400 border-red-700 bg-red-900/20';
    }
  };

  const categoryNames: Record<string, { label: string; icon: React.ReactNode }> = {
    profanity: { label: 'Profanity', icon: <Flag className="w-3 h-3" /> },
    harassment: { label: 'Harassment', icon: <ThumbsDown className="w-3 h-3" /> },
    spam: { label: 'Spam / Promotion', icon: <Zap className="w-3 h-3" /> },
    pii: { label: 'PII / Personal Data', icon: <Eye className="w-3 h-3" /> },
    nsfw: { label: 'NSFW / Adult', icon: <XCircle className="w-3 h-3" /> },
  };

  return (
    <div className="space-y-4">
      {/* Verdict */}
      <Card className={`bg-[#131820] border-gray-800 ${result.verdict === 'removed' ? 'border-red-500/30' : result.verdict === 'flagged' ? 'border-yellow-500/30' : ''}`}>
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-2">{verdictIcon(result.verdict)}</div>
          <h3 className={`text-xl font-bold uppercase tracking-wider ${verdictColor(result.verdict)}`}>
            {result.verdict === 'approved' ? 'Approved' : result.verdict === 'flagged' ? 'Flagged for Review' : 'Removed'}
          </h3>
          <p className="text-xs text-gray-500 mt-2">
            {result.inputLengthChars} chars · {result.ruleHits.length} rule hits
          </p>
        </CardContent>
      </Card>

      {/* Scores */}
      <Card className="bg-[#131820] border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Category Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(result.scores).map(([key, score]) => {
            const cat = categoryNames[key] || { label: key, icon: <Info className="w-3 h-3" /> };
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    {cat.icon}
                    {cat.label}
                  </span>
                  <span className={`text-xs font-medium ${
                    score > 60 ? 'text-red-400' : score > 30 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.round(score)}%
                  </span>
                </div>
                <Progress
                  value={score}
                  className={`h-1.5 bg-gray-700 ${
                    score > 60 ? '[&>div]:bg-red-500' : score > 30 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                  }`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Rule Hits */}
      {result.ruleHits.length > 0 && (
        <Card className="bg-[#131820] border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Triggered Rules ({result.ruleHits.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.ruleHits.map((hit, i) => (
              <div key={i} className="p-2 bg-[#0B0E14] rounded border border-gray-800 text-xs">
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${
                    hit.severity === 'high' ? 'bg-red-900/30 text-red-300' :
                    hit.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                    'bg-blue-900/30 text-blue-300'
                  }`}>
                    {hit.category} · {hit.severity}
                  </Badge>
                </div>
                <p className="text-gray-400 mt-1">{hit.description}</p>
                {hit.snippet && (
                  <p className="text-gray-500 mt-0.5 truncate">"{hit.snippet}"</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Original content preview */}
      <Card className="bg-[#131820] border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#B026FF]" />
            {mode === 'custom' ? 'Custom Text' : 'Example'} Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 break-words line-clamp-4">{content}</p>
        </CardContent>
      </Card>

      {/* Reset */}
      <Button variant="outline" onClick={onReset} className="w-full border-gray-700">
        <RefreshCw className="w-4 h-4 mr-2" />
        Analyze New Content
      </Button>
    </div>
  );
}
