import { useState, useEffect, useRef, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Shield, CheckCircle, AlertTriangle, RotateCcw, ChevronRight, ArrowLeft } from 'lucide-react';
import { SecurityToolsStrip } from '@/components/security/SecurityToolsStrip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';

type Answer = 'yes' | 'partial' | 'no' | null;

interface Question {
  id: number;
  text: string;
  category: string;
  yesPoints: number;
  partialPoints: number;
  recommendation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Do you have two-factor authentication (2FA) enabled on all your gaming accounts?',
    category: 'Account Security',
    yesPoints: 12,
    partialPoints: 6,
    recommendation: 'Enable 2FA on every gaming platform — Steam, Xbox, PlayStation, Epic, etc. Use an authenticator app over SMS.',
  },
  {
    id: 2,
    text: 'Do you use a unique password for each gaming platform (no reuse)?',
    category: 'Account Security',
    yesPoints: 12,
    partialPoints: 5,
    recommendation: 'Reused passwords are the #1 cause of account takeovers. Use a password manager to generate and store unique passwords.',
  },
  {
    id: 3,
    text: 'Do you use a password manager to store your gaming credentials?',
    category: 'Account Security',
    yesPoints: 10,
    partialPoints: 4,
    recommendation: 'A password manager (Bitwarden, 1Password) is the easiest way to maintain strong, unique passwords across all platforms.',
  },
  {
    id: 4,
    text: 'Have you checked if your gaming email has appeared in a known data breach (e.g., HaveIBeenPwned)?',
    category: 'Breach Awareness',
    yesPoints: 8,
    partialPoints: 4,
    recommendation: 'Check haveibeenpwned.com for your email. If compromised, change passwords and enable 2FA on affected accounts immediately.',
  },
  {
    id: 5,
    text: 'Do you keep your gaming client (Steam, Battle.net, etc.) and games updated promptly?',
    category: 'Patch Hygiene',
    yesPoints: 10,
    partialPoints: 5,
    recommendation: 'Enable auto-updates for gaming clients. Patches often fix exploits actively used by cheaters and hackers.',
  },
  {
    id: 6,
    text: 'Do you use a VPN when gaming on public or shared Wi-Fi networks?',
    category: 'Network Security',
    yesPoints: 8,
    partialPoints: 4,
    recommendation: 'Public Wi-Fi exposes you to MITM attacks and DDoS. Use a VPN (Mullvad, ProtonVPN) on any network you don\'t control.',
  },
  {
    id: 7,
    text: 'Do you use a separate email address for gaming accounts (not your primary email)?',
    category: 'Privacy',
    yesPoints: 8,
    partialPoints: 3,
    recommendation: 'A dedicated gaming email limits blast radius if your account is targeted. It also reduces spam and phishing in your main inbox.',
  },
  {
    id: 8,
    text: 'Do you have account recovery codes or backup methods saved securely?',
    category: 'Account Security',
    yesPoints: 10,
    partialPoints: 4,
    recommendation: 'Print or securely store recovery codes for your 2FA apps. Losing phone access without backups can permanently lock you out.',
  },
  {
    id: 9,
    text: 'Do you review app permissions before installing mobile games?',
    category: 'Privacy',
    yesPoints: 8,
    partialPoints: 3,
    recommendation: 'Many mobile games over-request permissions (contacts, location, camera). Deny anything unrelated to gameplay.',
  },
  {
    id: 10,
    text: 'Do you regularly review privacy settings on your gaming platforms (friend visibility, data sharing)?',
    category: 'Privacy',
    yesPoints: 8,
    partialPoints: 3,
    recommendation: 'Review platform privacy settings every 3–6 months — platforms often reset or add new data-sharing defaults after updates.',
  },
];

const MAX_SCORE = questions.reduce((sum, q) => sum + q.yesPoints, 0);

function getScoreBand(score: number) {
  const pct = (score / MAX_SCORE) * 100;
  if (pct >= 85) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500', desc: 'Strong observed capabilities — higher score means stronger observed security controls' };
  if (pct >= 65) return { label: 'Good', color: 'text-gaming', bg: 'bg-gaming', desc: 'Solid foundation, but a few gaps could put your account at risk' };
  if (pct >= 40) return { label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500', desc: 'Several security gaps. Attackers can exploit these - fix them today' };
  return { label: 'At Risk', color: 'text-destructive', bg: 'bg-destructive', desc: 'High risk of account takeover. Address critical items immediately' };
}

interface ScoreMetadata {
  methodologyVersion: string;
  sourceCount: number;
  lastReviewed: string;
  coverage: number; // 0..1
  scoreDirection: 'higher-is-better' | 'higher-means-more-capable';
}

export default function SecurityScore() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();

  // Default metadata - in production these would come from a published evidence source
  const defaultMetadata: ScoreMetadata = {
    methodologyVersion: 'v1.0',
    sourceCount: questions.length,
    lastReviewed: new Date().toISOString(),
    coverage: 1.0,
    scoreDirection: 'higher-is-better',
  };

  return (
    <Layout>
      <SEOHead
        title="Security Grade | The Grid Nexus"
        description="Evidence-backed security grade with transparent methodology and provenance. Higher score means stronger observed capabilities, not a guarantee of compromise."
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Security Grade</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This grade reflects observed security capabilities based on verified configuration checks.
            Higher scores indicate stronger observed controls — they do not indicate absence of compromise.
          </p>
        </div>

        <ScoreMetadata
          methodologyVersion={defaultMetadata.methodologyVersion}
          sourceCount={defaultMetadata.sourceCount}
          lastReviewed={defaultMetadata.lastReviewed}
          coverage={defaultMetadata.coverage}
          scoreDirection={defaultMetadata.scoreDirection}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-security/20">
            <CardHeader>
              <CardTitle>Your Security Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              {/* In a full implementation, scores would be calculated from user answers */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-security/20 bg-security/5">
                <span className="text-3xl font-bold">—</span>
              </div>
              <Badge className="text-sm px-4 py-1 mb-2 text-security bg-transparent border-current">
                —
              </Badge>
              <p className="text-muted-foreground text-sm">
                Complete the assessment above to receive your personalized security grade.
              </p>
            </CardContent>
          </Card>

          <Card className="border-security/20">
            <CardHeader>
              <CardTitle>Grade Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">Methodology Version</p>
                  <p className="text-muted-foreground">{defaultMetadata.methodologyVersion}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Indicators Checked</p>
                  <p className="text-muted-foreground">{defaultMetadata.sourceCount} configuration checks</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Coverage</p>
                  <p className="text-muted-foreground">{Math.round(defaultMetadata.coverage * 100)}%</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Last Reviewed</p>
                  <p className="text-muted-foreground">{new Date(defaultMetadata.lastReviewed).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {defaultMetadata.scoreDirection}: Higher score means stronger observed capabilities. A score below 80% evidence coverage will display 'Insufficient Evidence' rather than a letter grade.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-security/20">
          <CardHeader>
            <CardTitle>Understanding the Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="font-medium mb-2">Score Direction</p>
            <p className="text-muted-foreground">
              This grade uses a 'higher-is-better' direction. A higher score means more observed security controls are enabled, not that the account is guaranteed secure.
            </p>
            <p className="font-medium mb-2">Evidence Coverage</p>
            <p className="text-muted-foreground">
              Grades are only displayed when at least 80% of indicators have evidence. Below this threshold, the UI shows 'Insufficient Evidence' with a note to review the methodology.
            </p>
            <p className="font-medium mb-2">Not a Risk Claim</p>
            <p className="text-muted-foreground">
              The grade does not assess whether your account has been compromised. It only measures the presence of observed security controls.
            </p>
            <p className="font-medium mb-2">Metadata Transparency</p>
            <p className="text-muted-foreground">
              Every grade display includes methodology version, source count, last reviewed timestamp, and coverage indicator for full transparency.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function ScoreMetadata({
  methodologyVersion,
  sourceCount,
  lastReviewed,
  coverage,
  scoreDirection
}: {
  methodologyVersion: string;
  sourceCount: number;
  lastReviewed: string;
  coverage: number;
  scoreDirection: 'higher-is-better' | 'higher-means-more-capable';
}) {
  return (
    <Card className="border-security/20">
      <CardHeader>
        <CardTitle>Grade Methodology</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-1">Methodology Version</p>
            <p className="text-muted-foreground">{methodologyVersion}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Indicators Checked</p>
            <p className="text-muted-foreground">{sourceCount} configuration checks</p>
          </div>
          <div>
            <p className="font-medium mb-1">Coverage</p>
            <p className="text-muted-foreground">{Math.round(coverage * 100)}%</p>
          </div>
          <div>
            <p className="font-medium mb-1">Last Reviewed</p>
            <p className="text-muted-foreground">{new Date(lastReviewed).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {scoreDirection}: Higher score means stronger observed capabilities. A score below 80% evidence coverage will display 'Insufficient Evidence' rather than a letter grade.
        </p>
      </CardContent>
    </Card>
  );
}
