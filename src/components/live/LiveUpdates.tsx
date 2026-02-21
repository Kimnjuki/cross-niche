import React, { useState, useEffect, useRef } from 'react';
import { Activity, Bell, TrendingUp, AlertTriangle, Clock, Eye, MessageSquare, Share2, X, Wifi, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface LiveUpdate {
  id: string;
  type: 'breaking' | 'trending' | 'security' | 'update';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  imageUrl?: string;
  link?: string;
  metrics?: {
    views?: number;
    shares?: number;
    comments?: number;
  };
  isLive?: boolean;
}

interface LiveUpdatesProps {
  maxItems?: number;
  showNotifications?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

const mockUpdates: LiveUpdate[] = [
  {
    id: '1',
    type: 'breaking',
    title: 'Critical Zero-Day Vulnerability Discovered in Popular Software',
    description: 'Security researchers identify actively exploited vulnerability affecting millions of users worldwide. Immediate patching recommended.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    priority: 'critical',
    category: 'Security',
    imageUrl: '/api/placeholder/400/200',
    link: '/article/critical-zero-day-vulnerability',
    metrics: { views: 1250, shares: 89, comments: 23 },
    isLive: true
  },
  {
    id: '2',
    type: 'trending',
    title: 'AI Breakthrough: New Model Achieves Human-Level Performance',
    description: 'Revolutionary AI system demonstrates unprecedented capabilities in reasoning and creative tasks.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    priority: 'high',
    category: 'AI',
    imageUrl: '/api/placeholder/400/200',
    link: '/article/ai-breakthrough-human-level',
    metrics: { views: 5432, shares: 234, comments: 67 }
  },
  {
    id: '3',
    type: 'security',
    title: 'Major Data Breach Affects 500K Users',
    description: 'E-commerce giant confirms unauthorized access to customer data. Investigation underway.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    priority: 'high',
    category: 'Security',
    link: '/article/major-data-breach-ecommerce',
    metrics: { views: 8901, shares: 456, comments: 123 }
  },
  {
    id: '4',
    type: 'update',
    title: 'Tech Giant Announces Revolutionary Quantum Computing Breakthrough',
    description: 'New quantum processor achieves 1000x improvement in computational speed.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: 'medium',
    category: 'Tech',
    imageUrl: '/api/placeholder/400/200',
    link: '/article/quantum-computing-breakthrough',
    metrics: { views: 12345, shares: 789, comments: 234 }
  },
  {
    id: '5',
    type: 'trending',
    title: 'Gaming Industry Sees Record-Breaking Quarter',
    description: 'Mobile gaming revenue surpasses expectations as new titles dominate charts.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    priority: 'medium',
    category: 'Gaming',
    link: '/article/gaming-industry-record-quarter',
    metrics: { views: 6789, shares: 345, comments: 89 }
  }
];

const typeConfig = {
  breaking: {
    icon: AlertTriangle,
    color: 'text-security-red',
    bgColor: 'bg-security-red/10',
    borderColor: 'border-security-red/20',
    pulse: true
  },
  trending: {
    icon: TrendingUp,
    color: 'text-news-orange',
    bgColor: 'bg-news-orange/10',
    borderColor: 'border-news-orange/20',
    pulse: false
  },
  security: {
    icon: Bell,
    color: 'text-security-red',
    bgColor: 'bg-security-red/10',
    borderColor: 'border-security-red/20',
    pulse: false
  },
  update: {
    icon: Activity,
    color: 'text-tech-green',
    bgColor: 'bg-tech-green/10',
    borderColor: 'border-tech-green/20',
    pulse: false
  }
};

const priorityConfig = {
  low: { label: 'Low', color: 'text-gray-400' },
  medium: { label: 'Medium', color: 'text-news-orange' },
  high: { label: 'High', color: 'text-security-red' },
  critical: { label: 'Critical', color: 'text-security-red animate-pulse' }
};

export function LiveUpdates({ 
  maxItems = 10, 
  showNotifications = true, 
  autoRefresh = true, 
  refreshInterval = 30000,
  className 
}: LiveUpdatesProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>(mockUpdates.slice(0, maxItems));
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [newUpdate, setNewUpdate] = useState<LiveUpdate | null>(null);
  const [filter, setFilter] = useState<'all' | 'breaking' | 'trending' | 'security' | 'update'>('all');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        // Simulate new update
        const newUpdateData: LiveUpdate = {
          id: Date.now().toString(),
          type: ['breaking', 'trending', 'security', 'update'][Math.floor(Math.random() * 4)] as LiveUpdate['type'],
          title: `New Update: ${['Critical Security Alert', 'Breaking Tech News', 'Trending Now', 'Latest Update'][Math.floor(Math.random() * 4)]}`,
          description: 'This is a simulated real-time update to demonstrate the live functionality.',
          timestamp: new Date(),
          priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as LiveUpdate['priority'],
          category: ['Security', 'Tech', 'AI', 'Gaming'][Math.floor(Math.random() * 4)],
          metrics: { views: Math.floor(Math.random() * 10000), shares: Math.floor(Math.random() * 1000), comments: Math.floor(Math.random() * 500) },
          isLive: true
        };

        setUpdates(prev => [newUpdateData, ...prev.slice(0, maxItems - 1)]);
        setLastUpdate(new Date());
        
        if (showNotifications) {
          setNewUpdate(newUpdateData);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, maxItems, showNotifications]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredUpdates = filter === 'all' 
    ? updates 
    : updates.filter(update => update.type === filter);

  return (
    <>
      {/* Notification Toast */}
      {showNotification && newUpdate && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-up">
          <GlassCard className="p-4 border-l-4 border-l-nexus-cyan">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Bell className="w-5 h-5 text-nexus-cyan animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-text-primary">Live Update</span>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3 text-text-secondary" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary truncate">{newUpdate.title}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      <GlassCard className={cn('p-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-3 h-3 rounded-full',
                isLive ? 'bg-tech-green animate-pulse' : 'bg-gray-400'
              )} />
              <span className="text-sm font-semibold text-text-primary">
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-nexus-cyan" />
              <h2 className="text-xl font-bold text-text-primary">Live Updates</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-text-tertiary">
              <Clock className="w-3 h-3" />
              <span>Last: {formatTimeAgo(lastUpdate)}</span>
            </div>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                isLive 
                  ? 'bg-tech-green/10 text-tech-green' 
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              <Wifi className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Updates', count: updates.length },
            { id: 'breaking', label: 'Breaking', count: updates.filter(u => u.type === 'breaking').length },
            { id: 'trending', label: 'Trending', count: updates.filter(u => u.type === 'trending').length },
            { id: 'security', label: 'Security', count: updates.filter(u => u.type === 'security').length },
            { id: 'update', label: 'Updates', count: updates.filter(u => u.type === 'update').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                filter === tab.id
                  ? 'bg-nexus-cyan text-white'
                  : 'glass-subtle text-text-secondary hover:text-text-primary'
              )}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-current/20 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Updates List */}
        <div className="space-y-4">
          {filteredUpdates.map((update) => {
            const config = typeConfig[update.type];
            const Icon = config.icon;
            const priority = priorityConfig[update.priority];
            
            return (
              <div
                key={update.id}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-200 hover:shadow-md',
                  config.borderColor,
                  'bg-opacity-50'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={cn(
                    'p-2 rounded-lg flex-shrink-0',
                    config.bgColor,
                    config.pulse && 'animate-pulse-glow'
                  )}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-xs font-semibold', config.color)}>
                            {update.type.toUpperCase()}
                          </span>
                          {update.isLive && (
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-nexus-cyan animate-pulse" />
                              <span className="text-xs text-nexus-cyan">LIVE</span>
                            </div>
                          )}
                          <span className={cn('text-xs', priority.color)}>
                            {priority.label}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-text-primary mb-1 hover:text-nexus-cyan transition-colors cursor-pointer">
                          {update.title}
                        </h3>
                        
                        <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                          {update.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-text-tertiary">
                          <span>{update.category}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(update.timestamp)}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {update.link && (
                          <button className="p-2 rounded-lg glass-subtle hover:glass transition-all duration-200">
                            <Share2 className="w-4 h-4 text-text-secondary" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    {update.metrics && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-primary">
                        {update.metrics.views && (
                          <div className="flex items-center gap-1 text-xs text-text-tertiary">
                            <Eye className="w-3 h-3" />
                            <span>{update.metrics.views.toLocaleString()}</span>
                          </div>
                        )}
                        {update.metrics.shares && (
                          <div className="flex items-center gap-1 text-xs text-text-tertiary">
                            <Share2 className="w-3 h-3" />
                            <span>{update.metrics.shares.toLocaleString()}</span>
                          </div>
                        )}
                        {update.metrics.comments && (
                          <div className="flex items-center gap-1 text-xs text-text-tertiary">
                            <MessageSquare className="w-3 h-3" />
                            <span>{update.metrics.comments.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUpdates.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Updates</h3>
            <p className="text-text-secondary">
              No {filter === 'all' ? '' : filter} updates available at the moment.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border-primary">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
            </div>
            <span>Updates refresh every {refreshInterval / 1000}s</span>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
