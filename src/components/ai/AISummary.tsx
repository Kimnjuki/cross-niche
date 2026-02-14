import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, ChevronDown, ChevronUp, Copy, Check, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface AISummaryProps {
  article: {
    id: string;
    title: string;
    content: string;
    niche: 'tech' | 'security' | 'gaming' | 'ai';
  };
  className?: string;
}

interface SummaryLevel {
  id: string;
  name: string;
  description: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

const summaryLevels: SummaryLevel[] = [
  {
    id: 'basic',
    name: 'Quick Overview',
    description: '2-3 sentence summary for quick understanding',
    complexity: 'basic'
  },
  {
    id: 'intermediate',
    name: 'Detailed Summary',
    description: 'Key points and main insights',
    complexity: 'intermediate'
  },
  {
    id: 'advanced',
    name: 'Technical Deep Dive',
    description: 'Technical details and expert analysis',
    complexity: 'advanced'
  }
];

export function AISummary({ article, className }: AISummaryProps) {
  const [selectedLevel, setSelectedLevel] = useState<SummaryLevel>(summaryLevels[0]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);

  // Simulate AI summary generation
  const generateSummary = async (level: SummaryLevel) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI-generated content based on level
    const summaries = {
      basic: `${article.title} explores ${article.niche} developments with practical insights. This analysis covers current trends and future implications for professionals in the field.`,
      
      intermediate: `This article examines ${article.niche} innovations through multiple perspectives. Key findings include emerging technologies, security considerations, and practical applications. The analysis provides actionable insights for both technical and business stakeholders, with emphasis on real-world implementation strategies and risk mitigation approaches.`,
      
      advanced: `The technical analysis delves into ${article.niche} architecture, examining implementation patterns, performance optimization techniques, and security protocols. Detailed examination of API integrations, data flow architectures, and scalability considerations. The research includes benchmark comparisons, threat vector analysis, and compliance frameworks. Advanced practitioners will find value in the code examples, configuration patterns, and troubleshooting methodologies presented.`
    };
    
    const points = {
      basic: ['Main concept identified', 'Practical applications highlighted'],
      intermediate: [
        'Technical architecture explained',
        'Security implications analyzed',
        'Implementation roadmap provided',
        'Cost-benefit assessment included'
      ],
      advanced: [
        'Deep technical specifications',
        'Performance benchmarking data',
        'Security vulnerability assessment',
        'Compliance framework mapping',
        'Advanced optimization techniques',
        'Future scalability considerations'
      ]
    };
    
    setSummary(summaries[level.complexity as keyof typeof summaries]);
    setKeyPoints(points[level.complexity as keyof typeof points]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isExpanded) {
      generateSummary(selectedLevel);
    }
  }, [selectedLevel, isExpanded]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <GlassCard className={cn('p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-nexus-cyan to-blue-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">AI-Powered Summary</h3>
            <p className="text-sm text-text-secondary">Get insights tailored to your expertise</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg glass-subtle hover:glass transition-all duration-200"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          )}
        </button>
      </div>

      {/* Level Selection */}
      {isExpanded && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-nexus-cyan" />
            <span className="text-sm font-semibold text-text-primary">Select Complexity Level:</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {summaryLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-200 text-left',
                  selectedLevel.id === level.id
                    ? 'border-nexus-cyan bg-nexus-cyan/10 text-nexus-cyan'
                    : 'border-border-primary glass-subtle hover:border-nexus-cyan/50'
                )}
              >
                <div className="font-semibold text-sm mb-1">{level.name}</div>
                <div className="text-xs text-text-secondary">{level.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary Content */}
      {isExpanded && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-nexus-cyan animate-spin" />
              <span className="ml-2 text-text-secondary">Generating AI summary...</span>
            </div>
          ) : (
            <>
              {/* Summary Text */}
              <div className="relative">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg glass-subtle hover:glass transition-all duration-200"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-tech-green" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                </div>
                
                <div className="pr-12">
                  <p className="text-text-primary leading-relaxed">{summary}</p>
                </div>
              </div>

              {/* Key Points */}
              {keyPoints.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-nexus-cyan" />
                    Key Points
                  </h4>
                  <ul className="space-y-2">
                    {keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-nexus-cyan mt-2 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Confidence */}
              <div className="pt-4 border-t border-border-primary">
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>AI Confidence: 94%</span>
                  <span>Generated in 1.2s</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </GlassCard>
  );
}
