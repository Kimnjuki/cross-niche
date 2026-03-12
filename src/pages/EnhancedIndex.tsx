import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Shield, 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Play,
  ChevronRight,
  Zap,
  Eye,
  MessageSquare,
  Share2,
  Bookmark,
  Cpu,
  Gamepad2,
  Lock,
  Wifi
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { AISummary } from '@/components/ai/AISummary';
import { SecurityScoreCalculator } from '@/components/security/SecurityScoreCalculator';
import { BreachSimulator } from '@/components/security/BreachSimulator';
import { LiveUpdates } from '@/components/live/LiveUpdates';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const featuredArticles = [
  {
    id: '1',
    slug: 'critical-zero-day-vulnerability',
    title: 'Critical Zero-Day Vulnerability Discovered in Popular Software',
    excerpt: 'Security researchers identify actively exploited vulnerability affecting millions of users worldwide. Immediate patching recommended.',
    author: { name: 'Sarah Chen', avatar: '/api/placeholder/40/40' },
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
    slug: 'ai-breakthrough-human-level',
    title: 'AI Breakthrough: New Model Achieves Human-Level Performance',
    excerpt: 'Revolutionary AI system demonstrates unprecedented capabilities in reasoning and creative tasks, marking a significant milestone in artificial intelligence.',
    author: { name: 'Dr. Michael Roberts', avatar: '/api/placeholder/40/40' },
    publishedAt: '2024-01-15T09:15:00Z',
    readTime: 8,
    category: 'Artificial Intelligence',
    niche: 'ai' as const,
    imageUrl: '/api/placeholder/800/400',
    viewCount: 23450,
    commentCount: 156,
    featured: true,
    trending: true
  },
  {
    id: '3',
    slug: 'gaming-industry-record-quarter',
    title: 'Gaming Industry Sees Record-Breaking Quarter',
    excerpt: 'Mobile gaming revenue surpasses expectations as new titles dominate charts and player engagement reaches all-time highs.',
    author: { name: 'Alex Rivera', avatar: '/api/placeholder/40/40' },
    publishedAt: '2024-01-15T08:45:00Z',
    readTime: 6,
    category: 'Gaming',
    niche: 'gaming' as const,
    imageUrl: '/api/placeholder/800/400',
    viewCount: 18900,
    commentCount: 123,
    featured: true
  }
];

const categoryStats = [
  { name: 'Tech', icon: Cpu, count: 1234, color: 'text-tech-green', bgColor: 'bg-tech-green/10' },
  { name: 'Security', icon: Lock, count: 892, color: 'text-security-red', bgColor: 'bg-security-red/10' },
  { name: 'Gaming', icon: Gamepad2, count: 756, color: 'text-gaming-purple', bgColor: 'bg-gaming-purple/10' },
  { name: 'AI', icon: Brain, count: 445, color: 'text-blue-400', bgColor: 'bg-blue-400/10' }
];

export default function EnhancedIndex() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [showSecurityTools, setShowSecurityTools] = useState(false);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nexus-blue via-nexus-blue/95 to-gray-900">
      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-nexus-cyan to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">GridNexus</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => scrollToSection('home')}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    activeSection === 'home' ? 'text-nexus-cyan' : 'text-gray-300 hover:text-white'
                  )}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('tools')}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    activeSection === 'tools' ? 'text-nexus-cyan' : 'text-gray-300 hover:text-white'
                  )}
                >
                  Security Tools
                </button>
                <button
                  onClick={() => scrollToSection('live')}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    activeSection === 'live' ? 'text-nexus-cyan' : 'text-gray-300 hover:text-white'
                  )}
                >
                  Live Updates
                </button>
                <button
                  onClick={() => scrollToSection('ai')}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    activeSection === 'ai' ? 'text-nexus-cyan' : 'text-gray-300 hover:text-white'
                  )}
                >
                  AI Features
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg glass-subtle">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-48"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg glass-subtle hover:glass transition-all duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-gray-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg glass-subtle"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-white" />
                ) : (
                  <Menu className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 glass p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg glass-subtle"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  scrollToSection('home');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white hover:text-nexus-cyan transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection('tools');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white hover:text-nexus-cyan transition-colors"
              >
                Security Tools
              </button>
              <button
                onClick={() => {
                  scrollToSection('live');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white hover:text-nexus-cyan transition-colors"
              >
                Live Updates
              </button>
              <button
                onClick={() => {
                  scrollToSection('ai');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white hover:text-nexus-cyan transition-colors"
              >
                AI Features
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-nexus-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan to-blue-400">
                {' '}Tech Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Experience the intersection of technology, security, and gaming with AI-powered insights, 
              real-time updates, and interactive security tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('tools')}
                className="px-8 py-4 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Try Security Tools
              </button>
              
              <button
                onClick={() => scrollToSection('live')}
                className="px-8 py-4 glass border border-white/20 text-white rounded-lg font-semibold hover:border-nexus-cyan transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                View Live Updates
              </button>
            </div>

            {/* Stats */}
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
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Stories</h2>
              <p className="text-gray-400">Hand-picked articles from our expert team</p>
            </div>
            <Link
              to="/articles"
              className="flex items-center gap-2 text-nexus-cyan hover:text-nexus-cyan/80 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Security Tools Section */}
      <section id="tools" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Security Tools</h2>
            <p className="text-gray-400">Interactive tools to assess and improve your security posture</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SecurityScoreCalculator />
            <BreachSimulator />
          </div>
        </div>
      </section>

      {/* Live Updates Section */}
      <section id="live" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Live Updates</h2>
            <p className="text-gray-400">Real-time news and breaking updates from around the world</p>
          </div>

          <LiveUpdates maxItems={5} />
        </div>
      </section>

      {/* AI Features Section */}
      <section id="ai" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">AI-Powered Features</h2>
            <p className="text-gray-400">Experience the future of content consumption with AI</p>
          </div>

          <AISummary
            article={{
              id: '1',
              title: 'The Future of Artificial Intelligence in Cybersecurity',
              content: 'Comprehensive analysis of how AI is revolutionizing threat detection and response capabilities...',
              niche: 'ai'
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-nexus-cyan to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">GridNexus</span>
              </div>
              <p className="text-gray-400 text-sm">
                The intersection of technology, security, and gaming intelligence.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/tech" className="hover:text-nexus-cyan transition-colors">Technology</Link></li>
                <li><Link to="/security" className="hover:text-nexus-cyan transition-colors">Security</Link></li>
                <li><Link to="/gaming" className="hover:text-nexus-cyan transition-colors">Gaming</Link></li>
                <li><Link to="/ai" className="hover:text-nexus-cyan transition-colors">AI & ML</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('tools')} className="hover:text-nexus-cyan transition-colors">Security Score Calculator</button></li>
                <li><button onClick={() => scrollToSection('tools')} className="hover:text-nexus-cyan transition-colors">Breach Simulator</button></li>
                <li><button onClick={() => scrollToSection('ai')} className="hover:text-nexus-cyan transition-colors">AI Summaries</button></li>
                <li><button onClick={() => scrollToSection('live')} className="hover:text-nexus-cyan transition-colors">Live Updates</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-nexus-cyan transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-nexus-cyan transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-nexus-cyan transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-nexus-cyan transition-colors">RSS Feed</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 GridNexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
