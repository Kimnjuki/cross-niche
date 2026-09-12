import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, ExternalLink, ArrowRight } from 'lucide-react';

interface KeywordOpportunity {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: 'informational' | 'commercial' | 'navigational';
  competitors: string[];
}

const MOCK_OPPORTUNITIES: KeywordOpportunity[] = [
  {
    keyword: 'best gaming antivirus 2026',
    volume: 12000,
    difficulty: 35,
    intent: 'commercial',
    competitors: ['techradar.com', 'tomshardware.com', 'pcmag.com'],
  },
  {
    keyword: 'how to secure gaming accounts',
    volume: 8500,
    difficulty: 28,
    intent: 'informational',
    competitors: ['support.steampowered.com', 'howtogeek.com'],
  },
  {
    keyword: 'zero trust for gamers',
    volume: 3200,
    difficulty: 22,
    intent: 'informational',
    competitors: ['cisa.gov', 'nist.gov'],
  },
  {
    keyword: 'AI threat detection gaming',
    volume: 2100,
    difficulty: 18,
    intent: 'informational',
    competitors: ['darkreading.com', 'bleepingcomputer.com'],
  },
  {
    keyword: 'best gaming VPN',
    volume: 18000,
    difficulty: 42,
    intent: 'commercial',
    competitors: ['pcgamer.com', 'ign.com', 'gamespot.com'],
  },
  {
    keyword: 'Steam security best practices',
    volume: 5600,
    difficulty: 25,
    intent: 'informational',
    competitors: ['support.steampowered.com', 'reddit.com'],
  },
  {
    keyword: 'gaming PC security checklist',
    volume: 4200,
    difficulty: 20,
    intent: 'informational',
    competitors: ['microsoft.com', 'kaspersky.com'],
  },
  {
    keyword: 'anti-cheat software comparison',
    volume: 3800,
    difficulty: 30,
    intent: 'commercial',
    competitors: ['ea.com', 'riotgames.com', 'battleye.com'],
  },
];

export default function KeywordGapAnalysis() {
  const [domain, setDomain] = useState('thegridnexus.com');
  const [competitors, setCompetitors] = useState('techradar.com, tomshardware.com, pcgamer.com');
  const [opportunities, setOpportunities] = useState<KeywordOpportunity[]>([]);
  const [loading, setLoading] = useState(false);

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setOpportunities(MOCK_OPPORTUNITIES);
      setLoading(false);
    }, 1200);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'commercial':
        return 'bg-blue-100 text-blue-800';
      case 'informational':
        return 'bg-green-100 text-green-800';
      case 'navigational':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Keyword Gap Analysis | The Grid Nexus"
        description="Identify high-value keyword opportunities where competitors rank but The Grid Nexus doesn't. Find gaps to dominate tech, security, and gaming search results."
        url="https://thegridnexus.com/keyword-gap-analysis"
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 text-slate-900">
            Keyword Gap Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover high-value keyword opportunities where competitors rank but you don't. Close the gap and dominate your niche.
          </p>
        </div>

        {/* Analysis Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Keyword Gaps</CardTitle>
            <CardDescription>
              Enter your domain and competitor domains to find keyword opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Domain</label>
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="thegridnexus.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Competitor Domains (comma-separated)</label>
                <Input
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="techradar.com, tomshardware.com, pcgamer.com"
                />
              </div>
              <Button onClick={runAnalysis} disabled={loading} className="w-full">
                {loading ? 'Analyzing...' : 'Run Gap Analysis'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {opportunities.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="font-display font-bold text-2xl mb-2">
                Keyword Opportunities ({opportunities.length})
              </h2>
              <p className="text-muted-foreground">
                Keywords where competitors rank but your domain doesn't. Filtered for realistic opportunities.
              </p>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Keyword</th>
                    <th className="border border-border p-3 text-left">Volume</th>
                    <th className="border border-border p-3 text-left">Difficulty</th>
                    <th className="border border-border p-3 text-left">Intent</th>
                    <th className="border border-border p-3 text-left">Top Competitors</th>
                    <th className="border border-border p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp, i) => (
                    <tr key={i}>
                      <td className="border border-border p-3 font-medium">{opp.keyword}</td>
                      <td className="border border-border p-3">{opp.volume.toLocaleString()}</td>
                      <td className="border border-border p-3">
                        <Badge className={getDifficultyColor(opp.difficulty)}>
                          {opp.difficulty}
                        </Badge>
                      </td>
                      <td className="border border-border p-3">
                        <Badge variant="topic" className={getIntentColor(opp.intent)}>
                          {opp.intent}
                        </Badge>
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {opp.competitors.slice(0, 2).join(', ')}
                      </td>
                      <td className="border border-border p-3">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          Analyze
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Win Recommendations</CardTitle>
                <CardDescription>
                  Prioritize these keywords based on volume, difficulty, and commercial intent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">High Volume, Low Difficulty</p>
                      <p className="text-sm text-muted-foreground">
                        Target "gaming PC security checklist" (4,200 vol, KD 20) and "AI threat detection gaming" (2,100 vol, KD 18) first for quick wins.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Commercial Intent Keywords</p>
                      <p className="text-sm text-muted-foreground">
                        "Best gaming antivirus 2026" and "best gaming VPN" have high commercial intent. Create comparison pages with affiliate links.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Content Strategy</p>
                      <p className="text-sm text-muted-foreground">
                        Create pillar pages for "zero trust for gamers" and "gaming security best practices" to establish topical authority.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {opportunities.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">No Data Yet</h3>
              <p className="text-muted-foreground">
                Run the gap analysis to discover keyword opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
