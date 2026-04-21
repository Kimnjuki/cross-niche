/**
 * Nexus Search - Semantic AI Content Explorer
 * 
 * Replace the standard search box with a semantic AI search experience.
 * Users type natural language queries. Results are returned via vector similarity search.
 * A summary AI card at the top synthesizes the top 3 results into a direct answer.
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  X,
  Clock,
  ArrowRight,
  Loader2,
  FileText,
  BookOpen,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  contentType?: string;
  publishedAt?: number;
  estimatedReadingTimeMinutes?: number;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevanceScore?: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular';
}

type ContentType = 'all' | 'articles' | 'guides' | 'news';

export function NexusSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContentType>('all');
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nexusSearchHistory');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setAiSummary(null);
    }
  }, [debouncedQuery, activeFilter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const result = results[selectedIndex];
        if (result) {
          window.location.href = `/articles/${result.slug}`;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setSelectedIndex(-1);

    try {
      // Simulate API call (in production, call Convex action)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock results
      const mockResults: SearchResult[] = [
        {
          _id: '1',
          title: `Understanding ${searchQuery}: A Comprehensive Guide`,
          slug: `understanding-${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
          summary: `This comprehensive guide covers everything you need to know about ${searchQuery}. Learn about the fundamentals, best practices, and advanced techniques.`,
          contentType: 'guide',
          publishedAt: Date.now() - 86400000,
          estimatedReadingTimeMinutes: 12,
          difficultyLevel: 'intermediate',
        },
        {
          _id: '2',
          title: `${searchQuery} Security Best Practices for 2026`,
          slug: `${searchQuery.toLowerCase().replace(/\s+/g, '-')}-security-best-practices`,
          summary: `Essential security considerations when working with ${searchQuery}. Includes CVE references and mitigation strategies.`,
          contentType: 'article',
          publishedAt: Date.now() - 172800000,
          estimatedReadingTimeMinutes: 8,
          difficultyLevel: 'advanced',
        },
        {
          _id: '3',
          title: `Getting Started with ${searchQuery}`,
          slug: `getting-started-${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
          summary: `A beginner-friendly introduction to ${searchQuery}. Perfect for those new to the topic.`,
          contentType: 'tutorial',
          publishedAt: Date.now() - 259200000,
          estimatedReadingTimeMinutes: 15,
          difficultyLevel: 'beginner',
        },
      ];

      setResults(mockResults);

      // Generate AI summary (in production, call Convex action)
      setAiSummary(
        `Based on our content, ${searchQuery} is a topic covered extensively across multiple articles. ` +
          `Our guides provide step-by-step instructions, while our security articles cover potential vulnerabilities ` +
          `and best practices. Start with the beginner guide if you're new to this topic.`
      );

      // Save to recent searches
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const newSearch: SearchSuggestion = {
      id: Date.now().toString(),
      text: searchQuery,
      type: 'recent',
    };

    const updated = [newSearch, ...recentSearches.filter((s) => s.text !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('nexusSearchHistory', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('nexusSearchHistory');
  };

  const getContentTypeIcon = (type?: string) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'tutorial':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isOpen) return null;

  const filters: { id: ContentType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'articles', label: 'Articles' },
    { id: 'guides', label: 'Guides' },
    { id: 'news', label: 'News' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Nexus Search anything..."
              className="flex-1 border-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
            {query && (
              <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filters */}
          {query && (
            <div className="flex items-center gap-2 mt-3">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="h-7 text-xs"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Searching...</span>
            </div>
          )}

          {/* No Results */}
          {(!query || (query && !isLoading && results.length === 0)) && (
            <div className="p-6">
              {!query && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                    <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        onClick={() => setQuery(search.text)}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{search.text}</span>
                        <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!query && recentSearches.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Search TheGridNexus</h3>
                  <p className="text-muted-foreground">
                    Ask any question about AI, cybersecurity, or gaming performance
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="p-4 space-y-4">
              {/* AI Summary Card */}
              {aiSummary && (
                <Card className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-cyan-950/20 dark:to-purple-950/20 border-cyan-200 dark:border-cyan-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">AI Summary</h3>
                        <p className="text-sm text-muted-foreground">{aiSummary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results List */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {results.length} results found
                </p>

                {results.map((result, index) => (
                  <a
                    key={result._id}
                    href={`/articles/${result.slug}`}
                    className={cn(
                      'block p-4 rounded-lg border transition-colors',
                      selectedIndex === index
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getContentTypeIcon(result.contentType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                          {result.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {result.summary}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {result.difficultyLevel && (
                            <Badge
                              variant="secondary"
                              className={cn('text-xs', getDifficultyColor(result.difficultyLevel))}
                            >
                              {result.difficultyLevel}
                            </Badge>
                          )}
                          {result.estimatedReadingTimeMinutes && (
                            <span className="text-xs text-muted-foreground">
                              {result.estimatedReadingTimeMinutes} min read
                            </span>
                          )}
                          {result.publishedAt && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(result.publishedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd> to navigate</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd> to select</span>
        </div>
      </div>
    </div>
  );
}

// Hook for using the search modal
export function useNexusSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return { isOpen, open, close, toggle };
}