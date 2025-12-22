import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface SearchFilters {
  niches: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'date' | 'popularity';
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search articles...', className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    niches: [],
    dateRange: 'all',
    sortBy: 'relevance',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const niches = ['tech', 'security', 'gaming'];

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (query.trim() || filters.niches.length > 0 || filters.dateRange !== 'all') {
        onSearch(query, filters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  const handleNicheToggle = (niche: string) => {
    setFilters(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche],
    }));
  };

  const clearFilters = () => {
    setFilters({
      niches: [],
      dateRange: 'all',
      sortBy: 'relevance',
    });
    setQuery('');
    inputRef.current?.focus();
  };

  const hasActiveFilters = filters.niches.length > 0 || filters.dateRange !== 'all';

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={hasActiveFilters ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Niche</Label>
                  <div className="space-y-2">
                    {niches.map((niche) => (
                      <div key={niche} className="flex items-center space-x-2">
                        <Checkbox
                          id={niche}
                          checked={filters.niches.includes(niche)}
                          onCheckedChange={() => handleNicheToggle(niche)}
                        />
                        <Label
                          htmlFor={niche}
                          className="text-sm font-normal capitalize cursor-pointer"
                        >
                          {niche}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value: SearchFilters['dateRange']) =>
                      setFilters(prev => ({ ...prev, dateRange: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: SearchFilters['sortBy']) =>
                      setFilters(prev => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Newest First</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.niches.map((niche) => (
            <Badge
              key={niche}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleNicheToggle(niche)}
            >
              {niche}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {filters.dateRange !== 'all' && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
            >
              {filters.dateRange}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}



