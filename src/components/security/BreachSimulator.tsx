import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Play, RotateCcw, Eye, Lock, Database, Wifi, Globe, Users, FileText, TrendingUp, Clock, DollarSign, Activity } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface BreachScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'phishing' | 'malware' | 'network' | 'data' | 'social';
  icon: React.ComponentType<{ className?: string }>;
  estimatedTime: number;
  learningObjectives: string[];
  scenario: BreachStep[];
}

interface BreachStep {
  id: string;
  title: string;
  description: string;
  type: 'choice' | 'action' | 'analysis';
  options?: {
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
    impact: {
      risk: number;
      cost: number;
      time: number;
    };
  }[];
  analysis?: {
    metrics: {
      risk: number;
      cost: number;
      time: number;
    };
    insights: string[];
  };
}

const breachScenarios: BreachScenario[] = [
  {
    id: 'phishing_email',
    title: 'Sophisticated Phishing Attack',
    description: 'Detect and respond to a targeted phishing campaign against your organization',
    difficulty: 'beginner',
    category: 'phishing',
    icon: FileText,
    estimatedTime: 10,
    learningObjectives: [
      'Identify phishing indicators',
      'Understand social engineering tactics',
      'Learn proper incident response'
    ],
    scenario: [
      {
        id: 'email_received',
        title: 'Suspicious Email Received',
        description: 'You receive an urgent email from "IT Support" asking you to update your password due to "security maintenance". The email contains a link and mentions your account will be suspended in 2 hours if not updated.',
        type: 'choice',
        options: [
          {
            id: 'click_link',
            text: 'Click the link immediately to update password',
            correct: false,
            feedback: 'This is a classic phishing tactic. Always verify the sender and check the actual URL before clicking.',
            impact: { risk: 80, cost: 50000, time: 24 }
          },
          {
            id: 'verify_sender',
            text: 'Verify the sender\'s email address and hover over the link',
            correct: true,
            feedback: 'Excellent! You notice the email address is from it-support@company-security.co (not your real domain) and the link leads to a suspicious site.',
            impact: { risk: 10, cost: 100, time: 0.5 }
          },
          {
            id: 'ignore_email',
            text: 'Ignore the email completely',
            correct: false,
            feedback: 'Ignoring suspicious emails isn\'t enough. You should report them to your security team.',
            impact: { risk: 40, cost: 5000, time: 2 }
          }
        ]
      },
      {
        id: 'incident_response',
        title: 'Incident Response',
        description: 'After identifying the phishing attempt, what\'s your next step?',
        type: 'choice',
        options: [
          {
            id: 'delete_email',
            text: 'Delete the email and move on',
            correct: false,
            feedback: 'Deleting doesn\'t protect others who might receive the same email.',
            impact: { risk: 30, cost: 2000, time: 1 }
          },
          {
            id: 'report_it',
            text: 'Report to IT security team and forward the email',
            correct: true,
            feedback: 'Perfect! Reporting helps protect the entire organization and allows security teams to block similar attacks.',
            impact: { risk: 5, cost: 50, time: 0.25 }
          },
          {
            id: 'warn_colleagues',
            text: 'Send warning to all colleagues',
            correct: false,
            feedback: 'While well-intentioned, this could cause panic. Follow official reporting channels.',
            impact: { risk: 20, cost: 1000, time: 1 }
          }
        ]
      }
    ]
  },
  {
    id: 'ransomware_attack',
    title: 'Ransomware Outbreak',
    description: 'Contain and respond to a ransomware attack spreading through your network',
    difficulty: 'advanced',
    category: 'malware',
    icon: Lock,
    estimatedTime: 15,
    learningObjectives: [
      'Contain malware outbreaks',
      'Implement incident isolation',
      'Coordinate recovery efforts'
    ],
    scenario: [
      {
        id: 'initial_detection',
        title: 'Ransomware Detected',
        description: 'Multiple users report encrypted files with .LOCKED extension and ransom notes demanding Bitcoin. The attack appears to be spreading through network shares.',
        type: 'choice',
        options: [
          {
            id: 'pay_ransom',
            text: 'Pay the ransom immediately to restore files',
            correct: false,
            feedback: 'Never pay ransoms! There\'s no guarantee you\'ll get files back, and it encourages more attacks.',
            impact: { risk: 95, cost: 500000, time: 72 }
          },
          {
            id: 'isolate_network',
            text: 'Immediately isolate affected systems from the network',
            correct: true,
            feedback: 'Critical first step! Isolation prevents the ransomware from spreading to more systems.',
            impact: { risk: 40, cost: 10000, time: 2 }
          },
          {
            id: 'shutdown_everything',
            text: 'Shut down all servers and workloads',
            correct: false,
            feedback: 'Complete shutdown may impact business continuity more than necessary. Targeted isolation is better.',
            impact: { risk: 60, cost: 50000, time: 8 }
          }
        ]
      },
      {
        id: 'recovery_strategy',
        title: 'Recovery Planning',
        description: 'Systems are isolated. What\'s your recovery approach?',
        type: 'choice',
        options: [
          {
            id: 'restore_from_backup',
            text: 'Restore from clean backups after scanning',
            correct: true,
            feedback: 'Best practice! Ensure backups are clean before restoration to avoid reinfection.',
            impact: { risk: 15, cost: 5000, time: 12 }
          },
          {
            id: 'decrypt_files',
            text: 'Use decryption tools from security vendors',
            correct: false,
            feedback: 'Decryption tools may not work for all ransomware variants and could be time-consuming.',
            impact: { risk: 50, cost: 25000, time: 48 }
          },
          {
            id: 'rebuild_systems',
            text: 'Rebuild all systems from scratch',
            correct: false,
            feedback: 'While secure, this is extremely time-consuming and costly. Try backup recovery first.',
            impact: { risk: 10, cost: 100000, time: 168 }
          }
        ]
      }
    ]
  },
  {
    id: 'data_breach',
    title: 'Customer Data Breach',
    description: 'Handle a data breach involving customer personal information',
    difficulty: 'intermediate',
    category: 'data',
    icon: Database,
    estimatedTime: 12,
    learningObjectives: [
      'Assess breach scope',
      'Understand compliance requirements',
      'Coordinate notification process'
    ],
    scenario: [
      {
        id: 'breach_assessment',
        title: 'Breach Discovery',
        description: 'Your security team detects unauthorized access to customer database containing PII. The breach occurred 3 days ago and affected approximately 10,000 customers.',
        type: 'choice',
        options: [
          {
            id: 'hide_breach',
            text: 'Keep it quiet to avoid reputation damage',
            correct: false,
            feedback: 'This is illegal and unethical. Most regulations require timely disclosure.',
            impact: { risk: 100, cost: 1000000, time: 72 }
          },
          {
            id: 'assess_first',
            text: 'Conduct thorough assessment before notifying',
            correct: true,
            feedback: 'Correct! You need to understand the full scope before proper notification.',
            impact: { risk: 30, cost: 50000, time: 24 }
          },
          {
            id: 'immediate_notification',
            text: 'Notify everyone immediately without full details',
            correct: false,
            feedback: 'Premature notification without accurate information can cause more harm.',
            impact: { risk: 60, cost: 200000, time: 12 }
          }
        ]
      }
    ]
  }
];

const categoryConfig = {
  phishing: { icon: FileText, color: 'text-news-orange', bgColor: 'bg-news-orange/10' },
  malware: { icon: Lock, color: 'text-security-red', bgColor: 'bg-security-red/10' },
  network: { icon: Wifi, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  data: { icon: Database, color: 'text-tech-green', bgColor: 'bg-tech-green/10' },
  social: { icon: Users, color: 'text-gaming-purple', bgColor: 'bg-gaming-purple/10' }
};

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-tech-green' },
  intermediate: { label: 'Intermediate', color: 'text-news-orange' },
  advanced: { label: 'Advanced', color: 'text-security-red' }
};

export function BreachSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<BreachScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [totalImpact, setTotalImpact] = useState({ risk: 0, cost: 0, time: 0 });

  const startScenario = (scenario: BreachScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setChoices({});
    setIsRunning(true);
    setShowResults(false);
    setTotalImpact({ risk: 0, cost: 0, time: 0 });
  };

  const makeChoice = (stepId: string, optionId: string) => {
    setChoices(prev => ({ ...prev, [stepId]: optionId }));
    
    if (selectedScenario) {
      const step = selectedScenario.scenario.find(s => s.id === stepId);
      const option = step?.options?.find(o => o.id === optionId);
      
      if (option) {
        setTotalImpact(prev => ({
          risk: prev.risk + option.impact.risk,
          cost: prev.cost + option.impact.cost,
          time: prev.time + option.impact.time
        }));
      }
    }
  };

  const nextStep = () => {
    if (selectedScenario && currentStep < selectedScenario.scenario.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetSimulator = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setChoices({});
    setIsRunning(false);
    setShowResults(false);
    setTotalImpact({ risk: 0, cost: 0, time: 0 });
  };

  const getScoreColor = (value: number, type: 'risk' | 'cost' | 'time') => {
    const thresholds = {
      risk: [30, 60],
      cost: [10000, 50000],
      time: [12, 48]
    };
    
    const [low, high] = thresholds[type];
    
    if (value <= low) return 'text-tech-green';
    if (value <= high) return 'text-news-orange';
    return 'text-security-red';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 24) return `${hours} hours`;
    return `${Math.round(hours / 24)} days`;
  };

  if (showResults && selectedScenario) {
    return (
      <GlassCard className="p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-nexus-cyan to-blue-500 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-text-primary mb-2">Simulation Complete!</h2>
          <p className="text-text-secondary">
            Here's how your decisions impacted the breach outcome
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 rounded-lg glass-subtle">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-security-red/10 mb-3 mx-auto">
              <AlertTriangle className="w-6 h-6 text-security-red" />
            </div>
            <div className={cn('text-2xl font-bold mb-1', getScoreColor(totalImpact.risk, 'risk'))}>
              {totalImpact.risk}%
            </div>
            <div className="text-sm text-text-secondary">Risk Level</div>
          </div>
          
          <div className="text-center p-6 rounded-lg glass-subtle">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-news-orange/10 mb-3 mx-auto">
              <DollarSign className="w-6 h-6 text-news-orange" />
            </div>
            <div className={cn('text-2xl font-bold mb-1', getScoreColor(totalImpact.cost, 'cost'))}>
              {formatCurrency(totalImpact.cost)}
            </div>
            <div className="text-sm text-text-secondary">Total Cost</div>
          </div>
          
          <div className="text-center p-6 rounded-lg glass-subtle">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-400/10 mb-3 mx-auto">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div className={cn('text-2xl font-bold mb-1', getScoreColor(totalImpact.time, 'time'))}>
              {formatTime(totalImpact.time)}
            </div>
            <div className="text-sm text-text-secondary">Recovery Time</div>
          </div>
        </div>

        {/* Decision Review */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Your Decisions</h3>
          <div className="space-y-4">
            {selectedScenario.scenario.map((step, index) => {
              const choice = choices[step.id];
              const option = step.options?.find(o => o.id === choice);
              
              return (
                <div key={step.id} className="p-4 rounded-lg glass-subtle">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nexus-cyan/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-nexus-cyan">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary mb-2">{step.title}</h4>
                      {option && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              option.correct ? 'bg-tech-green' : 'bg-security-red'
                            )} />
                            <span className="text-sm text-text-secondary">{option.text}</span>
                          </div>
                          <p className="text-sm text-text-tertiary italic">{option.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Key Takeaways</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedScenario.learningObjectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-nexus-cyan mt-0.5 flex-shrink-0" />
                <span className="text-sm text-text-secondary">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetSimulator}
            className="flex items-center gap-2 px-6 py-3 bg-nexus-cyan text-white rounded-lg hover:bg-nexus-cyan/90 transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Try Another Scenario
          </button>
        </div>
      </GlassCard>
    );
  }

  if (isRunning && selectedScenario) {
    const step = selectedScenario.scenario[currentStep];
    const choice = choices[step.id];
    
    return (
      <GlassCard className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <selectedScenario.icon className="w-6 h-6 text-nexus-cyan" />
              <h2 className="text-2xl font-bold text-text-primary">{selectedScenario.title}</h2>
            </div>
            <button
              onClick={resetSimulator}
              className="p-2 rounded-lg glass-subtle hover:glass transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4">
            <span>Step {currentStep + 1} of {selectedScenario.scenario.length}</span>
            <span>•</span>
            <span>{selectedScenario.estimatedTime} min estimated</span>
            <span>•</span>
            <span className={difficultyConfig[selectedScenario.difficulty].color}>
              {difficultyConfig[selectedScenario.difficulty].label}
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nexus-cyan to-blue-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / selectedScenario.scenario.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">{step.title}</h3>
          <p className="text-text-secondary mb-6">{step.description}</p>
          
          {step.type === 'choice' && (
            <div className="space-y-4">
              {step.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => makeChoice(step.id, option.id)}
                  disabled={choice !== undefined}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all duration-200',
                    choice === option.id
                      ? option.correct
                        ? 'border-tech-green bg-tech-green/10 text-tech-green'
                        : 'border-security-red bg-security-red/10 text-security-red'
                      : choice !== undefined
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-border-primary hover:border-nexus-cyan'
                  )}
                >
                  <div className="font-medium mb-2">{option.text}</div>
                  
                  {choice === option.id && (
                    <div className="text-sm mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        {option.correct ? (
                          <TrendingUp className="w-4 h-4 text-tech-green" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-security-red" />
                        )}
                        <span className="font-medium">
                          {option.correct ? 'Good choice!' : 'Not optimal'}
                        </span>
                      </div>
                      <p className="text-text-tertiary">{option.feedback}</p>
                      
                      {/* Impact Preview */}
                      <div className="mt-3 pt-3 border-t border-border-primary">
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-text-tertiary">Risk: </span>
                            <span className={getScoreColor(option.impact.risk, 'risk')}>
                              {option.impact.risk}%
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Cost: </span>
                            <span className={getScoreColor(option.impact.cost, 'cost')}>
                              {formatCurrency(option.impact.cost)}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Time: </span>
                            <span className={getScoreColor(option.impact.time, 'time')}>
                              {formatTime(option.impact.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={nextStep}
            disabled={choice === undefined}
            className={cn(
              'px-6 py-3 rounded-lg transition-all duration-200',
              choice === undefined
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-nexus-cyan text-white hover:bg-nexus-cyan/90'
            )}
          >
            {currentStep < selectedScenario.scenario.length - 1 ? 'Next Step' : 'View Results'}
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-security-red to-orange-500 mb-4">
          <Shield className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-text-primary mb-2">Breach Simulator</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Experience realistic cybersecurity scenarios in a safe environment. 
          Learn to make critical decisions during security incidents.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breachScenarios.map((scenario) => {
          const config = categoryConfig[scenario.category];
          const Icon = scenario.icon;
          
          return (
            <GlassCard
              key={scenario.id}
              hover
              className="p-6 cursor-pointer group"
              onClick={() => startScenario(scenario)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={cn('p-3 rounded-lg', config.bgColor)}>
                  <Icon className={cn('w-6 h-6', config.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-text-primary group-hover:text-nexus-cyan transition-colors">
                      {scenario.title}
                    </h3>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      difficultyConfig[scenario.difficulty].color,
                      'bg-current/10'
                    )}>
                      {difficultyConfig[scenario.difficulty].label}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{scenario.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-text-tertiary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{scenario.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{scenario.scenario.length} steps</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 bg-nexus-cyan text-white rounded-lg hover:bg-nexus-cyan/90 transition-colors duration-200 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Scenario
              </button>
            </GlassCard>
          );
        })}
      </div>

      {/* Learning Objectives */}
      <div className="mt-12 p-6 rounded-lg glass-subtle">
        <h3 className="text-lg font-semibold text-text-primary mb-4">What You'll Learn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-nexus-cyan mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-text-primary mb-1">Threat Detection</div>
              <div className="text-sm text-text-secondary">Identify attack patterns and indicators</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-nexus-cyan mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-text-primary mb-1">Incident Response</div>
              <div className="text-sm text-text-secondary">Execute proper response procedures</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-nexus-cyan mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-text-primary mb-1">Risk Assessment</div>
              <div className="text-sm text-text-secondary">Evaluate impact and consequences</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-nexus-cyan mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-text-primary mb-1">Compliance</div>
              <div className="text-sm text-text-secondary">Understand regulatory requirements</div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
