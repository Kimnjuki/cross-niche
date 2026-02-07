import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockTools } from '@/data/mockData';
import { useGuides } from '@/hooks/useGuides';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BookOpen, Wrench, Search, ExternalLink, Clock, AlertTriangle, ChevronDown, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const difficultyColors = {
  beginner: 'bg-gaming/10 text-gaming border-gaming/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-security/10 text-security border-security/20',
};

const nicheColors = {
  tech: 'bg-tech/10 text-tech',
  security: 'bg-security/10 text-security',
  gaming: 'bg-gaming/10 text-gaming',
};

const nicheIdMap: Record<string, number> = {
  tech: 1,
  security: 2,
  gaming: 3,
};

export default function Guides() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const { guides, isLoading } = useGuides(undefined, selectedDifficulty || undefined);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      <SEOHead
        title="Tech Guides & Tools | The Grid Nexus"
        description="Level up your skills with comprehensive guides and discover the best tools recommended by our experts. Tutorials, resources, and recommendations."
        keywords={['tech guides', 'tutorials', 'tools', 'resources', 'how-to guides', 'expert recommendations']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Guides & Tools</h1>
              <p className="text-muted-foreground">Tutorials, Resources & Recommendations</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Level up your skills with our comprehensive guides and discover the best tools recommended by our experts.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link to="/tech" className="text-primary hover:underline">Tech News</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security" className="text-primary hover:underline">Security</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/topics" className="text-primary hover:underline">Topics</Link>
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="guides" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Wrench className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(
                      selectedDifficulty === difficulty ? null : difficulty
                    )}
                    className="capitalize"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Guides Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No guides found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <Card key={guide.id} className="group hover:border-primary/50 transition-colors overflow-hidden">
                    <CardHeader>
                      <div className="flex gap-2 mb-2">
                        <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
                          {guide.difficulty}
                        </Badge>
                        <Badge className={nicheColors[guide.niche]} variant="outline">
                          {guide.niche}
                        </Badge>
                      </div>
                      <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                        {guide.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">{guide.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {guide.readTime} min
                        </span>
                        <span>{guide.platform.join(', ')}</span>
                      </div>
                      <Collapsible open={expandedGuide === guide.id} onOpenChange={(o) => setExpandedGuide(o ? guide.id : null)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full justify-between gap-2 text-left h-auto py-2">
                            <span className="flex items-center gap-2">
                              <ListOrdered className="h-4 w-4" />
                              View steps ({guide.steps.length})
                            </span>
                            <ChevronDown className={cn('h-4 w-4 transition-transform', expandedGuide === guide.id && 'rotate-180')} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ol className="mt-2 space-y-1.5 pl-4 list-decimal text-sm text-muted-foreground">
                            {guide.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </CollapsibleContent>
                      </Collapsible>
                      <Button variant="outline" size="sm" asChild className="w-full gap-2">
                        <Link to={`/guides/${guide.id}`}>
                          View full guide
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTools.map((tool) => (
                <Card key={tool.id} className="group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                          {tool.name}
                          {tool.isAffiliate && (
                            <Badge variant="secondary" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Affiliate
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge className={cn(nicheColors[tool.niche], 'mt-2')} variant="outline">
                          {tool.niche}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Affiliate Disclosure */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>
                <strong>Disclosure:</strong> Some links on this page are affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you.{' '}
                <a href="/disclosure" className="text-primary hover:underline">
                  Learn more
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
