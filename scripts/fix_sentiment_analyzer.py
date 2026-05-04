#!/usr/bin/env python3
"""Apply targeted fixes to SentimentAnalyzer.tsx"""
import re

with open("src/pages/tools/SentimentAnalyzer.tsx") as f:
    content = f.read()

changes = 0

# 1. Replace static MOCK_RESULTS with import from gameLibrary + fuzzySearch
old_mock = '''const MOCK_RESULTS: Record<string, SentimentResult> = {'''
new_mock = '''const MOCK_RESULTS: Record<string, SentimentResult> = {'''
# Keep the mock results for now since they have the sentiment shape, but add note

# 2. Fix the findResult function to use fuzzy search
old_find = '''function findResult(query: string): SentimentResult | null {
  const key = normalize(query);
  if (MOCK_RESULTS[key]) return MOCK_RESULTS[key];
  // fuzzy: check if any key is included in query or vice versa
  for (const [k, v] of Object.entries(MOCK_RESULTS)) {
    if (key.includes(k) || k.includes(key) || v.gameTitle.toLowerCase().includes(query.toLowerCase())) {
      return v;
    }
  }
  return null;
}'''

new_find = '''function findResult(query: string): SentimentResult | null {
  const key = normalize(query);
  if (MOCK_RESULTS[key]) return MOCK_RESULTS[key];
  // fuzzy: check if any key is included in query or vice versa
  for (const [k, v] of Object.entries(MOCK_RESULTS)) {
    if (key.includes(k) || k.includes(key) || v.gameTitle.toLowerCase().includes(query.toLowerCase())) {
      return v;
    }
  }
  // Also check the game library
  const libraryResult = fuzzyGameSearch(query);
  if (libraryResult.length > 0) {
    const g = libraryResult[0].game;
    return {
      gameTitle: g.name,
      platform: g.platforms.join(' / '),
      overallSentiment: g.sentimentScores.gameplay,
      sentimentBreakdown: { gameplay: g.sentimentScores.gameplay, security: g.sentimentScores.security, community: g.sentimentScores.community, performance: g.sentimentScores.performance, story: g.sentimentScores.balance },
      securityMentionRate: g.securityMentionRate,
      topSecurityComplaints: g.recentSecurityComplaints.map(c => c.summary),
      topPositiveThemes: g.positiveThemes,
      reviewCount: 100000,
      trendDirection: g.sentimentTrendDirection,
      oneLineSummary: g.securityNotes || '',
    };
  }
  return null;
}'''

if old_find in content:
    content = content.replace(old_find, new_find, 1)
    print(f"✓ Replaced findResult with fuzzy search")
    changes += 1
else:
    print("✗ findResult not found")

# 3. Add import for fuzzyGameSearch and GAME_LIBRARY
old_import = "import { Link } from 'react-router-dom';"
new_import = "import { Link } from 'react-router-dom';\nimport { fuzzyGameSearch } from '@/lib/search/fuzzyGameSearch';\nimport { ErrorBoundary } from '@/components/common/ErrorBoundary';\nimport { LoadingState } from '@/components/common/LoadingState';\nimport { NotFoundState } from '@/components/common/NotFoundState';\nimport { EmptyState } from '@/components/common/EmptyState';"

if old_import in content:
    content = content.replace(old_import, new_import, 1)
    print(f"✓ Added new imports")
    changes += 1
    
# 4. Update SEO description 
old_seo = 'description="AI-powered sentiment analysis for any game. See security complaint rates, community mood, and trending player opinions from thousands of reviews."'
new_seo = 'description="Community-informed sentiment analysis for games. See security complaint rates, community mood, and trending player opinions."'

if old_seo in content:
    content = content.replace(old_seo, new_seo, 1)
    print(f"✓ Updated SEO copy")
    changes += 1

# 5. Wrap in ErrorBoundary
# Find the default export
old_export = "export default function SentimentAnalyzer() {"
new_export = '''export default function SentimentAnalyzerPage() {
  return (
    <ErrorBoundary toolName="Game Sentiment Dashboard">
      <SentimentAnalyzer />
    </ErrorBoundary>
  );
}

function SentimentAnalyzer() {'''

if old_export in content:
    content = content.replace(old_export, new_export, 1)
    print(f"✓ Added ErrorBoundary wrapper")
    changes += 1

# 6. Update hero copy
old_hero = '<h1 className="font-display font-bold text-3xl">Game Sentiment Analyzer</h1>'
new_hero = '<h1 className="font-display font-bold text-3xl">Game Sentiment Dashboard</h1>'

if old_hero in content:
    content = content.replace(old_hero, new_hero, 1)
    print(f"✓ Updated hero title")
    changes += 1

old_subtitle = '<p className="text-muted-foreground text-sm">AI-powered review intelligence from thousands of real player reviews</p>'
new_subtitle = '<p className="text-muted-foreground text-sm">Community-informed sentiment estimates from public reviews and security disclosures</p>'

if old_subtitle in content:
    content = content.replace(old_subtitle, new_subtitle, 1)
    print(f"✓ Updated subtitle copy")
    changes += 1

old_search = 'placeholder="Enter game name (e.g. Valorant, Fortnite, Minecraft\u2026)"'
new_search = 'placeholder="Enter a game name (e.g. Valorant, Elden Ring, Minecraft\u2026)"'

if old_search in content:
    content = content.replace(old_search, new_search, 1)
    print(f"✓ Updated search placeholder")
    changes += 1

# 7. Update popular games list
old_popular = "const POPULAR = ['Valorant', 'Fortnite', 'Minecraft', 'Counter-Strike', 'Apex Legends'];"
new_popular = "const POPULAR = ['Valorant', 'Elden Ring', 'Minecraft', 'Counter-Strike 2', 'Baldur\\'s Gate 3'];"

if old_popular in content:
    content = content.replace(old_popular, new_popular, 1)
    print(f"✓ Updated popular games list")
    changes += 1

# 8. Update the badge tags
old_badges = "(['Security Focus', 'Community Mood', 'Trend Direction', '280k+ Reviews'] as const).map"
new_badges = "(['Security Focus', 'Community Mood', 'Trend Direction', '23+ Games'] as const).map"

if old_badges in content:
    content = content.replace(old_badges, new_badges, 1)
    print(f"✓ Updated badge tags")
    changes += 1

# 9. Add empty state note instead of just "Enter a game to analyze"
old_empty = `<div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-1">Enter a game to analyze</p>
            <p className="text-sm">We'll scan thousands of reviews and surface the security patterns that matter.</p>
          </div>`
new_empty = `<div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-1">Enter a game to analyze</p>
            <p className="text-sm">Search from 23+ supported games. Sentiment scores are community-informed estimates based on public reviews and security disclosures.</p>
          </div>`

# This is tricky with JSX formatting. Let me check what's actually there
idx = content.find("Enter a game to analyze")
if idx > -1:
    # Find the surrounding div
    start = content.rfind("<div", 0, idx)
    end = content.find("/div>", idx) + 5
    old_block = content[start:end]
    if "Enter a game to analyze" in old_block and "We'll scan" in old_block:
        new_block = old_block.replace("We'll scan thousands of reviews and surface the security patterns that matter.", 
                                       "Search from 23+ supported games. Sentiment scores are community-informed estimates based on public reviews and security disclosures.")
        content = content.replace(old_block, new_block, 1)
        print(f"✓ Updated empty state text")
        changes += 1

# 10. Add notFound section to show NotFoundState on empty notFound
old_notfound = `{notFound && !loading && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center py-10">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="font-semibold">No data found for "{query}"</p>`

new_notfound = `{notFound && !loading && (
          <NotFoundState
            query={query}
            suggestions={POPULAR}
            onSelectSuggestion={(g) => { setQuery(g); analyze(g); }}
            onRequestAdd={() => window.open('mailto:data@thegridnexus.com?subject=Game Request: ' + encodeURIComponent(query), '_blank')}
          />`

if old_notfound in content:
    content = content.replace(old_notfound, new_notfound, 1)
    print(f"✓ Updated notFound to use NotFoundState component")
    changes += 1

with open("src/pages/tools/SentimentAnalyzer.tsx", "w") as f:
    f.write(content)

print(f"\nDone. {changes}/10 changes applied.")
