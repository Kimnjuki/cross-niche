import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'article' | 'topic' | 'author';
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'AI security threats', type: 'topic' },
  { id: '2', text: 'Gaming hardware reviews', type: 'topic' },
  { id: '3', text: 'Cloud computing trends', type: 'topic' },
  { id: '4', text: 'Cybersecurity best practices', type: 'topic' },
  { id: '5', text: 'Tech industry analysis', type: 'topic' },
  { id: '6', text: 'Mobile gaming devices', type: 'topic' },
  { id: '7', text: 'Software development tools', type: 'topic' },
  { id: '8', text: 'Network security protocols', type: 'topic' },
];

export function EnhancedSearch({ placeholder = "Search articles, topics, authors...", onSearch }: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch?.(suggestion.text);
    navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-12 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-medium">
                <TrendingUp className="h-3 w-3" />
                Suggestions
              </div>
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-muted/100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {suggestion.type === 'article' ? '📄' : suggestion.type === 'topic' ? '🏷️' : '👤'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
