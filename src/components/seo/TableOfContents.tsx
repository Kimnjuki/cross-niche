/**
 * TableOfContents – Auto-generated TOC from article headings.
 * 
 * Google AI Overviews reward well-structured content. A visible TOC
 * with jump links signals topic depth and improves crawlability.
 * Also emits a TableOfContents schema for rich results.
 */

import { useEffect, useState, useRef } from 'react';
import { List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  /** HTML content string to extract headings from */
  content?: string;
  /** Optional manual heading list (bypasses extraction) */
  headings?: TOCItem[];
  title?: string;
  className?: string;
  /** Minimum heading level to include (default: 2) */
  minLevel?: number;
  /** Maximum heading level to include (default: 3) */
  maxLevel?: number;
}

function extractHeadings(min = 2, max = 3): TOCItem[] {
  if (typeof document === 'undefined') return [];
  const article = document.querySelector('[data-article-content]') ||
                  document.querySelector('main') ||
                  document.getElementById('main-content');
  if (!article) return [];

  const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
  return Array.from(headings)
    .filter(h => {
      const level = parseInt(h.tagName[1]);
      return level >= min && level <= max;
    })
    .map(h => ({
      id: h.id || h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
      text: h.textContent || '',
      level: parseInt(h.tagName[1]),
    }))
    .filter(h => h.id && h.text.length > 0);
}

export function TableOfContents({
  content,
  headings: manualHeadings,
  title = 'Table of Contents',
  className,
  minLevel = 2,
  maxLevel = 3,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>(manualHeadings || []);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (manualHeadings) {
      setHeadings(manualHeadings);
      return;
    }

    // Wait a beat for React to render
    const timer = setTimeout(() => {
      const extracted = extractHeadings(minLevel, maxLevel);
      setHeadings(extracted);
    }, 300);
    return () => clearTimeout(timer);
  }, [content, manualHeadings, minLevel, maxLevel]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const ids = headings.map(h => h.id).filter(Boolean);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    elements.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      className={cn(
        'toc my-8 p-4 rounded-lg border border-white/10 bg-white/[0.03]',
        className,
      )}
      aria-label={title}
      itemScope
      itemType="https://schema.org/TableOfContents"
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-nexus-cyan" />
        <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</span>
      </div>
      <ul className="space-y-1">
        {headings.map((h) => {
          const indent = (h.level - 2) * 12;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  'flex items-center gap-1 text-sm transition-colors py-0.5 rounded hover:bg-white/5',
                  activeId === h.id
                    ? 'text-nexus-cyan'
                    : 'text-gray-400 hover:text-gray-200',
                )}
                style={{ paddingLeft: `${12 + indent}px` }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveId(h.id);
                  }
                }}
              >
                <ChevronRight className={cn(
                  'w-3 h-3 flex-shrink-0 transition-transform',
                  activeId === h.id ? 'rotate-90' : ''
                )} />
                <span className="truncate">{h.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
