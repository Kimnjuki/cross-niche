/**
 * SEO Checklist Page
 *
 * Implements two interactive checklists from SEO audit reports:
 * 1. Issues Overview Report – site-wide SEO issues (19 items)
 * 2. SEO Ideas Report – page-level improvement ideas (10 items)
 *
 * Features:
 * - Category tabs (Issues / Ideas / All)
 * - Progress tracking with completion bar
 * - Expandable item details (description + action)
 * - Severity badges (High / Medium / Low)
 * - LocalStorage persistence for completed states
 * - Search/filter by keyword
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { getPageMetadata } from '@/lib/seo/pageMetadata';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  allChecklistItems,
  getCompletionStats,
  type ChecklistItem,
} from '@/data/seoChecklists';
import {
  AlertTriangle,
  Info,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

const STORAGE_KEY = 'gnx_seo_checklist_completed';

function loadCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveCompleted(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

const severityConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  High: {
    color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    icon: <ShieldAlert className="h-3 w-3" />,
  },
  Medium: {
    color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  Low: {
    color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    icon: <Info className="h-3 w-3" />,
  },
};

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = severityConfig[severity] ?? severityConfig.Low;
  return (
    <Badge
      variant="topic"
      className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}
    >
      {cfg.icon}
      {severity}
    </Badge>
  );
}

function ChecklistItemCard({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group rounded-lg border p-4 transition-all duration-200 ${
        checked
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          id={`check-${item.id}`}
          checked={checked}
          onCheckedChange={() => onToggle(item.id)}
          className="mt-0.5 h-5 w-5"
          aria-label={`Mark "${item.name}" as ${checked ? 'incomplete' : 'complete'}`}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <label
              htmlFor={`check-${item.id}`}
              className={`text-sm font-semibold cursor-pointer leading-tight ${
                checked ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {item.name}
            </label>
            <SeverityBadge severity={item.severity} />
            {item.category === 'issues' && (
              <Badge
                variant="topic"
                className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              >
                {item.type}
              </Badge>
            )}
            {item.category === 'ideas' && (
              <Badge
                variant="topic"
                className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {item.type}
              </Badge>
            )}
          </div>

          {/* Metric / Affected URLs */}
          <p className="text-xs text-muted-foreground mb-1.5">
            <span className="font-mono">{item.metric}</span>
            {item.targetUrl && (
              <>
                {' '}·{' '}
                <a
                  href={item.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  {item.targetUrl.replace('https://thegridnexus.com', '')}
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
              </>
            )}
          </p>

          {/* Expandable details */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" /> Show details
                </>
              )}
            </button>
            {checked && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
          </div>

          {expanded && (
            <div className="mt-3 space-y-3 text-sm text-muted-foreground border-t border-border/50 pt-3">
              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                  Description
                </h4>
                <p className="leading-relaxed">{item.description}</p>
              </div>

              {/* Action */}
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                  How to Fix
                </h4>
                <p className="leading-relaxed">{item.action}</p>
              </div>

              {/* Keywords (ideas) */}
              {item.keywords && item.keywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                    Target Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
              {item.keywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="topic"
                        className="text-xs bg-muted/50"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Help URL */}
              {item.helpUrl && (
                <a
                  href={item.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View documentation <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SEOChecklist() {
  const meta = getPageMetadata('/seo-checklist');

  // Completed state
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => loadCompleted());

  // Persist to localStorage
  useEffect(() => {
    saveCompleted(completedIds);
  }, [completedIds]);

  const toggleItem = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Filter state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered items
  const filteredItems = useMemo(() => {
    let items = allChecklistItems;

    // Tab filter
    if (activeTab === 'issues') {
      items = items.filter((i) => i.category === 'issues');
    } else if (activeTab === 'ideas') {
      items = items.filter((i) => i.category === 'ideas');
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.action.toLowerCase().includes(q) ||
          i.keywords?.some((kw) => kw.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeTab, searchQuery]);

  // Stats for current view
  const stats = useMemo(() => {
    const total = filteredItems.length;
    const completed = filteredItems.filter((i) => completedIds.has(i.id)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [filteredItems, completedIds]);

  // Overall stats
  const overallStats = useMemo(() => getCompletionStats(
    allChecklistItems.map((i) => ({ ...i, completed: completedIds.has(i.id) }))
  ), [completedIds]);

  // Reset all
  const handleReset = () => {
    if (window.confirm('Reset all completed items? This cannot be undone.')) {
      setCompletedIds(new Set());
    }
  };

  // Export completion data
  const handleExport = () => {
    const data = allChecklistItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      severity: item.severity,
      completed: completedIds.has(item.id),
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        url={typeof window !== 'undefined' ? `${window.location.origin}/seo-checklist` : '/seo-checklist'}
        noindex={true}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">SEO Checklist</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
                SEO Audit Checklist
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Track remediation progress for SEO issues identified during audit.
                Complete each item to improve search performance, security posture,
                and content quality across the site.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                className="gap-1.5"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Overall Progress — {overallStats.completed} / {overallStats.total} items
            </h2>
            <span className="text-2xl font-bold font-display tabular-nums">
              {overallStats.percentComplete}%
            </span>
          </div>
          <Progress value={overallStats.percentComplete} className="h-2" />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Issues: {allChecklistItems.filter((i) => i.category === 'issues').filter((i) => completedIds.has(i.id)).length} / {allChecklistItems.filter((i) => i.category === 'issues').length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              Ideas: {allChecklistItems.filter((i) => i.category === 'ideas').filter((i) => completedIds.has(i.id)).length} / {allChecklistItems.filter((i) => i.category === 'ideas').length}
            </span>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All ({allChecklistItems.length})
              </TabsTrigger>
              <TabsTrigger value="issues">
                Issues ({allChecklistItems.filter((i) => i.category === 'issues').length})
              </TabsTrigger>
              <TabsTrigger value="ideas">
                Ideas ({allChecklistItems.filter((i) => i.category === 'ideas').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search checklist items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
              aria-label="Search checklist items"
            />
          </div>
        </div>

        {/* View stats */}
        <div className="mb-4 text-sm text-muted-foreground">
          {stats.total > 0 ? (
            <>
              Showing {stats.total} item{stats.total !== 1 ? 's' : ''}
              {stats.completed > 0 && ` — ${stats.completed} completed (${stats.percent}%)`}
            </>
          ) : (
            'No items match your search criteria.'
          )}
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">
                Try a different search term or clear the filter.
              </p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 underline"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <ChecklistItemCard
                key={item.id}
                item={item}
                checked={completedIds.has(item.id)}
                onToggle={toggleItem}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}