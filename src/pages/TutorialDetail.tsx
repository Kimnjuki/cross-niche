import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  Monitor,
  Apple,
  Terminal,
  Zap,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { mockTutorials, type Tutorial } from '@/data/tutorialsData';

const osIcons = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
  all: Zap
};

export default function TutorialDetail() {
  const { id } = useParams<{ id: string }>();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Find tutorial by ID
  const tutorial = mockTutorials.find(t => t.id === id);

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'text-tech';
      case 'security': return 'text-security';
      case 'gaming': return 'text-gaming';
      default: return 'text-foreground';
    }
  };
  
  if (!tutorial) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Tutorial Not Found</h1>
          <p className="text-muted-foreground mb-8">The tutorial you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/tutorials">Browse Tutorials</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const progress = (completedSteps.size / tutorial.steps.length) * 100;
  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/tutorials" 
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorials
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "capitalize",
                    tutorial.difficulty === 'beginner' && 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
                    tutorial.difficulty === 'intermediate' && 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
                    tutorial.difficulty === 'advanced' && 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
                    tutorial.difficulty === 'expert' && 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                  )}
                >
                  {tutorial.difficulty}
                </Badge>
                <Badge variant="outline" className={cn(getCategoryColor(tutorial.category))}>
                  {tutorial.category}
                </Badge>
                {tutorial.os.map(os => {
                  const Icon = osIcons[os];
                  return (
                    <Badge key={os} variant="outline" className="gap-1">
                      <Icon className="h-3 w-3" />
                      {os === 'all' ? 'All Platforms' : os}
                    </Badge>
                  );
                })}
                {tutorial.featured && (
                  <Badge className="bg-primary">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
                {tutorial.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {tutorial.description}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {tutorial.readTime} min read
                </span>
                {tutorial.views && (
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {tutorial.views.toLocaleString()} views
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {tutorial.steps.length} steps
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {tutorial.imageUrl && (
              <div className="rounded-xl overflow-hidden">
                <img
                  src={tutorial.imageUrl}
                  alt={tutorial.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {completedSteps.size} of {tutorial.steps.length} completed
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
            </Card>

            {/* Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tutorial.steps.map((step, index) => {
                    const isCompleted = completedSteps.has(index);
                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                          isCompleted 
                            ? "bg-green-500/10 border-green-500/20" 
                            : "bg-card border-border hover:border-primary/50"
                        )}
                        onClick={() => toggleStep(index)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-muted-foreground">
                                  Step {index + 1}
                                </span>
                                {isCompleted && (
                                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className={cn(
                                "text-base",
                                isCompleted && "line-through text-muted-foreground"
                              )}>
                                {step}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {tutorial.tags && tutorial.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tutorial.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                  <Badge className="capitalize">{tutorial.difficulty}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time Required</p>
                  <p className="font-semibold">{tutorial.readTime} minutes</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Platforms</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tutorial.os.map(os => {
                      const Icon = osIcons[os];
                      return (
                        <Badge key={os} variant="outline" className="gap-1">
                          <Icon className="h-3 w-3" />
                          {os === 'all' ? 'All' : os}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Tutorials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTutorials
                    .filter(t => 
                      t.id !== tutorial.id && 
                      (t.category === tutorial.category || 
                       t.os.some(os => tutorial.os.includes(os)))
                    )
                    .slice(0, 3)
                    .map(related => (
                      <Link
                        key={related.id}
                        to={`/tutorial/${related.id}`}
                        className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                      >
                        <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{related.readTime} min</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {related.difficulty}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

