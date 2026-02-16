import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  Eye,
  X,
  ChevronDown
} from 'lucide-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';
import { trackViewSearchResults } from '@/lib/analytics/ga4';

interface SearchFilters {
  category: string[];
  dateRange: string;
  sortBy: string;
  author: string;
  tags: string[];
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  views: number;
  imageUrl: string;
  tags: string[];
  relevance: number;
}

export const AdvancedSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    dateRange: 'all',
    sortBy: 'relevance',
    author: '',
    tags: []
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'tech', name: 'Technology', color: 'text-tech-green' },
    { id: 'security', name: 'Security', color: 'text-security-red' },
    { id: 'gaming', name: 'Gaming', color: 'text-gaming-purple' },
    { id: 'ai', name: 'AI & ML', color: 'text-blue-400' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: TrendingUp },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'views', label: 'Views', icon: Eye },
    { value: 'readTime', label: 'Read Time', icon: Clock }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Mock search function (replace with Algolia implementation)
  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'AI Breakthrough: Quantum Computing Achieves New Milestone',
        excerpt: 'Researchers have successfully demonstrated quantum supremacy in practical applications, marking a significant advancement in computing technology...',
        category: 'ai',
        author: 'Dr. Sarah Chen',
        publishDate: '2026-02-12',
        readTime: 5,
        views: 15420,
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
        tags: ['quantum', 'ai', 'research'],
        relevance: 95
      },
      {
        id: '2',
        title: 'Critical Security Vulnerability Affects Millions of Devices',
        excerpt: 'A newly discovered vulnerability in popular IoT devices could allow remote code execution, prompting urgent security patches...',
        category: 'security',
        author: 'Marcus Rodriguez',
        publishDate: '2026-02-11',
        readTime: 7,
        views: 28930,
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
        tags: ['vulnerability', 'iot', 'security'],
        relevance: 88
      },
      {
        id: '3',
        title: 'Next-Gen Gaming Consoles: What to Expect in 2026',
        excerpt: 'Major gaming manufacturers are preparing to release revolutionary new hardware with advanced graphics and AI integration...',
        category: 'gaming',
        author: 'Alex Thompson',
        publishDate: '2026-02-10',
        readTime: 6,
        views: 22150,
        imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop',
        tags: ['consoles', 'gaming', 'hardware'],
        relevance: 82
      }
    ];
    
    setResults(mockResults);
    setLoading(false);
    trackViewSearchResults(searchQuery, mockResults.length);
  };

  // Get search suggestions
  const getSuggestions = async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    // Mock suggestions (replace with Algolia autocomplete)
    const mockSuggestions = [
      'artificial intelligence',
      'cybersecurity best practices',
      'gaming hardware reviews',
      'quantum computing',
      'machine learning algorithms',
      'network security',
      'gaming industry trends',
      'tech innovation'
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase())
    );

    setSuggestions(mockSuggestions.slice(0, 5));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        getSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query, filters);
      setSuggestions([]);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      dateRange: 'all',
      sortBy: 'relevance',
      author: '',
      tags: []
    });
  };

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter(c => c !== categoryId)
        : [...prev.category, categoryId]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Advanced Search</h1>
        <p className="text-gray-400">Discover articles across technology, security, gaming, and AI</p>
      </div>

      {/* Search Input */}
      <GlassCard className="p-6 mb-6">
        <div className="relative">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search articles, topics, authors..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-nexus-cyan focus:bg-white/10 transition-all"
              />
              
              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-strong border border-white/10 rounded-lg overflow-hidden z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(suggestion);
                        setSuggestions([]);
                        handleSearch();
                      }}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3"
                    >
                      <Search className="w-4 h-4" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 glass border border-white/20 text-white rounded-lg hover:border-nexus-cyan transition-all duration-300 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Filters Panel */}
      {showFilters && (
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Search Filters</h3>
            <button
              onClick={clearFilters}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Categories</label>
              <div className="space-y-2">
                {categories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-nexus-cyan focus:ring-nexus-cyan focus:ring-offset-0"
                    />
                    <span className={cn(category.color)}>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nexus-cyan transition-all"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value} className="bg-gray-800">
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nexus-cyan transition-all"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Author</label>
              <input
                type="text"
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                placeholder="Filter by author..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-nexus-cyan transition-all"
              />
            </div>
          </div>
        </GlassCard>
      )}

      {/* Active Filters */}
      {(filters.category.length > 0 || filters.author || filters.dateRange !== 'all') && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Active filters:</span>
          {filters.category.map(catId => {
            const category = categories.find(c => c.id === catId);
            return category ? (
              <span
                key={catId}
                className="px-3 py-1 bg-nexus-cyan/20 text-nexus-cyan rounded-full text-sm flex items-center gap-2"
              >
                {category.name}
                <button
                  onClick={() => toggleCategory(catId)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
          {filters.author && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
              Author: {filters.author}
              <button
                onClick={() => handleFilterChange('author', '')}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2">
              {dateRanges.find(r => r.value === filters.dateRange)?.label}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Found {results.length} results
              {query && <span className="text-gray-400"> for "{query}"</span>}
            </h2>
            <div className="text-sm text-gray-400">
              Sorted by {sortOptions.find(o => o.value === filters.sortBy)?.label}
            </div>
          </div>

          <div className="grid gap-4">
            {results.map(result => (
              <GlassCard key={result.id} className="p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex gap-6">
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        result.category === 'tech' && 'bg-tech-green/20 text-tech-green',
                        result.category === 'security' && 'bg-security-red/20 text-security-red',
                        result.category === 'gaming' && 'bg-gaming-purple/20 text-gaming-purple',
                        result.category === 'ai' && 'bg-blue-500/20 text-blue-400'
                      )}>
                        {categories.find(c => c.id === result.category)?.name}
                      </span>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {result.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.readTime} min
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-nexus-cyan transition-colors cursor-pointer">
                      {result.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-3 line-clamp-2">
                      {result.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">by {result.author}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-300">{result.publishDate}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {result.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <GlassCard className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 glass border border-white/20 text-white rounded-lg hover:border-nexus-cyan transition-all"
          >
            Clear Filters
          </button>
        </GlassCard>
      )}
    </div>
  );
};

export default AdvancedSearch;
