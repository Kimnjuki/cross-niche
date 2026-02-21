import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target,
  Clock,
  Eye,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';

interface AIRecommendation {
  id: string;
  type: 'article' | 'tool' | 'alert' | 'trend';
  title: string;
  description: string;
  category: 'tech' | 'security' | 'gaming' | 'ai';
  confidence: number;
  reasoning: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metadata: {
    readTime?: number;
    views?: number;
    tags?: string[];
    impact?: string;
  };
}

interface UserPreferences {
  interests: string[];
  readingHistory: string[];
  securityLevel: 'basic' | 'intermediate' | 'advanced';
  expertiseLevel: 'beginner' | 'intermediate' | 'expert';
}

export const AIPulseEngine: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    interests: [],
    readingHistory: [],
    securityLevel: 'intermediate',
    expertiseLevel: 'intermediate'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock AI recommendation generation
  const generateRecommendations = async (): Promise<AIRecommendation[]> => {
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'ai-1',
        type: 'article',
        title: 'AI-Driven Cybersecurity: Next Generation Threat Detection',
        description: 'Advanced machine learning algorithms are revolutionizing how we detect and prevent cyber attacks before they happen...',
        category: 'security',
        confidence: 92,
        reasoning: 'Based on your interest in cybersecurity and AI, this article combines both topics with cutting-edge research.',
        priority: 'high',
        timestamp: new Date(),
        metadata: {
          readTime: 8,
          views: 15420,
          tags: ['ai', 'cybersecurity', 'ml', 'threat-detection'],
          impact: 'Revolutionary approach to proactive security'
        }
      },
      {
        id: 'ai-2',
        type: 'tool',
        title: 'Security Score Calculator Pro',
        description: 'Get personalized security recommendations based on your current setup and risk tolerance...',
        category: 'security',
        confidence: 88,
        reasoning: 'You recently completed a security assessment. This tool provides ongoing monitoring and improvement suggestions.',
        priority: 'medium',
        timestamp: new Date(),
        metadata: {
          tags: ['tool', 'security', 'monitoring'],
          impact: 'Continuous security improvement'
        }
      },
      {
        id: 'ai-3',
        type: 'trend',
        title: 'Quantum Computing Breakthrough: 1000x Speed Increase',
        description: 'IBM announces quantum processor that achieves quantum supremacy in practical applications...',
        category: 'tech',
        confidence: 95,
        reasoning: 'Trending in tech community with high engagement. Matches your interest in emerging technologies.',
        priority: 'high',
        timestamp: new Date(),
        metadata: {
          readTime: 6,
          views: 28930,
          tags: ['quantum', 'computing', 'ibm', 'breakthrough'],
          impact: 'Major advancement in computing technology'
        }
      },
      {
        id: 'ai-4',
        type: 'alert',
        title: 'Critical: Zero-Day Vulnerability in Popular Framework',
        description: 'Urgent security alert for developers using React, Vue, or Angular frameworks...',
        category: 'security',
        confidence: 98,
        reasoning: 'High-priority security alert relevant to all developers. Immediate attention required.',
        priority: 'critical',
        timestamp: new Date(),
        metadata: {
          tags: ['security', 'vulnerability', 'zero-day', 'framework'],
          impact: 'Affects millions of applications worldwide'
        }
      },
      {
        id: 'ai-5',
        type: 'article',
        title: 'The Future of AI in Gaming: NPCs That Think',
        description: 'How artificial intelligence is creating truly immersive gaming experiences with intelligent NPCs...',
        category: 'gaming',
        confidence: 85,
        reasoning: 'Combines your interest in gaming with AI trends. Highly engaging content predicted.',
        priority: 'medium',
        timestamp: new Date(),
        metadata: {
          readTime: 7,
          views: 22150,
          tags: ['gaming', 'ai', 'npcs', 'immersion'],
          impact: 'Revolutionary gaming experience'
        }
      }
    ];

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockRecommendations.sort((a, b) => {
      // Sort by priority and confidence
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.confidence - a.confidence;
    });
  };

  // Initialize recommendations
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsAnalyzing(true);
    try {
      const newRecommendations = await generateRecommendations();
      setRecommendations(newRecommendations);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshRecommendations = () => {
    loadRecommendations();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return Brain;
      case 'tool': return Target;
      case 'alert': return Zap;
      case 'trend': return TrendingUp;
      default: return Sparkles;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityBackground = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20';
      case 'high': return 'bg-orange-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'low': return 'bg-green-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'text-tech-green';
      case 'security': return 'text-security-red';
      case 'gaming': return 'text-gaming-purple';
      case 'ai': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-nexus-cyan" />
            <h1 className="text-2xl font-bold text-white">AI Pulse</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse" />
              <span className="text-sm text-nexus-cyan">ACTIVE</span>
            </div>
          </div>
          
          <button
            onClick={refreshRecommendations}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 glass border border-white/20 text-white rounded-lg hover:border-nexus-cyan transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', isAnalyzing && 'animate-spin')} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-nexus-cyan mb-1">{recommendations.length}</div>
            <div className="text-sm text-gray-400">Recommendations</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {recommendations.filter(r => r.confidence >= 90).length}
            </div>
            <div className="text-sm text-gray-400">High Confidence</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {recommendations.filter(r => r.priority === 'high' || r.priority === 'critical').length}
            </div>
            <div className="text-sm text-gray-400">Priority Items</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {recommendations.filter(r => r.type === 'trend').length}
            </div>
            <div className="text-sm text-gray-400">Trending Topics</div>
          </GlassCard>
        </div>

        {/* Last Update */}
        <div className="text-sm text-gray-400 mb-4">
          Last analyzed: {formatTimestamp(lastUpdate)}
        </div>
      </div>

      {/* Recommendations Feed */}
      <div className="space-y-4">
        {recommendations.map((recommendation) => {
          const TypeIcon = getTypeIcon(recommendation.type);
          
          return (
            <GlassCard 
              key={recommendation.id} 
              className={cn(
                'p-6 transition-all duration-300 hover:scale-[1.02]',
                recommendation.priority === 'critical' && 'ring-2 ring-red-500/50'
              )}
            >
              <div className="flex gap-6">
                {/* Type Icon */}
                <div className="flex-shrink-0">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    getPriorityBackground(recommendation.priority)
                  )}>
                    <TypeIcon className={cn('w-6 h-6', getPriorityColor(recommendation.priority))} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={cn('text-sm font-medium capitalize', getPriorityColor(recommendation.priority))}>
                        {recommendation.type}
                      </span>
                      
                      <span className={cn('text-sm font-medium', getCategoryColor(recommendation.category))}>
                        {recommendation.category.toUpperCase()}
                      </span>
                      
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        getPriorityBackground(recommendation.priority),
                        getPriorityColor(recommendation.priority)
                      )}>
                        {recommendation.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {recommendation.confidence}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(recommendation.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2 hover:text-nexus-cyan transition-colors cursor-pointer">
                    {recommendation.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-3 line-clamp-2">
                    {recommendation.description}
                  </p>
                  
                  {/* AI Reasoning */}
                  <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-blue-400 mb-1">AI Reasoning</div>
                        <div className="text-xs text-gray-300">{recommendation.reasoning}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {recommendation.metadata.readTime && (
                        <span className="text-sm text-gray-300">
                          {recommendation.metadata.readTime} min read
                        </span>
                      )}
                      {recommendation.metadata.views && (
                        <span className="flex items-center gap-1 text-sm text-gray-300">
                          <Eye className="w-3 h-3" />
                          {recommendation.metadata.views.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* No Recommendations */}
      {recommendations.length === 0 && !isAnalyzing && (
        <GlassCard className="p-12 text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400 mb-4">
            AI is analyzing your preferences to generate personalized recommendations.
          </p>
          <button
            onClick={refreshRecommendations}
            className="px-6 py-2 glass border border-white/20 text-white rounded-lg hover:border-nexus-cyan transition-all"
          >
            Generate Recommendations
          </button>
        </GlassCard>
      )}

      {/* Loading State */}
      {isAnalyzing && recommendations.length === 0 && (
        <GlassCard className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Brain className="w-16 h-16 text-nexus-cyan animate-pulse" />
            <div className="text-lg font-semibold text-white">AI Analyzing Your Preferences</div>
            <div className="text-sm text-gray-400">
              Generating personalized recommendations based on your interests and reading history...
            </div>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default AIPulseEngine;
