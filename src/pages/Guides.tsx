import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DifficultyLevelFilter, type DifficultyLevel } from '@/components/filters/DifficultyLevelFilter';
import { mockGuides, mockTools } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Wrench, Search, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function Guides() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState<DifficultyLevel[]>([]);

  const filteredGuides = mockGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficultyLevels.length === 0 || 
                             selectedDifficultyLevels.includes(guide.difficulty as DifficultyLevel);
    return matchesSearch && matchesDifficulty;
  });

  return (
    <Layout>
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
              <div>
                <DifficultyLevelFilter
                  selectedLevels={selectedDifficultyLevels}
                  onLevelsChange={setSelectedDifficultyLevels}
                  variant="badges"
                />
              </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="group hover:border-primary/50 transition-colors">
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
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{guide.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {guide.readTime} min
                      </span>
                      <span>{guide.platform.join(', ')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
