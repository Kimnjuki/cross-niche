import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, ExternalLink, Clock, Zap, Shield, Gamepad2, TrendingUp, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { howToGuides, getGuidesByCategory, searchGuides, type HowToGuide } from '@/data/howToGuides';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-600 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const categoryColors = {
  tech: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  security: 'bg-red-500/10 text-red-600 border-red-500/20',
  gaming: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
};

const categoryIcons = {
  tech: Zap,
  security: Shield,
  gaming: Gamepad2,
};

export default function Guides() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredGuides = useMemo(() => {
    let guides = searchQuery ? searchGuides(searchQuery) : howToGuides;
    
    if (selectedCategory !== 'all') {
      guides = guides.filter(g => g.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      guides = guides.filter(g => g.difficulty === selectedDifficulty);
    }
    
    return guides;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const techGuides = getGuidesByCategory('tech');
  const securityGuides = getGuidesByCategory('security');
  const gamingGuides = getGuidesByCategory('gaming');

  return (
    <Layout>
      <SEOHead
        title="How-To Guides 2026: Tech, Security & Gaming Solutions | The Grid Nexus"
        description="Solve the most searched tech, security, and gaming questions with our comprehensive how-to guides. Unique tricks, modern solutions, and step-by-step tutorials. Updated February 2026."
        keywords={[
          'how to speed up windows 11',
          'how to fix slow internet connection',
          'how to build a gaming pc step by step',
          'how to protect against ransomware attacks',
          'how to secure wifi network',
          'how to increase fps in games',
          'how to reduce lag in games',
          'windows 11 optimization guide',
          'internet troubleshooting guide',
          'gaming pc building tutorial',
          'ransomware protection guide',
          'wifi security setup',
          'fps optimization guide',
          'game lag reduction',
          'tech how-to guides',
          'security tutorials',
          'gaming guides',
          'step by step tech solutions',
          'unique tech tricks',
          'modern tech solutions',
        ]}
        url={window.location.href}
        type="website"
        faqs={[
          {
            question: 'What makes these guides unique?',
            answer: 'Our guides include unique tricks and modern solutions that go beyond basic tutorials. We compare traditional vs modern approaches and provide proven methods used by experts.',
          },
          {
            question: 'Are these guides based on real search queries?',
            answer: 'Yes! All guides are based on the most searched questions and queries in tech, security, and gaming. We solve real problems people search for daily.',
          },
          {
            question: 'How often are guides updated?',
            answer: 'Guides are updated monthly to reflect the latest best practices, new tools, and emerging solutions. Each guide shows the last updated date.',
          },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="font-display font-bold text-5xl mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            How-To Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Solve the most searched questions in tech, security, and gaming with unique tricks and modern solutions
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/tech" className="text-primary hover:underline">Tech News</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security" className="text-primary hover:underline">Security</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/topics" className="text-primary hover:underline">Topics</Link>
          </div>
        </div>

        {/* Featured Comparison Alert */}
        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <TrendingUp className="h-4 w-4" />
          <AlertTitle>Modern Solutions vs Traditional Methods</AlertTitle>
          <AlertDescription>
            Our guides compare traditional approaches with modern solutions, showing you the advantages of updated techniques. 
            Each guide includes unique tricks used by experts in the field.
          </AlertDescription>
        </Alert>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tech Guides</CardTitle>
                  <CardDescription>{techGuides.length} comprehensive guides</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Windows optimization, internet troubleshooting, PC building, and more
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security Guides</CardTitle>
                  <CardDescription>{securityGuides.length} security solutions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ransomware protection, WiFi security, network hardening, and more
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Gamepad2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Gaming Guides</CardTitle>
                  <CardDescription>{gamingGuides.length} performance guides</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                FPS optimization, lag reduction, PC building for gaming, and more
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search guides by question, problem, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)}>
              <TabsList>
                <TabsTrigger value="all">All Categories</TabsTrigger>
                <TabsTrigger value="tech" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Tech
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="gaming" className="gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Gaming
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="capitalize"
                >
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </Button>
              ))}
            </div>
          </div>

          {filteredGuides.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Found {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} matching your criteria
            </p>
          )}
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No guides found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => {
              const CategoryIcon = categoryIcons[guide.category];
              return (
                <Card key={guide.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={cn(categoryColors[guide.category], 'capitalize')}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {guide.category}
                        </Badge>
                        <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {guide.readTime} min
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search Query */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Solves:</p>
                      <p className="text-sm font-medium">"{guide.searchQuery}"</p>
                    </div>

                    {/* Unique Trick */}
                    {guide.uniqueTrick && (
                      <Alert className="border-yellow-500/20 bg-yellow-500/5">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-sm">Unique Trick</AlertTitle>
                        <AlertDescription className="text-sm">
                          {guide.uniqueTrick}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Comparison */}
                    {guide.comparison && (
                      <div className="border rounded-lg p-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Traditional vs Modern:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="font-semibold text-muted-foreground">Traditional:</p>
                            <p>{guide.comparison.traditional}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-primary">Modern:</p>
                            <p>{guide.comparison.modern}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-green-600">Advantage: {guide.comparison.advantage}</p>
                        </div>
                      </div>
                    )}

                    {/* Steps Preview */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Steps ({guide.steps.length}):</p>
                      <ol className="space-y-1 text-sm text-muted-foreground">
                        {guide.steps.slice(0, 3).map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-semibold text-primary">{i + 1}.</span>
                            <span>{step.title}</span>
                          </li>
                        ))}
                        {guide.steps.length > 3 && (
                          <li className="text-primary font-medium">
                            + {guide.steps.length - 3} more steps...
                          </li>
                        )}
                      </ol>
                    </div>

                    {/* Prerequisites */}
                    {guide.prerequisites.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.prerequisites.map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Button asChild className="w-full group/btn" size="lg">
                      <Link to={`/guides/${guide.id}`}>
                        View Complete Guide
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
