/**
 * TheGridNexus Personalized Onboarding Flow
 * Implements interest selection and personalized homepage feed
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Shield, Cpu, Gamepad2, Grid3X3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface UserInterests {
  tech: boolean;
  security: boolean;
  gaming: boolean;
  all: boolean;
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [interests, setInterests] = useState<UserInterests>({
    tech: false,
    security: false,
    gaming: false,
    all: false
  });
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 'interests',
      title: 'Choose Your Interests',
      description: 'Personalize your experience by selecting the topics that matter most to you.',
      component: InterestSelection
    },
    {
      id: 'security',
      title: 'Security Score Assessment',
      description: 'Get your personalized security posture assessment in 2 minutes.',
      component: SecurityAssessment
    },
    {
      id: 'newsletter',
      title: 'Stay Informed',
      description: 'Get weekly intelligence briefings delivered to your inbox.',
      component: NewsletterSignup
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      // Save preferences and redirect
      localStorage.setItem('userInterests', JSON.stringify(interests));
      localStorage.setItem('onboardingCompleted', 'true');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentComponent = steps[currentStep].component;

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-security-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-security-green" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to TheGridNexus</h2>
            <p className="text-muted-foreground mb-4">
              Your personalized intelligence feed is ready. Redirecting to your homepage...
            </p>
            <Progress value={100} className="mb-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-nexus-blue" />
              <span className="font-display font-bold">TheGridNexus</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Progress 
                value={((currentStep + 1) / steps.length) * 100} 
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h1>
            <p className="text-lg text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          {/* Step Component */}
          <div className="mb-8">
            <CurrentComponent 
              interests={interests}
              setInterests={setInterests}
              onNext={handleNext}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next Step'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interest Selection Component
function InterestSelection({ interests, setInterests }: any) {
  const interestOptions = [
    {
      id: 'tech',
      title: 'Technology',
      description: 'AI, hardware, software development, and innovation',
      icon: Cpu,
      color: 'text-nexus-blue',
      bgColor: 'bg-nexus-blue/10',
      borderColor: 'border-nexus-blue'
    },
    {
      id: 'security',
      title: 'Cybersecurity',
      description: 'Threats, vulnerabilities, breach analysis, and defense',
      icon: Shield,
      color: 'text-threat-red',
      bgColor: 'bg-threat-red/10',
      borderColor: 'border-threat-red'
    },
    {
      id: 'gaming',
      title: 'Gaming',
      description: 'Industry news, esports, hardware, and game security',
      icon: Gamepad2,
      color: 'text-gaming-purple',
      bgColor: 'bg-gaming-purple/10',
      borderColor: 'border-gaming-purple'
    }
  ];

  const handleInterestToggle = (interestId: keyof UserInterests) => {
    setInterests(prev => ({
      ...prev,
      [interestId]: !prev[interestId],
      all: false
    }));
  };

  const handleSelectAll = () => {
    setInterests({
      tech: true,
      security: true,
      gaming: true,
      all: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {interestOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = interests[option.id as keyof UserInterests];
          
          return (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? option.borderColor + ' border-2' : 'border-border'
              }`}
              onClick={() => handleInterestToggle(option.id as keyof UserInterests)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <h3 className="font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                  {isSelected && (
                    <Badge variant="secondary" className="mt-2">
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={handleSelectAll}
          className="mb-4"
        >
          Select All Interests
        </Button>
        <p className="text-sm text-muted-foreground">
          You can always change these preferences later in your profile settings.
        </p>
      </div>
    </div>
  );
}

// Security Assessment Component
function SecurityAssessment({ onNext }: any) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="w-16 h-16 bg-security-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-security-green" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Security Posture Assessment</h3>
          <p className="text-muted-foreground mb-6">
            Take our 15-question assessment to get your personalized security score 
            and actionable improvement steps.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>⏱️ 2 minutes</span>
              <span>•</span>
              <span>📊 Instant results</span>
              <span>•</span>
              <span>🎯 Actionable insights</span>
            </div>
            <Button onClick={() => setStarted(true)} className="w-full">
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <Badge variant="outline" className="mb-2">Coming Soon</Badge>
          <h3 className="text-xl font-semibold mb-2">Security Assessment Tool</h3>
          <p className="text-muted-foreground">
            Our comprehensive security assessment tool is currently in development. 
            You'll be able to access it from your dashboard once it's ready.
          </p>
        </div>
        <Button onClick={onNext} className="w-full">
          Continue to Newsletter Setup
        </Button>
      </CardContent>
    </Card>
  );
}

// Newsletter Signup Component
function NewsletterSignup({ onNext }: any) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setTimeout(() => onNext(), 1500);
  };

  if (subscribed) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="w-16 h-16 bg-nexus-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-nexus-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to Nexus Radar</h3>
          <p className="text-muted-foreground">
            You'll receive your first intelligence briefing this Friday at 07:00 UTC.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Nexus Radar Weekly Briefing</h3>
          <p className="text-muted-foreground">
            Get curated intelligence delivered every Friday. Critical insights you won't find elsewhere.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-blue"
            required
          />
          <div className="text-sm text-muted-foreground">
            <p>✅ CRITICAL: Must-know stories</p>
            <p>✅ SIGNAL: Underreported insights</p>
            <p>✅ NOISE: What hype got wrong</p>
          </div>
          <Button type="submit" className="w-full">
            Subscribe to Nexus Radar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </CardContent>
    </Card>
  );
}
