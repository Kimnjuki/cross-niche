import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, TrendingUp, Lock, Eye, Database, Wifi, ChevronRight, Calculator, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface SecurityCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  weight: number;
  questions: SecurityQuestion[];
}

interface SecurityQuestion {
  id: string;
  question: string;
  type: 'boolean' | 'scale' | 'multiple';
  options?: { value: string; label: string; points: number }[];
  weight: number;
}

const securityCategories: SecurityCategory[] = [
  {
    id: 'authentication',
    name: 'Authentication & Access',
    icon: Lock,
    weight: 25,
    questions: [
      {
        id: 'mfa',
        question: 'Do you use multi-factor authentication (MFA)?',
        type: 'boolean',
        weight: 30
      },
      {
        id: 'password_policy',
        question: 'How strong is your password policy?',
        type: 'multiple',
        options: [
          { value: 'weak', label: 'Basic (8+ chars)', points: 20 },
          { value: 'medium', label: 'Strong (12+ chars, symbols)', points: 60 },
          { value: 'strong', label: 'Very Strong (16+ chars, rotation)', points: 100 }
        ],
        weight: 40
      },
      {
        id: 'access_control',
        question: 'How is access controlled?',
        type: 'multiple',
        options: [
          { value: 'basic', label: 'Role-based access', points: 40 },
          { value: 'advanced', label: 'Zero-trust architecture', points: 80 },
          { value: 'enterprise', label: 'Zero-trust + continuous monitoring', points: 100 }
        ],
        weight: 30
      }
    ]
  },
  {
    id: 'data_protection',
    name: 'Data Protection',
    icon: Database,
    weight: 25,
    questions: [
      {
        id: 'encryption',
        question: 'Is data encrypted at rest and in transit?',
        type: 'boolean',
        weight: 35
      },
      {
        id: 'backup',
        question: 'How often are backups performed?',
        type: 'multiple',
        options: [
          { value: 'weekly', label: 'Weekly', points: 30 },
          { value: 'daily', label: 'Daily', points: 60 },
          { value: 'realtime', label: 'Real-time/Continuous', points: 100 }
        ],
        weight: 35
      },
      {
        id: 'data_classification',
        question: 'Do you classify sensitive data?',
        type: 'boolean',
        weight: 30
      }
    ]
  },
  {
    id: 'network_security',
    name: 'Network Security',
    icon: Wifi,
    weight: 25,
    questions: [
      {
        id: 'firewall',
        question: 'Do you have a properly configured firewall?',
        type: 'boolean',
        weight: 30
      },
      {
        id: 'monitoring',
        question: 'How extensive is your network monitoring?',
        type: 'multiple',
        options: [
          { value: 'basic', label: 'Basic logging', points: 30 },
          { value: 'advanced', label: 'SIEM implementation', points: 70 },
          { value: 'enterprise', label: 'AI-powered threat detection', points: 100 }
        ],
        weight: 40
      },
      {
        id: 'vpn',
        question: 'Is remote access secured with VPN?',
        type: 'boolean',
        weight: 30
      }
    ]
  },
  {
    id: 'visibility',
    name: 'Threat Visibility',
    icon: Eye,
    weight: 25,
    questions: [
      {
        id: 'vulnerability_scanning',
        question: 'How often do you scan for vulnerabilities?',
        type: 'multiple',
        options: [
          { value: 'monthly', label: 'Monthly', points: 40 },
          { value: 'weekly', label: 'Weekly', points: 70 },
          { value: 'daily', label: 'Daily/Continuous', points: 100 }
        ],
        weight: 35
      },
      {
        id: 'incident_response',
        question: 'Do you have an incident response plan?',
        type: 'boolean',
        weight: 35
      },
      {
        id: 'security_awareness',
        question: 'How often is security training conducted?',
        type: 'multiple',
        options: [
          { value: 'annually', label: 'Annually', points: 30 },
          { value: 'quarterly', label: 'Quarterly', points: 60 },
          { value: 'monthly', label: 'Monthly + phishing simulations', points: 100 }
        ],
        weight: 30
      }
    ]
  }
];

export function SecurityScoreCalculator() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      let totalScore = 0;
      let maxScore = 0;

      securityCategories.forEach(category => {
        const categoryWeight = category.weight / 100;
        
        category.questions.forEach(question => {
          const questionWeight = question.weight / 100;
          const questionKey = `${category.id}_${question.id}`;
          const answer = answers[questionKey];
          
          maxScore += categoryWeight * questionWeight * 100;
          
          if (answer !== undefined) {
            if (question.type === 'boolean') {
              totalScore += answer ? categoryWeight * questionWeight * 100 : 0;
            } else if (question.type === 'multiple' && answer.points) {
              totalScore += categoryWeight * questionWeight * answer.points;
            }
          }
        });
      });

      const finalScore = Math.round((totalScore / maxScore) * 100);
      setScore(finalScore);
      setIsCalculating(false);
      setShowResults(true);
    }, 2000);
  };

  const handleAnswer = (questionKey: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionKey]: answer }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tech-green';
    if (score >= 60) return 'text-news-orange';
    return 'text-security-red';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Your security posture is strong and well-maintained.';
    if (score >= 60) return 'Good foundation, but some areas need attention.';
    if (score >= 40) return 'Significant security gaps require immediate attention.';
    return 'Critical vulnerabilities detected. Immediate action required.';
  };

  const resetCalculator = () => {
    setAnswers({});
    setScore(null);
    setCurrentCategory(0);
    setShowResults(false);
  };

  const downloadReport = () => {
    // Generate PDF report (mock implementation)
    const reportData = {
      score,
      date: new Date().toISOString(),
      answers,
      recommendations: generateRecommendations(score || 0)
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-score-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateRecommendations = (score: number) => {
    const recommendations = [];
    
    if (score < 80) {
      recommendations.push('Implement multi-factor authentication across all systems');
      recommendations.push('Enhance network monitoring with SIEM solutions');
      recommendations.push('Conduct regular vulnerability assessments');
    }
    
    if (score < 60) {
      recommendations.push('Develop comprehensive incident response plan');
      recommendations.push('Increase security awareness training frequency');
      recommendations.push('Implement zero-trust architecture');
    }
    
    if (score < 40) {
      recommendations.push('Immediate security audit required');
      recommendations.push('Engage external security consultants');
      recommendations.push('Consider security-first architecture redesign');
    }
    
    return recommendations;
  };

  if (showResults && score !== null) {
    const ScoreIcon = getScoreIcon(score);
    
    return (
      <GlassCard className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-nexus-cyan/10 mb-4">
            <ScoreIcon className={cn('w-10 h-10', getScoreColor(score))} />
          </div>
          
          <h2 className="text-3xl font-bold text-text-primary mb-2">Security Score</h2>
          <div className={cn('text-5xl font-bold mb-2', getScoreColor(score))}>
            {score}/100
          </div>
          <div className="text-lg font-semibold text-text-primary mb-2">
            {getScoreLabel(score)}
          </div>
          <p className="text-text-secondary max-w-md mx-auto">
            {getScoreDescription(score)}
          </p>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-nexus-cyan" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {generateRecommendations(score).map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-nexus-cyan mt-1 flex-shrink-0" />
                <span className="text-text-secondary">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-6 py-3 bg-nexus-cyan text-white rounded-lg hover:bg-nexus-cyan/90 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button
            onClick={resetCalculator}
            className="px-6 py-3 border border-border-primary rounded-lg hover:border-nexus-cyan transition-colors duration-200"
          >
            Retake Assessment
          </button>
        </div>
      </GlassCard>
    );
  }

  const category = securityCategories[currentCategory];
  const CategoryIcon = category.icon;
  const progress = ((currentCategory + 1) / securityCategories.length) * 100;

  return (
    <GlassCard className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-nexus-cyan to-blue-500 mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Security Score Calculator</h2>
        <p className="text-text-secondary">
          Assess your organization's security posture in under 5 minutes
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-text-tertiary mb-2">
          <span>Step {currentCategory + 1} of {securityCategories.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-nexus-cyan to-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-nexus-cyan/10">
            <CategoryIcon className="w-6 h-6 text-nexus-cyan" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary">{category.name}</h3>
            <p className="text-sm text-text-secondary">Weight: {category.weight}%</p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {category.questions.map((question) => {
            const questionKey = `${category.id}_${question.id}`;
            const answer = answers[questionKey];
            
            return (
              <div key={question.id} className="p-4 rounded-lg glass-subtle">
                <h4 className="font-medium text-text-primary mb-3">
                  {question.question}
                </h4>
                
                {question.type === 'boolean' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer(questionKey, true)}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-lg border transition-all duration-200',
                        answer === true
                          ? 'border-nexus-cyan bg-nexus-cyan/10 text-nexus-cyan'
                          : 'border-border-primary hover:border-nexus-cyan/50'
                      )}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleAnswer(questionKey, false)}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-lg border transition-all duration-200',
                        answer === false
                          ? 'border-nexus-cyan bg-nexus-cyan/10 text-nexus-cyan'
                          : 'border-border-primary hover:border-nexus-cyan/50'
                      )}
                    >
                      No
                    </button>
                  </div>
                )}
                
                {question.type === 'multiple' && (
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(questionKey, option)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-all duration-200',
                          answer?.value === option.value
                            ? 'border-nexus-cyan bg-nexus-cyan/10 text-nexus-cyan'
                            : 'border-border-primary hover:border-nexus-cyan/50'
                        )}
                      >
                        <div className="font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentCategory(Math.max(0, currentCategory - 1))}
          disabled={currentCategory === 0}
          className={cn(
            'px-6 py-3 rounded-lg transition-all duration-200',
            currentCategory === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border border-border-primary hover:border-nexus-cyan'
          )}
        >
          Previous
        </button>
        
        {currentCategory === securityCategories.length - 1 ? (
          <button
            onClick={calculateScore}
            disabled={isCalculating || Object.keys(answers).length === 0}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200',
              isCalculating || Object.keys(answers).length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-nexus-cyan text-white hover:bg-nexus-cyan/90'
            )}
          >
            {isCalculating ? (
              <>
                <Calculator className="w-4 h-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                Calculate Score
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentCategory(currentCategory + 1)}
            disabled={Object.keys(answers).filter(key => key.startsWith(category.id)).length < category.questions.length}
            className={cn(
              'px-6 py-3 rounded-lg transition-all duration-200',
              Object.keys(answers).filter(key => key.startsWith(category.id)).length < category.questions.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-nexus-cyan text-white hover:bg-nexus-cyan/90'
            )}
          >
            Next
          </button>
        )}
      </div>
    </GlassCard>
  );
}
