import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, ShieldQuestion, ExternalLink, RotateCcw } from 'lucide-react';
import { triageDomain, type TriageResult, type TriageVerdict, OfficialDomain } from '@/lib/triage/domainTriage';
import { triageMessage, extractUrl, type MessageTriageResult } from '@/lib/triage/messageTriage';
import platformData from '@/data/platform-security.json';
import safetyData from '@/data/safety-verdicts.json';

const CATEGORY_VERDICT: Record<string, string> = Object.fromEntries(
  (safetyData.verdicts as Array<{ slug: string; verdict: string }>).map((v) => [v.slug, v.verdict])
);

/** Honest: no verified malicious-domain feed ships until human-reviewed. */
const KNOWN_BAD: Array<{ host: string; label: string }> = [];

const OFFICIAL: OfficialDomain[] = (platformData.platforms as Array<{ name: string; officialDomains: string[] }>).flatMap(
  (p) => p.officialDomains.map((d) => ({ host: d, label: p.name }))
).concat([
  { host: 'nexusmods.com', label: 'Nexus Mods' },
  { host: 'curseforge.com', label: 'CurseForge' },
  { host: 'steampowered.com', label: 'Steam' },
]);

type DisplayVerdict = TriageVerdict | 'suspicious' | 'provider_unavailable';

interface Result {
  verdict: DisplayVerdict;
  headline: string;
  flags: string[];
  actions: string[];
  matchedCategory: string | null;
  blockSubmission?: boolean;
  normalizedHost?: string | null;
}

const VERDICT_UI: Record<DisplayVerdict, { label: string; tone: string; icon: typeof ShieldAlert }> = {
  known_malicious: { label: 'known_malicious', tone: 'text-red-400 border-red-500/40 bg-red-500/10', icon: ShieldAlert },
  suspicious: { label: 'suspicious', tone: 'text-amber-400 border-amber-500/40 bg-amber-500/10', icon: ShieldQuestion },
  no_known_indicators: { label: 'no_known_indicators', tone: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', icon: ShieldCheck },
  insufficient_evidence: { label: 'insufficient_evidence', tone: 'text-slate-400 border-slate-500/40 bg-slate-500/10', icon: ShieldQuestion },
  provider_unavailable: { label: 'provider_unavailable', tone: 'text-slate-400 border-slate-500/40 bg-slate-500/10', icon: ShieldQuestion },
};

function looksLikeDomain(text: string): boolean {
  return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/\S*)?$/i.test(text);
}

function mapDomain(d: TriageResult): Result {
  if (d.verdict === 'known_malicious') {
    return {
      verdict: 'known_malicious',
      headline: 'This domain matches a known-bad indicator.',
      flags: d.reasons,
      actions: d.recommendedActions,
      matchedCategory: null,
      blockSubmission: d.blockSubmission,
      normalizedHost: d.normalizedHost,
    };
  }
  if (d.verdict === 'no_known_indicators') {
    return {
      verdict: 'no_known_indicators',
      headline: d.hasSecretToken
        ? 'Official domain, but this link looks secret-bearing — treat it as private.'
        : 'Official domain match — not a safety clearance for any page content.',
      flags: d.reasons,
      actions: d.recommendedActions,
      matchedCategory: null,
      blockSubmission: d.blockSubmission,
      normalizedHost: d.normalizedHost,
    };
  }
  if (d.blockSubmission) {
    return {
      verdict: 'suspicious',
      headline: 'This link carries a private token — do not share it or submit it externally.',
      flags: d.reasons,
      actions: d.recommendedActions,
      matchedCategory: null,
      blockSubmission: true,
      normalizedHost: d.normalizedHost,
    };
  }
  return {
    verdict: 'insufficient_evidence',
    headline: 'Not enough information — do not treat this as safe.',
    flags: d.reasons,
    actions: d.recommendedActions,
    matchedCategory: null,
    blockSubmission: d.blockSubmission,
    normalizedHost: d.normalizedHost,
  };
}

function mapMessage(m: MessageTriageResult): Result {
  if (m.verdict === 'suspicious') {
    const categoryVerdict = m.matchedCategory ? CATEGORY_VERDICT[m.matchedCategory] : null;
    return {
      verdict: categoryVerdict === 'avoid' ? 'known_malicious' : 'suspicious',
      headline:
        categoryVerdict === 'avoid'
          ? 'This matches a known scam category.'
          : 'Scam patterns detected in this message.',
      flags: m.redFlags,
      actions: m.recommendedActions,
      matchedCategory: m.matchedCategory,
    };
  }
  return {
    verdict: 'no_known_indicators',
    headline: 'No obvious scam patterns detected — not proof it is safe.',
    flags: [],
    actions: m.recommendedActions,
    matchedCategory: null,
  };
}

function analyzeText(text: string): Result | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const singleToken = !/\s/.test(trimmed);
  if (singleToken && (looksLikeDomain(trimmed) || extractUrl(trimmed))) {
    return mapDomain(triageDomain(trimmed, OFFICIAL, KNOWN_BAD));
  }

  const msg = triageMessage(trimmed);
  const url = extractUrl(trimmed);
  if (url && msg.verdict === 'no_known_indicators') {
    const d = mapDomain(triageDomain(url, OFFICIAL, KNOWN_BAD));
    if (d.verdict === 'known_malicious' || d.verdict === 'suspicious' || d.blockSubmission) {
      return { ...d, matchedCategory: d.matchedCategory ?? msg.matchedCategory };
    }
  }
  return mapMessage(msg);
}

export default function ScamChecker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(() => searchParams.get('q') ?? '');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      setResult(analyzeText(q));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate from URL once on mount / param change
  }, [searchParams]);

  function analyze() {
    const next = analyzeText(input);
    setResult(next);
    const trimmed = input.trim().slice(0, 2000);
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true });
    }
  }

  const ui = result ? VERDICT_UI[result.verdict] : null;
  const Icon = ui?.icon ?? ShieldQuestion;
  const showRecover =
    result &&
    (result.verdict === 'known_malicious' ||
      result.verdict === 'suspicious' ||
      result.blockSubmission);

  return (
    <Layout>
      <SEOHead
        title="Scam Checker — gaming link & message triage | The Grid Nexus"
        description="Paste a game link, Discord invite, or message. Get known_malicious, suspicious, no_known_indicators, or insufficient_evidence — never “safe.” Runs in your browser."
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm font-medium text-cyan">Free tool · local triage · no account</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Scam Checker</h1>
        <p className="mt-3 text-muted-foreground">
          Paste a link, Discord message, or game/mod name. We return an explicit verdict and never
          call an unknown domain safe. Nothing you enter is stored in analytics.
        </p>

        <div className="mt-6 space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'Paste a URL, message, or name — e.g. "steamcommunity.com" or "free V-Bucks generator"'}
            rows={4}
            maxLength={2000}
            className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
          />
          <p className="text-xs text-amber-200/90">
            Do not paste password-reset links, invite tokens, session URLs, or MFA codes.
          </p>
          <div className="flex gap-3">
            <Button onClick={analyze} disabled={!input.trim()}>
              Check it
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setInput('');
                setResult(null);
                setSearchParams({}, { replace: true });
              }}
            >
              <RotateCcw className="mr-1 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        {result && ui && (
          <Card className="mt-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-semibold ${ui.tone}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                  {ui.label}
                </span>
                <span className="text-foreground font-medium">{result.headline}</span>
              </div>
              {result.normalizedHost && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">host: {result.normalizedHost}</p>
              )}

              {result.blockSubmission && (
                <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                  Do not enter your password or MFA code on any linked page. Secret-bearing input was not sent to any external provider.
                </p>
              )}

              {result.flags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Why</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {result.flags.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
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
                  {result.actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              {showRecover && (
                <div className="mt-4">
                  <Link
                    to="/recover"
                    className="inline-flex rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:underline"
                  >
                    My account may be compromised → Recovery Navigator
                  </Link>
                </div>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                External reputation lookup is disabled until licensed (<span className="font-mono">provider_unavailable</span>).
              </p>
            </CardContent>
          </Card>
        )}

        <aside className="mt-8 rounded-lg border border-border bg-card/50 p-4" aria-labelledby="spa-trust-heading">
          <h2 id="spa-trust-heading" className="text-sm font-semibold text-foreground">
            What The Grid Nexus does not do
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>No account scanning or credential collection</li>
            <li>No guaranteed recovery or malware-clean claims</li>
            <li>No anti-cheat bypass or exploit assistance</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            See <Link to="/privacy/tools" className="text-cyan hover:underline">tool privacy</Link> and{' '}
            <Link to="/methodology" className="text-cyan hover:underline">methodology</Link>.
          </p>
        </aside>
      </div>
    </Layout>
  );
}
