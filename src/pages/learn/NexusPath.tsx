/**
 * Nexus Path - AI-Powered Personalized Learning Paths
 * 
 * Users declare a learning goal. The AI generates a structured, week-by-week
 * curriculum using TheGridNexus articles as the primary source.
 * Users track progress, earn XP, and get weekly email nudges.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  Trophy,
  Target,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

// Pre-defined learning goals
const curatedGoals = [
  {
    id: 'soc-analyst',
    title: 'Become a SOC Analyst',
    category: 'cybersecurity',
    description: 'Learn the skills needed for Security Operations Center roles',
    icon: '🛡️',
  },
  {
    id: 'ai-engineer',
    title: 'AI/ML Engineer',
    category: 'ai_ml',
    description: 'Master machine learning and AI development',
    icon: '🤖',
  },
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker',
    category: 'cybersecurity',
    description: 'Learn penetration testing and ethical hacking',
    icon: '🔓',
  },
  {
    id: 'gaming-performance',
    title: 'Gaming Performance Optimization',
    category: 'gaming',
    description: 'Optimize gaming PCs and understand hardware',
    icon: '🎮',
  },
  {
    id: 'llm-developer',
    title: 'LLM Developer',
    category: 'ai_ml',
    description: 'Build applications with Large Language Models',
    icon: '💬',
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Specialist',
    category: 'cybersecurity',
    description: 'Secure cloud infrastructure and applications',
    icon: '☁️',
  },
];

const skillLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to the topic' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Looking to master' },
];

const timeOptions = [
  { value: '5', label: '5 hours/week' },
  { value: '10', label: '10 hours/week' },
  { value: '15', label: '15 hours/week' },
  { value: '20', label: '20+ hours/week' },
];

interface Milestone {
  week: number;
  title: string;
  description: string;
  articles: string[];
  externalResources: Array<{ title: string; url: string; type: string }>;
  exercise?: string;
  xpReward: number;
}

interface LearningPath {
  goal: string;
  goalCategory: string;
  skillLevel: string;
  hoursPerWeek: number;
  totalWeeks: number;
  milestones: Milestone[];
  totalXP: number;
}

interface UserProgress {
  completedMilestones: number[];
  completedArticles: string[];
  totalXPEarned: number;
  startedAt: number;
  lastActivityAt: number;
}

type Step = 'goal' | 'details' | 'generating' | 'path' | 'progress';

export default function NexusPathPage() {
  const [currentStep, setCurrentStep] = useState<Step>('goal');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [customGoal, setCustomGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [hoursPerWeek, setHoursPerWeek] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('nexusPathProgress');
    const savedPath = localStorage.getItem('nexusPath');
    if (savedProgress && savedPath) {
      try {
        setProgress(JSON.parse(savedProgress));
        setLearningPath(JSON.parse(savedPath));
        setCurrentStep('progress');
      } catch {
        // ignore
      }
    }
  }, []);

  const handleGenerate = async () => {
    setCurrentStep('generating');
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const goal = selectedGoal || customGoal;
    const hours = parseInt(hoursPerWeek);

    // Calculate weeks based on skill level and hours
    const baseWeeks = skillLevel === 'beginner' ? 8 : skillLevel === 'intermediate' ? 6 : 4;
    const totalWeeks = hours < 5 ? baseWeeks + 2 : hours > 15 ? Math.max(baseWeeks - 2, 2) : baseWeeks;

    // Generate mock path
    const mockPath: LearningPath = {
      goal,
      goalCategory: selectedGoal ? curatedGoals.find((g) => g.id === selectedGoal)?.category || 'general_tech' : 'general_tech',
      skillLevel,
      hoursPerWeek: hours,
      totalWeeks,
      milestones: Array.from({ length: totalWeeks }, (_, i) => ({
        week: i + 1,
        title: `Week ${i + 1}: ${getWeekTitle(goal, i)}`,
        description: getWeekDescription(goal, i),
        articles: [
          `Article ${i * 2 + 1}: Introduction to ${goal}`,
          `Article ${i * 2 + 2}: Advanced ${goal} Concepts`,
        ],
        externalResources: [
          { title: `Resource ${i + 1}`, url: '#', type: 'documentation' },
        ],
        exercise: `Complete the ${goal} exercise for week ${i + 1}`,
        xpReward: 100 + i * 25,
      })),
      totalXP: 0,
    };

    mockPath.totalXP = mockPath.milestones.reduce((sum, m) => sum + m.xpReward, 0);

    setLearningPath(mockPath);
    setProgress({
      completedMilestones: [],
      completedArticles: [],
      totalXPEarned: 0,
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
    });

    localStorage.setItem('nexusPath', JSON.stringify(mockPath));
    localStorage.setItem('nexusPathProgress', JSON.stringify({
      completedMilestones: [],
      completedArticles: [],
      totalXPEarned: 0,
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
    }));

    setIsGenerating(false);
    setCurrentStep('path');
  };

  const completeMilestone = (week: number) => {
    if (!learningPath || !progress) return;

    const milestone = learningPath.milestones.find((m) => m.week === week);
    if (!milestone) return;

    if (progress.completedMilestones.includes(week)) return;

    const updatedProgress = {
      ...progress,
      completedMilestones: [...progress.completedMilestones, week],
      totalXPEarned: progress.totalXPEarned + milestone.xpReward,
      lastActivityAt: Date.now(),
    };

    setProgress(updatedProgress);
    localStorage.setItem('nexusPathProgress', JSON.stringify(updatedProgress));
  };

  const resetPath = () => {
    localStorage.removeItem('nexusPath');
    localStorage.removeItem('nexusPathProgress');
    setLearningPath(null);
    setProgress(null);
    setCurrentStep('goal');
    setSelectedGoal('');
    setCustomGoal('');
  };

  const getWeekTitle = (goal: string, index: number) => {
    const titles = [
      'Foundations & Core Concepts',
      'Essential Tools & Setup',
      'Hands-on Practice',
      'Advanced Techniques',
      'Real-world Applications',
      'Security Best Practices',
      'Performance Optimization',
      'Capstone Project',
    ];
    return titles[index % titles.length];
  };

  const getWeekDescription = (goal: string, index: number) => {
    const descriptions = [
      `Start with the fundamentals of ${goal}. Learn key concepts and terminology.`,
      'Set up your development environment and essential tools.',
      'Apply your knowledge through guided exercises.',
      'Dive deeper into advanced topics and techniques.',
      'Work on real-world scenarios and case studies.',
      'Learn security considerations and best practices.',
      'Optimize your workflows and improve efficiency.',
      'Complete a capstone project to demonstrate your skills.',
    ];
    return descriptions[index % descriptions.length];
  };

  const getProgressPercentage = () => {
    if (!learningPath || !progress) return 0;
    return (progress.completedMilestones.length / learningPath.totalWeeks) * 100;
  };

  const getNextWeek = () => {
    if (!learningPath || !progress) return 1;
    const nextWeek = progress.completedMilestones.length + 1;
    return Math.min(nextWeek, learningPath.totalWeeks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Helmet>
        <title>Nexus Path - AI-Powered Learning Paths | The Grid Nexus</title>
        <meta
          name="description"
          content="Create personalized learning paths powered by AI. Track progress, earn XP, and master AI, cybersecurity, and gaming topics with curated content from TheGridNexus."
        />
        <meta
          name="keywords"
          content="learning path, AI learning, cybersecurity training, gaming optimization guide, personalized curriculum"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Nexus Path Learning Paths',
            description: 'AI-powered personalized learning paths for tech topics',
            educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
            timeRequired: 'P4W-P8W',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Nexus Path</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Learning Paths</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get a personalized curriculum tailored to your goals. Our AI curates the best content
            from TheGridNexus and creates a structured learning journey just for you.
          </p>
        </div>

        {/* Progress Overview */}
        {learningPath && progress && currentStep === 'path' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{learningPath.goal}</h3>
                  <p className="text-sm text-muted-foreground">
                    Week {getNextWeek()} of {learningPath.totalWeeks}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold">{progress.totalXPEarned} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    of {learningPath.totalXP} total
                  </p>
                </div>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{progress.completedMilestones.length} weeks completed</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 'goal' && 'What do you want to learn?'}
              {currentStep === 'details' && 'Tell us about your experience'}
              {currentStep === 'generating' && 'Generating Your Learning Path...'}
              {currentStep === 'path' && 'Your Learning Path'}
            </CardTitle>
            {currentStep === 'goal' && (
              <CardDescription>
                Choose from our curated goals or enter your own
              </CardDescription>
            )}
            {currentStep === 'details' && (
              <CardDescription>
                This helps us create the perfect curriculum for you
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {/* Goal Selection */}
            {currentStep === 'goal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {curatedGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={cn(
                        'p-4 rounded-lg border text-left transition-all',
                        selectedGoal === goal.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                          : 'hover:border-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <div>
                          <h4 className="font-semibold">{goal.title}</h4>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                      Or enter your own goal
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-goal">Custom Learning Goal</Label>
                  <Input
                    id="custom-goal"
                    placeholder="e.g., Learn Kubernetes security"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                  />
                </div>

                <Button
                  onClick={() => setCurrentStep('details')}
                  disabled={!selectedGoal && !customGoal.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Details */}
            {currentStep === 'details' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Current Skill Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {skillLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setSkillLevel(level.value)}
                        className={cn(
                          'p-3 rounded-lg border text-center transition-all',
                          skillLevel === level.value
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                            : 'hover:border-gray-300'
                        )}
                      >
                        <div className="font-semibold">{level.label}</div>
                        <div className="text-xs text-muted-foreground">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time Available Per Week</Label>
                  <Select value={hoursPerWeek} onValueChange={setHoursPerWeek}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('goal')}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                  >
                    Generate Path
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Generating */}
            {currentStep === 'generating' && (
              <div className="text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse" />
                  <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <Target className="h-10 w-10 text-purple-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Creating Your Path</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI is analyzing your goals and curating the best content...
                </p>
                <div className="max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Analyzing learning objectives...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Curating relevant articles...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Structuring your curriculum...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Path */}
            {currentStep === 'path' && learningPath && progress && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{learningPath.goal}</h3>
                    <p className="text-sm text-muted-foreground">
                      {learningPath.totalWeeks}-week curriculum • {learningPath.skillLevel} level
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetPath}>
                    New Path
                  </Button>
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  {learningPath.milestones.map((milestone, index) => {
                    const isCompleted = progress.completedMilestones.includes(milestone.week);
                    const isNext = milestone.week === getNextWeek();
                    const isLocked = milestone.week > getNextWeek();

                    return (
                      <Card
                        key={milestone.week}
                        className={cn(
                          isCompleted && 'border-green-200 bg-green-50/50 dark:bg-green-950/10',
                          isNext && 'border-purple-200 bg-purple-50/50 dark:bg-purple-950/10',
                          isLocked && 'opacity-50'
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-8 w-8 text-green-500" />
                              ) : isLocked ? (
                                <Lock className="h-8 w-8 text-gray-400" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                  {milestone.week}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{milestone.title}</h4>
                                {isNext && (
                                  <Badge variant="secondary" className="text-xs">
                                    Next
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {milestone.description}
                              </p>

                              {/* Articles */}
                              <div className="space-y-2 mb-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Articles:
                                </p>
                                {milestone.articles.map((article, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <BookOpen className="h-4 w-4 text-purple-500" />
                                    <span>{article}</span>
                                  </div>
                                ))}
                              </div>

                              {/* External Resources */}
                              {milestone.externalResources.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  <p className="text-xs font-medium text-muted-foreground">
                                    Resources:
                                  </p>
                                  {milestone.externalResources.map((resource, i) => (
                                    <a
                                      key={i}
                                      href={resource.url}
                                      className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      {resource.title}
                                    </a>
                                  ))}
                                </div>
                              )}

                              {/* Exercise */}
                              {milestone.exercise && (
                                <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                  <p className="text-xs font-medium mb-1">Exercise:</p>
                                  <p className="text-sm text-muted-foreground">
                                    {milestone.exercise}
                                  </p>
                                </div>
                              )}

                              {/* Complete Button */}
                              {!isCompleted && !isLocked && (
                                <Button
                                  size="sm"
                                  onClick={() => completeMilestone(milestone.week)}
                                  className="bg-gradient-to-r from-purple-500 to-cyan-500"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete (+{milestone.xpReward} XP)
                                </Button>
                              )}

                              {isCompleted && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                  <CheckCircle className="h-4 w-4" />
                                  Completed • +{milestone.xpReward} XP earned
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}