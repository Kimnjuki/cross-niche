/**
 * Guide Detail Page with progress tracking.
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useGuide } from '@/hooks/useGuides';
import { useGuideProgressWithSteps } from '@/hooks/useGuideProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SEOHead } from '@/components/seo/SEOHead';
import { Clock, CheckCircle2, Circle, ArrowLeft, BookOpen, AlertTriangle, Lightbulb, Info, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const { guide, isLoading } = useGuide(id || '');
  const { completedSteps, progressPercent, isCompleted, markStepComplete } = useGuideProgressWithSteps(
    guide?.id || '',
    guide?.steps.length || 0
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

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

  return (
    <Layout>
      <SEOHead
        title={`${guide.title} - Complete ${new Date().getFullYear()} Guide | The Grid Nexus`}
        description={`Master ${guide.title.toLowerCase()} with our comprehensive ${new Date().getFullYear()} guide. Step-by-step tutorials, expert insights, and proven strategies. ${guide.description}`}
        keywords={[
          guide.niche,
          guide.difficulty,
          'guide',
          'tutorial',
          `${guide.niche} guide`,
          `${guide.difficulty} ${guide.niche} tutorial`,
          `how to ${guide.title.toLowerCase()}`,
          `${guide.niche} best practices`,
          `${guide.niche} step by step`,
        ]}
        url={window.location.href}
        type="article"
        howTo={{
          name: guide.title,
          description: guide.description,
          steps: guide.steps.map((step, index) => ({
            name: `Step ${index + 1}`,
            text: step,
          })),
          totalTime: `PT${guide.readTime}M`,
        }}
        faqs={[
          {
            question: `What is ${guide.title}?`,
            answer: guide.description,
          },
          {
            question: `How long does it take to complete ${guide.title}?`,
            answer: `This guide takes approximately ${guide.readTime} minutes to complete, depending on your experience level.`,
          },
          {
            question: `What difficulty level is ${guide.title}?`,
            answer: `This guide is designed for ${guide.difficulty} level users. ${guide.difficulty === 'beginner' ? 'No prior experience required.' : guide.difficulty === 'intermediate' ? 'Some basic knowledge recommended.' : 'Requires solid foundation in the topic.'}`,
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
            <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
              {guide.difficulty}
            </Badge>
            <Badge className={nicheColors[guide.niche]} variant="outline">
              {guide.niche}
            </Badge>
          </div>
          <h1 className="font-display font-bold text-4xl mb-4">{guide.title}</h1>
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-lg text-muted-foreground mb-4">{guide.description}</p>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-sm mb-2">Who is this guide for?</h3>
              <p className="text-sm text-muted-foreground">
                This guide is designed for <strong>{guide.difficulty}</strong> level users interested in <strong>{guide.niche}</strong>.
                {guide.difficulty === 'beginner' && ' No prior experience required.'}
                {guide.difficulty === 'intermediate' && ' Some basic knowledge recommended.'}
                {guide.difficulty === 'advanced' && ' Requires solid foundation in the topic.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {guide.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <span>Platform:</span> {guide.platform.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              <span>Last updated:</span> {new Date(guide.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion</span>
                  <span className="font-semibold">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Guide completed!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites & Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Prerequisites & Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Difficulty Level</h3>
              <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
                {guide.difficulty}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Estimated Time</h3>
              <p className="text-sm text-muted-foreground">{guide.readTime} minutes</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Quick Navigation</h3>
              <nav className="space-y-1">
                {guide.steps.map((_, index) => (
                  <a
                    key={index}
                    href={`#step-${index + 1}`}
                    className="block text-sm text-primary hover:underline"
                  >
                    Step {index + 1}: {guide.steps[index].substring(0, 50)}...
                  </a>
                ))}
              </nav>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              This comprehensive guide will walk you through {guide.title.toLowerCase()} step by step. 
              Whether you're a {guide.difficulty} looking to {guide.description.toLowerCase()}, 
              this guide provides everything you need to succeed.
            </p>
            <p className="text-muted-foreground">
              By the end of this guide, you'll have a solid understanding of the concepts and practical 
              experience implementing them. Each step builds on the previous one, so follow along in order 
              for the best learning experience.
            </p>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Step-by-Step Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-8">
              {guide.steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                return (
                  <li key={index} id={`step-${index + 1}`} className="scroll-mt-20">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => markStepComplete(index, guide.steps.length)}
                          className={cn(
                            'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors font-semibold',
                            isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-muted-foreground/30 hover:border-primary bg-background'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </button>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-semibold text-lg mb-2">Step {index + 1}</div>
                        <div className={cn('prose prose-base max-w-none', isCompleted && 'opacity-60')}>
                          <p className="text-muted-foreground leading-relaxed">{step}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        {/* Common Pitfalls & Solutions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common Pitfalls & Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Common Mistake: Skipping Steps</AlertTitle>
                <AlertDescription>
                  It's tempting to skip ahead, but each step builds on the previous one. 
                  Follow the guide in order for best results.
                </AlertDescription>
              </Alert>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tip: Take Your Time</AlertTitle>
                <AlertDescription>
                  Don't rush through the steps. Take time to understand each concept before moving to the next.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Advanced Tips & Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-base max-w-none">
            <p className="text-muted-foreground">
              Once you've mastered the basics, here are some advanced tips to optimize your results:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Experiment with different approaches to find what works best for your specific use case</li>
              <li>Join our community forums to share your experiences and learn from others</li>
              <li>Keep this guide bookmarked for future reference as you continue learning</li>
            </ul>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Resources & Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Further Reading</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <Link to="/guides" className="text-primary hover:underline">
                      Browse more {guide.niche} guides
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${guide.niche}`} className="text-primary hover:underline">
                      Explore {guide.niche} articles
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tools & Software</h3>
                <p className="text-sm text-muted-foreground">
                  Check out our <Link to="/guides?tab=tools" className="text-primary hover:underline">Tools section</Link> for 
                  recommended software and resources related to this guide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
