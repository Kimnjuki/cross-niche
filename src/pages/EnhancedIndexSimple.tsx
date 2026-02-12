import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Activity, TrendingUp, AlertTriangle, Play, ChevronRight, Zap, Eye, MessageSquare, Share2, Bookmark, Cpu, Gamepad2, Lock, Wifi } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiveUpdates } from '@/components/live/LiveUpdates';
import { cn } from '@/lib/utils';

// Simplified mock data
const featuredArticles = [
  {
    id: '1',
    slug: 'critical-zero-day-vulnerability',
    title: 'Critical Zero-Day Vulnerability Discovered',
    excerpt: 'Security researchers identify actively exploited vulnerability affecting millions of users worldwide.',
    author: { name: 'Sarah Chen' },
    publishedAt: '2024-01-15T10:30:00Z',
    readTime: 5,
    category: 'Security',
    niche: 'security' as const,
    imageUrl: '/api/placeholder/800/400',
    viewCount: 15420,
    commentCount: 89,
    featured: true,
    breaking: true
  },
  {
    id: '2',
    slug: 'ai-breakthrough',
    title: 'AI Breakthrough: New Model Achievements',
    excerpt: 'Revolutionary AI system demonstrates unprecedented capabilities in reasoning and creative tasks.',
    author: { name: 'Dr. Michael Roberts' },
    publishedAt: '2024-01-15T09:15:00Z',
    readTime: 8,
    category: 'Artificial Intelligence',
    niche: 'ai' as const,
    imageUrl: '/api/placeholder/800/400',
    viewCount: 23450,
    commentCount: 156,
    featured: true,
    trending: true
  }
];

const categoryStats = [
  { name: 'Tech', icon: Cpu, count: 1234, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  { name: 'Security', icon: Lock, count: 892, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { name: 'Gaming', icon: Gamepad2, count: 756, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { name: 'AI', icon: Brain, count: 445, color: 'text-blue-400', bgColor: 'bg-blue-400/10' }
];

export default function EnhancedIndexSimple() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {' '}Tech Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Experience the intersection of technology, security, and gaming with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/security-tools"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Try Security Tools
            </Link>
            
            <Link
              to="/live-updates"
              className="px-8 py-4 border border-blue-400/30 text-blue-400 rounded-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              View Live Updates
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3', stat.bgColor)}>
                    <Icon className={cn('w-8 h-8', stat.color)} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                  <div className="text-sm text-gray-400">{stat.name} Articles</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Stories</h2>
            <p className="text-gray-400">Hand-picked articles from our expert team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <GlassCard key={article.id} className="group cursor-pointer overflow-hidden">
                <div className="relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                        {article.breaking ? 'BREAKING' : article.category}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span>{article.author.name}</span>
                        <span>•</span>
                        <span>{article.readTime} min read</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{article.viewCount.toLocaleString()}</span>
                        <MessageSquare className="w-4 h-4 text-gray-400 ml-3" />
                        <span className="text-gray-400 text-sm">{article.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Live Updates Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Updates</h2>
            <p className="text-gray-400">Real-time news and breaking updates</p>
          </div>
          
          <LiveUpdates maxItems={3} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 GridNexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
