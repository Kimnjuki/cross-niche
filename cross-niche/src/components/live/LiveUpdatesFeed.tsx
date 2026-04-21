import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Clock,
  Eye,
  Share2,
  Bookmark,
  Filter,
  RefreshCw,
  Bell
} from 'lucide-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';

interface LiveUpdate {
  id: string;
  type: 'breaking' | 'trending' | 'alert' | 'update';
  title: string;
  description: string;
  category: 'tech' | 'security' | 'gaming' | 'ai';
  impact: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  views: number;
  tags: string[];
  imageUrl?: string;
  link?: string;
}

interface LiveStats {
  totalUpdates: number;
  breakingNews: number;
  activeAlerts: number;
  trendingTopics: number;
}

export const LiveUpdatesFeed: React.FC = () => {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<LiveUpdate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [stats, setStats] = useState<LiveStats>({
    totalUpdates: 0,
    breakingNews: 0,
    activeAlerts: 0,
    trendingTopics: 0
  });
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const wsRef = useRef<WebSocket | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', color: 'text-gray-400' },
    { id: 'tech', name: 'Technology', color: 'text-tech-green' },
    { id: 'security', name: 'Security', color: 'text-security-red' },
    { id: 'gaming', name: 'Gaming', color: 'text-gaming-purple' },
    { id: 'ai', name: 'AI & ML', color: 'text-blue-400' }
  ];

  const types = [
    { id: 'all', name: 'All Types', icon: Activity },
    { id: 'breaking', name: 'Breaking News', icon: Zap },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'alert', name: 'Security Alerts', icon: AlertTriangle }
  ];

  // Mock live data generation
  const generateMockUpdate = (): LiveUpdate => {
    const mockUpdates: Omit<LiveUpdate, 'id' | 'timestamp'>[] = [
      {
        type: 'breaking',
        title: 'Major AI Breakthrough Announced by Leading Tech Company',
        description: 'Revolutionary advances in artificial intelligence promise to transform multiple industries with unprecedented capabilities...',
        category: 'ai',
        impact: 'high',
        source: 'TechCrunch',
        views: Math.floor(Math.random() * 10000) + 1000,
        tags: ['ai', 'breakthrough', 'innovation'],
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
      },
      {
        type: 'alert',
        title: 'Critical Security Vulnerability Detected in Popular Software',
        description: 'Urgent security patch released for vulnerability affecting millions of users worldwide...',
        category: 'security',
        impact: 'critical',
        source: 'CVE Database',
        views: Math.floor(Math.random() * 15000) + 2000,
        tags: ['security', 'vulnerability', 'patch'],
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop'
      },
      {
        type: 'trending',
        title: 'Next-Gen Gaming Console Specs Leaked Online',
        description: 'Exclusive details about upcoming gaming hardware reveal significant performance improvements and new features...',
        category: 'gaming',
        impact: 'medium',
        source: 'Gaming Insider',
        views: Math.floor(Math.random() * 8000) + 500,
        tags: ['gaming', 'hardware', 'leak'],
        imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop'
      },
      {
        type: 'update',
        title: 'New Framework Revolutionizes Web Development',
        description: 'Developers embrace new JavaScript framework that promises faster performance and better developer experience...',
        category: 'tech',
        impact: 'medium',
        source: 'GitHub Blog',
        views: Math.floor(Math.random() * 6000) + 800,
        tags: ['development', 'framework', 'javascript'],
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop'
      }
    ];

    const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
    return {
      ...randomUpdate,
      id: `update-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
  };

  // Initialize WebSocket connection (mock)
  useEffect(() => {
    const connectWebSocket = () => {
      // Mock WebSocket connection
      const mockWebSocket = {
        send: () => {},
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      } as unknown as WebSocket;

      wsRef.current = mockWebSocket;
      setIsLive(true);

      // Simulate real-time updates
      const interval = setInterval(() => {
        const newUpdate = generateMockUpdate();
        setUpdates(prev => [newUpdate, ...prev.slice(0, 49)]);
        setLastUpdate(new Date());
      }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds

      return () => {
        clearInterval(interval);
        mockWebSocket.close();
      };
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  // Initialize with some data
  useEffect(() => {
    const initialUpdates = Array.from({ length: 5 }, () => generateMockUpdate());
    setUpdates(initialUpdates);
  }, []);

  // Filter updates based on selected filters
  useEffect(() => {
    let filtered = updates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(update => update.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(update => update.type === selectedType);
    }

    setFilteredUpdates(filtered);
  }, [updates, selectedCategory, selectedType]);

  // Update stats
  useEffect(() => {
    const newStats: LiveStats = {
      totalUpdates: updates.length,
      breakingNews: updates.filter(u => u.type === 'breaking').length,
      activeAlerts: updates.filter(u => u.type === 'alert' && u.impact === 'critical').length,
      trendingTopics: updates.filter(u => u.type === 'trending').length
    };
    setStats(newStats);
  }, [updates]);

  const getTypeIcon = (type: string) => {
    const typeConfig = types.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : Activity;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getImpactBackground = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'high': return 'bg-orange-500/20';
      case 'critical': return 'bg-red-500/20';
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
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const refreshFeed = () => {
    const newUpdate = generateMockUpdate();
    setUpdates(prev => [newUpdate, ...prev.slice(0, 49)]);
    setLastUpdate(new Date());
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-nexus-cyan" />
            <h1 className="text-2xl font-bold text-white">Live Updates</h1>
            {isLive && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-sm text-red-400">LIVE</span>
              </div>
            )}
          </div>
          
          <button
            onClick={refreshFeed}
            className="flex items-center gap-2 px-4 py-2 glass border border-white/20 text-white rounded-lg hover:border-nexus-cyan transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalUpdates}</div>
            <div className="text-sm text-gray-400">Total Updates</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">{stats.breakingNews}</div>
            <div className="text-sm text-gray-400">Breaking News</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{stats.activeAlerts}</div>
            <div className="text-sm text-gray-400">Active Alerts</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-nexus-cyan mb-1">{stats.trendingTopics}</div>
            <div className="text-sm text-gray-400">Trending Topics</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>
          
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm transition-all',
                  selectedCategory === category.id
                    ? 'bg-nexus-cyan text-white'
                    : 'glass border border-white/20 text-gray-300 hover:border-white/40'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {types.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1',
                    selectedType === type.id
                      ? 'bg-nexus-cyan text-white'
                      : 'glass border border-white/20 text-gray-300 hover:border-white/40'
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Last Update */}
        <div className="text-sm text-gray-400 mb-4">
          Last updated: {formatTimestamp(lastUpdate)}
        </div>
      </div>

      {/* Live Updates Feed */}
      <div className="space-y-4">
        {filteredUpdates.map((update, index) => {
          const TypeIcon = getTypeIcon(update.type);
          
          return (
            <GlassCard 
              key={update.id} 
              className={cn(
                'p-6 transition-all duration-300 hover:scale-[1.02]',
                index === 0 && 'ring-2 ring-nexus-cyan/50'
              )}
            >
              <div className="flex gap-6">
                {/* Update Image */}
                {update.imageUrl && (
                  <img
                    src={update.imageUrl}
                    alt={update.title}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-nexus-cyan" />
                        <span className="text-sm font-medium text-nexus-cyan capitalize">
                          {update.type}
                        </span>
                      </div>
                      
                      <span className={cn('text-sm font-medium', getCategoryColor(update.category))}>
                        {update.category.toUpperCase()}
                      </span>
                      
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        getImpactBackground(update.impact),
                        getImpactColor(update.impact)
                      )}>
                        {update.impact.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {update.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(update.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2 hover:text-nexus-cyan transition-colors cursor-pointer">
                    {update.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-3 line-clamp-2">
                    {update.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-300">
                        Source: {update.source}
                      </span>
                      
                      <div className="flex gap-2">
                        {update.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* No Updates */}
      {filteredUpdates.length === 0 && (
        <GlassCard className="p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No updates found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your filters to see more live updates.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedType('all');
            }}
            className="px-6 py-2 glass border border-white/20 text-white rounded-lg hover:border-nexus-cyan transition-all"
          >
            Clear Filters
          </button>
        </GlassCard>
      )}
    </div>
  );
};

export default LiveUpdatesFeed;
