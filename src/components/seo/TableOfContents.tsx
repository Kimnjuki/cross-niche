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

/**
 * URL-safe id for a heading.
 *
 * The body HTML ships without ids, so the TOC has to mint them itself —
 * otherwise every `href="#…"` target is missing and no jump link works.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

/**
 * True when a "heading" is really a sentence of body copy the author left in a
 * heading style (e.g. "A 10-minute mobile gaming security checklist is a set of
 * steps that…"). Those must never become TOC entries.
 */
function isSentenceLike(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.split(/\s+/).length > 14 && /[.!?]$/.test(trimmed);
}

function extractHeadings(min = 2, max = 3): TOCItem[] {
  if (typeof document === 'undefined') return [];
  const article = document.querySelector('[data-article-content]') ||
                  document.querySelector('main') ||
                  document.getElementById('main-content');
  if (!article) return [];

  const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const usedIds = new Set<string>();
  const items: TOCItem[] = [];

  for (const heading of Array.from(headings)) {
    const level = parseInt(heading.tagName[1], 10);
    if (level < min || level > max) continue;

    const text = (heading.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text || isSentenceLike(text)) continue;

    // Reuse an authored id when present, otherwise mint one and write it back so
    // the anchor resolves both for clicks and for deep links.
    let id = heading.id || slugifyHeading(text);
    if (!id) continue;
    if (usedIds.has(id)) {
      let n = 2;
      while (usedIds.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }
    usedIds.add(id);
    if (!heading.id) heading.id = id;

    items.push({ id, text, level });
  }

  return items;
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
        'toc my-8 p-4 rounded-lg border border-border bg-muted/30',
        className,
      )}
      aria-label={title}
      itemScope
      itemType="https://schema.org/TableOfContents"
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</span>
      </div>
      <ul className="space-y-1">
        {headings.map((h) => {
          const indent = (h.level - 2) * 12;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  'flex items-center gap-1 text-sm transition-colors py-0.5 rounded hover:bg-muted',
                  activeId === h.id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground',
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
