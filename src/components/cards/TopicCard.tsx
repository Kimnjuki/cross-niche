import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Shield, Gamepad2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  topic: {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: 'tech' | 'security' | 'gaming' | 'cross';
    icon?: string;
    articleCount: number;
    lastActivityAt: string;
    trending?: boolean;
  };
  className?: string;
}

const categoryIcons = {
  tech: Cpu,
  security: Shield,
  gaming: Gamepad2,
  cross: Zap
};

const categoryColors = {
  tech: 'var(--accent-cyan)',
  security: 'var(--accent-violet)',
  gaming: 'var(--accent-amber)',
  cross: 'var(--accent-cyan)'
};

export function TopicCard({ topic, className }: TopicCardProps) {
  const Icon = categoryIcons[topic.category];
  const color = categoryColors[topic.category];

  return (
    <Link
      to={`/topics/${topic.slug}`}
      className={cn(
        'group block bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-6 min-h-[180px] transition-all duration-180ms ease-out',
        'hover:border-[var(--border-cyan)] hover:shadow-[var(--shadow-glow-cyan)] hover:-translate-y-1',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-8 h-8" style={{ color }} />
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <h3 className="font-[var(--font-heading)] font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
        {topic.name}
      </h3>

      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
        {topic.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-[var(--text-tertiary)] text-xs">
          {topic.articleCount} articles · {topic.lastActivityAt}
        </div>
        <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] transition-all duration-180ms translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[var(--accent-cyan)]" />
      </div>
    </Link>
  );
}