import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, ShieldQuestion, ExternalLink, RotateCcw } from 'lucide-react';
import { triageDomain, type TriageResult } from '@/lib/triage/domainTriage';
import { triageMessage, extractUrl, type MessageTriageResult } from '@/lib/triage/messageTriage';
import platformData from '@/data/platform-security.json';
import safetyData from '@/data/safety-verdicts.json';

// Category slug → safety-database verdict, so a matched "avoid" category shows a
// definitive Avoid (not just Caution) when the message maps to a known scam type.
const CATEGORY_VERDICT: Record<string, string> = Object.fromEntries(
  (safetyData.verdicts as Array<{ slug: string; verdict: string }>).map((v) => [v.slug, v.verdict])
);

// ── Official domains (from platform-security.json) + established mod sites ────
const OFFICIAL = [
  ...(platformData.platforms as Array<{ name: string; officialDomains: string[] }>).flatMap((p) =>
    p.officialDomains.map((d) => ({ host: d, label: p.name }))
  ),
  { host: 'nexusmods.com', label: 'Nexus Mods' },
  { host: 'curseforge.com', label: 'CurseForge' },
  { host: 'steampowered.com', label: 'Steam' },
];

// Honest: no verified malicious-domain feed is shipped. Unknown domains return
// "insufficient evidence" rather than a fabricated "clean" verdict.
const KNOWN_BAD: Array<{ host: string; label: string }> = [];

type DisplayVerdict = 'avoid' | 'caution' | 'official' | 'unknown';

interface Result {
  verdict: DisplayVerdict;
  headline: string;
  flags: string[];
  actions: string[];
  matchedCategory: string | null;
}

const VERDICT_UI: Record<DisplayVerdict, { label: string; tone: string; icon: typeof ShieldAlert }> = {
  avoid: { label: 'Avoid', tone: 'text-red-400 border-red-500/40 bg-red-500/10', icon: ShieldAlert },
  caution: { label: 'Caution', tone: 'text-amber-400 border-amber-500/40 bg-amber-500/10', icon: ShieldQuestion },
  official: { label: 'Official domain', tone: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', icon: ShieldCheck },
  unknown: { label: 'Insufficient evidence', tone: 'text-slate-400 border-slate-500/40 bg-slate-500/10', icon: ShieldQuestion },
};

function looksLikeDomain(text: string): boolean {
  return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/\S*)?$/i.test(text);
}

function mapDomain(d: TriageResult): Result {
  if (d.verdict === 'known_malicious') {
    return { verdict: 'avoid', headline: 'This domain is a known bad indicator.', flags: d.reasons, actions: d.recommendedActions, matchedCategory: null };
  }
  if (d.verdict === 'no_known_indicators') {
    return { verdict: 'official', headline: 'This is an official domain.', flags: d.reasons, actions: d.recommendedActions, matchedCategory: null };
  }
  if (d.blockSubmission) {
    return { verdict: 'caution', headline: 'This link carries a private token — do not share it.', flags: d.reasons, actions: d.recommendedActions, matchedCategory: null };
  }
  // insufficient_evidence, or suspicious (homograph)
  return { verdict: 'unknown', headline: 'Not enough information to judge this domain.', flags: d.reasons, actions: d.recommendedActions, matchedCategory: null };
}

function mapMessage(m: MessageTriageResult): Result {
  if (m.verdict === 'suspicious') {
    const categoryVerdict = m.matchedCategory ? CATEGORY_VERDICT[m.matchedCategory] : null;
    if (categoryVerdict === 'avoid') {
      return {
        verdict: 'avoid',
        headline: 'This matches a known scam category.',
        flags: m.redFlags,
        actions: m.recommendedActions,
        matchedCategory: m.matchedCategory,
      };
    }
    return { verdict: 'caution', headline: 'Scam patterns detected in this message.', flags: m.redFlags, actions: m.recommendedActions, matchedCategory: m.matchedCategory };
  }
  return { verdict: 'unknown', headline: 'No obvious scam patterns detected.', flags: [], actions: m.recommendedActions, matchedCategory: null };
}

export default function ScamChecker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  function analyze() {
    const text = input.trim();
    if (!text) return;

    const singleToken = !/\s/.test(text);
    if (singleToken && (looksLikeDomain(text) || extractUrl(text))) {
      setResult(mapDomain(triageDomain(text, OFFICIAL, KNOWN_BAD)));
      return;
    }

    // Message / game / mod / invite text — triage the text, and also the embedded URL if any.
    const msg = triageMessage(text);
    const url = extractUrl(text);
    if (url && msg.verdict === 'no_known_indicators') {
      const d = mapDomain(triageDomain(url, OFFICIAL, KNOWN_BAD));
      if (d.verdict === 'avoid' || d.verdict === 'caution') {
        setResult({ ...d, matchedCategory: d.matchedCategory ?? msg.matchedCategory });
        return;
      }
    }
    setResult(mapMessage(msg));
  }

  const ui = result ? VERDICT_UI[result.verdict] : null;
  const Icon = ui?.icon ?? ShieldQuestion;

  return (
    <Layout>
      <SEOHead
        title="Scam Checker — is this link or message safe? | The Grid Nexus"
        description="Paste a link, message, game or mod name and get a quick risk check: red flags, an official alternative, and what to do next. Runs in your browser — nothing you enter is stored."
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm font-medium text-cyan">Free tool · runs in your browser</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Scam Checker</h1>
        <p className="mt-3 text-muted-foreground">
          Paste a link, a Discord message, or a game/mod name. We flag scam patterns and point
          you to the official source. Nothing you enter leaves your browser.
        </p>

        <div className="mt-6 space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'Paste a URL, message, or name — e.g. "steamcommunity.com" or "free V-Bucks generator"'}
            rows={4}
            className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
          />
          <div className="flex gap-3">
            <Button onClick={analyze} disabled={!input.trim()}>
              Check it
            </Button>
            <Button variant="ghost" onClick={() => { setInput(''); setResult(null); }}>
              <RotateCcw className="mr-1 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        {result && ui && (
          <Card className="mt-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-semibold ${ui.tone}`}>
                  <Icon className="h-4 w-4" />
                  {ui.label}
                </span>
                <span className="text-foreground font-medium">{result.headline}</span>
              </div>

              {result.flags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Red flags</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {result.flags.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}

              {result.matchedCategory && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Related safety verdict</p>
                  <Link to={`/safety/${result.matchedCategory}`} className="mt-1 inline-flex items-center gap-1 text-sm text-cyan hover:underline">
                    Read the full verdict <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground">What to do</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {result.actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          Results are rules-based guidance, not a guarantee. A "no red flags" result is not proof
          something is safe — verify through an official channel first. We never ask for your
          password, 2FA codes, recovery codes, or session tokens. See our{' '}
          <Link to="/methodology" className="text-cyan hover:underline">methodology</Link>.
        </p>
      </div>
    </Layout>
  );
}
