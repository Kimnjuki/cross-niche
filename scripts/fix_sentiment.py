import sys
with open('src/pages/tools/SentimentAnalyzer.tsx') as f:
    c = f.read()

changes = 0

# 1. Add imports after Link import
old_import = "import { Link } from 'react-router-dom';"
new_import = old_import + "\nimport { fuzzyGameSearch } from '@/lib/search/fuzzyGameSearch';\nimport { ErrorBoundary } from '@/components/common/ErrorBoundary';\nimport { NotFoundState } from '@/components/common/NotFoundState';"
if old_import in c:
    c = c.replace(old_import, new_import, 1)
    changes += 1
    print("+ Added imports")

# 2. Replace findResult to use fuzzyGameSearch
old_fn = """function findResult(query: string): SentimentResult | null {
  const key = normalize(query);
  if (MOCK_RESULTS[key]) return MOCK_RESULTS[key];
  // fuzzy: check if any key is included in query or vice versa
  for (const [k, v] of Object.entries(MOCK_RESULTS)) {
    if (key.includes(k) || k.includes(key) || v.gameTitle.toLowerCase().includes(query.toLowerCase())) {
      return v;
    }
  }
  return null;
}"""
new_fn = """function findResult(query: string): SentimentResult | null {
  const key = normalize(query);
  if (MOCK_RESULTS[key]) return MOCK_RESULTS[key];
  for (const [k, v] of Object.entries(MOCK_RESULTS)) {
    if (key.includes(k) || k.includes(key) || v.gameTitle.toLowerCase().includes(query.toLowerCase())) {
      return v;
    }
  }
  const libraryResult = fuzzyGameSearch(query);
  if (libraryResult.length > 0) {
    const g = libraryResult[0].game;
    return {
      gameTitle: g.name,
      platform: g.platforms.join(' / '),
      overallSentiment: g.sentimentScores.gameplay,
      sentimentBreakdown: { gameplay: g.sentimentScores.gameplay, security: g.sentimentScores.security, community: g.sentimentScores.community, performance: g.sentimentScores.performance, story: g.sentimentScores.balance },
      securityMentionRate: g.securityMentionRate,
      topSecurityComplaints: g.recentSecurityComplaints.map(c2 => c2.summary),
      topPositiveThemes: g.positiveThemes,
      reviewCount: 100000,
      trendDirection: g.sentimentTrendDirection,
      oneLineSummary: g.securityNotes || '',
    };
  }
  return null;
}"""
if old_fn in c:
    c = c.replace(old_fn, new_fn, 1)
    changes += 1
    print("+ Replaced findResult with fuzzy search")
else:
    print("! findResult not found")

# 3. Wrap export in ErrorBoundary
old_export = "export default function SentimentAnalyzer() {"
new_export = """export default function SentimentAnalyzerPage() {
  return (
    <ErrorBoundary toolName="Game Sentiment Dashboard">
      <SentimentAnalyzer />
    </ErrorBoundary>
  );
}

function SentimentAnalyzer() {"""
if old_export in c:
    c = c.replace(old_export, new_export, 1)
    changes += 1
    print("+ Added ErrorBoundary wrapper")
else:
    print("! export not found")

# 4. Copy fixes
c = c.replace("Game Sentiment Analyzer", "Game Sentiment Dashboard")
c = c.replace("AI-powered sentiment analysis", "Community-informed sentiment analysis")
c = c.replace("AI-powered review intelligence from thousands of real player reviews", "Community-informed sentiment estimates from public reviews and security disclosures")
c = c.replace("280k+ Reviews", "23+ Games")

# 5. Update popular games
c = c.replace("['Valorant', 'Fortnite', 'Minecraft', 'Counter-Strike', 'Apex Legends']", "['Valorant', 'Elden Ring', 'Minecraft', 'CS2', 'Baldur Gate 3']")

# 6. Update search placeholder
c = c.replace("Enter game name (e.g. Valorant, Fortnite, Minecraft", "Search from 23+ games (e.g. Valorant, Elden Ring, Minecraft")

# 7. Fix notFound section to use component
old_nf = """{notFound && !loading && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center py-10">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="font-semibold">No data found for &quot;{query}&quot;</p>"""
new_nf = """{notFound && !loading && (
          <NotFoundState
            query={query}
            suggestions={POPULAR}
            onSelectSuggestion={(g) => { setQuery(g); analyze(g); }}
            onRequestAdd={() => window.open('mailto:data@thegridnexus.com?subject=Game Request: ' + encodeURIComponent(query), '_blank')}
          />"""
if old_nf in c:
    c = c.replace(old_nf, new_nf, 1)
    changes += 1
    print("+ Replaced notFound with NotFoundState component")
else:
    print("! notFound section not found")

with open('src/pages/tools/SentimentAnalyzer.tsx', 'w') as f:
    f.write(c)

print(f"\nDone. {changes} changes applied.")
