import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/lazy-image';

interface StrategyGuideStep {
  id: string;
  title: string;
  description: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  prerequisites?: string[];
}

interface StrategyGuideProps {
  gameTitle: string;
  guideTitle: string;
  description: string;
  category: 'walkthrough' | 'build' | 'trophy' | 'multiplayer' | 'beginner';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: StrategyGuideStep[];
  imageUrl?: string;
  className?: string;
}

/**
 * GameSpot-style strategy guide component
 * Features: Step-by-step walkthroughs, build guides, trophy hunting, difficulty ratings
 */
export function StrategyGuide({
  gameTitle,
  guideTitle,
  description,
  category,
  difficulty,
  estimatedTime,
  steps,
  imageUrl,
  className
}: StrategyGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  const categoryConfig = {
    walkthrough: { label: 'Walkthrough', icon: BookOpen, color: 'text-blue-500' },
    build: { label: 'Build Guide', icon: Target, color: 'text-purple-500' },
    trophy: { label: 'Trophy Guide', icon: Trophy, color: 'text-yellow-500' },
    multiplayer: { label: 'Multiplayer', icon: ExternalLink, color: 'text-green-500' },
    beginner: { label: 'Beginner Guide', icon: BookOpen, color: 'text-green-500' }
  };

  const difficultyConfig = {
    beginner: { label: 'Beginner', color: 'bg-green-500/10 text-green-500' },
    intermediate: { label: 'Intermediate', color: 'bg-yellow-500/10 text-yellow-500' },
    advanced: { label: 'Advanced', color: 'bg-red-500/10 text-red-500' }
  };

  const categoryInfo = categoryConfig[category];
  const difficultyInfo = difficultyConfig[difficulty];

  const toggleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const progress = (completedSteps.size / steps.length) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="overflow-hidden">
        {imageUrl && (
          <div className="relative h-64 bg-gradient-to-br from-gray-900 to-gray-800">
            <LazyImage
              src={imageUrl}
              alt={gameTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{gameTitle}</Badge>
            <Badge className={categoryInfo.color.replace('text-', 'bg-') + '/10 ' + categoryInfo.color}>
              <categoryInfo.icon className="h-3 w-3 mr-1" />
              {categoryInfo.label}
            </Badge>
            <Badge className={difficultyInfo.color}>
              {difficultyInfo.label}
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">{guideTitle}</CardTitle>
          <p className="text-lg text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{steps.length} steps</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Progress</div>
            <div className="text-sm text-muted-foreground">
              {completedSteps.size} / {steps.length} completed
            </div>
          </div>
          <Progress value={progress} className="h-3 mb-4" />
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = idx === currentStep;
          
          return (
            <Card
              key={step.id}
              className={cn(
                'transition-all',
                isCurrent && 'ring-2 ring-primary',
                isCompleted && 'bg-green-500/5 border-green-500/20'
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      
                      {step.tips.length > 0 && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="font-semibold text-sm mb-2">Tips:</div>
                          <ul className="space-y-1 text-sm">
                            {step.tips.map((tip, tipIdx) => (
                              <li key={tipIdx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{step.estimatedTime} min</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {step.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={isCompleted ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => toggleStepComplete(step.id)}
                    className="ml-4"
                  >
                    <CheckCircle2 className={cn(
                      'h-5 w-5',
                      isCompleted && 'fill-current'
                    )} />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous Step
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex-1"
        >
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

