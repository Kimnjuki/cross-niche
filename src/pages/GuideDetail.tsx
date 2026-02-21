import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';
import { Clock, ArrowLeft, BookOpen, AlertTriangle, Lightbulb, Info, CheckCircle2, Zap, Shield, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { howToGuides } from '@/data/howToGuides';
import type { HowToGuide } from '@/data/howToGuides';

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

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const guide = howToGuides.find(g => g.id === id);

  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
          <Link to="/guides" className="text-primary hover:underline">
            Return to Guides
          </Link>
        </div>
      </Layout>
    );
  }

  const CategoryIcon = categoryIcons[guide.category];

  return (
    <Layout>
      <SEOHead
        title={`${guide.title} | The Grid Nexus`}
        description={guide.description}
        keywords={[...guide.tags, guide.searchQuery, guide.category, guide.difficulty]}
        url={window.location.href}
        type="article"
        howTo={{
          name: guide.title,
          description: guide.description,
          steps: guide.steps.map(step => ({
            name: step.title,
            text: step.description,
          })),
          totalTime: `PT${guide.readTime}M`,
        }}
        faqs={[
          {
            question: `What problem does this guide solve?`,
            answer: `This guide solves: "${guide.searchQuery}". ${guide.description}`,
          },
          {
            question: `How long does this take?`,
            answer: `This guide takes approximately ${guide.readTime} minutes to complete.`,
          },
          {
            question: `What makes this solution unique?`,
            answer: guide.uniqueTrick || `This guide provides modern solutions compared to traditional approaches.`,
          },
        ]}
      />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Link>
          <div className="flex gap-2 mb-4">
            <Badge className={cn(categoryColors[guide.category], 'capitalize')}>
              <CategoryIcon className="h-3 w-3 mr-1" />
              {guide.category}
            </Badge>
            <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
              {guide.difficulty}
            </Badge>
          </div>
          <h1 className="font-display font-bold text-4xl mb-4">{guide.title}</h1>
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-lg text-muted-foreground mb-4">{guide.description}</p>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-sm mb-2">Solves This Question:</h3>
              <p className="text-sm font-medium text-foreground">"{guide.searchQuery}"</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {guide.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <span>Last updated:</span> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Unique Trick */}
        {guide.uniqueTrick && (
          <Alert className="mb-8 border-yellow-500/20 bg-yellow-500/5">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Unique Trick</AlertTitle>
            <AlertDescription>
              {guide.uniqueTrick}
            </AlertDescription>
          </Alert>
        )}

        {/* Comparison */}
        {guide.comparison && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Traditional vs Modern Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-muted-foreground mb-2">Traditional Method</h4>
                  <p className="text-sm">{guide.comparison.traditional}</p>
                </div>
                <div className="border rounded-lg p-4 border-primary/20 bg-primary/5">
                  <h4 className="font-semibold text-primary mb-2">Modern Solution</h4>
                  <p className="text-sm">{guide.comparison.modern}</p>
                </div>
              </div>
              <Alert className="border-green-500/20 bg-green-500/5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Advantage</AlertTitle>
                <AlertDescription>
                  {guide.comparison.advantage}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Prerequisites */}
        {guide.prerequisites.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Info className="h-5 w-5" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {guide.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Tools */}
        {guide.tools.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Required Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {guide.tools.map((tool, i) => (
                  <Badge key={i} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Step-by-Step Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-8">
              {guide.steps.map((step, index) => (
                <li key={index} id={`step-${index + 1}`} className="scroll-mt-20">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center font-semibold text-primary">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-semibold text-lg mb-2">{step.title}</div>
                      <div className="prose prose-base max-w-none">
                        <p className="text-muted-foreground leading-relaxed mb-2">{step.description}</p>
                        {step.tip && (
                          <Alert className="border-blue-500/20 bg-blue-500/5">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-sm">Pro Tip</AlertTitle>
                            <AlertDescription className="text-sm">
                              {step.tip}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Related Guides */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">More {guide.category} Guides</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {howToGuides
                    .filter(g => g.category === guide.category && g.id !== guide.id)
                    .slice(0, 3)
                    .map((relatedGuide) => (
                      <li key={relatedGuide.id}>
                        <Link to={`/guides/${relatedGuide.id}`} className="text-primary hover:underline">
                          {relatedGuide.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <Link to="/guides">
                  <Button variant="outline" className="w-full">
                    Browse All Guides
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
