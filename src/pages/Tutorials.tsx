import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Search, 
  Clock, 
  Monitor, 
  Apple, 
  Terminal, 
  Gamepad2, 
  Cpu, 
  Shield, 
  Zap,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { mockTutorials, type Tutorial } from '@/data/tutorialsData';

const osIcons = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
  all: Zap
};

const categoryIcons = {
  tech: Cpu,
  security: Shield,
  gaming: Gamepad2
};

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  advanced: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  expert: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
};

export default function Tutorials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');
  const [selectedOS, setSelectedOS] = useState<('windows' | 'macos' | 'linux' | 'all')[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTutorials = useMemo(() => {
    return mockTutorials.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
      
      const matchesOS = selectedOS.length === 0 || 
                        tutorial.os.some(os => selectedOS.includes(os) || selectedOS.includes('all'));
      
      const matchesDifficulty = selectedDifficulty.length === 0 || 
                                selectedDifficulty.includes(tutorial.difficulty);
      
      return matchesSearch && matchesCategory && matchesOS && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedOS, selectedDifficulty]);

  const featuredTutorials = filteredTutorials.filter(t => t.featured);
  const regularTutorials = filteredTutorials.filter(t => !t.featured);

  const toggleOS = (os: 'windows' | 'macos' | 'linux' | 'all') => {
    setSelectedOS(prev => 
      prev.includes(os) 
        ? prev.filter(o => o !== os)
        : [...prev, os]
    );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const clearFilters = () => {
    setSelectedOS([]);
    setSelectedDifficulty([]);
    setSearchQuery('');
  };

  const activeFiltersCount = selectedOS.length + selectedDifficulty.length;

  return (
    <Layout>
      <SEOHead
        title="Tech Tutorials & Step-by-Step Guides | The Grid Nexus"
        description="Master common fixes across Windows, macOS, and Linux. Learn security best practices and optimize your gaming experience with comprehensive tutorials."
        keywords={['tech tutorials', 'how-to guides', 'step-by-step tutorials', 'tech fixes', 'security tutorials', 'gaming tutorials']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background mb-12 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary/20 backdrop-blur-sm">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
                  Tutorials & Fixes
                </h1>
                <p className="text-lg text-muted-foreground">
                  Step-by-step guides for tech, security, and gaming
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Master common fixes across Windows, macOS, and Linux. Learn security best practices 
              and optimize your gaming experience with our comprehensive tutorials.
            </p>
          </div>
        </div>

        {/* Search and Category Tabs */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tutorials... (e.g., 'fix slow startup', 'remove malware', 'optimize FPS')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="all" className="gap-2">
                <Zap className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="tech" className="gap-2">
                <Cpu className="h-4 w-4" />
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

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-6 animate-reveal">
              <div className="space-y-6">
                {/* OS Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Operating System
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(['windows', 'macos', 'linux', 'all'] as const).map(os => {
                      const Icon = osIcons[os];
                      return (
                        <Button
                          key={os}
                          variant={selectedOS.includes(os) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleOS(os)}
                          className="gap-2 capitalize"
                        >
                          <Icon className="h-4 w-4" />
                          {os === 'all' ? 'All Platforms' : os}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map(difficulty => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty.includes(difficulty) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleDifficulty(difficulty)}
                        className="capitalize"
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} found
          </p>
          {filteredTutorials.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Sorted by popularity</span>
            </div>
          )}
        </div>

        {/* Featured Tutorials */}
        {featuredTutorials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Featured Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Tutorials */}
        {regularTutorials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTutorials.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tutorials found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}

interface TutorialCardProps {
  tutorial: Tutorial;
  featured?: boolean;
}

function TutorialCard({ tutorial, featured }: TutorialCardProps) {
  const CategoryIcon = categoryIcons[tutorial.category];
  
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 overflow-hidden",
      featured && "border-2 border-primary/50"
    )}>
      {/* Image Header */}
      {tutorial.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={tutorial.imageUrl}
            alt={tutorial.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          {featured && (
            <Badge className="absolute top-3 right-3 bg-primary">
              Featured
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg",
              tutorial.category === 'tech' && "bg-tech/10",
              tutorial.category === 'security' && "bg-security/10",
              tutorial.category === 'gaming' && "bg-gaming/10"
            )}>
              <CategoryIcon className={cn(
                "h-4 w-4",
                tutorial.category === 'tech' && "text-tech",
                tutorial.category === 'security' && "text-security",
                tutorial.category === 'gaming' && "text-gaming"
              )} />
            </div>
            <Badge className={cn(difficultyColors[tutorial.difficulty], 'capitalize text-xs')}>
              {tutorial.difficulty}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="font-display text-xl group-hover:text-primary transition-colors line-clamp-2">
          {tutorial.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-2">
          {tutorial.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* OS Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutorial.os.map(os => {
            const Icon = osIcons[os];
            return (
              <Badge key={os} variant="outline" className="gap-1 text-xs">
                <Icon className="h-3 w-3" />
                {os === 'all' ? 'All' : os}
              </Badge>
            );
          })}
        </div>

        {/* Steps Preview */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            {tutorial.steps.length} Steps
          </p>
          <div className="space-y-1">
            {tutorial.steps.slice(0, 3).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="line-clamp-1">{step}</span>
              </div>
            ))}
            {tutorial.steps.length > 3 && (
              <p className="text-xs text-muted-foreground ml-5">
                +{tutorial.steps.length - 3} more steps
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {tutorial.readTime} min
            </span>
            {tutorial.views && (
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {tutorial.views.toLocaleString()}
              </span>
            )}
          </div>
          <Button asChild size="sm" className="gap-2">
            <Link to={`/tutorial/${tutorial.id}`}>
              <PlayCircle className="h-4 w-4" />
              Start
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

