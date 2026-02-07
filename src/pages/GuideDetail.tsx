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
import { Clock, CheckCircle2, Circle, ArrowLeft, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
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
        title={`${guide.title} | Guides | The Grid Nexus`}
        description={guide.description}
        keywords={[guide.niche, guide.difficulty, 'guide', 'tutorial']}
        url={window.location.href}
        type="article"
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
          <p className="text-lg text-muted-foreground mb-6">{guide.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {guide.readTime} min read
            </span>
            <span>{guide.platform.join(', ')}</span>
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

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step-by-Step Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-6">
              {guide.steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                return (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => markStepComplete(index, guide.steps.length)}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors',
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-muted-foreground/30 hover:border-primary'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-semibold mb-1">Step {index + 1}</div>
                      <p className={cn('text-muted-foreground', isCompleted && 'line-through opacity-60')}>
                        {step}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
